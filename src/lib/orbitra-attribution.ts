// Prepared integration. Enable only after the private collector/domain passes
// hosted verification. No layout, price, receipt or product changes.
const endpoint = 'https://orbitra.iptvnord4k.com/collect.php?campaign=pdf-organic';
const key = 'orbitra:pdf-attribution:v1';
const valid = (id: unknown): id is string => typeof id === 'string' && /^[0-9a-f]{48}$/.test(id);
const consent = () => localStorage.getItem('ipnord4k:cookie-consent:v1') === 'accepted';
const privacySignal = () => !!(navigator as Navigator & {globalPrivacyControl?: boolean}).globalPrivacyControl || navigator.doNotTrack === '1';
let collecting = false;
export function pdfAttributionId(): string | undefined {
  if (typeof window === 'undefined') return;
  try {
    if (!consent() || privacySignal()) return;
    const saved = JSON.parse(sessionStorage.getItem(key) || 'null');
    return saved && valid(saved.id) && Date.now() - saved.at < 30 * 60_000 ? saved.id : undefined;
  } catch { return; }
}
export async function startPdfAttribution(): Promise<void> {
  if (typeof window === 'undefined') return;
  try {
    if (!consent() || privacySignal()) { sessionStorage.removeItem(key); return; }
    const id = new URL(location.href).searchParams.get('or_click');
    if (valid(id)) { sessionStorage.setItem(key, JSON.stringify({id, at: Date.now()})); return; }
    if (pdfAttributionId() || collecting) return;
    collecting = true;
    try {
      const response = await fetch(endpoint, { method: 'POST', credentials: 'omit', referrerPolicy: 'no-referrer', body: '{}', headers: {'Content-Type':'application/json'}, signal: AbortSignal.timeout(5000) });
      if (!response.ok) return;
      const result = await response.json();
      if (valid(result.click_id) && consent() && !privacySignal()) sessionStorage.setItem(key, JSON.stringify({id: result.click_id, at: Date.now()}));
    } finally { collecting = false; }
  } catch { /* Analytics failures never prevent browsing or checkout. */ }
}
