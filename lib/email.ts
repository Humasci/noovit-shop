import 'server-only';
import { formatPrice } from '@/lib/utils/format';

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

async function send(to: string, subject: string, html: string) {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM || 'Noovit <orders@noovit.com>';
  if (!key) {
    const text = html.replace(/<a [^>]*href="([^"]+)"[^>]*>/g, ' [$1] ').replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&');
    console.log(`[email not configured] to=${to} subject="${subject}"\n${text.replace(/\s+/g, ' ').trim()}`);
    return;
  }
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from, to, subject, html }),
  });
  if (!res.ok) console.error(`Email to ${to} failed: ${res.status} ${await res.text()}`);
}

const layout = (body: string) => `
<div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;color:#1f2937">
  <p style="font-size:22px;font-weight:800;color:#14213d">noovit.</p>
  ${body}
  <p style="margin-top:32px;font-size:12px;color:#6b7280">Questions? Just reply to this email.<br/>Noovit · Clean, science-driven supplements</p>
</div>`;

export interface EmailOrder {
  orderNumber: number;
  email: string;
  name?: string | null;
  totalCents: number;
  items: { name: string; bottles: number; quantity: number; frequencyDays?: number | null }[];
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
      ${trackingUrl ? `<p><a href="${esc(trackingUrl)}" style="color:#2563eb">Track your package</a></p>` : ''}`)
  );
}

export function sendPortalLink(to: string, url: string) {
  return send(
    to,
    'Manage your Noovit subscription',
    layout(`
      <h1 style="font-size:20px">Manage your subscription</h1>
      <p>Use the secure link below to pause, skip, change or cancel your subscription and update your payment details. The link expires shortly.</p>
      <p><a href="${esc(url)}" style="display:inline-block;background:#14213d;color:#fff;padding:12px 24px;border-radius:999px;text-decoration:none;font-weight:bold">Manage my subscription</a></p>
      <p style="font-size:12px;color:#6b7280">If you didn't request this, you can ignore this email.</p>`)
  );
}
