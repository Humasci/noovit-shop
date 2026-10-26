'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { importLaunchCatalog, syncAllProducts, ActionResult } from '@/app/admin/product-actions';
import { btnSmOutline } from './ui';

export function ProductListActions({ empty }: { empty: boolean }) {
  const [pending, start] = useTransition();
  const router = useRouter();

  const run = (fn: () => Promise<ActionResult>) =>
    start(async () => {
      const r = await fn();
      if (r.ok) toast.success(r.message, { duration: 6000 });
      else toast.error(r.message, { duration: 8000 });
      router.refresh();
    });

  return empty ? (
    <button disabled={pending} onClick={() => run(importLaunchCatalog)} className={btnSmOutline}>
      {pending ? 'Importing…' : 'Import launch catalog'}
    </button>
  ) : (
    <button disabled={pending} onClick={() => run(syncAllProducts)} className={btnSmOutline}>
      {pending ? 'Syncing…' : 'Sync all to Stripe'}
    </button>
  );
}
