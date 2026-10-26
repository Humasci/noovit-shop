import { db } from '@/lib/db/server';
import { dbConfigured } from '@/lib/config';
import { requireAdmin } from '@/lib/admin/auth';
import { ROLE_LABELS, Role } from '@/lib/admin/permissions';
import { MIN_PASSWORD_LENGTH } from '@/lib/admin/password';
import { createStaff, resetStaffPassword, updateStaff } from '@/app/admin/staff-actions';
import { Badge, Card, Flash, NotConfigured, PageTitle, Table, btnSm, btnSmOutline, dateTime, inputCls, td } from '@/components/admin/ui';

const ROLES = Object.keys(ROLE_LABELS) as Role[];

export default async function StaffPage({ searchParams }: { searchParams: Promise<{ msg?: string }> }) {
  const me = await requireAdmin('staff');
  const { msg } = await searchParams;
  if (!dbConfigured()) return (<><PageTitle title="Staff" /><NotConfigured what="The database" /></>);

  const { data: staff } = await db().from('staff').select('id, name, email, role, active, last_login_at, created_at').order('created_at');

  return (
    <>
      <PageTitle title="Staff" />
      <Flash msg={msg} />
      {me.bootstrap && (
        <p className="mb-6 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Welcome! Create your own <b>Owner</b> account below. After that, the setup password stops working and everyone signs in with their own email and password.
        </p>
      )}

      <Card className="mb-6">
        <h2 className="mb-1 text-lg">Add a staff member</h2>
        <p className="mb-4 text-xs text-[var(--color-muted)]">
          {ROLES.map((r) => (
            <span key={r} className="mr-4 inline-block">
              <b>{ROLE_LABELS[r].label}:</b> {ROLE_LABELS[r].description}
            </span>
          ))}
        </p>
        <form action={createStaff} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <input name="name" required placeholder="Name" className={inputCls} />
          <input name="email" type="email" required placeholder="Email" className={inputCls} />
          <select name="role" defaultValue={me.bootstrap ? 'owner' : 'fulfilment'} className={inputCls}>
            {ROLES.map((r) => (
              <option key={r} value={r}>{ROLE_LABELS[r].label}</option>
            ))}
          </select>
          <input name="password" type="password" required minLength={MIN_PASSWORD_LENGTH} placeholder={`Temporary password (${MIN_PASSWORD_LENGTH}+ chars)`} autoComplete="new-password" className={inputCls} />
          <button className={btnSm}>Create account</button>
        </form>
      </Card>

      <Table head={['Name', 'Role', 'Status', 'Last sign-in', 'Change role / access', 'Reset password']} empty={!staff?.length}>
        {staff?.map((s) => (
          <tr key={s.id}>
            <td className={td}>
              <div className="font-semibold">{s.name}{s.id === me.id ? ' (you)' : ''}</div>
              <div className="text-xs text-[var(--color-muted)]">{s.email}</div>
            </td>
            <td className={td}>{ROLE_LABELS[s.role as Role].label}</td>
            <td className={td}><Badge status={s.active ? 'active' : 'cancelled'} /></td>
            <td className={td}>{dateTime(s.last_login_at)}</td>
            <td className={td}>
              <form action={updateStaff} className="flex gap-2">
                <input type="hidden" name="id" value={s.id} />
                <select name="role" defaultValue={s.role} className={inputCls} aria-label="Role">
                  {ROLES.map((r) => (
                    <option key={r} value={r}>{ROLE_LABELS[r].label}</option>
                  ))}
                </select>
                <select name="active" defaultValue={String(s.active)} className={inputCls} aria-label="Access">
                  <option value="true">Active</option>
                  <option value="false">Deactivated</option>
                </select>
                <button className={btnSmOutline}>Update</button>
              </form>
            </td>
            <td className={td}>
              <form action={resetStaffPassword} className="flex gap-2">
                <input type="hidden" name="id" value={s.id} />
                <input name="password" type="password" required minLength={MIN_PASSWORD_LENGTH} placeholder="New password" autoComplete="new-password" className={inputCls} />
                <button className={btnSmOutline}>Reset</button>
              </form>
            </td>
          </tr>
        ))}
      </Table>
    </>
  );
}
