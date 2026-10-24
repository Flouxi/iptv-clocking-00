// Proves each branch of the traffic gate by stubbing the MagicChecker response.
// Run from iptv-clocking-00:  node --experimental-strip-types scripts/gate-test.mjs
//
// This does not touch the live campaign — it verifies what the app will do for a
// given MagicChecker answer, so the dashboard change can be checked against it.

import { pathToFileURL } from "node:url";

const mod = await import(pathToFileURL("./src/lib/magicchecker.ts").href);
const { runTrafficGate, shouldCheckTrafficGate } = mod;

const OFFER = "https://www.iptvnord4k.com";
const STORE = "https://iptvnord4k.site";
const SAFE = "https://example.com/safe";

let answer = { success: 1, urlType: "include" };
let fetchThrows = false;
let fetchCalls = 0;
const realFetch = globalThis.fetch;

globalThis.fetch = async () => {
  fetchCalls++;
  if (fetchThrows) throw new Error("simulated network failure");
  return { status: 200, text: async () => JSON.stringify(answer) };
};

function req(url, init = {}) {
  return new Request(url, {
    method: "GET",
    headers: { "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/141" },
    ...init,
  });
}

let pass = 0;
let fail = 0;

async function check(name, fn) {
  try {
    await fn();
    console.log(`PASS  ${name}`);
    pass++;
  } catch (e) {
    console.log(`FAIL  ${name}\n        ${e.message}`);
    fail++;
  }
}

function eq(actual, expected) {
  const a = JSON.stringify(actual);
  const e = JSON.stringify(expected);
  if (a !== e) throw new Error(`expected ${e}, got ${a}`);
}

// ------------------------------------------------------------------ branches

await check("no env, redirect to offer -> 302 offer", async () => {
  delete process.env.SAFE_URL;
  answer = { success: 1, urlType: "redirect", url: OFFER, send_params: false };
  const r = await runTrafficGate(req(`${STORE}/`));
  eq([r.status, r.headers.get("location")], [302, OFFER]);
});

await check("redirect to offer keeps query params when send_params", async () => {
  answer = { success: 1, urlType: "redirect", url: OFFER, send_params: true };
  const r = await runTrafficGate(req(`${STORE}/?utm_source=fb&clickid=abc`));
  eq(r.headers.get("location"), `${OFFER}?utm_source=fb&clickid=abc`);
});

await check("current broken config (redirect to own host) + SAFE_URL -> SAFE_URL", async () => {
  process.env.SAFE_URL = SAFE;
  answer = { success: 1, urlType: "redirect", url: STORE, send_params: false };
  const r = await runTrafficGate(req(`${STORE}/`));
  eq([r.status, r.headers.get("location")], [302, SAFE]);
});

await check("broken config, no SAFE_URL -> white page (null)", async () => {
  delete process.env.SAFE_URL;
  answer = { success: 1, urlType: "redirect", url: STORE, send_params: false };
  const r = await runTrafficGate(req(`${STORE}/`));
  eq(r, null);
});

await check("production config: OFFER_URL only + redirect to own host -> OFFER_URL", async () => {
  // This is the exact Vercel setup: OFFER_URL is set, SAFE_URL is not.
  delete process.env.SAFE_URL;
  process.env.OFFER_URL = OFFER;
  answer = { success: 1, urlType: "redirect", url: STORE, send_params: true };
  const r = await runTrafficGate(req(`${STORE}/?px=123`));
  eq([r.status, r.headers.get("location")], [302, `${OFFER}?px=123`]);
  delete process.env.OFFER_URL;
});

await check("ban never forwards to the offer when only OFFER_URL is set", async () => {
  delete process.env.SAFE_URL;
  process.env.OFFER_URL = OFFER;
  answer = { success: 1, ban: 1 };
  const r = await runTrafficGate(req(`${STORE}/`));
  eq([r.status, r.headers.get("location")], [200, null]);
  delete process.env.OFFER_URL;
});

await check("blocked traffic after dashboard fix (include) -> white page (null)", async () => {
  delete process.env.SAFE_URL;
  answer = { success: 1, urlType: "include" };
  const r = await runTrafficGate(req(`${STORE}/`));
  eq(r, null);
});

await check("ban=1 + SAFE_URL -> 302 SAFE_URL", async () => {
  process.env.SAFE_URL = SAFE;
  answer = { success: 1, ban: 1 };
  const r = await runTrafficGate(req(`${STORE}/`));
  eq([r.status, r.headers.get("location")], [302, SAFE]);
});

