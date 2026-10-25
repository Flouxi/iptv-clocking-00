// MagicChecker traffic gate (JS port of the PHP starter index.php script).
//
// Flow, mirroring the PHP version at http://check.magicchecker.com/v2.2/:
//   - every incoming page request's headers are POSTed to MagicChecker
//   - {"ban":1}                 -> respond empty (do not render the site)
//   - {success:1, urlType:"redirect", url, send_params}
//                              -> 302 to that URL (+ original query string)
//   - {success:1, urlType:"include", ...}
//                              -> render our own page (the store = white page)
//   - any failure / timeout    -> serve the store (see GATE_MGC_FAILURE); the
//                                 PHP script answered 503, which takes the
//                                 whole property down with the third party
//
// Deliberately NOT ported from the PHP script:
//   - checkCache()/McProxy (127.0.0.1:8082 local proxy software) — not used
//   - relative-file "include" of a local white page file — on this setup the
//     white page is simply the store's own HTML, so include falls through SSR.

import {
  classifyTraffic,
  requestAsn,
  requestCountry,
  trafficDebugEnabled,
} from "./trafficFilter";

const MGC_DEFAULT_CAMPAIGN_ID = "813eda39604914d0f4b87bc90c9d87a5"; // bound to iptvnord.site
const MGC_API = "http://check.magicchecker.com/v2.2/index.php";
const MGC_SV = "31810.3";
const MGC_TIMEOUT_MS = 10_000;

function campaignId(): string {
  // Server-side env var (set it in Vercel → Project → Settings → Environment Variables).
  // Falls back to the campaign that was in the original PHP file.
  return process.env.MAGICCHECKER_CAMPAIGN_ID || MGC_DEFAULT_CAMPAIGN_ID;
}

function offerFallback(): string | null {
  // Where good traffic goes when the campaign's redirect URL points back at
  // this store. OFFER_URL is the original setting; SAFE_URL is accepted as a
  // fallback so a single variable can drive both paths.
  const raw = (process.env.OFFER_URL || process.env.SAFE_URL || "").trim();
  return raw.length > 0 ? raw : null;
}

function safeUrlFallback(): string | null {
  // Optional destination for traffic MagicChecker bans. Deliberately separate
  // from OFFER_URL: banned visitors must never be forwarded to the offer.
  const raw = (process.env.SAFE_URL || "").trim();
  return raw.length > 0 ? raw : null;
}

const GATE_HOSTS_DEFAULT = "iptvnord4k.site,www.iptvnord4k.site";

type MgcFailurePolicy = "store" | "offer" | "503";

function mgcFailurePolicy(): MgcFailurePolicy {
  // What to serve when MagicChecker cannot answer. Default "store" keeps
  // unclassified traffic off the offer and keeps the property up; "offer"
  // protects revenue at the cost of forwarding anything the gate could not
  // classify; "503" is the old PHP behaviour. Anything unrecognised -> store.
  const raw = (process.env.GATE_MGC_FAILURE || "").trim().toLowerCase();
  if (raw === "offer") return "offer";
  if (raw === "503") return "503";
  return "store";
}

function gateHosts(): string[] {
  // Only these hostnames are filtered. The payment subdomain
  // (pay.iptvnord4k.com) serves the /tv checkout page and must never be
  // gated — doing so bounced buyers to the store instead of the checkout.
  // *.vercel.app deployments are likewise left alone.
  const raw = process.env.GATE_HOSTS || GATE_HOSTS_DEFAULT;
  return raw
    .split(",")
    .map((h) => h.trim().toLowerCase())
    .filter((h) => h.length > 0);
}

function safeHostname(target: string): string | null {
  try {
    return new URL(target).hostname.toLowerCase();
  } catch {
    return null;
  }
}

function isFileExtensionRequest(pathname: string): boolean {
  const last = pathname.split("/").pop() ?? "";
  return /\.[a-zA-Z0-9]{1,8}$/.test(last);
}

