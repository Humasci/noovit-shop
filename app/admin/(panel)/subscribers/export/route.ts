import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { db } from '@/lib/db/server';
import { ADMIN_COOKIE, isAdminToken } from '@/lib/admin/session';
import { dbConfigured } from '@/lib/config';

const cell = (v: unknown) => {
  let s = v == null ? '' : String(v);
  if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`;
  return `"${s.replace(/"/g, '""')}"`;
};

export async function GET() {
  if (!isAdminToken((await cookies()).get(ADMIN_COOKIE)?.value)) return new NextResponse('Unauthorized', { status: 401 });
  if (!dbConfigured()) return new NextResponse('Database not configured', { status: 503 });

  const rows = ['"email","source","joined"'];
  for (let from = 0; ; from += 1000) {
    const { data, error } = await db()
      .from('subscribers')
      .select('email, source, created_at')
      .eq('status', 'subscribed')
      .order('created_at')
      .range(from, from + 999);
    if (error) return new NextResponse(error.message, { status: 500 });
    for (const s of data) rows.push([s.email, s.source, s.created_at].map(cell).join(','));
    if (data.length < 1000) break;
  }

  return new NextResponse(rows.join('\n'), {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="noovit-subscribers-${new Date().toISOString().slice(0, 10)}.csv"`,
      'Cache-Control': 'no-store',
    },
  });
}