await check("ban=1, no SAFE_URL -> empty 200", async () => {
  delete process.env.SAFE_URL;
  answer = { success: 1, ban: 1 };
  const r = await runTrafficGate(req(`${STORE}/`));
  eq([r.status, r.headers.get("location")], [200, null]);
});

await check("MagicChecker unreachable -> 503", async () => {
  delete process.env.SAFE_URL;
  fetchThrows = true;
  const r = await runTrafficGate(req(`${STORE}/`));
  fetchThrows = false;
  eq(r.status, 503);
});

// ------------------------------------------------------------ gating surface

await check("GET / is gated", () => eq(shouldCheckTrafficGate(req(`${STORE}/`), new URL(`${STORE}/`)), true));
await check("POST / is gated", () =>
  eq(shouldCheckTrafficGate(req(`${STORE}/`, { method: "POST" }), new URL(`${STORE}/`)), true));
await check("HEAD / is gated", () =>
  eq(shouldCheckTrafficGate(req(`${STORE}/`, { method: "HEAD" }), new URL(`${STORE}/`)), true));
await check("PUT / DELETE / PATCH / OPTIONS on a page are all gated", () => {
  for (const method of ["PUT", "DELETE", "PATCH", "OPTIONS"]) {
    const gated = shouldCheckTrafficGate(
      req(`${STORE}/`, { method }),
      new URL(`${STORE}/`),
    );
    if (gated !== true) throw new Error(`${method} / was not gated`);
  }
});

await check("a non-GET subresource is still not gated", () => {
  const r = new Request(`${STORE}/chunk.js`, {
    method: "PUT",
    headers: { "sec-fetch-dest": "script" },
  });
  eq(shouldCheckTrafficGate(r, new URL(`${STORE}/chunk.js`)), false);
});
await check("www.iptvnord4k.site is gated", () =>
  eq(
    shouldCheckTrafficGate(
      req("https://www.iptvnord4k.site/"),
      new URL("https://www.iptvnord4k.site/"),
    ),
    true,
  ));

await check("pay.iptvnord4k.com/tv is NOT gated (checkout must load)", () => {
  const u = "https://pay.iptvnord4k.com/tv";
  eq(shouldCheckTrafficGate(req(u), new URL(u)), false);
});

await check("preview deployments and localhost are NOT gated", () => {
  const preview = "https://iptv-clocking-00-abc-flouxis-projects.vercel.app/";
  eq(shouldCheckTrafficGate(req(preview), new URL(preview)), false);
  const local = "http://localhost:8080/";
  eq(shouldCheckTrafficGate(req(local), new URL(local)), false);
});

await check("GATE_HOSTS override replaces the default host list", () => {
  process.env.GATE_HOSTS = "example.com";
  eq(shouldCheckTrafficGate(req(`${STORE}/`), new URL(`${STORE}/`)), false);
  const other = "https://example.com/";
  eq(shouldCheckTrafficGate(req(other), new URL(other)), true);
  delete process.env.GATE_HOSTS;
});

await check("/favicon.ico is not gated", () =>
  eq(shouldCheckTrafficGate(req(`${STORE}/favicon.ico`), new URL(`${STORE}/favicon.ico`)), false));
await check("subresource (Sec-Fetch-Dest: image) is not gated", () => {
  const r = new Request(`${STORE}/`, { headers: { "sec-fetch-dest": "image" } });
  return eq(shouldCheckTrafficGate(r, new URL(`${STORE}/`)), false);
});

// ------------------------------------------------- local classifier (no MGC)

const filter = await import(pathToFileURL("./src/lib/trafficFilter.ts").href);
const { classifyTraffic, asnRulesAreInert } = filter;

const UA_GOOGLEBOT = "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)";
const UA_HEADLESS = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/141.0.0.0 Safari/537.36";
const UA_CHROME = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36";
const UA_IPHONE = "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1";

function clearFilterEnv() {
  delete process.env.TRAFFIC_LOCAL_FILTER;
  delete process.env.TRAFFIC_COUNTRY_ALLOW;
  delete process.env.TRAFFIC_COUNTRY_BLOCK;
  delete process.env.TRAFFIC_ASN_BLOCK;
}

function uaReq(ua, headers = {}) {
  const h = { ...headers };
  if (ua !== null) h["user-agent"] = ua;
  return new Request(`${STORE}/`, { method: "GET", headers: h });
}

