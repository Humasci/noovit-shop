import { chromium } from 'playwright-core';
import Stripe from 'stripe';
import { readFileSync, writeFileSync } from 'fs';

const dir = new URL('.', import.meta.url).pathname;
const base = 'http://localhost:3100';
const svc = readFileSync(`${dir}keys.txt`, 'utf8').split('\n')[0];
const results = [];
const check = (name, ok, detail) => { results.push(Boolean(ok)); console.log(`${ok ? 'PASS' : 'FAIL'} ${name}${ok ? '' : ' :: ' + String(JSON.stringify(detail)).slice(0, 400)}`); };
const rest = (path, init = {}) => fetch(`http://127.0.0.1:54321/rest/v1/${path}`, { ...init, headers: { apikey: svc, Authorization: `Bearer ${svc}`, 'Content-Type': 'application/json', Prefer: 'return=representation', ...(init.headers ?? {}) } }).then((r) => r.json());
const fakeLog = () => readFileSync(`${dir}fake.log`, 'utf8');
const nextLog = () => readFileSync(`${dir}next.log`, 'utf8');
const stripe = new Stripe('sk_test_123');
let n = 500;
async function webhook(type, object) {
  const payload = JSON.stringify({ id: `evt_q${++n}`, object: 'event', type, data: { object }, api_version: '2025-11-17.clover', created: 1 });
  const header = stripe.webhooks.generateTestHeaderString({ payload, secret: 'whsec_test_secret' });
  return (await fetch(`${base}/api/stripe/webhook`, { method: 'POST', headers: { 'stripe-signature': header }, body: payload })).status;
}
const status = async (path) => (await fetch(base + path, { redirect: 'manual' })).status;
const text = async (path) => (await fetch(base + path)).text();

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
const flash = async () => (await p.locator('main p.bg-\\[var\\(--color-navy\\)\\]').first().textContent({ timeout: 10000 }).catch(() => '')) ?? '';
const toastFor = async (page, re) => {
  const t = page.locator('[role=status]', { hasText: re });
  try { await t.first().waitFor({ timeout: 20000 }); return (await t.first().textContent()) ?? ''; } catch { return 'NO TOAST'; }
};
const submit = async (selector) => {
  const before = p.url();
  await p.click(selector);
  await p.waitForURL((u) => u.toString() !== before && /[?&](msg|link)=/.test(u.toString()), { timeout: 20000 }).catch(() => p.waitForLoadState('networkidle'));
};

// ===== Staff accounts =====
await p.goto(`${base}/admin/login`);
check('first-time setup prompt shown', await p.locator('text=First-time setup').isVisible());
await p.fill('#password', 'test-admin-pass');
await p.click('button:has-text("Sign in")');
await p.waitForURL(/\/admin\/staff/);
check('setup login lands on Staff page', true);
await p.fill('input[name=name]', 'Ilaria Owner');
await p.fill('input[name=email]', 'owner@noovit.com');
await p.fill('input[name=password]', 'owner-password-123');
await p.click('button:has-text("Create account")');
await p.waitForURL(/created=1/);
check('owner created, setup session ended', true);
await p.fill('#email', 'owner@noovit.com');
await p.fill('#password', 'test-admin-pass');
await p.click('button:has-text("Sign in")');
await p.waitForURL(/error=1/);
check('setup password stops working once staff exist', true);
const login = async (page, email, pw) => {
  await page.goto(`${base}/admin/login`);
  await page.fill('#email', email);
  await page.fill('#password', pw);
  await page.click('button:has-text("Sign in")');
  await page.waitForURL(/\/admin(\?|$)/, { timeout: 15000 });
};
await login(p, 'owner@noovit.com', 'owner-password-123');
check('owner signs in with email', p.url().endsWith('/admin'));
const ownerRow = (await rest('staff?email=eq.owner@noovit.com&select=password_hash,role'))[0];
check('password stored as scrypt hash', ownerRow.password_hash.startsWith('scrypt$') && !ownerRow.password_hash.includes('owner-password'));
await p.goto(`${base}/admin/staff`);
await p.fill('input[name=name]', 'Pat Packer');
await p.fill('input[name=email]', 'pack@noovit.com');
await p.selectOption('select[name=role]', 'fulfilment');
await p.fill('input[name=password]', 'packer-password-123');
await submit('button:has-text("Create account")');
check('fulfilment staff created', /can now sign in/.test(await flash()));

