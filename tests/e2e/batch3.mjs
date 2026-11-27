// Tests for the 30 Oct batch: newsletter goal, privacy export/delete, guide images, feeds.
import { chromium } from 'playwright-core';
import Stripe from 'stripe';
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

// Microsoft Ads (Bing) UET tag: on normal pages, never on health pages, gone after Decline
{
  const tb = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined });
  const tp = await (await tb.newContext()).newPage();
  await tp.goto(`${base}/shop`);
  await tp.waitForFunction(() => document.getElementById('bing-uet') !== null, null, { timeout: 15000 }).catch(() => null);
  check('bing uet: tag on the shop', (await tp.content()).includes('bat.bing.net/bat.js') && (await tp.content()).includes('97296488'));
  await tp.goto(`${base}/at-home-tests/vitamin-d-test`);
  await tp.waitForLoadState('networkidle');
  check('bing uet: never on health pages', !(await tp.content()).includes('bat.bing.net'));
  await tb.close();
}

// ChatGPT shopping feed (OpenAI JSONL spec)
{
  const txt = await (await fetch(`${base}/feeds/openai.jsonl`)).text();
  const rows = txt.trim().split('\n').map((l) => JSON.parse(l));
  const mag = rows.find((r) => r.item_id === 'magnesium-complex');
  const req = ['item_id', 'title', 'description', 'url', 'brand', 'seller_name', 'image_url', 'availability', 'price', 'target_countries', 'store_country'];
  check('openai feed: every row has the required fields', rows.length > 3 && rows.every((r) => req.every((k) => r[k] !== undefined && r[k] !== '')), rows[0]);
  check('openai feed: price, availability, returns in spec format', /^\d+\.\d{2} USD$/.test(mag?.price) && ['in_stock', 'out_of_stock'].includes(mag?.availability) && mag?.return_deadline_in_days === 90 && mag?.is_eligible_checkout === false && mag?.target_countries?.[0] === 'US', mag);
}

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

  // Continue with Google (fake token endpoint): state check, verified email only, same session as the email link
  check('account: Google button shown', out.includes('Continue with Google'));
  const g1 = await fetch(`${base}/api/account/google`, { redirect: 'manual' });
  const gUrl = new URL(g1.headers.get('location'));
  const gState = gUrl.searchParams.get('state');
  const gCookie = (g1.headers.get('set-cookie') ?? '').split(';')[0];
  check('account: Google step 1 goes to Google asking only for the email', gUrl.origin === 'https://accounts.google.com' && gUrl.searchParams.get('scope') === 'openid email' && gUrl.searchParams.get('redirect_uri') === `${base}/api/account/google/callback` && gState?.length > 20 && gCookie.startsWith('noovit_g_state='), gUrl.href);
  const gBack = (code, state, cookie = gCookie) => fetch(`${base}/api/account/google/callback?code=${encodeURIComponent(code)}&state=${state}`, { redirect: 'manual', headers: { cookie } });
  const gBad = await gBack('acct@test.com', 'forged-state');
  check('account: Google wrong state refused', gBad.headers.get('location')?.endsWith('/account?google=failed') && !(gBad.headers.get('set-cookie') ?? '').includes('noovit_account='));
  check('account: Google without the state cookie refused', (await gBack('acct@test.com', gState, '')).headers.get('location')?.endsWith('/account?google=failed'));
  check('account: Google unverified email refused', (await gBack('unverified:acct@test.com', gState)).headers.get('location')?.endsWith('/account?google=failed'));
  const gOk = await gBack('Acct@Test.com', gState);
  const gSession = (gOk.headers.getSetCookie?.() ?? []).find((c) => c.startsWith('noovit_account='))?.split(';')[0];
  const gPage = gSession ? (await (await fetch(`${base}/account/orders`, { headers: { cookie: gSession } })).text()).replace(/<!-- -->/g, '') : '';
  check('account: Google sign-in opens the same account', gOk.headers.get('location')?.endsWith('/account') && gPage.includes(`Order #${ao.order_number}`), gOk.headers.get('location'));

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
  check('account: no analytics tags', !(await ap.content()).includes('googletagmanager.com/gtm.js') && !(await ap.content()).includes('bat.bing.net'));

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

  // Phones: bottom navigation bar instead of the side menu
  await ap.setViewportSize({ width: 390, height: 800 });
  const bar = ap.locator('[data-testid=account-bottom-nav]');
  const box = await bar.boundingBox();
  check('account: bottom navigation on phones', (await bar.isVisible()) && box && Math.round(box.y + box.height) === 800 && (await bar.locator('a').count()) === 5 && (await bar.locator('a[aria-current=page]').textContent())?.includes('Subscriptions'), box);
  await bar.locator('a:has-text("Orders")').click();
  await ap.waitForURL(/\/account\/orders$/);
  check('account: bottom navigation moves between sections', (await bar.locator('a[aria-current=page]').textContent())?.includes('Orders'));
  await ap.setViewportSize({ width: 1280, height: 720 });
  check('account: side menu on desktop', !(await bar.isVisible()) && (await ap.locator('aside nav[aria-label=Account]').isVisible()));

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

  // Notify me list (migration 0009): every product and kit kept; shown in the account; removable
  const notify = (b) => post('/api/newsletter', { email: 'acct@test.com', source: 'launch', ...b });
  await notify({ product: 'lions-mane' });
  await notify({ product: 'coq10' });
  await post('/api/newsletter', { email: 'acct@test.com', source: 'tests', kit: 'vitamin-d-test' });
  await notify({ product: 'not-a-product' });
  const nr = await rest('notify_requests?email=eq.acct@test.com&select=kind,slug&order=slug');
  check('notify: every product and kit kept, unknown ignored', nr.length === 3 && nr.some((r) => r.slug === 'lions-mane') && nr.some((r) => r.slug === 'coq10') && nr.some((r) => r.kind === 'kit') && !nr.some((r) => r.slug === 'not-a-product'), nr);
  body = await open('/account', '[data-testid=notify-list]');
  const listText = (await ap.textContent('[data-testid=notify-list]')) ?? '';
  check('notify: list on the account overview', (await ap.locator('[data-testid=notify-list] li').count()) === 3 && listText.includes("Lion's Mane"), listText.slice(0, 300));
  await ap.click('[data-testid=notify-list] button[aria-label^="Remove Lion"]');
  check('notify: remove one', (await flash('notify_removed')).includes('Removed') && (await ap.locator('[data-testid=notify-list] li').count()) === 2 && (await rest('notify_requests?email=eq.acct@test.com&slug=eq.lions-mane')).length === 0);

  // Checkout knows a signed-in customer: their Stripe customer is passed (email and saved details filled in)
  const co = await ctx.request.post(`${base}/api/checkout`, { data: { items: [{ slug: 'magnesium-complex', mode: 'one-time', bottles: 1, quantity: 1 }] } });
  const last = await (await fetch('http://127.0.0.1:12120/__last_checkout')).json();
  check('checkout: signed-in customer prefilled', co.ok() && last.customer === 'cus_1' && last.customer_update?.shipping === 'auto' && !last.customer_creation && last.success_url?.includes('/api/account/after-checkout'), { s: co.status(), last });

  await ap.click('button:has-text("Sign out") >> visible=true');
  await ap.waitForSelector('text=Email me a sign-in link');
  check('account: sign out', true);
  await ab.close();
}

