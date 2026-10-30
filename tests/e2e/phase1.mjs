import { chromium } from 'playwright-core';
import Stripe from 'stripe';
import { readFileSync } from 'fs';

const dir = new URL('.', import.meta.url).pathname;
const base = 'http://localhost:3100';
const svc = readFileSync(`${dir}keys.txt`, 'utf8').split('\n')[0];
const results = [];
const check = (name, ok, detail) => { results.push(ok); console.log(`${ok ? 'PASS' : 'FAIL'} ${name}${ok ? '' : ' :: ' + JSON.stringify(detail)?.slice(0, 300)}`); };
const q = async (path) => (await fetch(`http://127.0.0.1:54321/rest/v1/${path}`, { headers: { apikey: svc, Authorization: `Bearer ${svc}` } })).json();
const fakeLog = () => readFileSync(`${dir}fake.log`, 'utf8');
const nextLog = () => readFileSync(`${dir}next.log`, 'utf8');
const stripe = new Stripe('sk_test_123');
let n = 100;
async function webhook(type, object) {
  const payload = JSON.stringify({ id: `evt_p${++n}`, object: 'event', type, data: { object }, api_version: '2025-11-17.clover', created: 1 });
  const header = stripe.webhooks.generateTestHeaderString({ payload, secret: 'whsec_test_secret' });
  const r = await fetch(`${base}/api/stripe/webhook`, { method: 'POST', headers: { 'stripe-signature': header }, body: payload });
  return r.status;
}
const page200 = async (path) => (await fetch(base + path)).status;

const b = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined });
const ctx = await b.newContext({ viewport: { width: 1400, height: 1000 } });
const p = await ctx.newPage();
// Pages stream behind a loading screen; let each navigation settle before reading the DOM.
{
  const proto = Object.getPrototypeOf(p);
  if (!proto.__settled) {
    const orig = proto.goto;
    proto.goto = async function (...a) { const r = await orig.apply(this, a); await this.waitForLoadState('networkidle').catch(() => {}); return r; };
    proto.__settled = true;
  }
}
const pageErrors = [];
p.on('pageerror', (e) => pageErrors.push(e.message));
const toastFor = async (re) => {
  const t = p.locator('[role=status]', { hasText: re });
  try { await t.first().waitFor({ timeout: 20000 }); return (await t.first().textContent()) ?? ''; }
  catch { return 'NO TOAST: ' + (await p.locator('[role=status]').allTextContents()).join(' | '); }
};

// --- Login
await p.goto(`${base}/admin/login`);
await p.fill('#password', 'test-admin-pass');
await p.click('button:has-text("Sign in")');
await p.waitForURL(/\/admin\/staff/);
await p.fill('input[name=name]', 'Owner');
await p.fill('input[name=email]', 'owner@noovit.com');
await p.fill('input[name=password]', 'owner-password-123');
await p.click('button:has-text("Create account")');
await p.waitForURL(/created=1/);
await p.fill('#email', 'owner@noovit.com');
await p.fill('#password', 'owner-password-123');
await p.click('button:has-text("Sign in")');
await p.waitForURL(`${base}/admin`);

// --- Import catalog
await p.goto(`${base}/admin/products`);
await p.click('button:has-text("Import launch catalog")');
const imp = await toastFor(/Imported/);
check('import launch catalog', /Imported 32 products/.test(imp), imp);
await p.waitForTimeout(800);
check('products table has 32 rows', (await p.locator('tbody tr').count()) === 32);

// --- Sync all to Stripe
await p.click('button:has-text("Sync all to Stripe")');
const syncMsg = await toastFor(/Stripe sync/);
const [, changed, unchanged] = syncMsg.match(/(\d+) prices changed, (\d+) unchanged/) ?? [];
check('sync all → 32 products, 352 prices', /32 products created/.test(syncMsg) && Number(changed) + Number(unchanged) === 352, syncMsg);