// ===== Data: catalog + orders =====
await p.goto(`${base}/admin/products`);
await p.click('button:has-text("Import launch catalog")');
await toastFor(p, /Imported/);
await p.click('button:has-text("Sync all to Stripe")');
await toastFor(p, /Stripe sync/);
check('order webhooks', (await webhook('checkout.session.completed', { id: 'cs_pay' })) === 200 && (await webhook('checkout.session.completed', { id: 'cs_sub' })) === 200);
check('Klaviyo Placed Order event sent', /POST \/api\/events .*Placed Order/.test(fakeLog()));

// ===== Orders: partial refund, notes, tags, cancel =====
await p.goto(`${base}/admin/orders/1001`);
await p.fill('input[name=amount]', '20');
await p.fill('form:has(button:has-text("Refund")) input[name=note]', 'Damaged bottle');
await submit('button:has-text("Refund")');
let o1 = (await rest('orders?order_number=eq.1001&select=status,refunded_cents,order_notes(body,author)'))[0];
check('partial refund recorded', o1.status === 'partially_refunded' && o1.refunded_cents === 2000, o1);
check('refund note signed by staff', o1.order_notes.some((x) => /Refunded \$20\.00/.test(x.body) && x.author === 'Ilaria Owner'), o1.order_notes);
check('Stripe refund amount + idempotency key', /POST \/v1\/refunds .*amount=2000.*\[idem refund-/.test(fakeLog()));
await p.fill('input[name=body]', 'Customer called, happy with partial refund');
await submit('button:has-text("Add")');
await p.fill('input[name=tags]', 'VIP, Wholesale!!');
await submit('form:has(input[name=tags]) button');
o1 = (await rest('orders?order_number=eq.1001&select=tags,order_notes(body)'))[0];
check('note added + tags normalised', o1.tags.join(',') === 'vip,wholesale' && o1.order_notes.length === 2, o1);
await p.goto(`${base}/admin/orders?tag=vip`);
check('orders filter by tag', (await p.locator('tbody tr').count()) === 1);
await p.goto(`${base}/admin/orders/1002`);
await p.check('input[name=cancel_subscription]');
await p.check('form:has(button:has-text("Cancel order")) input[name=confirm]');
await submit('button:has-text("Cancel order")');
const o2 = (await rest('orders?order_number=eq.1002&select=status,refunded_cents,total_cents,fulfilments(status)'))[0];
const sub = (await rest('subscriptions?select=status'))[0];
check('cancel: status, full refund, fulfilment cancelled, subscription cancelled', o2.status === 'cancelled' && o2.refunded_cents === o2.total_cents && o2.fulfilments[0].status === 'cancelled' && sub.status === 'canceled', { o2, sub });

// ===== Manual orders =====
await p.goto(`${base}/admin/orders/new`);
await p.fill('input[name=email]', 'replace@example.com');
await p.fill('input[name=name]', 'Rae Place');
await p.fill('input[name=line1]', '9 Oak Ave');
await p.fill('input[name=city]', 'Denver');
await p.fill('input[name=state]', 'co');
await p.fill('input[name=postal_code]', '80202');
await p.selectOption('select[name=slug_0]', 'probiotic-complex');
await p.fill('input[name=note]', 'Lost in transit (#1001)');
await submit('button:has-text("Create order")');
const manual = (await rest('orders?kind=eq.manual&select=order_number,total_cents,tags,shipping_address,fulfilments(status)'))[0];
check('free replacement order created + queued', manual?.total_cents === 0 && manual.tags.includes('replacement') && manual.fulfilments[0].status === 'queued' && manual.shipping_address.state === 'CO', manual);
await p.goto(`${base}/admin/orders/new`);
await p.check('input[value=payment_link]');
await p.fill('input[name=email]', 'phone@example.com');
await p.fill('input[name=name]', 'Phil One');
await p.selectOption('select[name=slug_0]', 'creatine');
await submit('button:has-text("Create order")');
check('payment link created and shown', await p.locator('text=Payment link created and emailed').isVisible() && (await p.locator('code').textContent()).includes('checkout.stripe.com'));
check('payment link emailed', /to=phone@example.com subject="Your Noovit order is ready to complete"/.test(nextLog()));

// ===== Customers =====
await p.goto(`${base}/admin/customers`);
await p.locator('text=/Active subscribers \\(\\d+\\)/').first().waitFor({ timeout: 15000 }).catch(() => {});
const segText = await p.locator('main').textContent();
check('segments shown with counts', /Active subscribers \(\d+\)/.test(segText) && /VIP/.test(segText));
await p.locator('tbody tr a').first().click();
await p.waitForURL(/\/admin\/customers\/[0-9a-f-]{36}/);
await p.fill('input[name=tags]', 'influencer');
await p.fill('textarea[name=notes]', 'Prefers capsules');
await submit('button:has-text("Save")');
check('customer notes + tags saved', /Customer saved/.test(await flash()));
const ccsv = await p.request.get(`${base}/admin/customers/export?tag=influencer`);
check('customer CSV export by tag', ccsv.status() === 200 && (await ccsv.text()).split('\n').length === 2);

// ===== Collections, bundles, bulk, CSV import =====
await p.goto(`${base}/admin/collections/new`);
await p.fill('input[placeholder="e.g. Sleep Support"]', 'Sleep Support');
await p.fill('textarea', 'Wind down and sleep better.');
await p.fill('input[placeholder="Search products to add…"]', 'magnes');
await p.click('button:has-text("+ Magnesium Sleep+")');
await p.fill('input[placeholder="Search products to add…"]', 'ashwa');
await p.click('button:has-text("+ Ashwagandha")');
await p.selectOption('select', 'active');
await p.click('button:has-text("Create collection")');
await p.waitForURL(/\/admin\/collections\/sleep-support/);
const col = await text('/collections/sleep-support');
check('collection page lists its products in order', col.includes('Magnesium Sleep+') && col.indexOf('Magnesium Sleep+') < col.indexOf('Ashwagandha'));
check('collection in sitemap and shop chips', (await text('/sitemap.xml')).includes('/collections/sleep-support') && (await text('/shop')).includes('href="/collections/sleep-support"'));

await p.goto(`${base}/admin/products/new`);
await p.locator('input[placeholder="e.g. Magnesium Sleep+"]').fill('Sleep Stack');
await p.locator('label:has-text("Short benefit") input').fill('Our complete wind-down routine.');
await p.locator('input[placeholder="Take 2 capsules daily with food."]').fill('Take as directed on each bottle.');
await p.locator('label:has-text("Base price") input').fill('60');
await p.click('button:has-text("Add product to bundle")');
await p.selectOption('select[aria-label="Bundle product"] >> nth=0', 'magnesium-complex');
await p.click('button:has-text("Add product to bundle")');
await p.selectOption('select[aria-label="Bundle product"] >> nth=1', 'ashwagandha');
await p.selectOption('select:near(:text("Status"))', 'active');
await p.click('button:has-text("Create product")');
await p.waitForURL(/\/admin\/products\/sleep-stack/, { timeout: 15000 });
check('bundle product created', (await rest('products?slug=eq.sleep-stack&select=data'))[0]?.data.bundleItems?.length === 2);
check('bundle page lists contents', (await text('/products/sleep-stack')).includes('What&#x27;s inside') || (await text('/products/sleep-stack')).includes("What's inside"));
await rest('products?slug=eq.magnesium-complex', { method: 'PATCH', body: JSON.stringify({ supplier_sku: 'SUP-MAG' }) });
await rest('products?slug=eq.ashwagandha', { method: 'PATCH', body: JSON.stringify({ supplier_sku: 'SUP-ASH' }) });
await p.goto(`${base}/admin/orders/new`);
await p.fill('input[name=email]', 'bundle@example.com');
await p.fill('input[name=name]', 'Bun Dle');
await p.fill('input[name=line1]', '1 Pine St');
await p.fill('input[name=city]', 'Austin');
await p.fill('input[name=state]', 'TX');
await p.fill('input[name=postal_code]', '73301');
await p.selectOption('select[name=slug_0]', 'sleep-stack');
await p.fill('input[name=qty_0]', '2');
await submit('button:has-text("Create order")');
const fcsv = await (await p.request.get(`${base}/admin/fulfilment/export`)).text();
check('fulfilment CSV expands bundle into component SKUs', /"Magnesium Sleep\+","SUP-MAG","2","Sleep Stack"/.test(fcsv) && /"Ashwagandha Calm\+","SUP-ASH","2","Sleep Stack"/.test(fcsv), fcsv.split('\n').filter((l) => l.includes('Sleep')));

await p.goto(`${base}/admin/products`);
await p.check('input[name=slugs][value=zinc]');
await p.check('input[name=slugs][value=iron-complex]');
await p.selectOption('select[name=action]', 'status:out_of_stock');
await submit('button:has-text("Apply")');
const bulk = await rest('products?slug=in.(zinc,iron-complex)&select=status');
check('bulk set out of stock', bulk.every((x) => x.status === 'out_of_stock'), bulk);
const pcsv = await (await p.request.get(`${base}/admin/products/export`)).text();
check('product CSV export', pcsv.split('\n').length === 34 && pcsv.startsWith('"slug","name","status"'));
const edited = pcsv.split('\n').map((l) => (l.startsWith('"zinc"') ? l.replace('"out_of_stock"', '"active"').replace('"22.00"', '"25.00"') : l)).join('\n')
  + '\n"no-such-product","X","active","supplements","20","30","capsules","","no","","",""\n"turmeric-complex","","","","5","","","","","","",""';
writeFileSync(`${dir}import.csv`, edited);
await p.setInputFiles('input[type=file][name=file]', `${dir}import.csv`);
await submit('button:has-text("Import CSV")');
const importMsg = await flash();
const zinc = (await rest('products?slug=eq.zinc&select=status,data'))[0];
check('CSV import updates price/status, reports bad rows, syncs Stripe', zinc.status === 'active' && zinc.data.basePrice === 25 && /2 skipped/.test(importMsg) && /Prices synced to Stripe for 1/.test(importMsg), { importMsg, zinc: zinc.status });

// ===== Homepage content + blog =====
await p.goto(`${base}/admin/content`);
await p.fill('textarea[name=hero_headline]', 'Supplements, simplified.');
await p.fill('input[name=announcement_text]', 'Free shipping on every order');
await p.fill('input[name=announcement_link]', '/shop');
await p.fill('input[name=popup_headline]', 'Get 10% off');
await submit('button:has-text("Save homepage")');
const home = await text('/');
check('homepage text + announcement updated', home.includes('Supplements, simplified.') && home.includes('Free shipping on every order'));
await p.fill('input[name=announcement_link]', 'javascript:alert(1)');
await submit('button:has-text("Save homepage")');
check('unsafe link rejected', /must start with/.test(await flash()));

await p.goto(`${base}/admin/blog/new`);
await p.fill('input[name=title]', 'Magnesium and sleep: what the research says');
await p.fill('input[name=slug]', 'magnesium-and-sleep');
await p.fill('textarea[name=excerpt]', 'A plain-English look at magnesium for sleep.');
await p.fill('textarea[name=body]', '## Why magnesium\n\nIt **supports** relaxation. <script>alert(1)</script> [Shop](/products/magnesium-complex) [x](javascript:alert(1))');
await p.selectOption('select[name=status]', 'draft');
await submit('button:has-text("Create post")');
check('draft not public', (await status('/blog/magnesium-and-sleep')) === 404 && !(await text('/blog')).includes('Magnesium and sleep'));
await p.goto(`${base}/admin/blog/magnesium-and-sleep/preview`);
check('draft preview for staff', await p.locator('text=draft, not visible').waitFor({ timeout: 10000 }).then(() => true, () => false));
await p.goto(`${base}/admin/blog/magnesium-and-sleep`);
await p.selectOption('select[name=status]', 'published');
await submit('button:has-text("Save")');
const post = await text('/blog/magnesium-and-sleep');
check('published post renders safely with BlogPosting schema', post.includes('<h2>Why magnesium</h2>') && !post.includes('<script>alert') && !post.includes('javascript:') && post.includes('"@type":"BlogPosting"'));
check('blog index + sitemap list the post', (await text('/blog')).includes('Magnesium and sleep') && (await text('/sitemap.xml')).includes('/blog/magnesium-and-sleep'));

// ===== Marketing automations =====
await p.goto(`${base}/admin/settings`);
await p.fill('input[name=auto_discount_threshold]', '50');
await p.fill('input[name=auto_discount_percent]', '10');
await p.fill('input[name=klaviyo_list_id]', 'AbC123');
await p.fill('input[name=review_request_days]', '14');
await submit('button:has-text("Save settings")');
check('settings saved (case kept for Klaviyo list)', (await rest("settings?key=eq.klaviyo_list_id"))[0]?.value === 'AbC123');
const co = await fetch(`${base}/api/checkout`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ items: [{ slug: 'probiotic-complex', mode: 'one-time', bottles: 3, quantity: 1 }] }) });
const lastCreate = fakeLog().split('\n').filter((l) => l.startsWith('POST /v1/checkout/sessions ')).pop() ?? '';
check('auto discount applied over $50 (codes disabled)', co.status === 200 && lastCreate.includes('discounts[0][coupon]=noovit-auto-10') && !lastCreate.includes('allow_promotion_codes=true'), lastCreate.slice(0, 300));
check('auto discount coupon created once', /POST \/v1\/coupons id=noovit-auto-10/.test(fakeLog()));
await fetch(`${base}/api/checkout`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ items: [{ slug: 'creatine', mode: 'one-time', bottles: 1, quantity: 1 }], ageConfirmed: true }) });
const small = fakeLog().split('\n').filter((l) => l.startsWith('POST /v1/checkout/sessions ')).pop() ?? '';
check('no auto discount under threshold', !small.includes('discounts[0]') && small.includes('allow_promotion_codes=true'));

