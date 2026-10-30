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


// ===== Affiliates =====
await p.goto(`${base}/admin/products`);
await p.click('button:has-text("Import launch catalog")');
await toastFor(p, /Imported/);
const cronSecret = readFileSync(`${dir}test.env`, 'utf8').match(/CRON_SECRET=(.*)/)[1].trim();

await p.goto(`${base}/admin/affiliates`);
check('affiliates page in nav', await p.locator('nav a[href="/admin/affiliates"]').isVisible());
const addPartner = async (name, email, code, disc, comm, recurring) => {
  await p.goto(`${base}/admin/affiliates`);
  await p.$$eval('form', (fs) => fs.forEach((x) => (x.noValidate = true))); // exercise server-side validation
  await p.fill('input[name=name]', name);
  await p.fill('input[name=email]', email);
  await p.fill('input[name=code]', code);
  await p.fill('input[name=customer_discount_pct]', String(disc));
  await p.fill('input[name=commission_pct]', String(comm));
  if (recurring) await p.check('input[name=recurring]');
  await submit('button:has-text("Add partner")');
  return await flash();
};
check('partner created', /added/.test(await addPartner('Sarah Jones', 'Sarah@Example.com', 'sarah10', 10, 15, true)));
const sarah = (await rest('affiliates?code=eq.SARAH10&select=*'))[0];
check('code uppercased, email lowercased, Stripe promo stored', sarah && sarah.email === 'sarah@example.com' && sarah.stripe_promotion_code_id?.startsWith('promo_') && sarah.stripe_coupon_id, sarah);
check('Stripe coupon is 10% once with code SARAH10', /POST \/v1\/coupons .*percent_off=10.*duration=once/.test(fakeLog()) || /POST \/v1\/coupons .*duration=once.*percent_off=10/.test(fakeLog()));
check('detail page shows share link', await p.locator('input[value="http://localhost:3100/r/SARAH10"]').count() === 1);
check('duplicate code rejected', /already taken/.test(await addPartner('Copy Cat', 'copy@example.com', 'SARAH10', 10, 10, false)));
check('invalid email rejected', /valid email/.test(await addPartner('Bad', 'not-an-email', 'BADMAIL', 10, 10, false)));
check('link-only partner (0%) has no Stripe code', /added/.test(await addPartner('Tom Link', 'tom@example.com', 'TOMLINK', 0, 20, false)) && !(await rest('affiliates?code=eq.TOMLINK&select=stripe_promotion_code_id'))[0].stripe_promotion_code_id);

// Share link
const r1 = await fetch(`${base}/r/sarah10?to=/products/magnesium-complex`, { redirect: 'manual' });
check('share link redirects to product and sets 30-day cookie', r1.status === 307 && r1.headers.get('location') === `${base}/products/magnesium-complex` && /noovit_ref=SARAH10.*Max-Age=2592000.*HttpOnly/i.test(r1.headers.get('set-cookie') ?? ''), [r1.status, r1.headers.get('location'), r1.headers.get('set-cookie')]);
const r2 = await fetch(`${base}/r/SARAH10?to=//evil.com/x`, { redirect: 'manual' });
const r3 = await fetch(`${base}/r/SARAH10?to=/%09/evil.com`, { redirect: 'manual' });
check('share link never redirects off-site', r2.headers.get('location') === `${base}/` && new URL(r3.headers.get('location')).origin === base, [r2.headers.get('location'), r3.headers.get('location')]);
const r4 = await fetch(`${base}/r/NOSUCH`, { redirect: 'manual' });
check('unknown code: redirect home, no cookie', r4.status === 307 && !r4.headers.get('set-cookie'));
check('clicks counted', (await rest('affiliates?code=eq.SARAH10&select=clicks'))[0].clicks === 3);

