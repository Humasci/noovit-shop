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

// Customer account (25 Nov): passwordless sign-in, overview, orders, order detail + help, reorder, subscriptions
// (skip, pause, cancel), profile + address, email settings, data download, sign-out
{
  const post = (path, body) => fetch(`${base}${path}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  const [ac] = await rest('customers', { method: 'POST', body: JSON.stringify({ email: 'acct@test.com', name: 'Ada Count', stripe_customer_id: 'cus_1' }) });
  const [asub] = await rest('subscriptions', { method: 'POST', body: JSON.stringify({ customer_id: ac.id, stripe_subscription_id: 'sub_1', status: 'active', frequency_days: 30, amount_cents: 2400, current_period_end: '2027-01-15T08:00:00Z' }) });
  const [ao] = await rest('orders', { method: 'POST', body: JSON.stringify({ customer_id: ac.id, subscription_id: asub.id, kind: 'subscription_initial', status: 'shipped', email: 'acct@test.com', subtotal_cents: 2400, total_cents: 2400, shipping_name: 'Ada Count', shipping_address: { line1: '5 Elm St', city: 'Austin', state: 'TX', postal_code: '73301', country: 'US' } }) });
  await rest('order_items', { method: 'POST', body: JSON.stringify({ order_id: ao.id, product_slug: 'magnesium-complex', product_name: 'Magnesium Sleep+', purchase_mode: 'subscribe', bottles: 1, frequency_days: 30, unit_amount_cents: 2400, quantity: 1 }) });
  await rest('fulfilments', { method: 'POST', body: JSON.stringify({ order_id: ao.id, supplier: 'supliful', status: 'shipped', carrier: 'USPS', tracking_number: '9400TEST', tracking_url: 'https://tools.usps.com/go/TrackConfirmAction?tLabels=9400TEST' }) });
  const [other] = await rest('orders', { method: 'POST', body: JSON.stringify({ kind: 'one_time', email: 'someone-else@test.com', subtotal_cents: 9900, total_cents: 9900 }) });
  await rest('subscribers', { method: 'POST', body: JSON.stringify({ email: 'acct@test.com' }) });

  const out = await (await fetch(`${base}/account`)).text();
  check('account: signed out shows the sign-in form', out.includes('Email me a sign-in link') && !out.includes('Signed in as'));
  check('account page is noindex', /<meta name="robots" content="noindex/.test(out));
  const anon = await (await fetch(`${base}/account/orders`)).text();
  check('account: sub-pages need a session', !anon.includes('Order #') && !anon.includes('acct@test.com') && (await fetch(`${base}/account/data`, { redirect: 'manual' })).headers.get('location')?.endsWith('/account'));
  const unknown = await post('/api/account/sign-in', { email: 'nobody@test.com' });
  const known = await post('/api/account/sign-in', { email: 'Acct@Test.com' });
  const km = (await known.json()).message, um = (await unknown.json()).message;
  check('account: same reply for known and unknown emails', known.ok && unknown.ok && km === um && /sign-in link/.test(km), { km, um });
  check('account: invalid email refused', (await post('/api/account/sign-in', { email: 'nope' })).status === 400);
  await new Promise((r) => setTimeout(r, 500));
  let log = readFileSync(`${dir}next.log`, 'utf8');
  const link = log.match(/to=acct@test\.com subject="Your Noovit sign-in link"\n[^\n]*?\[(http[^\]]+\/api\/account\/session\?token=[^\]]+)\]/)?.[1];
  check('account: link emailed to the known address only', Boolean(link) && !log.includes('to=nobody@test.com'), link);
  check('account: bad token bounces to expired', (await fetch(`${base}/api/account/session?token=garbage`, { redirect: 'manual' })).headers.get('location')?.endsWith('/account?expired=1'));
  check('account: portal needs a session', (await fetch(`${base}/api/account/portal`, { redirect: 'manual' })).headers.get('location')?.endsWith('/account?expired=1'));

  const ab = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined });
  const ctx = await ab.newContext();
  const ap = await ctx.newPage();
  const open = async (path, sel) => { await ap.goto(`${base}${path}`); await ap.waitForSelector(sel); return (await ap.textContent('body')) ?? ''; };
  // Waits for the action's result code in the address (?ok=code / ?err=code), then reads the message shown.
  const flash = async (code) => { await ap.waitForURL((u) => u.search === `?ok=${code}` || u.search === `?err=${code}`); await ap.waitForSelector('[data-testid=account-flash]'); return (await ap.textContent('[data-testid=account-flash]')) ?? ''; };
  await ap.goto(link);
  await ap.waitForSelector('[data-testid=account-email]');
  let body = (await ap.textContent('body')) ?? '';
  check('account: overview greets by first name, shows next delivery', body.includes('Hi, Ada') && body.includes('Signed in as acct@test.com') && body.includes('Next delivery: Jan 15, 2027'), body.slice(0, 300));
  check('account: no analytics tags', !(await ap.content()).includes('googletagmanager.com/gtm.js'));

  body = await open('/account/orders', '[data-testid=account-order]');
  check('account: orders list', (await ap.locator('[data-testid=account-order]').count()) === 1 && body.includes(`Order #${ao.order_number}`) && body.includes('Magnesium Sleep+') && body.includes('Shipped') && !body.includes('$99.00'));
  check('account: tracking link', (await ap.locator('a:has-text("Track package")').first().getAttribute('href'))?.includes('9400TEST'));

  body = await open(`/account/orders/${ao.order_number}`, 'text=Shipped to');
  check('account: order detail (items, totals, address, progress)', body.includes('Magnesium Sleep+') && body.includes('$24.00') && body.includes('5 Elm St') && body.includes('Free') && (await ap.locator('ol[aria-label="Order progress"] li[aria-current=step]').textContent())?.includes('Shipped'), body.slice(0, 400));
  const theirs = await (await ctx.request.get(`${base}/account/orders/${other.order_number}`)).text();
  check("account: someone else's order is not shown", !theirs.includes('$99.00') && !theirs.includes('someone-else') && !theirs.includes('Get help with this order'));
  await ap.click('button:has-text("Buy again")');
  await ap.waitForSelector('button[aria-label="Cart, 1 item"]');
  check('account: buy again puts it in the cart', true);
  await ap.keyboard.press('Escape');
  await ap.goto(`${base}/account/orders/${ao.order_number}`);
  await ap.click('summary:has-text("Get help with this order")');
  await ap.selectOption('select[name=topic]', 'refund');
  await ap.fill('textarea[name=message]', 'Not for me, please refund.');
  await ap.click('button:has-text("Send to support")');
  check('account: order help sent', (await flash('help')).includes('Message sent'));
  log = readFileSync(`${dir}next.log`, 'utf8');
  check('account: help email names the order, replies to the customer', log.includes(`Order #${ao.order_number}: Refund (90-day guarantee)`) && log.includes('Not for me, please refund.'));

  // Subscriptions
  const subState = async () => `${await ap.textContent('[data-testid=account-subscription]')}`;
  body = await open('/account/subscriptions', '[data-testid=account-subscription]');
  check('account: subscription shown', body.includes('Magnesium Sleep+') && body.includes('Every month') && body.includes('Next order: Jan 15, 2027') && body.includes('Active'), body.slice(0, 300));
  await ap.click('button:has-text("Skip next order")');
  check('account: skip next order', (await flash('skipped')).includes('skipped') && (await subState()).includes('Skipping next order'), await subState());
  let dbsub = await rest(`subscriptions?id=eq.${asub.id}&select=paused,cancel_at_period_end`);
  check('account: skip saved', dbsub[0]?.paused === true, dbsub);
  await ap.click("button:has-text(\"Don't skip\")");
  check('account: undo skip', (await flash('resumed')).includes('active again') && (await subState()).includes('Active'));
  await ap.click('button:has-text("Pause")');
  check('account: pause', (await flash('paused')).includes('paused') && (await subState()).includes('Paused'));
  await ap.click('button:has-text("Resume")');
  await flash('resumed');
  await ap.click('summary:has-text("Cancel subscription")');
  await ap.selectOption('select[name=reason]', 'too_expensive');
  await ap.click('button:has-text("Cancel my subscription")');
  const cancelMsg = await flash('cancelled');
  dbsub = await rest(`subscriptions?id=eq.${asub.id}&select=paused,cancel_at_period_end`);
  check('account: cancel at period end', cancelMsg.includes('cancelled') && (await subState()).includes('Ends Jan 15, 2027') && dbsub[0]?.cancel_at_period_end === true, dbsub);
  await ap.click('button:has-text("Keep my subscription")');
  check('account: undo cancel', (await flash('reactivated')).includes('Welcome back') && (await subState()).includes('Active'));
  // Someone else's subscription id is refused
  const [oc] = await rest('customers', { method: 'POST', body: JSON.stringify({ email: 'someone-else@test.com' }) });
  const [osub] = await rest('subscriptions', { method: 'POST', body: JSON.stringify({ customer_id: oc.id, stripe_subscription_id: 'sub_other', status: 'active', frequency_days: 30, amount_cents: 2400 }) });
  await ap.evaluate((id) => { document.querySelectorAll('[data-testid=account-subscription] input[name=id]').forEach((el) => { el.value = id; }); }, osub.id);
  await ap.click('button:has-text("Pause")');
  const refused = await flash('invalid');
  dbsub = await rest(`subscriptions?id=eq.${osub.id}&select=paused`);
  check("account: can't change someone else's subscription", refused.includes('check the form') && dbsub[0]?.paused === false, { refused, dbsub });
  const pr = await ctx.request.get(`${base}/api/account/portal`, { maxRedirects: 0 });
  check('account: card and invoices open the Stripe portal', pr.status() >= 300 && pr.status() < 400 && (pr.headers().location ?? '').startsWith('https://billing.stripe.com/'), pr.headers().location);

  // Profile and address
  await open('/account/profile', '[data-testid=address-form]');
  await ap.fill('input[name=name]', 'Ada Lovelace');
  await ap.click('button:has-text("Save name")');
  check('account: name saved', (await flash('name')).includes('name is saved') && (await rest(`customers?id=eq.${ac.id}&select=name`))[0]?.name === 'Ada Lovelace');
  await ap.fill('input[name=line1]', '77 Oak Ave');
  await ap.fill('input[name=city]', 'Denver');
  await ap.fill('input[name=state]', 'co');
  await ap.fill('input[name=zip]', '80202');
  await ap.click('button:has-text("Save address")');
  check('account: address saved for future orders', (await flash('address')).includes('address is saved') && (await ap.inputValue('input[name=line1]')) === '77 Oak Ave' && (await ap.inputValue('input[name=state]')) === 'CO');
  await ap.fill('input[name=zip]', '80202');
  await ap.evaluate(() => { const z = document.querySelector('input[name=zip]'); z.removeAttribute('pattern'); z.value = 'ABC'; });
  await ap.click('button:has-text("Save address")');
  check('account: bad address refused', (await flash('address_invalid')).includes('full US address'));

  // Emails and privacy
  await open('/account/settings', '[data-testid=email-state]');
  await ap.click('button:has-text("Unsubscribe")');
  check('account: unsubscribe', (await flash('unsubscribed')).includes('off our email list') && (await rest('subscribers?email=eq.acct@test.com&select=status'))[0]?.status === 'unsubscribed');
  await ap.click('button:has-text("Send me guides and offers")');
  check('account: subscribe again', (await flash('subscribed')).includes('on our email list') && (await rest('subscribers?email=eq.acct@test.com&select=status'))[0]?.status === 'subscribed');
  const dl = await ctx.request.get(`${base}/account/data`);
  const mine = await dl.json().catch(() => ({}));
  check('account: data download is mine only', dl.ok() && mine.customer?.email === 'acct@test.com' && mine.orders?.length === 1 && mine.subscriptions?.length === 1 && !JSON.stringify(mine).includes('someone-else'), Object.keys(mine));
  await ap.click('summary:has-text("Delete my data")');
  await ap.fill('input[name=confirm]', 'acct@test.com');
  await ap.click('button:has-text("Request deletion")');
  check('account: delete request asks to cancel the subscription first', (await flash('active_sub')).includes('cancel your subscription first'));

  await ap.click('button:has-text("Sign out") >> visible=true');
  await ap.waitForSelector('text=Email me a sign-in link');
  check('account: sign out', true);
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
