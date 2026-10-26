import 'server-only';
import { createHash, timingSafeEqual } from 'crypto';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { signToken } from '@/lib/sign';
import { db } from '@/lib/db/server';
import { dbConfigured } from '@/lib/config';
import { ADMIN_COOKIE, readSession } from './session';
import { can, Permission, Role } from './permissions';
import { verifyPassword } from './password';

const SESSION_TTL = 7 * 24 * 60 * 60;

export interface Staff {
  id: string;
  name: string;
  email: string;
  role: Role;
  bootstrap: boolean;
}

function matchesAdminPassword(given: string) {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  const a = createHash('sha256').update(given).digest();
  const b = createHash('sha256').update(expected).digest();
  return timingSafeEqual(a, b);
}

export async function staffCount() {
  if (!dbConfigured()) return 0;
  const { count } = await db().from('staff').select('id', { count: 'exact', head: true });
  return count ?? 0;
}

// ADMIN_PASSWORD only works until the first staff account exists; after that everyone signs in with their own email.
export async function authenticate(email: string, password: string): Promise<Staff | null> {
  if ((await staffCount()) === 0) {
    return matchesAdminPassword(password) ? { id: 'bootstrap', name: 'Setup', email: '', role: 'owner', bootstrap: true } : null;
  }
  const { data } = await db().from('staff').select('*').eq('email', email.trim().toLowerCase()).eq('active', true).maybeSingle();
  if (!data || !(await verifyPassword(password, data.password_hash))) return null;
  await db().from('staff').update({ last_login_at: new Date().toISOString() }).eq('id', data.id);
  return { id: data.id, name: data.name, email: data.email, role: data.role, bootstrap: false };
}

export async function startSession(staff: Staff) {
  (await cookies()).set(ADMIN_COOKIE, signToken({ sid: staff.id, role: staff.role }, SESSION_TTL), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_TTL,
  });
}

export async function endSession() {
  (await cookies()).delete(ADMIN_COOKIE);
}

export async function currentStaff(): Promise<Staff | null> {
  const session = readSession((await cookies()).get(ADMIN_COOKIE)?.value);
  if (!session) return null;
  if (session.sid === 'bootstrap') {
    return (await staffCount()) === 0 ? { id: 'bootstrap', name: 'Setup', email: '', role: 'owner', bootstrap: true } : null;
  }
  if (!dbConfigured()) return null;
  const { data } = await db().from('staff').select('id, name, email, role, active').eq('id', session.sid).maybeSingle();
  return data?.active ? { id: data.id, name: data.name, email: data.email, role: data.role, bootstrap: false } : null;
}

// Every admin page and server action calls this; the proxy is only a first line of defence.
export async function requireAdmin(permission?: Permission): Promise<Staff> {
  const staff = await currentStaff();
  if (!staff) redirect('/admin/login');
  if (permission && !can(staff.role, permission)) redirect('/admin?msg=' + encodeURIComponent("Your role doesn't have access to that."));
  return staff;
}
