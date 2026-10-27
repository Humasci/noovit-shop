'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { X } from 'lucide-react';
import toast from 'react-hot-toast';
import { useStoreConfig } from '@/components/store/StoreConfig';
import { Brand } from '@/components/brand/Brand';
import { useCart } from '@/lib/store/cart';
import { useDialog } from '@/lib/useDialog';

const SEEN_KEY = 'noovit-popup-seen';
export const SUBSCRIBED_KEY = 'noovit-subscribed';
const QUIET_DAYS = 14;
const DELAY_MS = 20_000;
const SKIP = ['/cart', '/checkout', '/account', '/unsubscribe'];

// Shown at most once every 14 days: after 20 seconds, or when the mouse leaves the window (desktop exit intent).
export function NewsletterPopup() {
  const { popup } = useStoreConfig();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [busy, setBusy] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  const close = useCallback(() => setOpen(false), []);
  useDialog(box, open && Boolean(popup), close);

  useEffect(() => {
    if (!popup || SKIP.some((p) => pathname.startsWith(p))) return;
    if (localStorage.getItem(SUBSCRIBED_KEY)) return;
    const seen = Number(localStorage.getItem(SEEN_KEY) ?? 0);
    if (Date.now() - seen < QUIET_DAYS * 86_400_000) return;

    const show = () => {
      if (useCart.getState().isOpen) return; // never on top of the cart; exit intent can try again
      localStorage.setItem(SEEN_KEY, String(Date.now()));
      setOpen(true);
      cleanup();
    };
    const onLeave = (e: MouseEvent) => e.clientY <= 0 && show();
    const timer = setTimeout(show, DELAY_MS);
    document.addEventListener('mouseout', onLeave);
    const cleanup = () => {
      clearTimeout(timer);
      document.removeEventListener('mouseout', onLeave);
    };
    return cleanup;
  }, [popup, pathname]);

  if (!open || !popup) return null;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const res = await fetch('/api/newsletter', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }) });
    const data = await res.json().catch(() => ({}));
    setBusy(false);
    if (!res.ok) return void toast.error(data.error || 'Something went wrong.');
    localStorage.setItem(SUBSCRIBED_KEY, '1');
    toast.success(data.message);
    setOpen(false);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/40 p-4 sm:items-center" onClick={(e) => e.target === e.currentTarget && close()}>
      <div ref={box} role="dialog" aria-modal="true" aria-labelledby="popup-title" className="relative w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-2xl">
        <button onClick={close} className="absolute right-2 top-2 p-2.5" aria-label="Close">
          <X className="h-5 w-5" />
        </button>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-accent)]"><Brand /></p>
        <h2 id="popup-title" className="mt-2 text-2xl">{popup.headline}</h2>
        {popup.text && <p className="mt-2 text-sm text-[var(--color-muted)]">{popup.text}</p>}
        <form onSubmit={submit} className="mt-6 flex flex-col gap-3">
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Your email" aria-label="Email address" autoComplete="email" className="rounded-full border border-[var(--color-line)] px-5 py-3" />
          <button disabled={busy} className="btn btn-primary disabled:opacity-50">{busy ? 'Joining…' : 'Sign me up'}</button>
        </form>
        <button onClick={close} className="mt-4 p-1 text-xs text-[var(--color-muted)] underline">No thanks</button>
      </div>
    </div>
  );
}
