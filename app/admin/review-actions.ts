'use server';

import { redirect } from 'next/navigation';
import { requireAdmin } from '@/lib/admin/auth';
import { loadCatalog } from '@/lib/catalog/server';
import { reviewInviteUrl } from '@/lib/reviews-invite';
import { sendReviewerInvite } from '@/lib/email';

const back = (msg: string): never => redirect(`/admin/reviews?msg=${encodeURIComponent(msg)}`);

// Reviewer programme: email someone a personal link to review the products we sent them free.
export async function inviteReviewer(f: FormData) {
  await requireAdmin('reviews');
  const name = String(f.get('name') ?? '').trim().slice(0, 60);
  const email = String(f.get('email') ?? '').trim().toLowerCase().slice(0, 200);
  const picked = f.getAll('products').map(String);
  if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) back('Enter a name and a valid email.');
  const products = (await loadCatalog()).filter((p) => picked.includes(p.slug) && p.status === 'active');
  if (!products.length) back('Pick at least one product.');
  const firstName = name.split(' ')[0];
  const url = reviewInviteUrl({ e: email, n: firstName, s: products.map((p) => p.slug) });
  const sent = await sendReviewerInvite(email, firstName, products.map((p) => p.name), url).catch(() => false);
  back(sent ? `Invite emailed to ${email}. Their personal link: ${url}` : `Email not sent. Send them this link yourself: ${url}`);
}
