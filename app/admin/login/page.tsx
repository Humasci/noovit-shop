import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { checkPassword, startSession } from '@/lib/admin/auth';
import { adminConfigured } from '@/lib/admin/session';

export const metadata: Metadata = { title: 'Admin login — Noovit', robots: { index: false } };

async function login(formData: FormData) {
  'use server';
  if (!checkPassword(String(formData.get('password') ?? ''))) {
    await new Promise((r) => setTimeout(r, 800)); // slow down guessing
    redirect('/admin/login?error=1');
  }
  await startSession();
  redirect('/admin');
}

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-soft)] px-6">
      <form action={login} className="w-full max-w-sm rounded-3xl bg-white p-8 shadow-sm">
        <p className="text-2xl font-extrabold text-[var(--color-navy)]">
          noovit<span className="text-[var(--color-blue)]">.</span> <span className="text-sm font-semibold text-[var(--color-muted)]">admin</span>
        </p>
        {!adminConfigured() ? (
          <p className="mt-6 text-sm text-[var(--color-muted)]">
            Admin is not set up. Add <code>ADMIN_PASSWORD</code> and <code>APP_SECRET</code> to the environment variables.
          </p>
        ) : (
          <>
            <label className="mt-6 block text-sm font-semibold" htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoFocus
              autoComplete="current-password"
              className="mt-2 w-full rounded-xl border border-[var(--color-line)] px-4 py-3"
            />
            {error && <p className="mt-3 text-sm text-red-600">Incorrect password.</p>}
            <button className="btn btn-primary mt-6 w-full">Sign in</button>
          </>
        )}
      </form>
    </div>
  );
}
