import { NextResponse } from 'next/server';
import { csvRow } from '@/lib/csv';
import { currentStaff } from '@/lib/admin/auth';
import { can } from '@/lib/admin/permissions';
import { dbConfigured } from '@/lib/config';
import { db } from '@/lib/db/server';
import { shareLink, statsByAffiliate, type Affiliate } from '@/lib/affiliates';

export async function GET() {
  const staff = await currentStaff();
  if (!staff || !can(staff.role, 'marketing')) return new NextResponse('Unauthorized', { status: 401 });
  if (!dbConfigured()) return new NextResponse('Database not configured', { status: 503 });

  const [{ data }, stats] = await Promise.all([db().from('affiliates').select('*').order('name'), statsByAffiliate()]);
  const lines = [csvRow(['name', 'email', 'code', 'platform', 'status', 'customer_discount_pct', 'commission_pct', 'recurring', 'clicks', 'orders', 'sales', 'pending', 'owed', 'paid', 'payout_details', 'share_link'])];
  for (const a of (data ?? []) as Affiliate[]) {
    const s = stats.get(a.id);
    const usd = (c: number) => (c / 100).toFixed(2);
    lines.push(csvRow([a.name, a.email, a.code, a.platform, a.status, a.customer_discount_pct, a.commission_pct, a.recurring, a.clicks, s.orders, usd(s.sales), usd(s.pending), usd(s.approved), usd(s.paid), a.payout_details, shareLink(a.code)]));
  }
  return new NextResponse(lines.join('\n'), {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="noovit-affiliates-${new Date().toISOString().slice(0, 10)}.csv"`,
      'Cache-Control': 'no-store',
    },
  });
}