// Checkout via link pre-applies the partner code
const co = await fetch(`${base}/api/checkout`, { method: 'POST', headers: { 'Content-Type': 'application/json', Cookie: 'noovit_ref=SARAH10' }, body: JSON.stringify({ items: [{ slug: 'magnesium-complex', mode: 'one-time', bottles: 1, quantity: 2 }] }) });
const lastCreate = fakeLog().split('\n').filter((l) => l.startsWith('POST /v1/checkout/sessions ')).pop() ?? '';
check('checkout pre-applies partner promo code and tags affiliate', co.status === 200 && lastCreate.includes(`discounts[0][promotion_code]=${sarah.stripe_promotion_code_id}`) && lastCreate.includes(`metadata[affiliate_id]=${sarah.id}`) && !lastCreate.includes('allow_promotion_codes=true'), lastCreate);
check('order webhook (link)', (await webhook('checkout.session.completed', { id: 'cs_new' })) === 200);
let order = (await rest('orders?stripe_checkout_session_id=eq.cs_new&select=id,order_number,affiliate_id,subtotal_cents,discount_cents'))[0];
let com = (await rest(`commissions?order_id=eq.${order?.id}&select=*`))[0];
check('order credited to partner', order?.affiliate_id === sarah.id, order);
check('commission: link, 15% of $63 = $9.45, pending', com && com.source === 'link' && com.base_cents === 6300 && com.amount_cents === 945 && com.status === 'pending', com);
check('duplicate webhook does not double-count', (await webhook('checkout.session.completed', { id: 'cs_new' })) === 200 && (await rest(`commissions?affiliate_id=eq.${sarah.id}&select=id`)).length === 1);

// No cookie = no affiliate
await fetch(`${base}/api/checkout`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ items: [{ slug: 'magnesium-complex', mode: 'one-time', bottles: 1, quantity: 1 }] }) });
const plain = fakeLog().split('\n').filter((l) => l.startsWith('POST /v1/checkout/sessions ')).pop() ?? '';
check('normal checkout: codes allowed, no affiliate', plain.includes('allow_promotion_codes=true') && !plain.includes('affiliate_id'), plain);

// Code typed at checkout, and self-referral
check('order webhook (code)', (await webhook('checkout.session.completed', { id: 'cs_code' })) === 200);
const codeOrder = (await rest('orders?stripe_checkout_session_id=eq.cs_code&select=id,affiliate_id'))[0];
const codeCom = (await rest(`commissions?order_id=eq.${codeOrder?.id}&select=*`))[0];
check('typed code credits partner: $31.50 base, $4.73', codeOrder?.affiliate_id === sarah.id && codeCom?.source === 'code' && codeCom.base_cents === 3150 && codeCom.amount_cents === 473, [codeOrder, codeCom]);
await webhook('checkout.session.completed', { id: 'cs_self' });
const selfOrder = (await rest('orders?stripe_checkout_session_id=eq.cs_self&select=id'))[0];
const selfCom = (await rest(`commissions?order_id=eq.${selfOrder?.id}&select=*`))[0];
check('partner using own code earns nothing', selfCom?.status === 'void' && selfCom.amount_cents === 0 && /own code/.test(selfCom.void_reason), selfCom);

// Refunds
await webhook('charge.refunded', { id: 'ch_1', object: 'charge', payment_intent: 'pi_new', amount: 6300, amount_refunded: 3000 });
com = (await rest(`commissions?order_id=eq.${order.id}&select=*`))[0];
check('partial refund shrinks commission ($33 base → $4.95)', com.base_cents === 3300 && com.amount_cents === 495 && com.status === 'pending', com);
await webhook('charge.refunded', { id: 'ch_2', object: 'charge', payment_intent: 'pi_code', amount: 3150, amount_refunded: 3150 });
const codeCom2 = (await rest(`commissions?order_id=eq.${codeOrder.id}&select=*`))[0];
check('full refund voids commission', codeCom2.status === 'void' && codeCom2.amount_cents === 0, codeCom2);

