import 'server-only';
import { formatPrice } from '@/lib/utils/format';
import { SITE_URL } from '@/lib/site';

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

async function send(to: string, subject: string, html: string, headers?: Record<string, string>, replyTo?: string) {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM || 'Noovit <orders@noovit.com>';
  if (!key) {
    // Bodies hold sign-in links, so they are only printed outside production.
    const text = html.replace(/<a [^>]*href="([^"]+)"[^>]*>/g, ' [$1] ').replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&');
    const body = process.env.NODE_ENV === 'production' && !process.env.STRIPE_MOCK_PORT ? '' : `\n${text.replace(/\s+/g, ' ').trim()}`;
    console.log(`[email not configured] to=${to} subject="${subject}"${body}`);
    return process.env.NODE_ENV !== 'production' || Boolean(process.env.STRIPE_MOCK_PORT); // nothing was delivered in production
  }
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from, to, subject, html, ...(headers ? { headers } : {}), ...(replyTo ? { reply_to: replyTo } : {}) }),
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) console.error(`Email to ${to} failed: ${res.status} ${await res.text()}`);
  return res.ok;
}

const layout = (body: string) => `
<div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;color:#1f2937">
  <p style="font-size:24px;font-weight:600;color:#14213d">noovit<sup style="color:#ff5f00;font-size:14px">+</sup></p>
  ${body}
  <p style="margin-top:32px;font-size:12px;color:#6b7280">Questions? Just reply to this email.<br/>Noovit · Clean, science-driven supplements</p>
</div>`;

export interface EmailOrder {
  orderNumber: number;
  email: string;
  name?: string | null;
  totalCents: number;
  items: { name: string; bottles: number; quantity: number; frequencyDays?: number | null; unitCents?: number }[];
}

// Auto-renewal acknowledgment (ROSCA / California ARL): what renews, how often, for how much, and how to cancel.
function subscriptionTerms(items: EmailOrder['items']) {
  const subs = items.filter((i) => i.frequencyDays);
  if (!subs.length) return '';
  const lines = subs
    .map((i) => `<li>${esc(i.name)}: ${i.unitCents !== undefined ? `${formatPrice((i.unitCents * i.quantity) / 100)} ` : ''}every ${i.frequencyDays} days</li>`)
    .join('');
  return `<div style="margin:20px 0;padding:14px 16px;background:#f5f7f6;border-radius:12px;font-size:14px">
    <p style="margin:0 0 6px"><b>Your subscription</b></p>
    <ul style="margin:0 0 8px;padding-left:18px">${lines}</ul>
    <p style="margin:0">It renews automatically at these prices (plus any applicable tax) until you cancel. Your card is charged on each renewal date.
    You can change or cancel anytime before your next renewal at <a href="${SITE_URL}/account" style="color:#3a8069">${SITE_URL.replace(/^https?:\/\//, '')}/account</a>.</p>
  </div>`;
}

export function sendOrderConfirmation(order: EmailOrder) {
  const rows = order.items
    .map(
      (i) =>
        `<li>${esc(i.name)} — ${i.bottles} ${i.bottles === 1 ? 'bottle' : 'bottles'} × ${i.quantity}${
          i.frequencyDays ? ` (every ${i.frequencyDays} days)` : ''
        }</li>`
    )
    .join('');
  return send(
    order.email,
    `Order #${order.orderNumber} confirmed`,
    layout(`
      <h1 style="font-size:20px">Thanks${order.name ? `, ${esc(order.name.split(' ')[0])}` : ''}! Your order is confirmed.</h1>
      <p>Order <b>#${order.orderNumber}</b></p>
      <ul>${rows}</ul>
      <p><b>Total: ${formatPrice(order.totalCents / 100)}</b></p>
      ${subscriptionTerms(order.items)}
      <p>We'll email you tracking details as soon as it ships.</p>`)
  );
}

