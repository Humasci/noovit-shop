import { NextResponse } from 'next/server';
import { csvCell as cell } from '@/lib/csv';
import { db } from '@/lib/db/server';
import { currentStaff } from '@/lib/admin/auth';
import { can } from '@/lib/admin/permissions';
import { dbConfigured } from '@/lib/config';


export async function GET(req: Request) {
  const source = new URL(req.url).searchParams.get('source');
  const staff = await currentStaff();
  if (!staff || !can(staff.role, 'marketing')) return new NextResponse('Unauthorized', { status: 401 });
  if (!dbConfigured()) return new NextResponse('Database not configured', { status: 503 });

  const rows = ['"email","source","goal_or_kit","joined"'];
  for (let from = 0; ; from += 1000) {
    let q = db().from('subscribers').select('*').eq('status', 'subscribed');
    if (source && /^[a-z-]{3,30}$/.test(source)) q = q.eq('source', source);
    const { data, error } = await q.order('created_at').range(from, from + 999);
    if (error) return new NextResponse(error.message, { status: 500 });
    for (const s of data) rows.push([s.email, s.source, s.goal ?? '', s.created_at].map(cell).join(','));
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