// Subscription via link + renewal (recurring partner)
await fetch(`${base}/api/checkout`, { method: 'POST', headers: { 'Content-Type': 'application/json', Cookie: 'noovit_ref=SARAH10' }, body: JSON.stringify({ items: [{ slug: 'probiotic-complex', mode: 'subscribe', bottles: 2, frequency: 60, quantity: 1 }], ageConfirmed: true, autoRenewConsent: true }) });
const subCreate = fakeLog().split('\n').filter((l) => l.startsWith('POST /v1/checkout/sessions ')).pop() ?? '';
check('subscription checkout carries affiliate on the subscription', subCreate.includes(`subscription_data[metadata][affiliate_id]=${sarah.id}`), subCreate);
await rest(`orders?stripe_checkout_session_id=eq.cs_new`, { method: 'PATCH', body: JSON.stringify({ stripe_checkout_session_id: 'cs_new_first' }) }); // the fake reuses cs_new
await webhook('checkout.session.completed', { id: 'cs_new' });
const subRow = (await rest('subscriptions?stripe_subscription_id=eq.sub_1&select=id,affiliate_id'))[0];
check('subscription linked to partner', subRow?.affiliate_id === sarah.id, subRow);
check('renewal webhook', (await webhook('invoice.paid', { id: 'in_2', object: 'invoice', billing_reason: 'subscription_cycle', customer: 'cus_1', customer_email: 'jane@example.com', currency: 'usd', subtotal: 6500, amount_paid: 6500, total_discount_amounts: [], total_taxes: [], parent: { subscription_details: { subscription: 'sub_1' } } })) === 200);
const ren = (await rest('orders?stripe_invoice_id=eq.in_2&select=id,affiliate_id'))[0];
const renCom = (await rest(`commissions?order_id=eq.${ren?.id}&select=*`))[0];
check('renewal earns recurring commission (15% of $65 = $9.75)', ren?.affiliate_id === sarah.id && renCom?.source === 'renewal' && renCom.amount_cents === 975, [ren, renCom]);

// Approval via cron, payout
const beforeCron = await (await fetch(`${base}/api/cron/daily`, { headers: { Authorization: `Bearer ${cronSecret}` } })).json();
check('cron leaves fresh commissions pending (30-day hold)', beforeCron.commissionsApproved === 0, beforeCron);
await rest(`commissions?affiliate_id=eq.${sarah.id}&status=eq.pending`, { method: 'PATCH', body: JSON.stringify({ created_at: new Date(Date.now() - 31 * 86400000).toISOString() }) });
const afterCron = await (await fetch(`${base}/api/cron/daily`, { headers: { Authorization: `Bearer ${cronSecret}` } })).json();
check('cron approves commissions past the hold', afterCron.commissionsApproved >= 2, afterCron);

await p.goto(`${base}/admin/affiliates/${sarah.id}`);
const owedText = await p.locator('text=Owed now:').first().textContent();
check('detail page shows owed $23.48', /\$23\.48/.test(owedText ?? ''), owedText);
await p.fill('input[name=method]', 'PayPal');
await p.fill('input[name=reference]', 'TXN-1');
await submit('button:has-text("Record payout")');
check('payout recorded', /Payout of \$23\.48 recorded/.test(await flash()), await flash());
const paid = await rest(`commissions?affiliate_id=eq.${sarah.id}&status=eq.paid&select=id`);
const payouts = await rest(`affiliate_payouts?affiliate_id=eq.${sarah.id}&select=*`);
check('commissions marked paid, payout row saved', paid.length === 3 && payouts[0]?.amount_cents === 2348 && payouts[0].paid_by === 'Ilaria Owner', [paid, payouts]);
await webhook('charge.refunded', { id: 'ch_3', object: 'charge', payment_intent: 'pi_new', amount: 6300, amount_refunded: 6300 });
check('refund after payout leaves paid commission alone', (await rest(`commissions?order_id=eq.${order.id}&select=status`))[0].status === 'paid');