await check("classify: Googlebot blocked", () => {
  clearFilterEnv();
  const v = classifyTraffic(uaReq(UA_GOOGLEBOT), new URL(`${STORE}/`));
  if (!v.blocked || !v.reason.startsWith("ua:")) throw new Error(JSON.stringify(v));
});

await check("classify: HeadlessChrome blocked", () => {
  const v = classifyTraffic(uaReq(UA_HEADLESS), new URL(`${STORE}/`));
  if (!v.blocked) throw new Error(JSON.stringify(v));
});

await check("classify: curl / python-requests / AhrefsBot blocked", () => {
  for (const ua of ["curl/8.9.1", "python-requests/2.32.3", "Mozilla/5.0 (compatible; AhrefsBot/7.0)"]) {
    const v = classifyTraffic(uaReq(ua), new URL(`${STORE}/`));
    if (!v.blocked) throw new Error(`not blocked: ${ua}`);
  }
});

await check("classify: empty UA blocked", () => {
  const v = classifyTraffic(uaReq(null), new URL(`${STORE}/`));
  eq(v, { blocked: true, reason: "empty-user-agent" });
});

await check("classify: real Chrome and iPhone allowed", () => {
  for (const ua of [UA_CHROME, UA_IPHONE]) {
    eq(classifyTraffic(uaReq(ua), new URL(`${STORE}/`)), { blocked: false });
  }
});

await check("classify: CUBOT handset not mistaken for a bot", () => {
  const ua = "Mozilla/5.0 (Linux; Android 13; CUBOT X19) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36";
  eq(classifyTraffic(uaReq(ua), new URL(`${STORE}/`)), { blocked: false });
});

await check("country: allowlist blocks non-listed", () => {
  process.env.TRAFFIC_COUNTRY_ALLOW = "us,ca";
  const v = classifyTraffic(uaReq(UA_CHROME, { "x-vercel-ip-country": "DE" }), new URL(`${STORE}/`));
  eq(v, { blocked: true, reason: "country-not-allowed:DE" });
});

await check("country: allowlist passes listed", () => {
  process.env.TRAFFIC_COUNTRY_ALLOW = "us,ca";
  eq(classifyTraffic(uaReq(UA_CHROME, { "x-vercel-ip-country": "US" }), new URL(`${STORE}/`)), { blocked: false });
});

await check("country: blocklist blocks listed", () => {
  clearFilterEnv();
  process.env.TRAFFIC_COUNTRY_BLOCK = "ru";
  const v = classifyTraffic(uaReq(UA_CHROME, { "x-vercel-ip-country": "RU" }), new URL(`${STORE}/`));
  eq(v, { blocked: true, reason: "country-blocked:RU" });
});

await check("country: cf-ipcountry accepted as fallback", () => {
  process.env.TRAFFIC_COUNTRY_BLOCK = "ru";
  const v = classifyTraffic(uaReq(UA_CHROME, { "cf-ipcountry": "RU" }), new URL(`${STORE}/`));
  if (!v.blocked) throw new Error(JSON.stringify(v));
});

await check("country: allowlist is permissive when header missing", () => {
  clearFilterEnv();
  process.env.TRAFFIC_COUNTRY_ALLOW = "us";
  eq(classifyTraffic(uaReq(UA_CHROME), new URL(`${STORE}/`)), { blocked: false });
});

await check("asn: blocked when an ASN header is present", () => {
  clearFilterEnv();
  process.env.TRAFFIC_ASN_BLOCK = "14618,16509";
  const v = classifyTraffic(uaReq(UA_CHROME, { "x-vercel-ip-as-number": "14618" }), new URL(`${STORE}/`));
  eq(v, { blocked: true, reason: "asn-blocked:14618" });
});

await check("asn: inert when no ASN header is present", () => {
  process.env.TRAFFIC_ASN_BLOCK = "14618";
  eq(classifyTraffic(uaReq(UA_CHROME), new URL(`${STORE}/`)), { blocked: false });
  eq(asnRulesAreInert(uaReq(UA_CHROME)), true);
});

await check("TRAFFIC_LOCAL_FILTER=off disables the classifier", () => {
  clearFilterEnv();
  process.env.TRAFFIC_LOCAL_FILTER = "off";
  eq(classifyTraffic(uaReq(UA_GOOGLEBOT), new URL(`${STORE}/`)), { blocked: false });
  clearFilterEnv();
});

