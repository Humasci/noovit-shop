'use server';

import { redirect, unstable_rethrow } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/admin/auth';
import { sendOpenNotices } from '@/lib/marketing/launch';

const back = (msg: string): never => redirect(`/admin?msg=${encodeURIComponent(msg)}`);

// Admin overview → People waiting → "Send 'now open' emails".
export async function sendOpenNoticesAction() {
  await requireAdmin('marketing');
  let msg = '';
  try {
    const { sent, left } = await sendOpenNotices();
    msg = `${sent} "now open" ${sent === 1 ? 'email' : 'emails'} sent.${left ? ` ${left} still to go: press the button again.` : ' Everyone waiting has been told.'}`;
  } catch (e) {
    unstable_rethrow(e);
    msg = `Not sent: ${e instanceof Error ? e.message : 'unknown error'}`;
  }
  revalidatePath('/admin');
  back(msg);
}
