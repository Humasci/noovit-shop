'use client';

import { useRef, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { ArrowLeft, ArrowRight, Trash2, Upload } from 'lucide-react';
import { moveProductImage, removeProductImage, uploadProductImage } from '@/app/admin/product-actions';
import { Card, btnSm, btnSmOutline } from './ui';

export function ProductImages({ slug, initial }: { slug: string; initial: string[] }) {
  const router = useRouter();
  const [images, setImages] = useState(initial);
  const [pending, start] = useTransition();
  const [progress, setProgress] = useState<string | null>(null);
  const input = useRef<HTMLInputElement>(null);

  const apply = (r: { ok: boolean; message: string; images?: string[] }) => {
    if (r.images) setImages(r.images);
    if (!r.ok) toast.error(r.message, { duration: 8000 });
    return r.ok;
  };

  const upload = (files: FileList) =>
    start(async () => {
      const list = [...files];
      let done = 0;
      for (const file of list) {
        setProgress(`Uploading ${done + 1} of ${list.length}…`);
        const form = new FormData();
        form.append('file', file);
        if (apply(await uploadProductImage(slug, form))) done++;
      }
      setProgress(null);
      if (done) toast.success(`${done} image${done === 1 ? '' : 's'} uploaded.`);
      if (input.current) input.current.value = '';
      router.refresh();
    });

  return (
    <Card>
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg">Photos</h2>
          <p className="text-xs text-[var(--color-muted)]">JPG, PNG or WebP up to 4 MB, ideally square. The first photo is the main image. Without photos the store shows a generated bottle mockup.</p>
        </div>
        <label className={`${btnSm} inline-flex shrink-0 cursor-pointer items-center gap-1 ${pending ? 'pointer-events-none opacity-50' : ''}`}>
          <Upload className="h-3.5 w-3.5" /> {progress ?? 'Upload'}
          <input
            ref={input}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            className="hidden"
            onChange={(e) => e.target.files?.length && upload(e.target.files)}
          />
        </label>
      </div>
      {images.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {images.map((url, i) => (
            <div key={url} className="overflow-hidden rounded-xl border border-[var(--color-line)]">
              <img src={url} alt={`Product photo ${i + 1}`} className="aspect-square w-full object-cover" />
              <div className="flex items-center justify-between gap-1 p-2">
                <span className="text-xs text-[var(--color-muted)]">{i === 0 ? 'Main' : `#${i + 1}`}</span>
                <div className="flex gap-1">
                  <button disabled={pending || i === 0} onClick={() => start(async () => void apply(await moveProductImage(slug, i, -1)))} className={btnSmOutline} aria-label="Move left">
                    <ArrowLeft className="h-3 w-3" />
                  </button>
                  <button disabled={pending || i === images.length - 1} onClick={() => start(async () => void apply(await moveProductImage(slug, i, 1)))} className={btnSmOutline} aria-label="Move right">
                    <ArrowRight className="h-3 w-3" />
                  </button>
                  <button disabled={pending} onClick={() => start(async () => void apply(await removeProductImage(slug, url)))} className={btnSmOutline} aria-label="Remove photo">
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
