// Tests for the 30 Oct batch: newsletter goal, privacy export/delete, guide images, feeds.
import { chromium } from 'playwright-core';
import { readFileSync } from 'fs';
const dir = new URL('.', import.meta.url).pathname;
const base = 'http://localhost:3100';
const svc = readFileSync(`${dir}keys.txt`, 'utf8').split('\n')[0];
const results = [];
const check = (name, ok, detail) => { results.push(Boolean(ok)); console.log(`${ok ? 'PASS' : 'FAIL'} ${name}${ok ? '' : ' :: ' + String(JSON.stringify(detail)).slice(0, 300)}`); };
const rest = (path, init = {}) => fetch(`http://127.0.0.1:54321/rest/v1/${path}`, { ...init, headers: { apikey: svc, Authorization: `Bearer ${svc}`, 'Content-Type': 'application/json', Prefer: 'return=representation', ...(init.headers ?? {}) } }).then((r) => r.json());

// Newsletter with goal
let r = await fetch(`${base}/api/newsletter`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: 'goal@test.com', goal: 'sleep' }) });
check('newsletter with goal accepted', r.ok);
let sub = await rest('subscribers?email=eq.goal@test.com&select=goal,source');
check('goal stored', sub[0]?.goal === 'sleep', sub);
r = await fetch(`${base}/api/newsletter`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: 'bad@test.com', goal: '<script>' }) });
sub = await rest('subscribers?email=eq.bad@test.com&select=goal');
check('invalid goal ignored', r.ok && sub[0] && sub[0].goal === null, sub);

// Guide image + guides
const gi = await fetch(`${base}/guide-image/magnesium`).catch(() => null);
const gi2 = await fetch(`${base}/guide-image/ashwagandha`);
check('guide image is a PNG', gi2.ok && gi2.headers.get('content-type') === 'image/png', gi2.status);
check('unknown guide image 404', (await fetch(`${base}/guide-image/nope`)).status === 404);
const gh = await (await fetch(`${base}/guides/ashwagandha`)).text();
check('guide has og:image', gh.includes('/guide-image/ashwagandha'));
void gi;

// Feeds titles
const feed = await (await fetch(`${base}/feeds/google.xml`)).text();
check('feed title has spec', feed.includes('Noovit Magnesium Sleep+ – Magnesium Glycinate 275 mg – 90 Capsules'), feed.slice(0, 300));

// Product images: gallery variants
const hl = await fetch(`${base}/product-image/magnesium-complex/highlights-abc.png`);
check('highlights image renders', hl.ok && hl.headers.get('content-type') === 'image/png', hl.status);
check('compare image 404 for product without it', (await fetch(`${base}/product-image/ashwagandha/compare-abc.png`)).status === 404);