// --- Edit Magnesium: price, status, SKU
await p.goto(`${base}/admin/products/magnesium-complex`);
await p.locator('label:has-text("Base price") input').fill('39');
await p.selectOption('h2:text-is("Status") + select', 'out_of_stock');
await p.locator('input[placeholder="e.g. SUP-MAG-60"]').fill('SUP-MAG-60');
await p.click('button:has-text("Save changes")');
const saveMsg = await toastFor(/Saved/);
check('save product syncs changed prices to Stripe', /Saved\. Stripe updated \(\d+ prices\)/.test(saveMsg), saveMsg);
await p.waitForTimeout(500);
const pp = await (await fetch(`${base}/products/magnesium-complex`)).text();
check('storefront shows out of stock + new price', pp.includes('Out of stock') && pp.includes('"price":"39.00"'), pp.match(/"price":"[\d.]+"/)?.[0]);
const checkoutRes = await fetch(`${base}/api/checkout`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ items: [{ slug: 'magnesium-complex', mode: 'one-time', bottles: 1, quantity: 1 }] }) });
check('checkout rejects out-of-stock', checkoutRes.status === 400 && /out of stock/.test((await checkoutRes.json()).error));
const magRow = (await q('products?slug=eq.magnesium-complex&select=supplier_sku,data'))[0];
check('SKU and price saved in database', magRow.supplier_sku === 'SUP-MAG-60' && magRow.data.basePrice === 39, magRow?.supplier_sku);

// --- Validation
await p.locator('label:has-text("Base price") input').fill('10');
await p.click('button:has-text("Save changes")');
check('rejects base price under $15', /between \$15/.test(await toastFor(/Base price/)));
await p.reload();
await p.waitForLoadState('networkidle');
await p.locator('input[type=file]').waitFor({ state: 'attached' });

// --- Photos
await p.setInputFiles('input[type=file]', [`${dir}photoA.jpg`, `${dir}photoB.png`]);
await p.waitForFunction(() => document.querySelectorAll('img[alt^="Product photo"]').length === 2, null, { timeout: 20000 });
check('two photos uploaded', true);
await p.locator('button[aria-label="Move left"]').nth(1).click();
await p.waitForTimeout(1500);
let imgs = (await q('products?slug=eq.magnesium-complex&select=images'))[0].images;
check('photo reordered (PNG now first)', imgs.length === 2 && imgs[0].endsWith('.png'), imgs);
const photoRes = await fetch(imgs[0]);
check('photo URL is served', photoRes.status === 200);
const pp2 = await (await fetch(`${base}/products/magnesium-complex`)).text();
check('storefront gallery uses uploaded photos', pp2.includes(imgs[0]) && pp2.includes(imgs[1]));
await p.locator('button[aria-label="Remove photo"]').nth(1).click();
await p.waitForTimeout(1500);
imgs = (await q('products?slug=eq.magnesium-complex&select=images'))[0].images;
check('photo removed', imgs.length === 1, imgs);
check('Stripe product images updated', /POST \/v1\/products\/noovit_magnesium-complex images/.test(fakeLog()));

// --- New product
await p.goto(`${base}/admin/products/new`);
await p.locator('input[placeholder="e.g. Magnesium Sleep+"]').fill('Electrolyte Mix');
await p.locator('label:has-text("Short benefit") input').fill('Supports hydration and endurance.');
await p.locator('input[placeholder="Take 2 capsules daily with food."]').fill('Mix 1 scoop in water daily.');
await p.locator('label:has-text("Base price") input').fill('32');
await p.click('button:has-text("Create product")');
await p.waitForURL(`${base}/admin/products/electrolyte-mix`, { timeout: 15000 });
check('new product created with auto URL handle', true);
check('new product hidden by default (404 in store)', (await page200('/products/electrolyte-mix')) === 404);
await p.selectOption('h2:text-is("Status") + select', 'active');
await p.click('button:has-text("Save changes")');
await toastFor(/Saved/);
await p.waitForTimeout(500);
check('activated product is live', (await page200('/products/electrolyte-mix')) === 200);
const feed = await (await fetch(`${base}/feeds/google.xml`)).text();
check('feed includes new product, lists out-of-stock', feed.includes('<g:id>electrolyte-mix</g:id>') && feed.includes('<g:availability>out_of_stock</g:availability>'));

// --- Hide a product
await p.goto(`${base}/admin/products/zinc`);
await p.selectOption('h2:text-is("Status") + select', 'hidden');
await p.click('button:has-text("Save changes")');
await toastFor(/Saved/);
let hiddenOk = false;
for (let i = 0; i < 30 && !hiddenOk; i++) {
  await p.waitForTimeout(500);
  const sitemap = await (await fetch(`${base}/sitemap.xml`)).text();
  const feed2 = await (await fetch(`${base}/feeds/meta.csv`)).text();
  hiddenOk = (await page200('/products/zinc')) === 404 && !sitemap.includes('/products/zinc<') && !feed2.includes('"zinc"');
  if (i === 29) console.log('DEBUG', await page200('/products/zinc'), sitemap.includes('/products/zinc<'), feed2.includes('"zinc"'), (feed2.match(/.*"zinc".*/)||[''])[0].slice(0,200));
}
check('hidden product: 404, not in sitemap or feed', hiddenOk);
const shop = await (await fetch(`${base}/shop`)).text();
check('shop page omits hidden product, includes new one', !shop.includes('/products/zinc"') && shop.includes('/products/electrolyte-mix'));

