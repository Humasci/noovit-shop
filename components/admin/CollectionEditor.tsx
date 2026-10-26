'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { ArrowDown, ArrowUp, ExternalLink, Trash2, Upload, X } from 'lucide-react';
import { CollectionInput, deleteCollection, removeCollectionImage, saveCollection, setCollectionImage } from '@/app/admin/collection-actions';
import { Card, btnSm, btnSmOutline, inputCls } from './ui';

const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
const label = 'mb-1 block text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)]';

interface Option {
  slug: string;
  name: string;
  status: string;
}

export function CollectionEditor({ initial, isNew, image, products }: { initial: CollectionInput; isNew: boolean; image: string | null; products: Option[] }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [c, setC] = useState(initial);
  const [img, setImg] = useState(image);
  const [slugTouched, setSlugTouched] = useState(!isNew);
  const [filter, setFilter] = useState('');
  const set = <K extends keyof CollectionInput>(k: K, v: CollectionInput[K]) => setC((p) => ({ ...p, [k]: v }));
  const name = (slug: string) => products.find((p) => p.slug === slug)?.name ?? slug;

  const move = (i: number, dir: -1 | 1) => {
    const next = [...c.productSlugs];
    [next[i], next[i + dir]] = [next[i + dir], next[i]];
    set('productSlugs', next);
  };

  const save = () =>
    start(async () => {
      const r = await saveCollection(c, isNew);
      if (!r.ok) return void toast.error(r.message, { duration: 8000 });
      toast.success(r.message);
      if (isNew) router.push(`/admin/collections/${r.slug}`);
      else router.refresh();
    });

  const available = products.filter((p) => !c.productSlugs.includes(p.slug) && p.name.toLowerCase().includes(filter.toLowerCase()));

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
      <div className="space-y-6">
        <Card>
          <div className="grid gap-4 sm:grid-cols-2">
            <label>
              <span className={label}>Title</span>
              <input
                value={c.title}
                onChange={(e) => {
                  set('title', e.target.value);
                  if (!slugTouched) set('slug', slugify(e.target.value));
                }}
                placeholder="e.g. Sleep Support"
                className={`${inputCls} w-full`}
              />
            </label>
            <label>
              <span className={label}>URL handle</span>
              <input
                value={c.slug}
                disabled={!isNew}
                onChange={(e) => {
                  setSlugTouched(true);
                  set('slug', slugify(e.target.value));
                }}
                className={`${inputCls} w-full disabled:bg-[var(--color-soft)]`}
              />
              <span className="mt-1 block text-xs text-[var(--color-muted)]">noovit.com/collections/{c.slug || '…'}</span>
            </label>
          </div>
          <label className="mt-4 block">
            <span className={label}>Description</span>
            <textarea rows={3} value={c.description} onChange={(e) => set('description', e.target.value)} className={`${inputCls} w-full`} />
          </label>
        </Card>

        <Card>
          <h2 className="mb-3 text-lg">Products in this collection ({c.productSlugs.length})</h2>
          <ol className="mb-4 space-y-1">
            {c.productSlugs.map((slug, i) => (
              <li key={slug} className="flex items-center justify-between gap-2 rounded-lg bg-[var(--color-soft)] px-3 py-2 text-sm">
                <span>{i + 1}. {name(slug)}</span>
                <span className="flex gap-1">
                  <button type="button" disabled={i === 0} onClick={() => move(i, -1)} className={btnSmOutline} aria-label="Move up"><ArrowUp className="h-3 w-3" /></button>
                  <button type="button" disabled={i === c.productSlugs.length - 1} onClick={() => move(i, 1)} className={btnSmOutline} aria-label="Move down"><ArrowDown className="h-3 w-3" /></button>
                  <button type="button" onClick={() => set('productSlugs', c.productSlugs.filter((s) => s !== slug))} className={btnSmOutline} aria-label="Remove from collection"><X className="h-3 w-3" /></button>
                </span>
              </li>
            ))}
          </ol>
          <input value={filter} onChange={(e) => setFilter(e.target.value)} placeholder="Search products to add…" className={`${inputCls} mb-2 w-full`} />
          <div className="max-h-64 space-y-1 overflow-y-auto">
            {available.map((p) => (
              <button
                type="button"
                key={p.slug}
                onClick={() => set('productSlugs', [...c.productSlugs, p.slug])}
                className="flex w-full items-center justify-between rounded-lg px-3 py-1.5 text-left text-sm hover:bg-[var(--color-soft)]"
              >
                <span>+ {p.name}</span>
                {p.status !== 'active' && <span className="text-xs text-[var(--color-muted)]">{p.status.replace('_', ' ')}</span>}
              </button>
            ))}
          </div>
        </Card>

        <Card>
          <h2 className="mb-3 text-lg">Search engine listing</h2>
          <input value={c.seoTitle} onChange={(e) => set('seoTitle', e.target.value)} placeholder={`${c.title || 'Collection'} — Noovit`} className={`${inputCls} mb-2 w-full`} />
          <textarea rows={2} value={c.seoDescription} onChange={(e) => set('seoDescription', e.target.value)} placeholder={c.description} className={`${inputCls} w-full`} />
        </Card>
      </div>

      <div className="space-y-6">
        <Card>
          <h2 className="mb-3 text-lg">Status</h2>
          <select value={c.status} onChange={(e) => set('status', e.target.value as CollectionInput['status'])} className={`${inputCls} w-full`}>
            <option value="active">Active — visible in the store</option>
            <option value="hidden">Hidden</option>
          </select>
          <button onClick={save} disabled={pending} className={`${btnSm} mt-4 w-full py-3 text-sm`}>
            {pending ? 'Saving…' : isNew ? 'Create collection' : 'Save changes'}
          </button>
          {!isNew && (
            <>
              <Link href={`/collections/${c.slug}`} target="_blank" className="mt-3 flex items-center justify-center gap-1 text-sm text-[var(--color-accent)]">
                View in store <ExternalLink className="h-3.5 w-3.5" />
              </Link>
              <button
                type="button"
                onClick={() =>
                  confirm('Delete this collection? Products are not affected.') &&
                  start(async () => {
                    await deleteCollection(c.slug);
                    router.push('/admin/collections');
                  })
                }
                className="mt-3 flex w-full items-center justify-center gap-1 text-sm text-red-600"
              >
                <Trash2 className="h-3.5 w-3.5" /> Delete collection
              </button>
            </>
          )}
        </Card>

        {!isNew && (
          <Card>
            <h2 className="mb-3 text-lg">Banner image</h2>
            {img && <img src={img} alt="" className="mb-3 aspect-[16/9] w-full rounded-xl object-cover" />}
            <div className="flex gap-2">
              <label className={`${btnSm} inline-flex cursor-pointer items-center gap-1`}>
                <Upload className="h-3.5 w-3.5" /> {img ? 'Replace' : 'Upload'}
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const form = new FormData();
                    form.append('file', file);
                    start(async () => {
                      const r = await setCollectionImage(c.slug, form);
                      if (r.ok) setImg(r.image ?? null);
                      else toast.error(r.message);
                    });
                  }}
                />
              </label>
              {img && (
                <button type="button" onClick={() => start(async () => setImg((await removeCollectionImage(c.slug)).image ?? null))} className={btnSmOutline}>
                  Remove
                </button>
              )}
            </div>
            <p className="mt-2 text-xs text-[var(--color-muted)]">Wide image (16:9), JPG/PNG/WebP up to 4 MB.</p>
          </Card>
        )}
      </div>
    </div>
  );
}
