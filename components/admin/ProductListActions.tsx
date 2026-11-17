'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { importLaunchCatalog, syncAllProducts, ActionResult } from '@/app/admin/product-actions';
import { btnSmOutline } from './ui';
import { MosaicLoader } from '@/components/brand/MosaicLoader';

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

  // "Add missing launch products" copies any seed product the database doesn't have yet (hidden), never touching
  // existing ones, so it stays useful after the first import (e.g. a product added to the seed later).
  const spin = <span className="inline-flex items-center gap-2"><MosaicLoader size={14} label="Working" /> Working…</span>;
  return (
    <div className="flex flex-wrap gap-2">
      <button disabled={pending} onClick={() => run(importLaunchCatalog)} className={btnSmOutline}>
        {pending ? spin : empty ? 'Import launch catalog' : 'Add missing launch products'}
      </button>
      {!empty && (
        <button disabled={pending} onClick={() => run(syncAllProducts)} className={btnSmOutline}>
          {pending ? spin : 'Sync all to Stripe'}
        </button>
      )}
    </div>
  );
}