export function shouldCheckTrafficGate(request: Request, url: URL): boolean {
  // Scope the gate to the store's own hostnames. Anything else — the payment
  // subdomain with its /tv checkout, preview deployments, localhost — reaches
  // the app untouched.
  if (!gateHosts().includes(url.hostname.toLowerCase())) {
    return false;
  }

  // Own API endpoints (Stripe checkout, etc.) and static assets never need the
  // gate — they are either internal XHR (handled before the gate) or
  // subresources of a page the visitor has already been gated on.
  if (url.pathname === "/favicon.ico" || isFileExtensionRequest(url.pathname)) {
    return false;
  }
  if (url.pathname.startsWith("/api/") && !url.pathname.startsWith("/api/redirect")) {
    return false;
  }

  // Browser subresource loads (script/style/img/font/XHR from our own pages)
  // arrive with sec-fetch-dest set to something other than "document".
  // Real navigations (and bots, which usually omit the header) still get gated.
  const dest = request.headers.get("sec-fetch-dest");
  if (dest && dest !== "document") {
    return false;
  }

  // Every method is gated, not just GET/POST/HEAD. A page-level probe must not
  // be able to read the white page by switching verbs (PUT/DELETE/OPTIONS/PATCH
  // previously returned the full store HTML without ever asking the filter).
  // The exemptions above — assets, own API routes, subresource loads — are the
  // only ways past the gate.
  return true;
}

type MagicCheckerAnswer = {
  ban?: number;
  success?: number;
  urlType?: "redirect" | "include";
  url?: string;
  send_params?: boolean | number | string;
  errorMessage?: string;
};

function collectHeadersToReport(request: Request): Record<string, string> {
  // Mirror the PHP script: report every header, values capped at 1024 chars.
  const reported: Record<string, string> = {};
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    reported["REMOTE_ADDR"] = forwarded.split(",")[0].trim();
  }
  request.headers.forEach((value, name) => {
    reported["HTTP_" + name.toUpperCase().replace(/-/g, "_")] =
      value.length <= 1024 ? value : "TRIMMED: " + value.slice(0, 1024);
  });
  return reported;
}

async function askMagicChecker(request: Request): Promise<MagicCheckerAnswer> {
  const reported = collectHeadersToReport(request);

  // Same wire format the PHP script produced with http_build_query():
  // nested arrays are sent as headers[KEY]=value (URLSearchParams encodes the
  // brackets exactly like PHP did).
  const body = new URLSearchParams({
    cmp: campaignId(),
    adapi: "2.2",
    sv: MGC_SV,
  });
  for (const [key, value] of Object.entries(reported)) {
    body.append(`headers[${key}]`, value);
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), MGC_TIMEOUT_MS);
  let raw: string;
  try {
    const res = await fetch(MGC_API, {
      method: "POST",
      headers: { adapi: "2.2", "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString(),
      signal: controller.signal,
    });
    raw = await res.text();
    if (res.status !== 200 || raw.length === 0) {
      throw new Error(`MagicChecker HTTP ${res.status}`);
    }
  } finally {
    clearTimeout(timer);
  }

  let answer: MagicCheckerAnswer;
  try {
    answer = JSON.parse(raw) as MagicCheckerAnswer;
  } catch {
    throw new Error("MagicChecker returned non-JSON response");
  }
  if (answer.success !== 1) {
    throw new Error(answer.errorMessage || "MagicChecker answered without success");
  }
  return answer;
}

/**
 * Runs the gate. Returns a Response to send to the visitor instead of the
 * site, or null to let the normal SSR handler serve the page (the white page).
 */
