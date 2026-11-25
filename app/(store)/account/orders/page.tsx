import Link from 'next/link';
import { Package } from 'lucide-react';
import { requireAccount, loadAccount } from '@/lib/account/data';
import { OrderRow } from '@/components/account/OrderRow';
import { Empty, Flash, PageTitle } from '@/components/account/ui';

export const dynamic = 'force-dynamic';

export default async function OrdersPage({ searchParams }: { searchParams: Promise<{ ok?: string; err?: string }> }) {
  const email = await requireAccount();
  const [{ orders }, sp] = await Promise.all([loadAccount(email), searchParams]);
  return (
    <>
      <PageTitle icon={Package} title="Orders" sub="Every order placed with this email, newest first." />
      <Flash {...sp} />
      {orders.length ? (
        <ul className="grid gap-4">{orders.map((o) => <OrderRow key={o.id} o={o} />)}</ul>
      ) : (
        <Empty>No orders yet. When you order, it shows up here with its tracking link. <Link href="/shop" className="font-semibold text-[var(--color-navy)] underline">Browse the shop</Link></Empty>
      )}
    </>
  );
}
