import { previewToken, siteLive } from '@/lib/launch';
import { SITE_URL } from '@/lib/site';

// Pre-launch reminder on the admin overview, with a shareable preview link (valid 30 days).
export function LaunchNotice() {
  if (siteLive()) return null;
  const link = `${SITE_URL}/preview?token=${previewToken()}`;
  return (
    <div className="mb-6 rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm">
      <p className="font-semibold">Pre-launch mode is on</p>
      <p className="mt-1 text-[var(--color-muted)]">
        Visitors see a &ldquo;Coming soon&rdquo; page with a waitlist, and search engines are told not to index the site. You see the full store while signed in
        here. To launch, set <code>SITE_LIVE=true</code> in Vercel and redeploy.
      </p>
      <p className="mt-3 font-semibold">Preview link to share (30 days)</p>
      <input readOnly value={link} aria-label="Preview link" className="mt-1 w-full rounded border border-[var(--color-line)] bg-white px-3 py-2 font-mono text-xs" />
    </div>
  );
}