await check("end-to-end: Googlebot gets white page and no MagicChecker call", async () => {
  clearFilterEnv();
  answer = { success: 1, urlType: "redirect", url: OFFER, send_params: false };
  fetchCalls = 0;
  const r = await runTrafficGate(uaReq(UA_GOOGLEBOT));
  eq(r, null);
  eq(fetchCalls, 0);
});

await check("end-to-end: real Chrome still goes through MagicChecker", async () => {
  clearFilterEnv();
  answer = { success: 1, urlType: "redirect", url: OFFER, send_params: false };
  fetchCalls = 0;
  const r = await runTrafficGate(uaReq(UA_CHROME));
  eq(r.headers.get("location"), OFFER);
  eq(fetchCalls, 1);
  clearFilterEnv();
});

await check("end-to-end: PUT / with a browser UA is filtered, not raw store HTML", async () => {
  clearFilterEnv();
  process.env.OFFER_URL = OFFER;
  answer = { success: 1, urlType: "redirect", url: STORE, send_params: false };
  fetchCalls = 0;
  const r = await runTrafficGate(
    new Request(`${STORE}/`, { method: "PUT", headers: { "user-agent": UA_CHROME } }),
  );
  eq([r.status, r.headers.get("location")], [302, OFFER]);
  eq(fetchCalls, 1);
  delete process.env.OFFER_URL;
});

await check("end-to-end: PUT / from a bot gets the white page, not raw HTML from the app", async () => {
  clearFilterEnv();
  answer = { success: 1, urlType: "redirect", url: OFFER, send_params: false };
  fetchCalls = 0;
  const r = await runTrafficGate(
    new Request(`${STORE}/`, { method: "PUT", headers: { "user-agent": UA_GOOGLEBOT } }),
  );
  eq(r, null);
  eq(fetchCalls, 0);
});

// ------------------------------------------------------- debug logging

async function captureLogs(fn) {
  const lines = [];
  const orig = console.log;
  console.log = (...args) => {
    lines.push(args.map(String).join(" "));
  };
  try {
    await fn();
  } finally {
    console.log = orig;
  }
  return lines;
}

function gateLines(lines) {
  return lines.filter((l) => l.startsWith("gate "));
}

await check("debug: no gate line when TRAFFIC_DEBUG is unset", async () => {
  clearFilterEnv();
  delete process.env.TRAFFIC_DEBUG;
  answer = { success: 1, urlType: "include" };
  const lines = await captureLogs(async () => {
    await runTrafficGate(uaReq(UA_CHROME));
  });
  eq(gateLines(lines).length, 0);
});

await check("debug: one structured line with country and decision", async () => {
  clearFilterEnv();
  process.env.TRAFFIC_DEBUG = "1";
  answer = { success: 1, urlType: "include" };
  const lines = await captureLogs(async () => {
    await runTrafficGate(uaReq(UA_CHROME, { "x-vercel-ip-country": "ES" }));
  });
  const g = gateLines(lines);
  eq(g.length, 1);
  const payload = JSON.parse(g[0].slice(5));
  eq(payload.decision, "include-white");
  eq(payload.country, "ES");
  eq(payload.method, "GET");
  eq(payload.path, "/");
  delete process.env.TRAFFIC_DEBUG;
});

await check("debug: locally blocked request logs reason and skips MagicChecker", async () => {
  process.env.TRAFFIC_DEBUG = "1";
  answer = { success: 1, urlType: "redirect", url: OFFER, send_params: false };
  fetchCalls = 0;
  const lines = await captureLogs(async () => {
    await runTrafficGate(uaReq(UA_GOOGLEBOT));
  });
  const g = gateLines(lines);
  eq(g.length, 1);
  const payload = JSON.parse(g[0].slice(5));
  eq(payload.decision, "local-block");
  if (!String(payload.detail).startsWith("ua:")) {
    throw new Error(`unexpected detail: ${payload.detail}`);
  }
  eq(fetchCalls, 0);
  delete process.env.TRAFFIC_DEBUG;
});

await check("debug: offer redirect decision is logged", async () => {
  process.env.TRAFFIC_DEBUG = "1";
  answer = { success: 1, urlType: "redirect", url: OFFER, send_params: false };
  const lines = await captureLogs(async () => {
    await runTrafficGate(uaReq(UA_CHROME));
  });
  const g = gateLines(lines);
  eq(g.length, 1);
  eq(JSON.parse(g[0].slice(5)).decision, "offer-redirect");
  delete process.env.TRAFFIC_DEBUG;
});

globalThis.fetch = realFetch;

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail === 0 ? 0 : 1);
