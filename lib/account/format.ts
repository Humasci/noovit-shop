import { formatPrice } from '@/lib/utils/format';

// Shared wording for the account pages.
export const day = (iso: string | null | undefined) =>
  iso ? new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' }).format(new Date(iso)) : '';
export const money = (cents: number) => formatPrice(cents / 100);
export const every = (days: number) => (days % 30 === 0 ? (days === 30 ? 'Every month' : `Every ${days / 30} months`) : `Every ${days} days`);

export type Tone = 'navy' | 'green' | 'amber' | 'muted';
export const ORDER_STATUS: Record<string, { label: string; tone: Tone; step: number }> = {
  paid: { label: 'Order received', tone: 'navy', step: 0 },
  fulfilling: { label: 'Being packed', tone: 'navy', step: 1 },
  shipped: { label: 'Shipped', tone: 'green', step: 2 },
  delivered: { label: 'Delivered', tone: 'green', step: 3 },
  cancelled: { label: 'Cancelled', tone: 'muted', step: -1 },
  refunded: { label: 'Refunded', tone: 'muted', step: -1 },
  partially_refunded: { label: 'Partly refunded', tone: 'muted', step: 3 },
};
export const orderStatus = (s: string) => ORDER_STATUS[s] ?? { label: s, tone: 'muted' as Tone, step: -1 };
export const ORDER_STEPS = ['Received', 'Packed', 'Shipped', 'Delivered'];

// Short confirmations and errors shown after an action (?ok=code / ?err=code): fixed texts, never text from the URL.
export const FLASH: Record<string, string> = {
  skipped: 'Done. Your next order is skipped; deliveries pick up again after that.',
  paused: 'Your subscription is paused. Nothing ships and nothing is charged until you resume.',
  resumed: 'Your subscription is active again.',
  cancelled: 'Your subscription is cancelled. You keep what you already paid for; nothing more will be charged.',
  reactivated: 'Welcome back. Your subscription continues as before.',
  name: 'Your name is saved.',
  address: 'Your shipping address is saved. Future subscription orders ship there.',
  subscribed: "You're on our email list.",
  unsubscribed: "You're off our email list. Order and shipping emails still reach you.",
  help: 'Message sent. We reply by email, usually within one business day.',
  delete: 'Request received. We will confirm by email once your data is deleted (within 30 days, usually much sooner).',
  stripe: "That didn't go through. Please try again, or email us and we'll do it for you.",
  invalid: 'Please check the form and try again.',
  address_invalid: 'Please enter a full US address: street, city, 2-letter state and ZIP code.',
  limit: 'Too many requests. Please try again later.',
  receipt: "We couldn't find a receipt for this order. Email us and we'll send one.",
  active_sub: 'Please cancel your subscription first, then send the delete request.',
};
