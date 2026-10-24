// MagicChecker traffic gate (JS port of the PHP starter index.php script).
//
// Flow, mirroring the PHP version at http://check.magicchecker.com/v2.2/:
//   - every incoming page request's headers are POSTed to MagicChecker
//   - {"ban":1}                 -> respond empty (do not render the site)
//   - {success:1, urlType:"redirect", url, send_params}
//                              -> 302 to that URL (+ original query string)
//   - {success:1, urlType:"include", ...}
//                              -> render our own page (the store = white page)
//   - any failure / timeout    -> 503, like the PHP script did
//
// Deliberately NOT ported from the PHP script:
//   - checkCache()/McProxy (127.0.0.1:8082 local proxy software) — not used
//   - relative-file "include" of a local white page file — on this setup the
//     white page is simply the store's own HTML, so include falls through SSR.

import { classifyTraffic } from "./trafficFilter";

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

  // HEAD is gated too: it is a page-level probe, and leaving it open let a
  // client ask about the page without ever passing the filter.
  return request.method === "GET" || request.method === "POST" || request.method === "HEAD";
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

  // Local classification first: a blocked verdict skips the MagicChecker round
  // trip entirely and serves the white page (the store).
  const verdict = classifyTraffic(request, url);
  if (verdict.blocked) {
    console.log(
      `Traffic gate: blocked locally (${verdict.reason}); serving the white page`,
    );
    return null;
  }

  let answer: MagicCheckerAnswer;
  try {
    answer = await askMagicChecker(request);
  } catch (error) {
    console.error("MagicChecker gate unavailable (mirroring the PHP script's 503):", error);
    return new Response(
      "<h1>503 Service Unavailable</h1>",
      { status: 503, headers: { "content-type": "text/html; charset=utf-8" } },
    );
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
      return new Response(null, { status: 302, headers: { Location: safeTarget } });
    }
    // PHP die(): empty 200 response, nothing rendered.
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
        return new Response(null, { status: 302, headers: { Location: offerTarget } });
      }
      console.error(
        `MagicChecker redirect points back at this host (${targetHost}) and neither OFFER_URL nor SAFE_URL is set; serving the white page instead. ` +
          "Fix the campaign's redirect URL in the MagicChecker dashboard.",
      );
      return null;
    }


    // Rewrite ad-platform params onto the offer URL, same as _redirectPage().
    return new Response(null, {
      status: 302,
      headers: { Location: target },
    });
  }

  // urlType "include" (or anything else): white page = our own store, so let
  // the normal SSR handler render it.
  return null;
}
