import Link from 'next/link';
import { Plus } from 'lucide-react';
import { requireAdmin } from '@/lib/admin/auth';
import { dbConfigured } from '@/lib/config';
import { loadCollections } from '@/lib/catalog/server';
import { Badge, NotConfigured, PageTitle, Table, btnSm, td } from '@/components/admin/ui';

export default async function CollectionsPage() {
  await requireAdmin('products');
  if (!dbConfigured()) return (<><PageTitle title="Collections" /><NotConfigured what="The database" /></>);
  const collections = await loadCollections();

  return (
    <>
      <PageTitle title="Collections">
        <Link href="/admin/collections/new" className={`${btnSm} inline-flex items-center gap-1`}>
          <Plus className="h-3.5 w-3.5" /> New collection
        </Link>
      </PageTitle>
      <p className="mb-4 text-sm text-[var(--color-muted)]">
        Collections group products for landing pages and ads — e.g. “Sleep Support”, “Women&apos;s Health”, “Gift ideas”. Each active collection gets its own page at
        noovit.com/collections/… and appears on the Shop page.
      </p>
      <Table head={['Collection', 'Products', 'Status', '']} empty={!collections.length}>
        {collections.map((c) => (
          <tr key={c.slug}>
            <td className={td}>
              <Link href={`/admin/collections/${c.slug}`} className="font-semibold hover:text-[var(--color-blue)]">{c.title}</Link>
              <div className="text-xs text-[var(--color-muted)]">/collections/{c.slug}</div>
            </td>
            <td className={td}>{c.productSlugs.length}</td>
            <td className={td}><Badge status={c.status} /></td>
            <td className={td}><Link href={`/admin/collections/${c.slug}`} className="text-sm font-bold text-[var(--color-blue)]">Edit</Link></td>
          </tr>
        ))}
      </Table>
    </>
  );
}
