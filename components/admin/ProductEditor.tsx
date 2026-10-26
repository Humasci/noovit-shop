'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { Plus, Trash2, ExternalLink } from 'lucide-react';
import { saveProduct, ProductInput } from '@/app/admin/product-actions';
import { DIETARY_TAGS, PRODUCT_FORMS, PRODUCT_TYPES, packOptions } from '@/data/products';
import { buildProduct } from '@/lib/catalog/build';
import { Audience, DietaryTag, ProductData, ProductStatus, Species } from '@/types';
import { formatPrice } from '@/lib/utils/format';
import { ProductImage } from '@/components/product/ProductImage';
import { Card, btnSm, btnSmOutline, inputCls } from './ui';

const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

const label = 'block text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)] mb-1';
const full = `${inputCls} w-full`;

function Field({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className={label}>{title}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-[var(--color-muted)]">{hint}</span>}
    </label>
  );
}

function Counter({ value, max }: { value: string; max: number }) {
  return <span className={`text-xs ${value.length > max ? 'text-red-600' : 'text-[var(--color-muted)]'}`}>{value.length}/{max}</span>;
}

export const EMPTY_PRODUCT: ProductData = {
  name: '',
  shortBenefit: '',
  description: '',
  whoFor: '',
  benefits: [''],
  ingredients: [{ name: '', amount: '' }],
  otherIngredients: 'Vegetable capsule (HPMC).',
  dosage: '',
  servings: 30,
  form: 'capsules',
  basePrice: 35,
  color: '#5C7FA8',
  productType: 'supplements',
  dietaryTags: [],
  audiences: [],
  species: [],
  ageRestricted: false,
  bestSeller: false,
  rating: 0,
  reviewCount: 0,
  extraFaqs: [],
};

