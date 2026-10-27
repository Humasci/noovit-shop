'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';

const TOPICS = ['Product question', 'Order status', 'Shipping & delivery', 'Subscription', 'Returns & refunds', 'Wholesale', 'Other'];
const input = 'w-full rounded-xl border border-[var(--color-line)] bg-white px-4 py-3';

export function ContactForm({ email }: { email: string }) {
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    setSending(true);
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(Object.fromEntries(new FormData(form))),
    }).catch(() => null);
    const data = await res?.json().catch(() => ({}));
    setSending(false);
    if (!res?.ok) return toast.error(data?.error || `Sorry, something went wrong. Please email ${email}.`);
    form.reset();
    setSent(true);
  };

  if (sent) {
    return (
      <div role="status" className="rounded-2xl bg-[var(--color-soft)] p-6">
        <p className="font-semibold">Thanks, your message is on its way.</p>
        <p className="mt-1 text-sm text-[var(--color-muted)]">We&apos;ll reply to your email within one business day.</p>
        <button onClick={() => setSent(false)} className="mt-4 text-sm font-bold text-[var(--color-accent)]">Send another message</button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      <div className="grid gap-5 md:grid-cols-2">
        <label className="block text-sm font-semibold">
          Your name
          <input name="name" required maxLength={80} autoComplete="name" className={`${input} mt-2 font-normal`} />
        </label>
        <label className="block text-sm font-semibold">
          Email
          <input name="email" type="email" required autoComplete="email" className={`${input} mt-2 font-normal`} />
        </label>
      </div>
      <label className="block text-sm font-semibold">
        Topic
        <select name="topic" required defaultValue="" className={`${input} mt-2 font-normal`}>
          <option value="" disabled>Choose a topic</option>
          {TOPICS.map((t) => <option key={t}>{t}</option>)}
        </select>
      </label>
      <label className="block text-sm font-semibold">
        Message
        <textarea name="message" required maxLength={5000} rows={6} placeholder="Include your order number if it's about an order." className={`${input} mt-2 resize-y font-normal`} />
      </label>
      <input name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
      <button disabled={sending} className="btn btn-primary disabled:opacity-50">{sending ? 'Sending…' : 'Send message'}</button>
    </form>
  );
}
