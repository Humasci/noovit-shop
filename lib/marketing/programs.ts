import 'server-only';
import { db } from '@/lib/db/server';
import { sendProgramEmail } from '@/lib/email';
import { marketingFooter } from './subscribers';
import { nextProgramEmail, PROGRAM_EMAILS } from '@/lib/programs/perimenopause-emails';

// Free email programs (migration 0008). One program today: "perimenopause".
const BATCH = 200;

// Returns true when this is a new enrollment (send the welcome), false if already enrolled. Without the table
// (migration not run yet) it returns true, so the welcome still goes out, and logs a reminder.
export async function enroll(email: string, program: 'perimenopause') {
  const normalized = email.trim().toLowerCase();
  const { data, error } = await db().from('program_enrollments').upsert({ email: normalized, program }, { onConflict: 'email,program', ignoreDuplicates: true }).select('id');
  if (error) {
    console.error('Program enrollment not saved (run migration 0008?)', error.message);
    return true;
  }
  return (data?.length ?? 0) > 0;
}

// Daily: send each enrolled reader the next email that's due (at most one per person per day).
export async function sendProgramEmails() {
  const { data, error } = await db()
    .from('program_enrollments')
    .select('id, email, program, started_at, last_step')
    .is('completed_at', null)
    .order('started_at')
    .limit(BATCH);
  if (error) return { sent: 0, stopped: 0, error: error.message };

  let sent = 0;
  let stopped = 0;
  const last = PROGRAM_EMAILS[PROGRAM_EMAILS.length - 1].step;
  for (const e of data ?? []) {
    const { data: sub } = await db().from('subscribers').select('status').eq('email', e.email).maybeSingle();
    if (sub?.status === 'unsubscribed') {
      await db().from('program_enrollments').update({ completed_at: new Date().toISOString() }).eq('id', e.id);
      stopped++;
      continue;
    }
    const days = Math.floor((Date.now() - new Date(e.started_at).getTime()) / 86_400_000);
    const next = nextProgramEmail(e.last_step, days);
    if (!next) continue;
    // Record the step before sending, so a retried cron can't send the same email twice.
    const now = new Date().toISOString();
    const { error: upd } = await db()
      .from('program_enrollments')
      .update({ last_step: next.step, last_sent_at: now, completed_at: next.step === last ? now : null })
      .eq('id', e.id)
      .eq('last_step', e.last_step);
    if (upd) continue;
    try {
      await sendProgramEmail(e.email, next.subject, next.html, await marketingFooter(e.email));
      sent++;
    } catch (err) {
      console.error('Program email failed', err);
    }
  }
  return { sent, stopped };
}