export function sendShippedEmail(to: string, orderNumber: number, carrier: string | null, trackingUrl: string | null, trackingNumber: string | null) {
  return send(
    to,
    `Order #${orderNumber} has shipped`,
    layout(`
      <h1 style="font-size:20px">Your order is on its way.</h1>
      <p>Order <b>#${orderNumber}</b>${carrier ? ` shipped with ${esc(carrier)}` : ' has shipped'}.</p>
      ${trackingNumber ? `<p>Tracking number: <b>${esc(trackingNumber)}</b></p>` : ''}
      ${trackingUrl ? `<p><a href="${esc(trackingUrl)}" style="color:#3a8069">Track your package</a></p>` : ''}`)
  );
}

export function sendPortalLink(to: string, url: string) {
  return send(
    to,
    'Manage your Noovit subscription',
    layout(`
      <h1 style="font-size:20px">Manage your subscription</h1>
      <p>Use the secure link below to change or cancel your subscription, update your card and address, and view invoices. The link expires shortly.</p>
      <p><a href="${esc(url)}" style="display:inline-block;background:#14213d;color:#fff;padding:12px 24px;border-radius:999px;text-decoration:none;font-weight:bold">Manage my subscription</a></p>
      <p style="font-size:12px;color:#6b7280">If you didn't request this, you can ignore this email.</p>`)
  );
}

export function sendPartnerWelcome(
  to: string,
  p: { name: string; code: string; discountPct: number; commissionPct: number; recurring: boolean; link: string; dashboard: string }
) {
  const btn = 'display:inline-block;background:#14213d;color:#fff;padding:12px 24px;border-radius:999px;text-decoration:none;font-weight:bold';
  return send(
    to,
    'Your Noovit partner code and link',
    layout(`
      <h1 style="font-size:20px">Welcome to the Noovit partner programme, ${esc(p.name.split(' ')[0])}</h1>
      ${p.discountPct > 0 ? `<p>Your code gives your audience <b>${p.discountPct}% off</b> their first order:</p>
      <p style="font-size:24px;font-weight:800;letter-spacing:2px;color:#14213d">${esc(p.code)}</p>` : ''}
      <p>Your personal link (it remembers your followers for 30 days and applies your code automatically):<br/>
      <a href="${esc(p.link)}" style="color:#3a8069">${esc(p.link)}</a></p>
      <p>You earn <b>${p.commissionPct}%</b> of each order you refer${p.recurring ? ', including every subscription renewal' : ''}, after discounts and refunds.</p>
      <p>Track clicks, orders and earnings any time on your private dashboard:</p>
      <p><a href="${esc(p.dashboard)}" style="${btn}">Open my dashboard</a></p>
      <p style="font-size:12px;color:#6b7280">Keep the dashboard link private. Please disclose the partnership in your posts (e.g. #ad), as the FTC requires.</p>`)
  );
}

// Marketing emails carry a postal address and one-click unsubscribe (CAN-SPAM; Gmail/Yahoo bulk-sender rules).
export interface MarketingFooter {
  unsubscribeUrl: string;
  oneClickUrl: string;
  address: string;
}

const marketingLayout = (body: string, f: MarketingFooter) =>
  layout(`${body}
  <p style="margin-top:32px;font-size:11px;color:#9ca3af">You're receiving this because you signed up at noovit.com.
  <a href="${esc(f.unsubscribeUrl)}" style="color:#9ca3af">Unsubscribe</a>${f.address ? `<br/>${esc(f.address)}` : ''}</p>`);

const unsubscribeHeaders = (f: MarketingFooter) => ({
  'List-Unsubscribe': `<${f.oneClickUrl}>`,
  'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
});