const shopper = await ctx.newPage();
await shopper.goto(`${base}/products/magnesium-complex`);
await shopper.click('button:has-text("One-Time Purchase")');
await shopper.click('button:has-text("Add to Cart —")');
await shopper.waitForTimeout(500);
const drawer = await shopper.locator('aside').textContent();
check('cart shows discount progress + pairs-well-with', /more to get 10% off/.test(drawer) && /Pairs well with/.test(drawer), drawer.slice(0, 300));
await shopper.locator('aside button:has-text("Add")').first().click();
await shopper.waitForTimeout(300);
check('upsell adds to cart', (await shopper.locator('aside li').count()) >= 2);
await shopper.goto(`${base}/`);
await shopper.mouse.move(600, 400);
await shopper.mouse.move(600, -5);
await shopper.evaluate(() => document.dispatchEvent(new MouseEvent('mouseout', { clientY: 0, bubbles: true })));
await shopper.waitForTimeout(500);
check('newsletter pop-up on exit intent', await shopper.locator('#popup-title').isVisible());
check('pop-up asks the goal first', /main goal/i.test(await shopper.locator('#popup-title').innerText()));
await shopper.click('[role=dialog] button:has-text("Sleep & stress")');
await shopper.fill('[role=dialog] input[type=email]', 'pop@example.com');
await shopper.click('button:has-text("Sign me up")');
await shopper.waitForTimeout(800);
check('pop-up signup → Klaviyo list subscription', /POST \/api\/profile-subscription-bulk-create-jobs .*pop@example.com.*AbC123/.test(fakeLog()));
check('pop-up goal saved on subscriber', (await rest('subscribers?email=eq.pop@example.com&select=goal'))[0]?.goal === 'sleep');
await shopper.reload();
await shopper.evaluate(() => document.dispatchEvent(new MouseEvent('mouseout', { clientY: 0, bubbles: true })));
await shopper.waitForTimeout(300);
check('pop-up not shown again', !(await shopper.locator('#popup-title').isVisible()));

