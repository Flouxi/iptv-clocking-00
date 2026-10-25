// Probes the live production deployment across traffic profiles and reports
// which ones reach the offer, and whether the payment subdomain still serves
// the checkout. Run from iptv-clocking-00:  npm run test:live
//
// This is a read-only GET/PUT probe against the public site — it changes
// nothing. It exists because the gate's last two regressions (the redirect
// loop and the gated /tv checkout) were both only visible from a real request
// against the deployed host, not from the unit harness.
//
// Exit code is 1 if any expectation fails, so it can be wired into CI.

const STORE = process.env.STORE_URL ?? "https://iptvnord4k.site";
const PAY = process.env.PAY_URL ?? "https://pay.iptvnord4k.com";
const OFFER_HOSTS = ["www.iptvnord4k.com", "iptvnord4k.com"];

const UA = {
  chrome:
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36",
  safari:
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Safari/605.1.15",
  iphone:
    "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1",
  android:
    "Mozilla/5.0 (Linux; Android 15; Pixel 9) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36",
  googlebot: "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
  bingbot:
    "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm) Chrome/116.0.0.0 Safari/537.36",
  ahrefs: "Mozilla/5.0 (compatible; AhrefsBot/7.0; +http://ahrefs.com/robot/)",
  semrush:
    "Mozilla/5.0 (compatible; SemrushBot/7~bl; +http://www.semrush.com/bot.html)",
  headless:
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/141.0.0.0 Safari/537.36",
  python: "python-requests/2.32.3",
  curl: "curl/8.5.0",
  // Facebook / Instagram in-app browsers. These are where paid social traffic
  // actually lands, and their UAs are unusual enough to be worth asserting.
  facebook:
    "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 [FBAN/FBIOS;FBAV/470.0.0.38.79;FBBV/612664536;FBDV/iPhone15,2;FBMD/iPhone]",
  instagram:
    "Mozilla/5.0 (Linux; Android 15; Pixel 9 Build/AP4A.250105.002; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/141.0.0.0 Mobile Safari/537.36 Instagram 350.0.0.35.92 Android",
};

const BROWSERS = [
  ["Chrome 141 desktop", UA.chrome],
  ["Safari 18 macOS", UA.safari],
  ["iPhone Safari 18", UA.iphone],
  ["Android Chrome", UA.android],
  ["Facebook in-app (iOS)", UA.facebook],
  ["Instagram in-app (Android)", UA.instagram],
];

const BOTS = [
  ["Googlebot", UA.googlebot],
  ["bingbot", UA.bingbot],
  ["AhrefsBot", UA.ahrefs],
  ["SemrushBot", UA.semrush],
  ["HeadlessChrome", UA.headless],
  ["python-requests", UA.python],
  ["curl/8.5.0", UA.curl],
  // An unrecognised UA must still reach the offer: Vercel and Node's own fetch
  // send one, and so do a long tail of in-app webviews. Treating "unknown UA"
  // as a bot would silently drop real buyers.
  ["unknown UA (node/22)", null],
];

function headers(ua, dest) {
  const h = {
    accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "accept-language": "es-ES,es;q=0.9",
  };
  if (ua) h["user-agent"] = ua;
  if (dest) h["sec-fetch-dest"] = dest;
  return h;
}

async function probe(method, url, ua, dest) {
  const response = await fetch(url, {
    method,
    headers: headers(ua, dest),
    redirect: "manual",
  });
  const location = response.headers.get("location");
  const body = response.status === 200 ? await response.text() : "";
  return { status: response.status, location, body };
}

/** Follows up to `max` redirects, returning the final response. */
async function follow(url, ua, dest, max = 4) {
  let current = url;
  let hops = 0;
  let res = await probe("GET", current, ua, dest);
  while (res.status >= 300 && res.status < 400 && res.location && hops < max) {
    current = new URL(res.location, current).href;
    res = await probe("GET", current, ua, dest);
    hops++;
  }
  return { ...res, url: current };
}

