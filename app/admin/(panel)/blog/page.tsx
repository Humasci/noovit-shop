import Link from 'next/link';
import { Plus } from 'lucide-react';
import { requireAdmin } from '@/lib/admin/auth';
import { dbConfigured } from '@/lib/config';
import { loadPosts } from '@/lib/blog';
import { Badge, Flash, NotConfigured, PageTitle, Table, btnSm, date, td } from '@/components/admin/ui';

export default async function BlogAdmin({ searchParams }: { searchParams: Promise<{ msg?: string }> }) {
  await requireAdmin('content');
  const { msg } = await searchParams;
  if (!dbConfigured()) return (<><PageTitle title="Blog" /><NotConfigured what="The database" /></>);
  const posts = await loadPosts(true);
  // eslint-disable-next-line react-hooks/purity -- server component, evaluated once per request
  const now = Date.now();

  return (
    <>
      <PageTitle title="Blog">
        <Link href="/admin/blog/new" className={`${btnSm} inline-flex items-center gap-1`}>
          <Plus className="h-3.5 w-3.5" /> New post
        </Link>
      </PageTitle>
      <Flash msg={msg} />
      <p className="mb-4 text-sm text-[var(--color-muted)]">
        Articles appear at noovit.com/blog, in the sitemap and in Google with article details. Write in plain text with simple formatting (markdown). Keep health claims to the
        same “supports…” wording as product pages.
      </p>
      <Table head={['Post', 'Status', 'Published', 'Author', '']} empty={!posts.length}>
        {posts.map((p) => {
          const scheduled = p.status === 'published' && p.publishedAt && Date.parse(p.publishedAt) > now;
          return (
            <tr key={p.slug}>
              <td className={td}>
                <Link href={`/admin/blog/${p.slug}`} className="font-semibold hover:text-[var(--color-accent)]">{p.title}</Link>
                <div className="text-xs text-[var(--color-muted)]">/blog/{p.slug}</div>
              </td>
              <td className={td}><Badge status={scheduled ? 'scheduled' : p.status === 'published' ? 'active' : 'pending'} /></td>
              <td className={td}>{date(p.publishedAt)}</td>
              <td className={td}>{p.author}</td>
              <td className={td}><Link href={`/admin/blog/${p.slug}`} className="text-sm font-bold text-[var(--color-accent)]">Edit</Link></td>
            </tr>
          );
        })}
      </Table>
    </>
  );
}
