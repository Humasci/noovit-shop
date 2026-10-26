import { NextResponse } from 'next/server';
import { currentStaff } from '@/lib/admin/auth';
import { can } from '@/lib/admin/permissions';
import { loadCatalog } from '@/lib/catalog/server';
import { PRODUCT_CSV_COLUMNS } from '@/lib/catalog/csv';
import { csvResponse, csvRow } from '@/lib/csv';

export async function GET() {
  const staff = await currentStaff();
  if (!staff || !can(staff.role, 'products')) return new NextResponse('Unauthorized', { status: 401 });

  const lines = [csvRow([...PRODUCT_CSV_COLUMNS])];
  for (const p of await loadCatalog()) {
    lines.push(
      csvRow([
        p.slug, p.name, p.status, p.productType, p.basePrice.toFixed(2), p.servings, p.form, p.supplierSku ?? '', p.bestSeller ? 'yes' : 'no',
        p.shortBenefit, p.seoTitle ?? '', p.seoDescription ?? '',
      ])
    );
  }
  return csvResponse(lines.join('\n'), `noovit-products-${new Date().toISOString().slice(0, 10)}.csv`);
}