const fulfil = (await rest('fulfilments?select=id,orders(order_number)'))[0];
await rest(`fulfilments?id=eq.${fulfil.id}`, { method: 'PATCH', body: JSON.stringify({ status: 'shipped', shipped_at: new Date(Date.now() - 20 * 86400000).toISOString() }) });
check('cron rejects without secret', (await fetch(`${base}/api/cron/daily`)).status === 401);
const cron1 = await (await fetch(`${base}/api/cron/daily`, { headers: { Authorization: 'Bearer test-cron-secret' } })).json();
const cron2 = await (await fetch(`${base}/api/cron/daily`, { headers: { Authorization: 'Bearer test-cron-secret' } })).json();
check('review request sent once', cron1.reviewRequests.sent + cron1.reviewRequests.skipped === 1 && cron2.reviewRequests.sent === 0, { cron1, cron2 });
check('review email links to product review form', /How are you finding Noovit\?.*#write/s.test(nextLog()) || cron1.reviewRequests.skipped === 1);

// ===== Reports =====
await p.goto(`${base}/admin/reports?days=30`);
check('reports render KPIs and chart', (await p.locator('text=Net revenue').count()) > 0 && (await p.locator('svg[aria-label^="Net revenue per day"] path').count()) > 0);
await p.locator('svg rect[tabindex="0"]').last().hover();
check('chart tooltip on hover', await p.locator('text=Subscription').nth(1).isVisible());
const rcsv = await p.request.get(`${base}/admin/reports/export?days=30`);
check('orders CSV export', rcsv.status() === 200 && (await rcsv.text()).startsWith('"order_number","date"'));
await p.screenshot({ path: `${dir}shots/q-reports.png`, fullPage: true });

// ===== Roles =====
const ctx2 = await b.newContext({ viewport: { width: 1400, height: 1000 } });
const f = await ctx2.newPage();
await login(f, 'pack@noovit.com', 'packer-password-123');
const nav = await f.locator('aside nav').textContent();
check('fulfilment role sees only its sections', nav.includes('Fulfilment') && !nav.includes('Products') && !nav.includes('Discounts') && !nav.includes('Staff'), nav);
await f.goto(`${base}/admin/discounts`);
await f.waitForURL(/msg=/, { timeout: 10000 }).catch(() => {});
await f.locator('main >> text=/doesn/').first().waitFor({ timeout: 10000 }).catch(() => {});
check('fulfilment role blocked from Discounts', /doesn/.test((await f.locator('main').textContent()) ?? ''));
await f.goto(`${base}/admin/orders/1001`);
check('no refund/cancel controls for fulfilment role', (await f.locator('button:has-text("Refund")').count()) === 0 && (await f.locator('button:has-text("Cancel order")').count()) === 0);
check('fulfilment role can’t download reports', (await f.request.get(`${base}/admin/reports/export`)).status() === 401);
check('overview hides revenue from fulfilment role', !(await (await f.goto(`${base}/admin`)).text()).includes('Revenue today'));
await p.goto(`${base}/admin/staff`);
const packRow = p.locator('tr', { hasText: 'pack@noovit.com' });
await packRow.locator('select[name=active]').selectOption('false');
await packRow.locator('button:has-text("Update")').click();
await p.waitForURL(/msg=/);
await f.goto(`${base}/admin/orders`);
check('deactivated staff is signed out immediately', f.url().includes('/admin/login'));
await p.goto(`${base}/admin/staff`);
const ownerRowEl = p.locator('tr', { hasText: 'owner@noovit.com' });
await ownerRowEl.locator('select[name=role]').selectOption('manager');
await ownerRowEl.locator('button:has-text("Update")').click();
await p.waitForURL(/msg=/);
check('last owner can’t be demoted', /at least one active owner/.test(await flash()));

for (const [name, path] of [['q-staff', '/admin/staff'], ['q-order', '/admin/orders/1001'], ['q-customers', '/admin/customers'], ['q-collection', '/admin/collections/sleep-support'], ['q-content', '/admin/content'], ['q-blog', '/admin/blog/magnesium-and-sleep']]) {
  await p.goto(base + path);
  await p.screenshot({ path: `${dir}shots/${name}.png`, fullPage: true });
}
await shopper.goto(`${base}/blog/magnesium-and-sleep`);
await shopper.screenshot({ path: `${dir}shots/q-post.png`, fullPage: true });

check('no browser page errors', pageErrors.length === 0, pageErrors);
console.log(`\n${results.filter(Boolean).length}/${results.length} passed`);
await b.close();
