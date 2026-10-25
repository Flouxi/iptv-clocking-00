import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import ts from 'typescript';
const catalog = JSON.parse(await fs.readFile('src/lib/pdf-catalog.json', 'utf8'));
const compile = code => ts.transpileModule(code, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText;
const importCode = code => import('data:text/javascript;base64,' + Buffer.from(compile(code)).toString('base64'));
const input = await importCode((await fs.readFile('src/lib/pdf-checkout-input.ts', 'utf8')).replace("import catalog from './pdf-catalog.json' with { type: 'json' };", 'const catalog=' + JSON.stringify(catalog) + ';'));
const productSource = (await fs.readFile('src/lib/products.ts', 'utf8')).replace('import pdfCatalog from "./pdf-catalog.json";', 'const pdfCatalog=' + JSON.stringify(catalog) + ';').replace(/import (\w+) from "@\/assets\/[^"\n]+";/g, 'const $1="fixture-image";');
const products = await importCode(productSource);
const access = await importCode((await fs.readFile('src/lib/pdf-access.server.ts', 'utf8')).replace("import catalog from './pdf-catalog.json';", 'const catalog=' + JSON.stringify(catalog) + ';'));
let checks = 0;
function check(name, fn) { fn(); checks++; console.log('PASS ' + name); }
const slug = catalog[0].slug, other = catalog[1].slug;
check('public catalog contains all 13 genuine PDF products only', () => { assert.equal(products.PRODUCTS.length, 13); assert.ok(products.getAllProducts().every(p => catalog.some(f => f.slug === p.slug))); assert.equal(products.getProduct('mundial-3-meses'), undefined); assert.equal(products.getProduct('iptv-mundial-24'), undefined); });
check('PDF cart accepts real catalog items and quantities', () => assert.deepEqual(input.validatePdfCart({ items: [{ slug, qty: 2 }, { slug: other, qty: 1 }] }).items, [{ slug, qty: 2 }, { slug: other, qty: 1 }]));
for (const items of [[], [{ slug: 'mundial-3-meses', qty: 1 }], [{ slug, qty: 0 }], [{ slug, qty: 1.5 }], [{ slug, qty: 100 }], [{ slug, qty: '1' }], [{ slug, qty: 1 }, { slug, qty: 1 }]]) {
  check('invalid cart rejected ' + JSON.stringify(items), () => assert.throws(() => input.validatePdfCart({ items })));
}
check('client price and customer fields cannot override server input', () => assert.deepEqual(input.validatePdfCart({ items: [{ slug, qty: 1, price: 1 }], price: 1, email: 'example@example.com' }), { items: [{ slug, qty: 1 }], orbitraClickId: undefined }));
check('invalid attribution is dropped', () => assert.equal(input.validatePdfCart({ items: [{ slug, qty: 1 }], orbitraClickId: 'email@example.com' }).orbitraClickId, undefined));
for (const url of ['http://checkout.stripe.com/x', 'https://pay.iptvnord4k.com/x', 'https://checkout.stripe.com.attacker.example/x', 'https://user@checkout.stripe.com/x']) check('non-Stripe checkout rejected ' + url, () => assert.throws(() => input.stripeCheckoutUrl(url)));
check('Stripe hosted checkout allowed', () => assert.equal(input.stripeCheckoutUrl('https://checkout.stripe.com/c/pay/test_fixture'), 'https://checkout.stripe.com/c/pay/test_fixture'));
const now = Math.floor(Date.now() / 1000);
const line = (s, amount = 2900, quantity = 1) => ({ price: { product: { metadata: { slug: s } } }, quantity, currency: 'eur', amount_total: amount });
const session = { id: 'cs_test_' + 'a'.repeat(30), status: 'complete', mode: 'payment', payment_status: 'paid', metadata: { order_kind: 'pdf_download', product_slug: slug }, currency: 'eur', amount_total: 2900, line_items: { data: [line(slug)], has_more: false }, payment_intent: { status: 'succeeded', latest_charge: { paid: true, disputed: false, refunded: false, amount_refunded: 0 } }, created: now - 60 };
check('existing single-PDF purchases remain downloadable', () => assert.equal(access.validatePdfPayment(session, now).file.slug, slug));
const multi = structuredClone(session); multi.metadata = { order_kind: 'pdf_download' }; multi.line_items.data = [line(slug, 5800, 2), line(other, 6500)]; multi.amount_total = 12300;
check('paid cart authorizes exactly its purchased PDFs', () => assert.deepEqual(access.validatePdfPayment(multi, now).files.map(f => f.slug), [slug, other]));
for (const [name, mutate] of [
  ['unpaid', s => s.payment_status = 'unpaid'], ['unknown product', s => s.line_items.data[0].price.product.metadata.slug = 'mundial-3-meses'],
  ['wrong total', s => s.amount_total = 1], ['truncated line items', s => s.line_items.has_more = true],
  ['refunded', s => s.payment_intent.latest_charge.refunded = true], ['partial refund', s => s.payment_intent.latest_charge.amount_refunded = 1],
  ['disputed', s => s.payment_intent.latest_charge.disputed = true], ['wrong order type', s => s.metadata.order_kind = 'tv_prepaid'],
  ['expired', s => s.created = now - access.DOWNLOAD_SECONDS - 1], ['wrong currency', s => s.currency = 'sek'],
]) check(name + ' payment denies PDF access', () => { const s = structuredClone(multi); mutate(s); assert.throws(() => access.validatePdfPayment(s, now), access.DownloadDenied); });
const secret = 'local-test-fixture-secret-32-chars';
check('authenticated download tokens round trip', () => { const token = access.issueDownload(session.id, now + 60, secret); assert.equal(access.readDownload(token, secret, now), session.id); assert.throws(() => access.readDownload(token, secret + 'wrong', now)); assert.throws(() => access.readDownload(token, secret, now + 120)); });
globalThis.__pdfInput = input;
const requests = [];
globalThis.__pdfStripe = { stripe: { checkout: { sessions: { create: async p => { requests.push(p); return { url: 'https://checkout.stripe.com/c/pay/test_fixture' }; } } } }, syncProductToStripe: async p => ({ priceId: 'price_' + p.slug }) };
let source = await fs.readFile('src/lib/checkout.functions.ts', 'utf8');
source = source.replace("import { createServerFn } from '@tanstack/react-start';", 'const createServerFn=()=>({inputValidator:validate=>({handler:handler=>async({data})=>handler({data:validate(data)})})});')
  .replace("import { getRequestHost } from '@tanstack/react-start/server';", "const getRequestHost=()=> 'iptvnord4k.site';")
  .replace("import { getProduct } from './products';", 'const getProduct=slug=>({slug,name:slug,price:29});')
  .replace("import { validatePdfCart, stripeCheckoutUrl, type PdfCheckoutItem } from './pdf-checkout-input';", 'const {validatePdfCart,stripeCheckoutUrl}=globalThis.__pdfInput;')
  .replace("await import('./stripe.server')", 'globalThis.__pdfStripe');
const server = await importCode(source);
await server.createCartCheckoutSession({ data: { items: [{ slug, qty: 2 }, { slug: other, qty: 1 }], orbitraClickId: 'b'.repeat(48), price: 1 } });
check('cart creates server-selected Stripe prices and exact quantities', () => assert.deepEqual(requests[0].line_items, [{ price: 'price_' + slug, quantity: 2 }, { price: 'price_' + other, quantity: 1 }]));
check('checkout returns to .site with truthful PDF metadata and no pay intermediary', () => { const p = requests[0]; assert.equal(p.metadata.source_site, 'https://iptvnord4k.site'); assert.equal(p.metadata.order_kind, 'pdf_download'); assert.equal(p.cancel_url, 'https://iptvnord4k.site/cart'); assert.ok(p.success_url.startsWith('https://iptvnord4k.site/success?')); assert.ok(!JSON.stringify(p).includes('pay.iptvnord4k')); assert.equal(p.payment_method_types, undefined); assert.match(p.integration_identifier, /^ipnord4k_pdf_[a-z]{8}$/); });
await server.createCheckoutSession({ data: { slug } });
check('product-page checkout retains single-product identity', () => assert.equal(requests[1].metadata.product_slug, slug));
const serverSource = await fs.readFile('src/server.ts', 'utf8');
check('server no longer invokes conditional product redirects', () => { assert.ok(!serverSource.includes('runTrafficGate')); assert.ok(!serverSource.includes('pay.iptvnord4k.com')); });
for (const file of ['src/server.ts', 'src/lib/checkout.functions.ts', 'src/lib/pdf-checkout-input.ts', 'src/lib/orders.functions.ts', 'src/lib/pdf-access.server.ts', 'src/routes/checkout.tsx', 'src/routes/success.tsx', 'src/routes/api/public/download.$token.ts']) {
  const text = await fs.readFile(file, 'utf8');
  check(file + ' syntax', () => assert.equal(ts.createSourceFile(file, text, 99, true, file.endsWith('tsx') ? 4 : 3).parseDiagnostics.length, 0));
}
console.log(JSON.stringify({ checks, failed: 0 }));