// Customer account (25 Nov): passwordless sign-in, orders with tracking, subscriptions, sign-out
{
  const post = (path, body) => fetch(`${base}${path}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  const [ac] = await rest('customers', { method: 'POST', body: JSON.stringify({ email: 'acct@test.com', name: 'Ada Count', stripe_customer_id: 'cus_acct' }) });
  const [asub] = await rest('subscriptions', { method: 'POST', body: JSON.stringify({ customer_id: ac.id, stripe_subscription_id: 'sub_acct', status: 'active', frequency_days: 30, amount_cents: 2400, current_period_end: '2027-01-15T00:00:00Z' }) });
  const [ao] = await rest('orders', { method: 'POST', body: JSON.stringify({ customer_id: ac.id, subscription_id: asub.id, kind: 'subscription_initial', status: 'shipped', email: 'acct@test.com', subtotal_cents: 2400, total_cents: 2400 }) });
  await rest('order_items', { method: 'POST', body: JSON.stringify({ order_id: ao.id, product_slug: 'magnesium-complex', product_name: 'Magnesium Sleep+', purchase_mode: 'subscribe', bottles: 1, frequency_days: 30, unit_amount_cents: 2400, quantity: 1 }) });
  await rest('fulfilments', { method: 'POST', body: JSON.stringify({ order_id: ao.id, supplier: 'supliful', status: 'shipped', carrier: 'USPS', tracking_number: '9400TEST', tracking_url: 'https://tools.usps.com/go/TrackConfirmAction?tLabels=9400TEST' }) });
  await rest('orders', { method: 'POST', body: JSON.stringify({ kind: 'one_time', email: 'someone-else@test.com', subtotal_cents: 9900, total_cents: 9900 }) });

  const out = await (await fetch(`${base}/account`)).text();
  check('account: signed out shows the sign-in form', out.includes('Email me a sign-in link') && !out.includes('Signed in as'));
  check('account page is noindex', /<meta name="robots" content="noindex/.test(out));
  const unknown = await post('/api/account/sign-in', { email: 'nobody@test.com' });
  const known = await post('/api/account/sign-in', { email: 'Acct@Test.com' });
  const km = (await known.json()).message, um = (await unknown.json()).message;
  check('account: same reply for known and unknown emails', known.ok && unknown.ok && km === um && /sign-in link/.test(km), { km, um });
  check('account: invalid email refused', (await post('/api/account/sign-in', { email: 'nope' })).status === 400);
  await new Promise((r) => setTimeout(r, 500));
  const log = readFileSync(`${dir}next.log`, 'utf8');
  const link = log.match(/to=acct@test\.com subject="Your Noovit sign-in link"\n[^\n]*?\[(http[^\]]+\/api\/account\/session\?token=[^\]]+)\]/)?.[1];
  check('account: link emailed to the known address only', Boolean(link) && !log.includes('to=nobody@test.com'), link);
  check('account: bad token bounces to expired', (await fetch(`${base}/api/account/session?token=garbage`, { redirect: 'manual' })).headers.get('location')?.endsWith('/account?expired=1'));
  check('account: portal needs a session', (await fetch(`${base}/api/account/portal`, { redirect: 'manual' })).headers.get('location')?.endsWith('/account?expired=1'));

  const ab = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined });
  const ctx = await ab.newContext();
  const ap = await ctx.newPage();
  await ap.goto(link);
  await ap.waitForURL(/\/account$/);
  const body = (await ap.textContent('main, body')) ?? '';
  check('account: signed in, greets by first name', body.includes('Hi, Ada') && body.includes('Signed in as acct@test.com'), body.slice(0, 200));
  check('account: order with items and status', (await ap.locator('[data-testid=account-order]').count()) === 1 && body.includes(`Order #${ao.order_number}`) && body.includes('Magnesium Sleep+') && body.includes('Shipped') && body.includes('$24.00'));
  check('account: tracking link', (await ap.locator('a:has-text("Track package")').getAttribute('href'))?.includes('9400TEST'));
  check('account: buy again uses the public product address', (await ap.locator('a:has-text("Buy again")').getAttribute('href')) === '/products/magnesium-glycinate');
  check('account: subscription with next order date', (await ap.locator('[data-testid=account-subscription]').count()) === 1 && body.includes('Every month') && body.includes('Next order Jan 15, 2027'));
  check("account: other customers' orders not shown", !body.includes('$99.00'));
  check('account: no analytics tags', !(await ap.content()).includes('googletagmanager.com/gtm.js'));
  const pr = await ctx.request.get(`${base}/api/account/portal`, { maxRedirects: 0 });
  check('account: Manage opens the Stripe portal', pr.status() >= 300 && pr.status() < 400 && (pr.headers().location ?? '').startsWith('https://billing.stripe.com/'), pr.headers().location);
  await ap.click('button:has-text("Sign out")');
  await ap.waitForURL(/\/account$/);
  check('account: sign out', ((await ap.textContent('body')) ?? '').includes('Email me a sign-in link'));
  await ab.close();
}

// Privacy: seed a customer with an order, review, subscriber
const [cust] = await rest('customers', { method: 'POST', body: JSON.stringify({ email: 'erase@test.com', name: 'Erase Me' }) });
await rest('orders', { method: 'POST', body: JSON.stringify({ customer_id: cust.id, kind: 'one_time', email: 'erase@test.com', subtotal_cents: 2900, total_cents: 2900, shipping_name: 'Erase Me', shipping_address: { line1: '1 Test St' } }) });
await rest('reviews', { method: 'POST', body: JSON.stringify({ product_slug: 'magnesium-complex', name: 'Erase', email: 'erase@test.com', rating: 5, title: 't', body: 'b' }) });
await rest('subscribers', { method: 'POST', body: JSON.stringify({ email: 'erase@test.com' }) });

const b = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined });
const p = await (await b.newContext()).newPage();
await p.goto(`${base}/admin/login`);
await p.fill('#password', 'test-admin-pass');
await p.click('button:has-text("Sign in")');
await p.waitForLoadState('networkidle');
const exp = await p.request.get(`${base}/admin/customers/${cust.id}/privacy-export`);
const data = await exp.json().catch(() => ({}));
check('privacy export JSON', exp.ok() && data.customer?.email === 'erase@test.com' && data.orders?.length === 1 && data.reviews?.length === 1 && data.marketing?.email === 'erase@test.com', { s: exp.status(), keys: Object.keys(data) });
{ const u = await fetch(`${base}/admin/customers/${cust.id}/privacy-export`, { redirect: 'manual' }); check('privacy export needs login', [401, 404].includes(u.status) || (u.status >= 300 && u.status < 400 && /admin\/login/.test(u.headers.get('location') ?? '')), u.status); }
await p.goto(`${base}/admin/customers/${cust.id}`);
await p.fill('input[name=confirm]', 'wrong@test.com');
await p.click('button:has-text("Delete personal data")');
await p.waitForURL(/msg=/);
check('wrong confirmation refused', decodeURIComponent(p.url()).includes('Type the customer'), p.url());
await p.fill('input[name=confirm]', 'erase@test.com');
await p.click('button:has-text("Delete personal data")');
await p.waitForURL(/Personal|failed/i);
const after = await rest(`customers?id=eq.${cust.id}&select=email,name`);
const ord = await rest(`orders?customer_id=eq.${cust.id}&select=email,shipping_name,shipping_address`);
const rev = await rest('reviews?email=eq.erase@test.com&select=id');
const sb = await rest('subscribers?email=eq.erase@test.com&select=id');
check('customer anonymised', after[0]?.email.endsWith('@deleted.invalid') && after[0]?.name === null, after);
check('order kept without personal data', ord.length === 1 && ord[0].email.endsWith('@deleted.invalid') && ord[0].shipping_name === null && ord[0].shipping_address === null, ord);
check('review and subscriber deleted', rev.length === 0 && sb.length === 0, { rev, sb });
await b.close();
console.log(`\n${results.filter(Boolean).length}/${results.length} passed`);