export function ProductEditor({
  initial,
  isNew,
  images,
  productOptions,
}: {
  initial: ProductInput;
  isNew: boolean;
  images: string[];
  productOptions: { slug: string; name: string }[];
}) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [slug, setSlug] = useState(initial.slug);
  const [slugTouched, setSlugTouched] = useState(!isNew);
  const [status, setStatus] = useState<ProductStatus>(initial.status);
  const [seoTitle, setSeoTitle] = useState(initial.seoTitle);
  const [seoDescription, setSeoDescription] = useState(initial.seoDescription);
  const [supplierSku, setSupplierSku] = useState(initial.supplierSku);
  const [d, setD] = useState<ProductData>(initial.data);

  const set = <K extends keyof ProductData>(key: K, value: ProductData[K]) => setD((prev) => ({ ...prev, [key]: value }));
  const toggle = <T,>(key: 'dietaryTags' | 'audiences' | 'species', value: T) =>
    setD((prev) => {
      const cur = (prev[key] ?? []) as T[];
      return { ...prev, [key]: cur.includes(value) ? cur.filter((v) => v !== value) : [...cur, value] };
    });

  const preview = buildProduct({ slug: slug || 'new-product', data: d, status, images });
  const priceOk = d.basePrice >= 15;

  const save = () =>
    start(async () => {
      const r = await saveProduct({ slug, status, seoTitle, seoDescription, supplierSku, data: d }, isNew);
      if (!r.ok) {
        toast.error(r.message, { duration: 8000 });
        return;
      }
      toast.success(r.message, { duration: 6000 });
      if (isNew) router.push(`/admin/products/${r.slug}`);
      else router.refresh();
    });

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
      <div className="space-y-6">
        <Card>
          <h2 className="mb-4 text-lg">Basics</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field title="Name">
              <input
                value={d.name}
                onChange={(e) => {
                  set('name', e.target.value);
                  if (!slugTouched) setSlug(slugify(e.target.value));
                }}
                className={full}
                placeholder="e.g. Magnesium Complex"
              />
            </Field>
            <Field title="URL handle" hint={isNew ? `noovit.com/products/${slug || '…'}` : "Can't be changed after creation (orders and Stripe refer to it)."}>
              <input
                value={slug}
                disabled={!isNew}
                onChange={(e) => {
                  setSlugTouched(true);
                  setSlug(slugify(e.target.value));
                }}
                className={`${full} disabled:bg-[var(--color-soft)]`}
              />
            </Field>
            <Field title="Short benefit" hint="One line, shown on product cards.">
              <input value={d.shortBenefit} onChange={(e) => set('shortBenefit', e.target.value)} className={full} maxLength={160} />
            </Field>
            <Field title="Product type">
              <select value={d.productType} onChange={(e) => set('productType', e.target.value as ProductData['productType'])} className={full}>
                {PRODUCT_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </Field>
          </div>
          <div className="mt-4 grid gap-4">
            <Field title="Description">
              <textarea rows={3} value={d.description} onChange={(e) => set('description', e.target.value)} className={full} />
            </Field>
            <Field title="Who it's for">
              <textarea rows={2} value={d.whoFor} onChange={(e) => set('whoFor', e.target.value)} className={full} />
            </Field>
          </div>
        </Card>

        <Card>
          <h2 className="mb-4 text-lg">Pricing &amp; format</h2>
          <div className="grid gap-4 sm:grid-cols-4">
            <Field title="Base price (USD)" hint="One-time, 1 bottle.">
              <input type="number" min={15} step="0.5" value={d.basePrice} onChange={(e) => set('basePrice', Number(e.target.value))} className={full} />
            </Field>
            <Field title="Form">
              <select value={d.form} onChange={(e) => set('form', e.target.value as ProductData['form'])} className={full}>
                {PRODUCT_FORMS.map((f) => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
            </Field>
            <Field title="Servings per bottle">
              <input type="number" min={1} value={d.servings} onChange={(e) => set('servings', Number(e.target.value))} className={full} />
            </Field>
            <Field title="Label colour" hint="Used on mockup images.">
              <input type="color" value={d.color} onChange={(e) => set('color', e.target.value)} className="h-10 w-full rounded-lg border border-[var(--color-line)]" />
            </Field>
          </div>
          {priceOk ? (
            <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
              {(['subscribe', 'one-time'] as const).map((mode) => (
                <div key={mode} className="rounded-xl bg-[var(--color-soft)] p-3">
                  <p className="mb-1 text-xs font-bold uppercase tracking-wider text-[var(--color-muted)]">{mode === 'subscribe' ? 'Subscribe & save' : 'One-time'}</p>
                  {packOptions(preview, mode).map((o) => (
                    <p key={o.bottles} className="flex justify-between">
                      <span>{o.bottles} {o.bottles === 1 ? 'bottle' : 'bottles'}</span>
                      <span>{formatPrice(o.pricePerBottle)} each · <b>{formatPrice(o.pricePerBottle * o.bottles)}</b></span>
                    </p>
                  ))}
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-3 text-sm text-red-600">Base price must be at least $15 (the cheapest tier is base price − $10).</p>
          )}
        </Card>

        <Card>
          <h2 className="mb-4 text-lg">Benefits</h2>
          <div className="space-y-2">
            {d.benefits.map((b, i) => (
              <div key={i} className="flex gap-2">
                <input value={b} onChange={(e) => set('benefits', d.benefits.map((x, j) => (j === i ? e.target.value : x)))} className={full} />
                <button type="button" onClick={() => set('benefits', d.benefits.filter((_, j) => j !== i))} className={btnSmOutline} aria-label="Remove benefit">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
            <button type="button" onClick={() => set('benefits', [...d.benefits, ''])} className={`${btnSmOutline} inline-flex items-center gap-1`}>
              <Plus className="h-3.5 w-3.5" /> Add benefit
            </button>
          </div>
        </Card>

        <Card>
          <h2 className="mb-4 text-lg">Ingredients &amp; dosage</h2>
          <div className="space-y-2">
            {d.ingredients.map((ing, i) => {
              const update = (patch: Partial<typeof ing>) => set('ingredients', d.ingredients.map((x, j) => (j === i ? { ...x, ...patch } : x)));
              return (
                <div key={i} className="grid gap-2 sm:grid-cols-[2fr_1fr_2fr_auto]">
                  <input placeholder="Ingredient" value={ing.name} onChange={(e) => update({ name: e.target.value })} className={inputCls} />
                  <input placeholder="Amount" value={ing.amount} onChange={(e) => update({ amount: e.target.value })} className={inputCls} />
                  <input placeholder="Note (optional)" value={ing.description ?? ''} onChange={(e) => update({ description: e.target.value })} className={inputCls} />
                  <button type="button" onClick={() => set('ingredients', d.ingredients.filter((_, j) => j !== i))} className={btnSmOutline} aria-label="Remove ingredient">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              );
            })}
            <button type="button" onClick={() => set('ingredients', [...d.ingredients, { name: '', amount: '' }])} className={`${btnSmOutline} inline-flex items-center gap-1`}>
              <Plus className="h-3.5 w-3.5" /> Add ingredient
            </button>
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Field title="Other ingredients">
              <input value={d.otherIngredients} onChange={(e) => set('otherIngredients', e.target.value)} className={full} />
            </Field>
            <Field title="Dosage / how to take">
              <input value={d.dosage} onChange={(e) => set('dosage', e.target.value)} className={full} placeholder="Take 2 capsules daily with food." />
            </Field>
          </div>
        </Card>

        <Card>
          <h2 className="mb-1 text-lg">Bundle contents</h2>
          <p className="mb-4 text-xs text-[var(--color-muted)]">
            Leave empty for a normal product. For a bundle (e.g. a “Sleep Stack”), list the products inside it: shoppers buy one item at the bundle price, and the
            fulfilment CSV lists each component with its own supplier SKU.
          </p>
          <div className="space-y-2">
            {(d.bundleItems ?? []).map((b, i) => (
              <div key={i} className="grid gap-2 sm:grid-cols-[3fr_1fr_auto]">
                <select
                  value={b.slug}
                  onChange={(e) => set('bundleItems', (d.bundleItems ?? []).map((x, j) => (j === i ? { ...x, slug: e.target.value } : x)))}
                  className={inputCls}
                  aria-label="Bundle product"
                >
                  <option value="">Choose a product…</option>
                  {productOptions.map((o) => (
                    <option key={o.slug} value={o.slug}>{o.name}</option>
                  ))}
                </select>
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={b.quantity}
                  onChange={(e) => set('bundleItems', (d.bundleItems ?? []).map((x, j) => (j === i ? { ...x, quantity: Number(e.target.value) } : x)))}
                  className={inputCls}
                  aria-label="Quantity in bundle"
                />
                <button type="button" onClick={() => set('bundleItems', (d.bundleItems ?? []).filter((_, j) => j !== i))} className={btnSmOutline} aria-label="Remove bundle item">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
            <button type="button" onClick={() => set('bundleItems', [...(d.bundleItems ?? []), { slug: '', quantity: 1 }])} className={`${btnSmOutline} inline-flex items-center gap-1`}>
              <Plus className="h-3.5 w-3.5" /> Add product to bundle
            </button>
          </div>
        </Card>

        <Card>
          <h2 className="mb-1 text-lg">Product FAQs</h2>
          <p className="mb-4 text-xs text-[var(--color-muted)]">Shown first on the product page, before the standard questions (how to take it, gluten, returns, shipping).</p>
          <div className="space-y-3">
            {d.extraFaqs.map((f, i) => {
              const update = (patch: Partial<typeof f>) => set('extraFaqs', d.extraFaqs.map((x, j) => (j === i ? { ...x, ...patch } : x)));
              return (
                <div key={i} className="grid gap-2 sm:grid-cols-[1fr_2fr_auto]">
                  <input placeholder="Question" value={f.q} onChange={(e) => update({ q: e.target.value })} className={inputCls} />
                  <input placeholder="Answer" value={f.a} onChange={(e) => update({ a: e.target.value })} className={inputCls} />
                  <button type="button" onClick={() => set('extraFaqs', d.extraFaqs.filter((_, j) => j !== i))} className={btnSmOutline} aria-label="Remove FAQ">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              );
            })}
            <button type="button" onClick={() => set('extraFaqs', [...d.extraFaqs, { q: '', a: '' }])} className={`${btnSmOutline} inline-flex items-center gap-1`}>
              <Plus className="h-3.5 w-3.5" /> Add FAQ
            </button>
          </div>
        </Card>

        <Card>
          <h2 className="mb-4 text-lg">Search engine listing</h2>
          <div className="grid gap-4">
            <Field title="Page title" hint="Defaults to “Name — Noovit”.">
              <input value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} className={full} placeholder={`${d.name || 'Product'} — Noovit`} />
              <Counter value={seoTitle} max={60} />
            </Field>
            <Field title="Meta description" hint="Defaults to the description.">
              <textarea rows={2} value={seoDescription} onChange={(e) => setSeoDescription(e.target.value)} className={full} placeholder={d.description} />
              <Counter value={seoDescription} max={155} />
            </Field>
          </div>
          <div className="mt-4 rounded-xl border border-[var(--color-line)] p-4 text-sm">
            <p className="truncate text-[#1a0dab]">{seoTitle || `${d.name || 'Product'} — Noovit`}</p>
            <p className="text-xs text-[#006621]">noovit.com/products/{slug}</p>
            <p className="line-clamp-2 text-xs text-[var(--color-muted)]">{seoDescription || d.description}</p>
          </div>
        </Card>
      </div>

      <div className="space-y-6">
        <Card>
          <h2 className="mb-4 text-lg">Status</h2>
          <select value={status} onChange={(e) => setStatus(e.target.value as ProductStatus)} className={full}>
            <option value="active">Active — on sale</option>
            <option value="out_of_stock">Out of stock — visible, can&apos;t be bought</option>
            <option value="hidden">Hidden — not shown in the store</option>
          </select>
          <button onClick={save} disabled={pending} className={`${btnSm} mt-4 w-full py-3 text-sm`}>
            {pending ? 'Saving…' : isNew ? 'Create product' : 'Save changes'}
          </button>
          {!isNew && (
            <Link href={`/products/${slug}`} target="_blank" className="mt-3 flex items-center justify-center gap-1 text-sm text-[var(--color-accent)]">
              View in store <ExternalLink className="h-3.5 w-3.5" />
            </Link>
          )}
        </Card>

        <Card>
          <p className={label}>Preview</p>
          <ProductImage product={preview} className="aspect-square w-full rounded-xl" />
          <p className="mt-2 font-bold">{d.name || 'Product name'}</p>
          <p className="text-sm text-[var(--color-muted)]">{d.shortBenefit}</p>
        </Card>

        <Card>
          <h2 className="mb-3 text-lg">Supplier</h2>
          <Field title="Supplier SKU" hint="Your supplier's product code — included on orders and the fulfilment CSV.">
            <input value={supplierSku} onChange={(e) => setSupplierSku(e.target.value)} className={full} placeholder="e.g. SUP-MAG-60" />
          </Field>
        </Card>

        <Card>
          <h2 className="mb-3 text-lg">Tags</h2>
          {d.productType !== 'pets' && (
            <>
              <p className={label}>Dietary</p>
              <div className="mb-4 grid grid-cols-2 gap-1 text-sm">
                {DIETARY_TAGS.map((t) => (
                  <label key={t.value} className="flex items-center gap-2">
                    <input type="checkbox" checked={d.dietaryTags.includes(t.value)} onChange={() => toggle<DietaryTag>('dietaryTags', t.value)} /> {t.label}
                  </label>
                ))}
              </div>
              <p className={label}>Shown in</p>
              <div className="mb-4 flex gap-4 text-sm">
                {(['women', 'men'] as Audience[]).map((a) => (
                  <label key={a} className="flex items-center gap-2">
                    <input type="checkbox" checked={d.audiences.includes(a)} onChange={() => toggle<Audience>('audiences', a)} /> {a === 'women' ? "Women's Health" : "Men's Health"}
                  </label>
                ))}
              </div>
            </>
          )}
          {d.productType === 'pets' && (
            <>
              <p className={label}>For</p>
              <div className="mb-4 flex gap-4 text-sm">
                {(['dog', 'cat'] as Species[]).map((s) => (
                  <label key={s} className="flex items-center gap-2">
                    <input type="checkbox" checked={d.species?.includes(s) ?? false} onChange={() => toggle<Species>('species', s)} /> {s === 'dog' ? 'Dogs' : 'Cats'}
                  </label>
                ))}
              </div>
            </>
          )}
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={d.bestSeller} onChange={(e) => set('bestSeller', e.target.checked)} /> Best seller
          </label>
          <label className="mt-1 flex items-center gap-2 text-sm">
            <input type="checkbox" checked={Boolean(d.ageRestricted)} onChange={(e) => set('ageRestricted', e.target.checked)} /> 18+ only (age check at checkout)
          </label>
        </Card>

        <Card>
          <h2 className="mb-1 text-lg">Rating display</h2>
          <p className="mb-3 text-xs text-[var(--color-muted)]">Used only until the product has approved reviews — then the real average and count are shown automatically. Set to 0 to hide.</p>
          <div className="grid grid-cols-2 gap-3">
            <Field title="Rating">
              <input type="number" min={0} max={5} step="0.1" value={d.rating} onChange={(e) => set('rating', Number(e.target.value))} className={full} />
            </Field>
            <Field title="Review count">
              <input type="number" min={0} value={d.reviewCount} onChange={(e) => set('reviewCount', Number(e.target.value))} className={full} />
            </Field>
          </div>
        </Card>
      </div>
    </div>
  );
}