export function sendNewsletterWelcome(to: string, code: string, f: MarketingFooter) {
  return send(
    to,
    code ? `Welcome to Noovit — here's ${code}` : 'Welcome to Noovit',
    marketingLayout(
      `<h1 style="font-size:20px">Welcome to Noovit</h1>
      <p>Thanks for joining. Expect nutrition tips, early access to new formulas and member-only offers — never spam.</p>
      ${code ? `<p>As promised, here's your welcome code for your first order:</p><p style="font-size:24px;font-weight:800;letter-spacing:2px;color:#14213d">${esc(code)}</p><p>Enter it at checkout.</p>` : ''}
      <p><a href="${SITE_URL}/shop" style="display:inline-block;background:#14213d;color:#fff;padding:12px 24px;border-radius:999px;text-decoration:none;font-weight:bold">Shop Noovit</a></p>`,
      f
    ),
    unsubscribeHeaders(f)
  );
}

export function sendAbandonedCheckout(
  to: string,
  items: { name: string; quantity: number }[],
  totalCents: number,
  recoveryUrl: string,
  code: string,
  f: MarketingFooter
) {
  const rows = items.map((i) => `<li>${esc(i.name)} × ${i.quantity}</li>`).join('');
  return send(
    to,
    'You left something in your cart',
    marketingLayout(
      `<h1 style="font-size:20px">Still thinking it over?</h1>
      <p>Your cart is saved — pick up right where you left off.</p>
      <ul>${rows}</ul>
      <p><b>Total: ${formatPrice(totalCents / 100)}</b></p>
      ${code ? `<p>First order? Use <b>${esc(code)}</b> at checkout for your welcome discount.</p>` : ''}
      <p><a href="${esc(recoveryUrl)}" style="display:inline-block;background:#14213d;color:#fff;padding:12px 24px;border-radius:999px;text-decoration:none;font-weight:bold">Complete my order</a></p>
      <p style="font-size:12px;color:#6b7280">Free shipping and a 90-day money-back guarantee on every order.</p>`,
      f
    ),
    unsubscribeHeaders(f)
  );
}

export function sendPaymentLink(to: string, name: string, url: string, items: { name: string; quantity: number }[]) {
  const rows = items.map((i) => `<li>${esc(i.name)} × ${i.quantity}</li>`).join('');
  return send(
    to,
    'Your Noovit order is ready to complete',
    layout(`
      <h1 style="font-size:20px">Hi${name ? ` ${esc(name.split(' ')[0])}` : ''}, your order is ready</h1>
      <p>We've prepared this order for you:</p>
      <ul>${rows}</ul>
      <p><a href="${esc(url)}" style="display:inline-block;background:#14213d;color:#fff;padding:12px 24px;border-radius:999px;text-decoration:none;font-weight:bold">Review and pay securely</a></p>
      <p style="font-size:12px;color:#6b7280">This secure Stripe link expires in 24 hours.</p>`)
  );
}

export function sendReviewRequest(to: string, name: string | null, products: { name: string; url: string }[], f: MarketingFooter) {
  const rows = products
    .map(
      (p) =>
        `<li style="margin-bottom:8px">${esc(p.name)} — <a href="${esc(p.url)}" style="color:#3a8069;font-weight:bold">Write a review</a></li>`
    )
    .join('');
  return send(
    to,
    'How are you finding Noovit?',
    marketingLayout(
      `<h1 style="font-size:20px">Hi${name ? ` ${esc(name.split(' ')[0])}` : ''}, how's it going?</h1>
      <p>You've had your order for a little while now. We'd love to hear what you think — your review helps other people find what works for them.</p>
      <ul style="padding-left:18px">${rows}</ul>
      <p style="font-size:12px;color:#6b7280">Takes less than a minute. Honest reviews only — good or bad.</p>`,
      f
    ),
    unsubscribeHeaders(f)
  );
}

export function sendContactMessage(to: string, m: { name: string; email: string; topic: string; message: string }) {
  return send(
    to,
    `Contact form: ${m.topic} — ${m.name}`,
    layout(`<p><b>From:</b> ${esc(m.name)} &lt;${esc(m.email)}&gt;<br/><b>Topic:</b> ${esc(m.topic)}</p>
  <p style="white-space:pre-wrap">${esc(m.message)}</p>
  <p style="font-size:12px;color:#6b7280">Reply to this email to answer the customer directly.</p>`),
    undefined,
    m.email
  );
}
