import { requireAdmin } from '@/lib/admin/auth';
import { ROLE_LABELS } from '@/lib/admin/permissions';
import { MIN_PASSWORD_LENGTH } from '@/lib/admin/password';
import { changeOwnPassword } from '@/app/admin/staff-actions';
import { Card, Flash, PageTitle, btnSm, inputCls } from '@/components/admin/ui';

export default async function AccountPage({ searchParams }: { searchParams: Promise<{ msg?: string }> }) {
  const me = await requireAdmin();
  const { msg } = await searchParams;
  return (
    <>
      <PageTitle title="My account" />
      <Flash msg={msg} />
      <Card className="max-w-lg">
        <p className="font-semibold">{me.name}</p>
        <p className="text-sm text-[var(--color-muted)]">{me.email} · {ROLE_LABELS[me.role].label}</p>
        {!me.bootstrap && (
          <form action={changeOwnPassword} className="mt-6 grid gap-3">
            <h2 className="text-lg">Change password</h2>
            <input name="current" type="password" required placeholder="Current password" autoComplete="current-password" className={inputCls} />
            <input name="next" type="password" required minLength={MIN_PASSWORD_LENGTH} placeholder={`New password (${MIN_PASSWORD_LENGTH}+ characters)`} autoComplete="new-password" className={inputCls} />
            <input name="confirm" type="password" required placeholder="Repeat new password" autoComplete="new-password" className={inputCls} />
            <button className={`${btnSm} justify-self-start`}>Change password</button>
          </form>
        )}
      </Card>
    </>
  );
}
