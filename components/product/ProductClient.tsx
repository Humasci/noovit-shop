'use client';

import { useEffect, useId, useRef, useState, useSyncExternalStore } from 'react';
import { Check, Truck } from 'lucide-react';
import { Frequency, Product, PurchaseMode } from '@/types';
import { packOptions, maxSavingPercent } from '@/data/products';
import { PAYMENT_METHODS } from '@/data/content';
import toast from 'react-hot-toast';
import { track } from '@/lib/analytics';
import { useCart, cartFrequency } from '@/lib/store/cart';
import { formatPrice } from '@/lib/utils/format';

import { ProductImage, ImageVariant } from './ProductImage';

const VARIANTS: ImageVariant[] = ['front', 'capsules', 'duo', 'facts'];

// Uploaded photos take over the gallery; until then it shows generated mockups.
export function Gallery({ product }: { product: Product }) {
  const [active, setActive] = useState(0);
  const photos = product.images;
  const count = photos.length || VARIANTS.length;
  const slide = (i: number, className: string, main = false) =>
    photos.length ? (
      <img src={photos[i]} alt={main ? `${product.name} ${i + 1}` : ''} className={`object-cover ${className}`} />
    ) : (
      <ProductImage
        product={product}
        variant={VARIANTS[i]}
        className={className}
        sizes={main ? '(min-width: 768px) 50vw, 100vw' : '120px'}
        priority={main && i === 0}
      />
    );

  return (
    <div>
      <div className="overflow-hidden rounded-3xl bg-[var(--color-soft)]">{slide(Math.min(active, count - 1), 'aspect-square w-full', true)}</div>
      {count > 1 && (
        <div className="mt-4 grid grid-cols-4 gap-3">
          {Array.from({ length: count }, (_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`overflow-hidden rounded-xl border-2 ${i === active ? 'border-[var(--color-navy)]' : 'border-transparent'}`}
              aria-label={`Show image ${i + 1} of ${count}`}
              aria-current={i === active}
            >
              {slide(i, 'aspect-square w-full')}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

const deliveryText = () => {
  const day = (offset: number) => new Date(Date.now() + offset * 86400000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  return `${day(3)} – ${day(6)}`;
};

// Pages are statically generated, so the estimate is computed in the browser rather than frozen at build time.
function DeliveryEstimate() {
  const text = useSyncExternalStore(() => () => {}, deliveryText, () => null);
  return text ? (
    <>
      {' · Estimated '}
      <span className="font-semibold">{text}</span>
    </>
  ) : null;
}

const PERKS = ['Change or cancel anytime online', 'Free US shipping on every delivery', '90-day money-back guarantee', 'Choose every 30, 60 or 90 days'];

export function PurchaseBox({ product }: { product: Product }) {
  // One-time is the default so the first price shown matches the Google Shopping feed (and nothing is pre-selected into a recurring charge).
  const [mode, setMode] = useState<PurchaseMode>('one-time');
  const [bottles, setBottles] = useState(1);
  const [frequency, setFrequency] = useState<Frequency>(30);
  const addItem = useCart((s) => s.addItem);
  const mainButton = useRef<HTMLButtonElement>(null);
  const [buttonVisible, setButtonVisible] = useState(true);

  // Pack sizes differ by mode; keep the same bottle count when switching if that size exists.
  const options = packOptions(product, mode);
  const pack = options.find((o) => o.bottles === bottles) ?? options[0];
  const active = product.status === 'active';

  // On phones the Add to Cart button is far down the page; a sticky bar stands in while it is off screen.
  useEffect(() => {
    const el = mainButton.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setButtonVisible(e.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const add = () => {
    const current = cartFrequency(useCart.getState().items);
    if (mode === 'subscribe' && current && current !== frequency) {
      toast(`All subscription items in your cart will now arrive every ${frequency} days.`);
    }
    addItem({ product, mode, bottles: pack.bottles, pricePerBottle: pack.pricePerBottle, frequency: mode === 'subscribe' ? frequency : undefined });
    track({ name: 'add_to_cart', item: { id: product.slug, name: product.name, price: pack.pricePerBottle * pack.bottles } });
  };
  const label = active ? `Add to Cart — ${formatPrice(pack.pricePerBottle * pack.bottles)}` : 'Out of stock';

  return (
    <div>
      <p className="mb-5 flex items-center gap-2 text-sm">
        <Truck className="h-4 w-4 text-[var(--color-green)]" />
        Free US shipping on every order
        <DeliveryEstimate />
      </p>

      <div className="grid grid-cols-2 gap-2 rounded-full bg-[var(--color-soft)] p-1" role="group" aria-label="Purchase type">
        {(['subscribe', 'one-time'] as const).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            aria-pressed={mode === m}
            className={`rounded-full px-3 py-2.5 text-sm font-bold transition-colors ${mode === m ? 'bg-[var(--color-navy)] text-white' : ''}`}
          >
            {m === 'subscribe' ? `Subscribe & Save up to ${maxSavingPercent(product)}%` : 'One-Time Purchase'}
          </button>
        ))}
      </div>

      <div className="mt-4 space-y-3">
        {options.map((o) => {
          const selected = pack.bottles === o.bottles;
          const saving = Math.round((1 - o.pricePerBottle / product.basePrice) * 100);
          return (
            <label
              key={o.bottles}
              className={`flex cursor-pointer items-center justify-between rounded-2xl border-2 p-4 ${
                selected ? 'border-[var(--color-navy)] bg-[var(--color-soft)]' : 'border-[var(--color-line)]'
              }`}
            >
              <span className="flex items-center gap-3">
                <input type="radio" name="pack" checked={selected} onChange={() => setBottles(o.bottles)} className="accent-[var(--color-navy)]" />
                <span>
                  <span className="block font-bold">
                    {o.bottles} {o.bottles === 1 ? 'Bottle' : 'Bottles'}
                    {saving > 0 && (
                      <span className="ml-2 rounded-full bg-[var(--color-green)] px-2 py-0.5 text-[10px] font-bold uppercase text-white">
                        Save {saving}%
                      </span>
                    )}
                  </span>
                  <span className="text-xs text-[var(--color-muted)]">
                    {o.bottles * product.servings}-day supply
                  </span>
                </span>
              </span>
              <span className="text-right">
                <span className="block font-bold">
                  {mode === 'subscribe' && o.pricePerBottle < product.basePrice && (
                    <s className="mr-1.5 text-sm font-normal text-[var(--color-muted)]">{formatPrice(product.basePrice)}</s>
                  )}
                  {formatPrice(o.pricePerBottle)}
                </span>
                <span className="text-xs text-[var(--color-muted)]">per bottle</span>
              </span>
            </label>
          );
        })}
      </div>

      {mode === 'subscribe' && (
        <div className="mt-4 rounded-2xl bg-[var(--color-soft)] p-4">
          <ul className="grid gap-2 text-sm sm:grid-cols-2">
            {PERKS.map((p) => (
              <li key={p} className="flex items-center gap-2">
                <Check className="h-4 w-4 text-[var(--color-green)]" /> {p}
              </li>
            ))}
          </ul>
          <label className="mt-4 flex items-center justify-between text-sm font-semibold">
            Deliver every
            <select
              value={frequency}
              onChange={(e) => setFrequency(Number(e.target.value) as Frequency)}
              className="rounded-full border border-[var(--color-line)] bg-white px-4 py-2"
            >
              {[30, 60, 90].map((d) => (
                <option key={d} value={d}>
                  {d} days
                </option>
              ))}
            </select>
          </label>
        </div>
      )}

      <button ref={mainButton} disabled={!active} onClick={add} className="btn btn-primary mt-5 w-full text-lg disabled:opacity-50">
        {label}
      </button>

      {active && !buttonVisible && (
        <div className="fixed inset-x-0 bottom-0 z-30 flex items-center gap-3 border-t border-[var(--color-line)] bg-white/95 px-4 py-3 backdrop-blur md:hidden">
          <div className="min-w-0 flex-1 text-sm">
            <p className="truncate font-bold">{product.name}</p>
            <p className="text-xs text-[var(--color-muted)]">
              {pack.bottles} {pack.bottles === 1 ? 'bottle' : 'bottles'} · {mode === 'subscribe' ? `every ${frequency} days` : 'one-time'}
            </p>
          </div>
          <button onClick={add} className="btn btn-primary shrink-0 px-5 py-3 text-sm">
            Add — {formatPrice(pack.pricePerBottle * pack.bottles)}
          </button>
        </div>
      )}

      <div className="mt-4 flex flex-wrap justify-center gap-1.5">
        {PAYMENT_METHODS.map((m) => (
          <span key={m} className="rounded border border-[var(--color-line)] px-2 py-0.5 text-[10px] font-semibold text-[var(--color-muted)]">
            {m}
          </span>
        ))}
      </div>
    </div>
  );
}

export function InfoTabs({ product }: { product: Product }) {
  const tabs = [
    {
      label: 'Benefits',
      body: (
        <ul className="space-y-2">
          {product.benefits.map((b) => (
            <li key={b} className="flex gap-2">
              <Check className="mt-0.5 h-5 w-5 shrink-0 text-[var(--color-green)]" /> {b}*
            </li>
          ))}
        </ul>
      ),
    },
    { label: 'Description', body: <p>{product.description}</p> },
    { label: "Who's It For", body: <p>{product.whoFor}</p> },
    {
      label: 'Ingredients',
      body: (
        <div>
          <table className="w-full text-sm">
            <tbody>
              {product.ingredients.map((i) => (
                <tr key={i.name} className="border-b border-[var(--color-line)]">
                  <td className="py-2 font-semibold">{i.name}</td>
                  <td className="py-2 text-right">{i.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-3 text-sm text-[var(--color-muted)]">Other ingredients: {product.otherIngredients}</p>
          <p className="mt-1 text-sm text-[var(--color-muted)]">How to take: {product.dosage}</p>
        </div>
      ),
    },
  ];
  const [active, setActive] = useState(0);
  const id = useId();
  // WAI-ARIA tabs: arrow keys move between tabs.
  const onKey = (e: React.KeyboardEvent) => {
    const step = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
    if (!step) return;
    const next = (active + step + tabs.length) % tabs.length;
    setActive(next);
    document.getElementById(`${id}-tab-${next}`)?.focus();
  };

  return (
    <div>
      <div role="tablist" aria-label="Product details" onKeyDown={onKey} className="no-scrollbar flex gap-6 overflow-x-auto border-b border-[var(--color-line)]">
        {tabs.map((t, i) => (
          <button
            key={t.label}
            id={`${id}-tab-${i}`}
            role="tab"
            aria-selected={i === active}
            aria-controls={`${id}-panel`}
            tabIndex={i === active ? 0 : -1}
            onClick={() => setActive(i)}
            className={`-mb-px shrink-0 border-b-2 pb-3 text-sm font-bold ${
              i === active ? 'border-[var(--color-navy)] text-[var(--color-navy)]' : 'border-transparent text-[var(--color-muted)]'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div id={`${id}-panel`} role="tabpanel" aria-labelledby={`${id}-tab-${active}`} tabIndex={0} className="pt-5 text-[var(--color-ink)]">
        {tabs[active].body}
      </div>
    </div>
  );
}

export function TrackViewItem({ product }: { product: Product }) {
  useEffect(() => track({ name: 'view_item', item: { id: product.slug, name: product.name, price: product.basePrice } }), [product.slug, product.name, product.basePrice]);
  return null;
}
