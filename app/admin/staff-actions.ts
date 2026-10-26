'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { endSession, requireAdmin } from '@/lib/admin/auth';
import { hashPassword, MIN_PASSWORD_LENGTH, verifyPassword } from '@/lib/admin/password';
import { Role, ROLE_LABELS } from '@/lib/admin/permissions';
import { db } from '@/lib/db/server';

const str = (f: FormData, k: string) => String(f.get(k) ?? '').trim();
const back = (path: string, msg: string): never => redirect(`${path}?msg=${encodeURIComponent(msg)}`);
const isRole = (r: string): r is Role => r in ROLE_LABELS;

async function activeOwners(excludeId?: string) {
  let q = db().from('staff').select('id', { count: 'exact', head: true }).eq('role', 'owner').eq('active', true);
  if (excludeId) q = q.neq('id', excludeId);
  return (await q).count ?? 0;
}

export async function createStaff(f: FormData) {
  const me = await requireAdmin('staff');
  const name = str(f, 'name').slice(0, 80);
  const email = str(f, 'email').toLowerCase().slice(0, 200);
  const role = str(f, 'role');
  const password = String(f.get('password') ?? '');

  if (!name) back('/admin/staff', 'Name is required.');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) back('/admin/staff', 'Enter a valid email.');
  if (!isRole(role)) back('/admin/staff', 'Choose a role.');
  if (password.length < MIN_PASSWORD_LENGTH) back('/admin/staff', `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`);
  if (me.bootstrap && role !== 'owner') back('/admin/staff', 'Create your own owner account first.');

  const { error } = await db().from('staff').insert({ name, email, role, password_hash: await hashPassword(password) });
  if (error) back('/admin/staff', error.code === '23505' ? 'Someone with that email already has an account.' : error.message);

  if (me.bootstrap) {
    // The setup login stops working now that a real account exists.
    await endSession();
    redirect('/admin/login?created=1');
  }
  revalidatePath('/admin/staff');
  back('/admin/staff', `${name} can now sign in.`);
}

export async function updateStaff(f: FormData) {
  const me = await requireAdmin('staff');
  const id = str(f, 'id');
  const role = str(f, 'role');
  const active = str(f, 'active') === 'true';
  if (!isRole(role)) back('/admin/staff', 'Invalid role.');

  const { data: target } = await db().from('staff').select('role, active').eq('id', id).maybeSingle();
  if (!target) back('/admin/staff', 'Account not found.');
  const losesOwner = target!.role === 'owner' && target!.active && (role !== 'owner' || !active);
  if (losesOwner && (await activeOwners(id)) === 0) back('/admin/staff', 'There must always be at least one active owner.');

  const { error } = await db().from('staff').update({ role, active }).eq('id', id);
  if (error) back('/admin/staff', error.message);
  if (id === me.id && (!active || role !== me.role)) {
    await endSession();
    redirect('/admin/login');
  }
  revalidatePath('/admin/staff');
  back('/admin/staff', 'Account updated.');
}

export async function resetStaffPassword(f: FormData) {
  await requireAdmin('staff');
  const password = String(f.get('password') ?? '');
  if (password.length < MIN_PASSWORD_LENGTH) back('/admin/staff', `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`);
  const { error } = await db().from('staff').update({ password_hash: await hashPassword(password) }).eq('id', str(f, 'id'));
  if (error) back('/admin/staff', error.message);
  back('/admin/staff', 'Password reset. Share it with them securely and ask them to change it.');
}

export async function changeOwnPassword(f: FormData) {
  const me = await requireAdmin();
  if (me.bootstrap) back('/admin/account', 'Create a staff account first.');
  const current = String(f.get('current') ?? '');
  const next = String(f.get('next') ?? '');
  const { data } = await db().from('staff').select('password_hash').eq('id', me.id).single();
  if (!(await verifyPassword(current, data!.password_hash))) back('/admin/account', 'Current password is incorrect.');
  if (next.length < MIN_PASSWORD_LENGTH) back('/admin/account', `New password must be at least ${MIN_PASSWORD_LENGTH} characters.`);
  if (next !== String(f.get('confirm') ?? '')) back('/admin/account', "New passwords don't match.");
  await db().from('staff').update({ password_hash: await hashPassword(next) }).eq('id', me.id);
  back('/admin/account', 'Password changed.');
}