// --- Settings + analytics
await p.goto(`${base}/admin/settings`);
await p.fill('input[name=ga4_id]', 'not-an-id');
await p.click('button:has-text("Save settings")');
await p.waitForURL(/msg=/);
check('rejects invalid GA4 id', /doesn/.test(await p.locator('main').textContent()));
await p.fill('input[name=ga4_id]', 'G-TEST1234');
await p.fill('input[name=meta_pixel_id]', '1234567890123');
await p.fill('input[name=newsletter_code]', 'welcome10');
await p.fill('input[name=business_address]', 'Noovit LLC, 123 Main St, Austin, TX 78701');
await p.click('button:has-text("Save settings")');
await p.waitForURL(/Settings%20saved|Settings saved/);
check('settings saved', true);
const store = await ctx.newPage();
await store.route('https://www.googletagmanager.com/**', (r) => r.fulfill({ body: '' }));
await store.route('https://connect.facebook.net/**', (r) => r.fulfill({ body: '' }));
await store.goto(`${base}/`);
const banner = store.locator('text=We use cookies');
check('cookie banner shown', await banner.waitFor({ timeout: 10000 }).then(() => true, () => false));
// Opt-out model: tags load straight away; Accept just dismisses the banner; Decline removes them (after a reload).
await store.waitForTimeout(1500);
check('GA, GTM and Meta load without waiting for consent', (await store.locator('script[src*="googletagmanager.com/gtag/js?id=G-TEST1234"]').count()) === 1 && (await store.locator('#gtm').count()) === 1 && (await store.locator('#meta-pixel').count()) === 1);
await store.click('button:has-text("Accept")');
check('Accept dismisses the banner', await banner.waitFor({ state: 'hidden', timeout: 5000 }).then(() => true, () => false));
const declinedCtx = await b.newContext(); const declined = await declinedCtx.newPage();
await declined.route('https://www.googletagmanager.com/**', (r) => r.fulfill({ body: '' }));
await declined.goto(`${base}/`);
await declined.click('button:has-text("Decline")');
await declined.waitForLoadState('load');
await declined.waitForTimeout(1500);
check('Decline turns tags off', (await declined.locator('#gtm, #meta-pixel, script[src*="gtag/js"]').count()) === 0);
await declinedCtx.close();

// --- Discounts
await p.goto(`${base}/admin/discounts`);
await p.fill('input[name=code]', 'save5');
await p.selectOption('select[name=kind]', 'amount');
await p.fill('input[name=value]', '5');
await p.fill('input[name=minimum_amount]', '50');
await p.check('input[name=first_time_transaction]');
await p.click('button:has-text("Create code")');
await p.waitForURL(/msg=/);
const row = await p.locator('tr', { hasText: 'SAVE5' }).textContent();
check('fixed-amount code with min order + first-time', /\$5\.00/.test(row) && /min \$50\.00/.test(row) && /first-time/.test(row), row);
await p.fill('input[name=code]', 'sub20');
await p.fill('input[name=value]', '20');
await p.selectOption('select[name=duration]', 'repeating');
await p.fill('input[name=duration_in_months]', '3');
await p.click('button:has-text("Create code")');
await p.waitForURL(/SUB20/);
check('repeating 3-month code', /First 3 months/.test(await p.locator('tr', { hasText: 'SUB20' }).textContent()));

// --- Newsletter
await store.goto(`${base}/`);
await store.fill('input[placeholder="Your email"]', 'news@example.com');
await store.click('button:has-text("Get 10% Off")');
const nt = (await store.locator('[role=status]').last().textContent({ timeout: 10000 })) ?? '';
check('newsletter signup confirms', /You're in/.test(nt), nt);
await store.waitForTimeout(500);
const sub = (await q('subscribers?email=eq.news@example.com'))[0];
check('subscriber stored', sub?.status === 'subscribed' && sub?.source === 'newsletter');
const welcome = nextLog().split('[email not configured]').find((e) => e.includes('to=news@example.com'));
check('welcome email has code, address, unsubscribe link', welcome?.includes('WELCOME10') && welcome?.includes('123 Main St') && /unsubscribe\?token=/.test(welcome));
const oneClick = welcome.match(/\[(http:\/\/localhost:3100\/unsubscribe\?token=[^\]]+)\]/)?.[1].replace('/unsubscribe?', '/api/newsletter/unsubscribe?');
const oc = await fetch(oneClick, { method: 'POST', body: 'List-Unsubscribe=One-Click' });
check('one-click unsubscribe works', oc.status === 200 && (await q('subscribers?email=eq.news@example.com'))[0].status === 'unsubscribed');
const bad = await fetch(oneClick.replace(/token=./, 'token=X'), { method: 'POST' });
check('tampered unsubscribe rejected', bad.status === 400);
await store.goto(oneClick.replace('/api/newsletter/unsubscribe?', '/unsubscribe?'));
check('unsubscribe page shows confirmation form', await store.locator('text=Stop marketing emails to').isVisible());
const csv = await p.request.get(`${base}/admin/subscribers/export`);
check('subscriber CSV export (unsubscribed excluded)', csv.status() === 200 && !(await csv.text()).includes('news@example.com'));