const titleOf = (body) => (body.match(/<title>([^<]*)<\/title>/i) || [null, ""])[1];
const isStorePage = (body) => /Descarga\.\s*Imprime/i.test(titleOf(body));
const isCheckoutPage = (body) =>
  /Tu paquete|Confirma tu paquete|Secure checkout|Pagar/i.test(body) && !isStorePage(body);

// ---------------------------------------------------------------- the matrix

const cases = [];

for (const [name, ua] of BROWSERS) {
  cases.push({ label: `store / · ${name}`, url: `${STORE}/`, ua, dest: "document", expect: "offer" });
}
cases.push({
  label: "store /?px=123&utm_source=fb · Chrome",
  url: `${STORE}/?px=123&utm_source=fb`,
  ua: UA.chrome,
  dest: "document",
  expect: "offer",
  params: ["px=123", "utm_source=fb"],
});
for (const [name, ua] of BOTS) {
  // `null` means "whatever Node sends" — the unknown-UA case, which must pass.
  const expect = name.startsWith("unknown UA") ? "offer" : "white";
  cases.push({ label: `store / · ${name}`, url: `${STORE}/`, ua, dest: "document", expect });
}
for (const method of ["PUT", "PATCH", "DELETE", "OPTIONS"]) {
  cases.push({ label: `store / · Chrome ${method}`, url: `${STORE}/`, ua: UA.chrome, method, expect: "offer" });
}
cases.push({ label: "pay / · Chrome", url: `${PAY}/`, ua: UA.chrome, dest: "document", expect: "pay-home" });
cases.push({ label: "pay /tv · Chrome", url: `${PAY}/tv`, ua: UA.chrome, dest: "document", expect: "checkout" });
cases.push({ label: "pay /tv · Googlebot", url: `${PAY}/tv`, ua: UA.googlebot, dest: "document", expect: "checkout" });

// ------------------------------------------------------------------ execute

let failed = 0;
console.log(`\nstore: ${STORE}\npay:   ${PAY}\n`);
console.log("profile".padEnd(42), "detail".padEnd(46), "status  result");

for (const testCase of cases) {
  const { label, url, ua, method = "GET", dest, expect, params } = testCase;
  let detail = "";
  let status = "";
  let ok = false;
  let note = "";

  try {
    const res = await probe(method, url, ua, dest);
    status = String(res.status);

    if (expect === "offer") {
      const target = res.location ? new URL(res.location, url) : null;
      detail = target ? target.host + (target.search || "") : "no Location";
      ok =
        res.status >= 300 &&
        res.status < 400 &&
        !!target &&
        OFFER_HOSTS.includes(target.hostname) &&
        (params ?? []).every((p) => target.search.includes(p));
      if (!ok && target && params) {
        const missing = params.filter((p) => !target.search.includes(p));
        if (missing.length) note = `lost params: ${missing.join(", ")}`;
      }
    } else if (expect === "white") {
      const title = titleOf(res.body);
      detail = `${res.body.length}B ${title.slice(0, 34)}`;
      ok = res.status === 200 && /<html/i.test(res.body);
    } else if (expect === "pay-home") {
      const target = res.location ? new URL(res.location, url) : null;
      detail = target ? target.pathname + (target.search || "") : "no Location";
      ok = res.status >= 300 && res.status < 400 && !!target && target.pathname.startsWith("/tv");
    } else if (expect === "checkout") {
      const final = await follow(url, ua, dest);
      const title = titleOf(final.body);
      detail = `${final.body.length}B ${title.slice(0, 34)}`;
      status = String(final.status);
      ok = final.status === 200 && isCheckoutPage(final.body);
      if (!ok && isStorePage(final.body)) note = "got the store page, not the checkout";
      if (!ok && final.location) note = note || `ended at ${final.url}`;
    }
  } catch (error) {
    detail = error instanceof Error ? error.message.slice(0, 44) : String(error);
    note = "request failed";
  }

  if (!ok) failed++;
  console.log(
    label.padEnd(42),
    detail.padEnd(46),
    status.padEnd(7),
    ok ? "PASS" : `FAIL ${note}`,
  );
}

console.log(`\n${cases.length - failed} passed, ${failed} failed\n`);
process.exitCode = failed === 0 ? 0 : 1;
