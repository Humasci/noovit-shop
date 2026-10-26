import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { authenticate, staffCount, startSession } from '@/lib/admin/auth';
import { adminConfigured } from '@/lib/admin/session';

export const metadata: Metadata = { title: 'Admin login — Noovit', robots: { index: false } };

async function login(formData: FormData) {
  'use server';
  const staff = await authenticate(String(formData.get('email') ?? ''), String(formData.get('password') ?? ''));
  if (!staff) {
    await new Promise((r) => setTimeout(r, 800)); // slow down guessing
    redirect('/admin/login?error=1');
  }
  await startSession(staff);
  redirect(staff.bootstrap ? '/admin/staff' : '/admin');
}

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string; created?: string }> }) {
  const { error, created } = await searchParams;
  const setup = adminConfigured() && (await staffCount()) === 0;
  const input = 'mt-2 w-full rounded-xl border border-[var(--color-line)] px-4 py-3';

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-soft)] px-6">
      <form action={login} className="w-full max-w-sm rounded-3xl bg-white p-8 shadow-sm">
        <p className="text-2xl font-extrabold text-[var(--color-navy)]">
          noovit<span className="text-[var(--color-blue)]">.</span> <span className="text-sm font-semibold text-[var(--color-muted)]">admin</span>
        </p>
        {!adminConfigured() ? (
          <p className="mt-6 text-sm text-[var(--color-muted)]">
            Admin is not set up. Add <code>APP_SECRET</code> and <code>ADMIN_PASSWORD</code> to the environment variables.
          </p>
        ) : (
          <>
            {setup ? (
              <p className="mt-4 rounded-xl bg-[var(--color-soft)] p-3 text-xs text-[var(--color-muted)]">
                <b>First-time setup:</b> sign in with the setup password (<code>ADMIN_PASSWORD</code>), then create your owner account. The setup password stops working once a staff account exists.
              </p>
            ) : (
              <>
                <label className="mt-6 block text-sm font-semibold" htmlFor="email">Email</label>
                <input id="email" name="email" type="email" required autoFocus autoComplete="username" className={input} />
              </>
            )}
            <label className="mt-4 block text-sm font-semibold" htmlFor="password">{setup ? 'Setup password' : 'Password'}</label>
            <input id="password" name="password" type="password" required autoFocus={setup} autoComplete="current-password" className={input} />
            {created && <p className="mt-3 text-sm text-[var(--color-green)]">Owner account created — sign in with your email and password.</p>}
            {error && <p className="mt-3 text-sm text-red-600">Incorrect {setup ? 'password' : 'email or password'}.</p>}
            <button className="btn btn-primary mt-6 w-full">Sign in</button>
          </>
        )}
      </form>
    </div>
  );
}