// Signed in after checkout: only the browser that started the checkout; the order email carries a 7-day sign-in link
{
  const cb = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined });
  const guest = await cb.newContext();
  const co = await guest.request.post(`${base}/api/checkout`, { data: { items: [{ slug: 'magnesium-complex', mode: 'one-time', bottles: 1, quantity: 1 }] } });
  const last = await (await fetch('http://127.0.0.1:12120/__last_checkout')).json();
  check('checkout: guest gets no customer prefill', co.ok() && !last.customer && !last.customer_email && last.customer_creation === 'always', last);
  const stranger = await fetch(`${base}/api/account/after-checkout?session_id=cs_new`, { redirect: 'manual' });
  check('after checkout: a copied session id signs nobody in', stranger.headers.get('location')?.endsWith('/checkout/success?session_id=cs_new') && !(stranger.headers.get('set-cookie') ?? '').includes('noovit_account='));
  const gp = await guest.newPage();
  await gp.goto(`${base}/api/account/after-checkout?session_id=cs_new`);
  await gp.waitForSelector('[data-testid=success-account]');
  check('after checkout: buyer signed in, success page says so', ((await gp.textContent('[data-testid=success-account]')) ?? '').includes('Your account is ready'));
  await gp.goto(`${base}/account`);
  await gp.waitForSelector('[data-testid=account-email]');
  check('after checkout: account opens without a link', ((await gp.textContent('[data-testid=account-email]')) ?? '').includes('fan@example.com'));
  const again = await guest.request.get(`${base}/api/account/after-checkout?session_id=cs_new`, { maxRedirects: 0 });
  check('after checkout: works once (cookie cleared)', !(again.headers()['set-cookie'] ?? '').includes('noovit_account='));

  // Order email: the webhook creates the order and emails a "View your order" sign-in link
  // (The fake checkout session belongs to Stripe customer cus_1, which the account tests above lent to acct@test.com.)
  await rest('customers?email=eq.acct@test.com', { method: 'PATCH', body: JSON.stringify({ stripe_customer_id: 'cus_acct_done' }) });
  const st = new Stripe('sk_test_123');
  const payload = JSON.stringify({ id: 'evt_acct1', object: 'event', type: 'checkout.session.completed', data: { object: { id: 'cs_new' } }, api_version: '2025-11-17.clover', created: 1 });
  const wh = await fetch(`${base}/api/stripe/webhook`, { method: 'POST', headers: { 'stripe-signature': st.webhooks.generateTestHeaderString({ payload, secret: 'whsec_test_secret' }) }, body: payload });
  await new Promise((r) => setTimeout(r, 500));
  const [fanOrder] = await rest('orders?email=eq.fan@example.com&select=order_number');
  const mail = readFileSync(`${dir}next.log`, 'utf8').match(new RegExp(`to=fan@example\\.com subject="Order #${fanOrder?.order_number} confirmed"\\n[^\\n]*?\\[(http[^\\]]+/api/account/session\\?token=[^\\]]+)\\]`));
  check('order email: View your order link', wh.ok && mail && decodeURIComponent(mail[1]).includes(`next=/account/orders/${fanOrder.order_number}`), mail?.[1]);
  const fresh = await cb.newContext();
  const fp = await fresh.newPage();
  await fp.goto(mail[1]);
  await fp.waitForSelector('text=Shipped to');
  check('order email: link signs in and opens the order', fp.url().endsWith(`/account/orders/${fanOrder.order_number}`));
  const evil = await fetch(`${base}/api/account/session?token=${new URL(mail[1]).searchParams.get('token')}&next=https://evil.example`, { redirect: 'manual' });
  check('sign-in link never sends people off-site', evil.headers.get('location') === `${base}/account`);
  await cb.close();
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
// "Now open" emails to the Notify me list (Admin overview → People waiting)
{
  await rest('subscribers', { method: 'POST', body: JSON.stringify([{ email: 'wait1@test.com', source: 'launch-waitlist', status: 'subscribed' }, { email: 'wait2@test.com', source: 'launch-waitlist', status: 'subscribed' }, { email: 'gone@test.com', source: 'launch-waitlist', status: 'unsubscribed' }]) });
  await rest('notify_requests', { method: 'POST', body: JSON.stringify([
    { email: 'wait1@test.com', kind: 'product', slug: 'lions-mane' }, { email: 'wait1@test.com', kind: 'product', slug: 'coq10' },
    { email: 'wait1@test.com', kind: 'kit', slug: 'vitamin-d-test' }, { email: 'gone@test.com', kind: 'product', slug: 'lions-mane' },
  ]) });
  await p.goto(`${base}/admin`);
  await p.waitForSelector('[data-testid=open-notices]');
  await p.click('[data-testid=open-notices] button');
  await p.waitForURL(/msg=/);
  const msg = decodeURIComponent(p.url());
  const log = readFileSync(`${dir}next.log`, 'utf8');
  check('now open: sent, with a count', /\d+ "now open" emails? sent/.test(msg), msg);
  check('now open: one email listing both products', log.includes('to=wait1@test.com subject="What you asked about is now available"') && (log.match(/to=wait1@test\.com subject=/g) ?? []).length === 1);
  check('now open: general launch email for people who picked nothing', log.includes('to=wait2@test.com subject="Noovit is open"'));
  check('now open: unsubscribed skipped', !log.includes('to=gone@test.com'));
  const w1 = await rest('notify_requests?email=eq.wait1@test.com&select=kind,slug,notified_at');
  check('now open: products marked, kit still waiting', w1.filter((r) => r.kind === 'product').every((r) => r.notified_at) && w1.find((r) => r.kind === 'kit')?.notified_at === null, w1);
  check('now open: launch list moved to newsletter', (await rest('subscribers?email=in.(wait1@test.com,wait2@test.com)&select=source')).every((r) => r.source === 'newsletter'));
  await p.goto(`${base}/admin`);
  await p.waitForLoadState('networkidle');
  check('now open: nobody emailed twice (panel gone)', (await p.locator('[data-testid=open-notices]').count()) === 0);
}
await b.close();
console.log(`\n${results.filter(Boolean).length}/${results.length} passed`);