// --- Abandoned checkouts
const expired = (id, email, consent) => ({
  id, object: 'checkout.session', status: 'expired', amount_total: 3500, currency: 'usd',
  customer_details: { email }, consent: consent ? { promotions: 'opt_in' } : null,
  after_expiration: { recovery: { enabled: true, url: `https://buy.stripe.com/r/test_${id}` } },
});
check('expired webhook 1', (await webhook('checkout.session.expired', expired('cs_exp1', 'sam@example.com', true))) === 200);
check('expired webhook 2 (same email)', (await webhook('checkout.session.expired', expired('cs_exp2', 'sam@example.com', true))) === 200);
check('expired webhook 3 (no consent)', (await webhook('checkout.session.expired', expired('cs_exp3', 'nocon@example.com', false))) === 200);
const ab = await q('abandoned_checkouts?select=stripe_session_id,email,email_sent_at&order=stripe_session_id');
check('3 abandoned recorded; only 1 email (gap + consent rules)', ab.length === 3 && ab.filter((a) => a.email_sent_at).length === 1 && ab[0].email_sent_at, ab);
const recovery = nextLog().split('[email not configured]').find((e) => e.includes('to=sam@example.com') && e.includes('left something'));
check('recovery email has cart link, code and unsubscribe', recovery?.includes('https://buy.stripe.com/r/test_cs_exp1') && recovery.includes('WELCOME10') && /unsubscribe\?token=/.test(recovery));
check('consenting shopper added to subscribers', (await q('subscribers?email=eq.sam@example.com'))[0]?.source === 'checkout');
check('recovered checkout webhook', (await webhook('checkout.session.completed', { id: 'cs_rec' })) === 200);
const rec = (await q('abandoned_checkouts?stripe_session_id=eq.cs_exp1&select=recovered_at,recovered_order_id'))[0];
check('abandoned cart marked recovered with order', rec?.recovered_at && rec?.recovered_order_id, rec);
await p.goto(`${base}/admin/abandoned`);
await p.locator('text=recovery rate').first().waitFor({ timeout: 10000 }).catch(() => {});
const statText = await p.locator('main').textContent();
check('abandoned page shows recovery stats', /Recovered #\d+/.test(statText) && /33% recovery rate/.test(statText));

// --- Reviews feed real ratings into catalog + structured data
await fetch(`${base}/api/reviews`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ slug: 'electrolyte-mix', rating: 4, title: 'Good', body: 'Tastes fine.', name: 'Ann', email: 'ann@example.com' }) });
await p.goto(`${base}/admin/reviews`);
await p.locator('button:has-text("Approve")').first().click();
await p.waitForURL(/msg=/);
await p.waitForTimeout(500);
const ep = await (await fetch(`${base}/products/electrolyte-mix`)).text();
check('approved review → real rating + aggregateRating', ep.includes('"aggregateRating":{"@type":"AggregateRating","ratingValue":4,"reviewCount":1}'));
const mp = await (await fetch(`${base}/products/probiotic-complex`)).text();
check('no aggregateRating for placeholder-only products', !mp.includes('aggregateRating'));

// --- Admin screenshots
for (const [name, path] of [['p-products', '/admin/products'], ['p-editor', '/admin/products/magnesium-complex'], ['p-settings', '/admin/settings'], ['p-subscribers', '/admin/subscribers'], ['p-abandoned', '/admin/abandoned'], ['p-discounts', '/admin/discounts']]) {
  await p.goto(base + path);
  await p.screenshot({ path: `${dir}shots/${name}.png`, fullPage: true });
}
await store.goto(`${base}/products/magnesium-complex`);
await store.screenshot({ path: `${dir}shots/p-store-product.png` });

check('no browser page errors', pageErrors.length === 0, pageErrors);
console.log(`\n${results.filter(Boolean).length}/${results.length} passed`);
await b.close();