// Order page, list page, export, dashboard
await p.goto(`${base}/admin/orders/${order.order_number}`);
check('order page shows referral', await p.locator('text=Referred by').isVisible() && await p.locator('a:has-text("Sarah Jones (SARAH10)")').isVisible());
await p.goto(`${base}/admin/affiliates`);
check('list shows partner stats', await p.locator('tr:has-text("SARAH10")').isVisible() && /\$23\.48/.test(await p.locator('tr:has-text("SARAH10")').textContent()));
const csv = await p.evaluate(async () => (await fetch('/admin/affiliates/export')).text());
check('CSV export', csv.startsWith('"name","email","code"') && csv.includes('"SARAH10"') && csv.includes('"23.48"'), csv.slice(0, 300));
check('export requires login', [401, 307].includes((await fetch(`${base}/admin/affiliates/export`, { redirect: 'manual' })).status));
const portal = (await text(`/partner/${sarah.portal_token}`)).replace(/<!-- -->/g, "");
check('partner dashboard shows their stats, no customer emails', portal.includes('Hi Sarah') && portal.includes('SARAH10') && portal.includes('$23.48') && !portal.includes('fan@example.com') && !portal.includes('jane@example.com'));
check('bad dashboard token is 404', (await status('/partner/' + 'a'.repeat(64))) === 404 && (await status('/partner/xyz')) === 404);
await p.goto(`${base}/admin/affiliates/${sarah.id}`);
await submit('button:has-text("New dashboard link")');
check('regenerated dashboard link invalidates old one', (await status(`/partner/${sarah.portal_token}`)) === 404);
await submit('button:has-text("Email them their code")');
check('welcome email sent', /Welcome email sent/.test(await flash()) && /Your Noovit partner code and link/.test(nextLog()));

// Change discount, pause
await p.goto(`${base}/admin/affiliates/${sarah.id}`);
await p.fill('input[name=customer_discount_pct]', '15');
await submit('button:has-text("Save")');
const sarah2 = (await rest('affiliates?code=eq.SARAH10&select=*'))[0];
check('discount change creates new Stripe code, deactivates old', sarah2.customer_discount_pct === 15 && sarah2.stripe_promotion_code_id !== sarah.stripe_promotion_code_id && fakeLog().includes(`POST /v1/promotion_codes/${sarah.stripe_promotion_code_id} active=false`), [sarah2.stripe_promotion_code_id, sarah.stripe_promotion_code_id]);
await p.selectOption('select[name=status]', 'paused');
await submit('button:has-text("Save")');
check('pause deactivates code', /paused/.test(await flash()) && fakeLog().includes(`POST /v1/promotion_codes/${sarah2.stripe_promotion_code_id} active=false`));
const r5 = await fetch(`${base}/r/SARAH10`, { redirect: 'manual' });
check('paused partner link sets no cookie', !r5.headers.get('set-cookie'));
await fetch(`${base}/api/checkout`, { method: 'POST', headers: { 'Content-Type': 'application/json', Cookie: 'noovit_ref=SARAH10' }, body: JSON.stringify({ items: [{ slug: 'magnesium-complex', mode: 'one-time', bottles: 1, quantity: 1 }] }) });
const pausedCo = fakeLog().split('\n').filter((l) => l.startsWith('POST /v1/checkout/sessions ')).pop() ?? '';
check('paused partner cookie ignored at checkout', !pausedCo.includes('affiliate_id') && pausedCo.includes('allow_promotion_codes=true'));

// Permissions
const f = await ctx.browser().newContext().then((c) => c.newPage());
await login(f, 'pack@noovit.com', 'packer-password-123');
await f.goto(`${base}/admin/affiliates`);
await f.waitForURL((u) => !u.toString().includes('/admin/affiliates'), { timeout: 10000 }).catch(() => {});
check('fulfilment role cannot open affiliates', !f.url().includes('/admin/affiliates') && !(await f.locator('nav a[href="/admin/affiliates"]').count()));
check('robots hides partner and share links', /Disallow: \/partner\//.test(await text('/robots.txt')) && /Disallow: \/r\//.test(await text('/robots.txt')));
check('no browser errors', pageErrors.length === 0, pageErrors);

console.log(`\n${results.filter(Boolean).length}/${results.length} passed`);
await b.close();