export async function runTrafficGate(request: Request): Promise<Response | null> {
  const url = new URL(request.url);
  if (!shouldCheckTrafficGate(request, url)) {
    return null;
  }

  // One structured line per gated request when TRAFFIC_DEBUG is on. Off by
  // default: a log line per request is noisy and costs invocation duration.
  const debug = trafficDebugEnabled();
  const logGate = (decision: string, detail?: string | null) => {
    if (!debug) return;
    console.log(
      "gate " +
        JSON.stringify({
          decision,
          method: request.method,
          path: url.pathname,
          country: requestCountry(request),
          asn: requestAsn(request),
          ua: (request.headers.get("user-agent") || "").slice(0, 120),
          detail: detail ?? null,
        }),
    );
  };

  // Local classification first: a blocked verdict skips the MagicChecker round
  // trip entirely and serves the white page (the store).
  const verdict = classifyTraffic(request, url);
  if (verdict.blocked) {
    if (debug) {
      logGate("local-block", verdict.reason);
    } else {
      console.log(
        `Traffic gate: blocked locally (${verdict.reason}); serving the white page`,
      );
    }
    return null;
  }

  let answer: MagicCheckerAnswer;
  try {
    answer = await askMagicChecker(request);
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    const policy = mgcFailurePolicy();
    logGate("mgc-unavailable", `${detail}; policy=${policy}`);

    // Default is the store, not a 503: an unclassifiable request must never be
    // forwarded to the offer (that is exactly the traffic the gate exists to
    // keep away from it), and a 503 on every request turns a third-party
    // hiccup into a dead property. A short pause in conversions is the cheaper
    // failure. GATE_MGC_FAILURE switches the trade.
    if (policy === "offer") {
      const offer = offerFallback();
      const offerHost = offer ? safeHostname(offer) : null;
      if (offer && offerHost && offerHost !== url.hostname.toLowerCase()) {
        let offerTarget = offer;
        if (url.search) {
          offerTarget += (offerTarget.includes("?") ? "&" : "?") + url.searchParams.toString();
        }
        console.warn(
          `MagicChecker gate unavailable (${detail}); GATE_MGC_FAILURE=offer, redirecting to ${offerHost}`,
        );
        return new Response(null, { status: 302, headers: { Location: offerTarget } });
      }
      console.error(
        `MagicChecker gate unavailable (${detail}) and GATE_MGC_FAILURE=offer but OFFER_URL is unset; serving the white page.`,
      );
      return null;
    }

    if (policy === "503") {
      console.error(`MagicChecker gate unavailable (${detail}); GATE_MGC_FAILURE=503, serving 503.`);
      return new Response(
        "<h1>503 Service Unavailable</h1>",
        { status: 503, headers: { "content-type": "text/html; charset=utf-8" } },
      );
    }

    console.error(`MagicChecker gate unavailable (${detail}); serving the white page.`);
    return null;
  }

  if (answer.ban === 1) {
    // If SAFE_URL is set and points at a different host, redirect there.
    // This filters out unwelcome traffic (e.g. bots) to a safe page instead
    // of showing the store or sending them to the offer.
    const safe = safeUrlFallback();
    const safeHost = safe ? safeHostname(safe) : null;
    const requestHost = url.hostname.toLowerCase();
    if (safe && safeHost && safeHost !== requestHost) {
      let safeTarget = safe;
      if (url.search) {
        safeTarget += (safeTarget.includes("?") ? "&" : "?") + url.searchParams.toString();
      }
      console.warn(
        `MagicChecker ban; redirecting unwelcome traffic to SAFE_URL (${safeHost})`,
      );
      logGate("mgc-ban-safe-url", safeHost);
      return new Response(null, { status: 302, headers: { Location: safeTarget } });
    }
    // PHP die(): empty 200 response, nothing rendered.
    logGate("mgc-ban-empty");
    return new Response(null, { status: 200 });
  }

  if (answer.urlType === "redirect" && answer.url) {
    let target = answer.url;
    if (answer.send_params && url.search) {
      target += (target.includes("?") ? "&" : "?") + url.searchParams.toString();
    }

    // Safety net: never redirect a visitor back to the page they are on. If the
    // campaign's redirect URL points at this same site, a 302 would loop
    // forever (browser: ERR_TOO_MANY_REDIRECTS) and the site would be
    // unreachable. Send good traffic to the offer instead; otherwise fall
    // through to the white page.
    const requestHost = url.hostname.toLowerCase();
    const targetHost = safeHostname(target);
    if (targetHost && targetHost === requestHost) {
      const offer = offerFallback();
      const offerHost = offer ? safeHostname(offer) : null;
      if (offer && offerHost && offerHost !== requestHost) {
        let offerTarget = offer;
        if (answer.send_params && url.search) {
          offerTarget += (offerTarget.includes("?") ? "&" : "?") + url.searchParams.toString();
        }
        console.warn(
          `MagicChecker redirect points back at this host (${targetHost}); redirecting to the offer (${offerHost}) instead.`,
        );
        logGate("self-redirect-offer", offerHost);
        return new Response(null, { status: 302, headers: { Location: offerTarget } });
      }
      console.error(
        `MagicChecker redirect points back at this host (${targetHost}) and neither OFFER_URL nor SAFE_URL is set; serving the white page instead. ` +
          "Fix the campaign's redirect URL in the MagicChecker dashboard.",
      );
      logGate("self-redirect-white", targetHost);
      return null;
    }


    // Rewrite ad-platform params onto the offer URL, same as _redirectPage().
    logGate("offer-redirect", targetHost);
    return new Response(null, {
      status: 302,
      headers: { Location: target },
    });
  }

  // urlType "include" (or anything else): white page = our own store, so let
  // the normal SSR handler render it.
  logGate("include-white");
  return null;
}
