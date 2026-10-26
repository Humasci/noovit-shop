import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { db } from '@/lib/db/server';
import { ADMIN_COOKIE, isAdminToken } from '@/lib/admin/session';
import { dbConfigured } from '@/lib/config';

// Neutralise spreadsheet formula injection and quote every cell.
const cell = (v: unknown) => {
  let s = v === null || v === undefined ? '' : String(v);
  if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`;
  return `"${s.replace(/"/g, '""')}"`;
};

const HEADERS = [
  'order_number', 'order_date', 'name', 'email', 'address_line1', 'address_line2', 'city', 'state', 'postal_code', 'country',
  'product', 'supplier_sku', 'bottles_per_pack', 'packs', 'total_bottles',
];

export async function GET() {
  if (!isAdminToken((await cookies()).get(ADMIN_COOKIE)?.value)) return new NextResponse('Unauthorized', { status: 401 });
  if (!dbConfigured()) return new NextResponse('Database not configured', { status: 503 });

  const { data, error } = await db()
    .from('fulfilments')
    .select('orders(order_number, created_at, email, shipping_name, shipping_address, order_items(product_slug, product_name, supplier_sku, bottles, quantity))')
    .eq('status', 'queued')
    .order('created_at', { ascending: true });
  if (error) return new NextResponse(error.message, { status: 500 });

  // Orders placed before a SKU was mapped fall back to the current mapping.
  const { data: settings } = await db().from('products').select('slug, supplier_sku');
  const currentSku = new Map((settings ?? []).map((r) => [r.slug as string, r.supplier_sku as string | null]));

  const rows = [HEADERS.map(cell).join(',')];
  for (const f of data ?? []) {
    const o = f.orders as unknown as {
      order_number: number;
      created_at: string;
      email: string;
      shipping_name: string | null;
      shipping_address: Record<string, string | null> | null;
      order_items: { product_slug: string; product_name: string; supplier_sku: string | null; bottles: number; quantity: number }[];
    };
    const a = o.shipping_address ?? {};
    for (const i of o.order_items) {
      rows.push(
        [
          o.order_number, o.created_at.slice(0, 10), o.shipping_name, o.email, a.line1, a.line2, a.city, a.state, a.postal_code, a.country,
          i.product_name, i.supplier_sku ?? currentSku.get(i.product_slug), i.bottles, i.quantity, i.bottles * i.quantity,
        ].map(cell).join(',')
      );
    }
  }

  return new NextResponse(rows.join('\n'), {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="noovit-orders-${new Date().toISOString().slice(0, 10)}.csv"`,
      'Cache-Control': 'no-store',
    },
  });
}
