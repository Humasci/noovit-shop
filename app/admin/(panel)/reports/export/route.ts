import { NextRequest, NextResponse } from 'next/server';
import { currentStaff } from '@/lib/admin/auth';
import { can } from '@/lib/admin/permissions';
import { dbConfigured } from '@/lib/config';
import { loadOrdersSince } from '@/lib/admin/reports';
import { csvResponse, csvRow } from '@/lib/csv';

export async function GET(req: NextRequest) {
  const staff = await currentStaff();
  if (!staff || !can(staff.role, 'reports')) return new NextResponse('Unauthorized', { status: 401 });
  if (!dbConfigured()) return new NextResponse('Database not configured', { status: 503 });

  const days = Math.min(Math.max(Number(req.nextUrl.searchParams.get('days')) || 30, 1), 3650);
  const since = new Date(Date.now() - days * 86_400_000).toISOString();
  const orders = await loadOrdersSince(since);
  const lines = [csvRow(['order_number', 'date', 'kind', 'status', 'total', 'refunded', 'net', 'discount', 'product', 'bottles_per_pack', 'quantity', 'line_amount'])];
  for (const o of orders) {
    for (const i of o.order_items) {
      lines.push(
        csvRow([
          o.order_number, o.created_at.slice(0, 10), o.kind, o.status, (o.total_cents / 100).toFixed(2), ((o.refunded_cents ?? 0) / 100).toFixed(2),
          ((o.total_cents - (o.refunded_cents ?? 0)) / 100).toFixed(2), ((o.discount_cents ?? 0) / 100).toFixed(2),
          i.product_name, i.bottles, i.quantity, ((i.unit_amount_cents * i.quantity) / 100).toFixed(2),
        ])
      );
    }
  }
  return csvResponse(lines.join('\n'), `noovit-orders-${days}d-${new Date().toISOString().slice(0, 10)}.csv`);
}
