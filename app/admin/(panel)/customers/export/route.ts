import { NextRequest, NextResponse } from 'next/server';
import { csvCell as cell } from '@/lib/csv';
import { currentStaff } from '@/lib/admin/auth';
import { can } from '@/lib/admin/permissions';
import { dbConfigured } from '@/lib/config';
import { filterCustomers, loadCustomerSummaries } from '@/lib/admin/customers';


export async function GET(req: NextRequest) {
  const staff = await currentStaff();
  if (!staff || !can(staff.role, 'customers')) return new NextResponse('Unauthorized', { status: 401 });
  if (!dbConfigured()) return new NextResponse('Database not configured', { status: 503 });

  const p = req.nextUrl.searchParams;
  const rows = filterCustomers(await loadCustomerSummaries(), { segment: p.get('segment') ?? undefined, tag: p.get('tag') ?? undefined, q: p.get('q') ?? undefined });
  const lines = [['email', 'name', 'orders', 'lifetime_spend', 'active_subscriptions', 'last_order', 'tags', 'customer_since'].map(cell).join(',')];
  for (const c of rows) {
    lines.push([c.email, c.name, c.orderCount, (c.ltv / 100).toFixed(2), c.activeSubs, c.lastOrder?.slice(0, 10), c.tags.join(' '), c.createdAt.slice(0, 10)].map(cell).join(','));
  }
  return new NextResponse(lines.join('\n'), {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="noovit-customers-${p.get('segment') ?? 'all'}-${new Date().toISOString().slice(0, 10)}.csv"`,
      'Cache-Control': 'no-store',
    },
  });
}
