// Local traffic classifier — decides "blocked" from the request alone, without a
// round trip to MagicChecker. Runs first in runTrafficGate(): a blocked verdict
// serves the white page and skips the network call entirely.
//
// Signals, in order:
//   1. User-Agent — crawlers, headless browsers, HTTP libraries, scrapers
//   2. Country    — from x-vercel-ip-country (also accepts cf-ipcountry)
//   3. ASN        — from an ASN header IF one is present (see note below)
//
// ASN note: Vercel does not send an ASN header (its documented request headers
// stop at country/region/city/lat/long/timezone/postal). ASN rules are therefore
// inert on a plain Vercel deployment: they only fire when a proxy in front adds
// one of ASN_HEADERS, or you supply the value yourself. Country and UA rules need
// no extra infrastructure.
//
// Configuration (all optional, comma-separated):
//   TRAFFIC_LOCAL_FILTER=off        disable this classifier entirely
//   TRAFFIC_COUNTRY_ALLOW=US,CA,GB  allowlist — anything else is blocked
//   TRAFFIC_COUNTRY_BLOCK=RU,CN     blocklist — these are blocked
//   TRAFFIC_ASN_BLOCK=14618,16509   blocked ASNs (needs an ASN header, see above)

const BOT_UA_PATTERNS: RegExp[] = [
  // Search / SEO crawlers
  /googlebot/i,
  /google-inspectiontool/i,
  /bingbot/i,
  /bingpreview/i,
  /yandex(bot|images|mobilebot)/i,
  /baiduspider/i,
  /duckduckbot/i,
  /applebot/i,
  /slurp/i,
  /sogou/i,
  /seznam/i,
  /petalbot/i,
  // SEO / marketing tools
  /ahrefs/i,
  /semrush/i,
  /mj12bot/i,
  /dotbot/i,
  /rogerbot/i,
  /screaming\s?frog/i,
  /seobility/i,
  /dataforseo/i,
  /serpstat/i,
  /siteaudit/i,
  // Social / messaging unfurlers
  /facebookexternalhit/i,
  /facebookcatalog/i,
  /twitterbot/i,
  /linkedinbot/i,
  /slackbot/i,
  /telegrambot/i,
  /discordbot/i,
  /whatsapp/i,
  /pinterest\/|pinterestbot/i,
  /embedly/i,
  /vkshare/i,
  // Headless / automation
  /headlesschrome/i,
  /phantomjs/i,
  /puppeteer/i,
  /playwright/i,
  /selenium/i,
  /webdriver/i,
  /electron\//i,
  // HTTP libraries / scripted clients
  /curl\//i,
  /wget\//i,
  /libwww-perl/i,
  /python-requests/i,
  /python-urllib/i,
  /aiohttp/i,
  /httpx/i,
  /scrapy/i,
  /go-http-client/i,
  /okhttp/i,
  /axios\//i,
  /node-fetch/i,
  /java\/\d/i,
  /apache-httpclient/i,
  /guzzlehttp/i,
  /postmanruntime/i,
  /insomnia/i,
  // Generic crawler tails. Deliberately no bare /bot/i: it false-positives on
  // real devices (the "CUBOT X19" Android handset) and the named crawlers above
  // already cover the traffic that matters.
  /crawler/i,
  /spider/i,
  /scraper/i,
];

// Headers a proxy might add when it knows the ASN. Checked in order.
const ASN_HEADERS = [
  "x-vercel-ip-as-number",
  "cf-asn",
  "x-client-asn",
  "x-real-asn",
  "x-forwarded-asn",
];

export type LocalVerdict =
  | { blocked: false }
  | { blocked: true; reason: string };

function listEnv(name: string): string[] {
  const raw = process.env[name];
  if (!raw) return [];
  return raw
    .split(",")
    .map((v) => v.trim().toUpperCase())
    .filter((v) => v.length > 0);
}

function requestCountry(request: Request): string | null {
  // Cloudflare in front would send cf-ipcountry; Vercel sends its own header.
  const value =
    request.headers.get("x-vercel-ip-country") ??
    request.headers.get("cf-ipcountry");
  const trimmed = value?.trim().toUpperCase();
  return trimmed && trimmed.length > 0 ? trimmed : null;
}

function requestAsn(request: Request): string | null {
  for (const header of ASN_HEADERS) {
    const value = request.headers.get(header);
    const digits = value?.replace(/[^0-9]/g, "");
    if (digits && digits.length > 0) return digits;
  }
  return null;
}

/**
 * Classifies a request locally. Returns { blocked: true, reason } when the
 * visitor should get the white page.
 */
export function classifyTraffic(
  request: Request,
  _url: URL,
): LocalVerdict {
  if ((process.env.TRAFFIC_LOCAL_FILTER || "").toLowerCase() === "off") {
    return { blocked: false };
  }

  const ua = (request.headers.get("user-agent") || "").trim();

  if (ua.length === 0) {
    return { blocked: true, reason: "empty-user-agent" };
  }

  for (const pattern of BOT_UA_PATTERNS) {
    if (pattern.test(ua)) {
      return { blocked: true, reason: `ua:${pattern.source}` };
    }
  }

  const country = requestCountry(request);
  if (country) {
    const allow = listEnv("TRAFFIC_COUNTRY_ALLOW");
    if (allow.length > 0 && !allow.includes(country)) {
      return { blocked: true, reason: `country-not-allowed:${country}` };
    }
    const deny = listEnv("TRAFFIC_COUNTRY_BLOCK");
    if (deny.length > 0 && deny.includes(country)) {
      return { blocked: true, reason: `country-blocked:${country}` };
    }
  }

  const asn = requestAsn(request);
  if (asn) {
    const denyAsn = listEnv("TRAFFIC_ASN_BLOCK");
    if (denyAsn.length > 0 && denyAsn.includes(asn)) {
      return { blocked: true, reason: `asn-blocked:${asn}` };
    }
  }

  return { blocked: false };
}

/** True when ASN rules are configured but no ASN header is reaching the app. */
export function asnRulesAreInert(request: Request): boolean {
  return listEnv("TRAFFIC_ASN_BLOCK").length > 0 && requestAsn(request) === null;
}
