'use client';

import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { Check, RefreshCw, ShieldCheck, Truck } from 'lucide-react';
import { Frequency, Product, PurchaseMode } from '@/types';
import { packOptions, maxSavingPercent } from '@/data/products';
import { PAYMENT_METHODS } from '@/data/content';
import toast from 'react-hot-toast';
import { track } from '@/lib/analytics';
import { useCart, cartFrequency } from '@/lib/store/cart';
import { formatPrice } from '@/lib/utils/format';

import { ProductImage, ImageVariant } from './ProductImage';

const VARIANTS: ImageVariant[] = ['front', 'duo', 'facts'];

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
      <div className="overflow-hidden rounded-lg border border-[var(--color-line)] bg-[var(--color-soft)]">{slide(Math.min(active, count - 1), 'aspect-square w-full', true)}</div>
      {count > 1 && (
        <div className="mt-4 grid grid-cols-4 gap-3">
          {Array.from({ length: count }, (_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`overflow-hidden rounded border-2 ${i === active ? 'border-[var(--color-navy)]' : 'border-transparent'}`}
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

const PERKS = ['Change, skip or cancel anytime online', 'Free US shipping on every delivery', '90-day money-back guarantee'];

// Plan selector, add to cart and sticky bars (The Absorption Company layout, Noovit colours).
// One-time is the default so the first price matches the Google Shopping feed and nothing is pre-selected
// into a recurring charge; the best-value pack is highlighted, not pre-selected.
export function PurchaseBox({ product, sections = [] }: { product: Product; sections?: { id: string; label: string }[] }) {
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
  const bundle = Boolean(product.bundleItems?.length);
  const best = options.length > 1 ? options[options.length - 1].bottles : null;
  const unit = bundle ? 'bundle' : 'bottle';

  // The main button can be far down on phones; sticky bars stand in while it is off screen.
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
  const total = pack.pricePerBottle * pack.bottles;
  const label = active ? `Add to cart — ${formatPrice(total)}` : 'Out of stock';
  const packTitle = (n: number) => (bundle ? `Bundle of ${product.bundleItems!.length} bottles` : `${n} ${n === 1 ? 'Bottle' : 'Bottles'}`);

  return (
    <div>
      <p className="label-caps">Choose your plan</p>
      <div className="mt-3 grid grid-cols-2 overflow-hidden rounded border border-[var(--color-navy)]" role="group" aria-label="Purchase type">
        {(['one-time', 'subscribe'] as const).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            aria-pressed={mode === m}
            className={`px-3 py-2.5 text-sm font-semibold transition-colors ${mode === m ? 'bg-[var(--color-navy)] text-white' : 'bg-white text-[var(--color-navy)] hover:bg-[var(--color-soft)]'}`}
          >
            {m === 'subscribe' ? `Subscribe & save${bundle ? '' : ` up to ${maxSavingPercent(product)}%`}` : 'One-time purchase'}
          </button>
        ))}
      </div>

      <div className="mt-3 space-y-3">
        {options.map((o) => {
          const selected = pack.bottles === o.bottles;
          const compare = product.basePrice * o.bottles;
          const price = o.pricePerBottle * o.bottles;
          const saving = Math.round((1 - o.pricePerBottle / product.basePrice) * 100);
          return (
            <label
              key={o.bottles}
              className={`relative block cursor-pointer rounded-lg border p-4 transition-colors ${
                selected ? 'border-[1.5px] border-[var(--color-orange)] bg-[var(--color-pets-soft)]' : 'border-[var(--color-line)] bg-white hover:border-[var(--color-navy)]'
              }`}
            >
              {best === o.bottles && (
                <span className="absolute -top-px right-4 rounded-b bg-[var(--color-orange)] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[var(--color-navy)]">
                  Best value
                </span>
              )}
              <span className="flex items-center gap-3">
                <input type="radio" name="pack" checked={selected} onChange={() => setBottles(o.bottles)} className="h-4 w-4 accent-[var(--color-navy)]" />
                <span className="font-semibold">{packTitle(o.bottles)}</span>
                <span className="text-xs text-[var(--color-muted)]">{o.bottles * product.servings}-day supply</span>
              </span>
              <span className="mt-2 flex flex-wrap items-baseline gap-x-3 gap-y-1 pl-7">
                {saving > 0 && <span className="rounded-sm bg-[var(--color-navy)] px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider text-white">Save {saving}%</span>}
                <span className="text-xl font-semibold text-[var(--color-navy)]">{formatPrice(o.pricePerBottle)}</span>
                <span className="text-sm text-[var(--color-muted)]">/{unit}</span>
              </span>
              {(o.bottles > 1 || saving > 0) && (
                <span className="mt-1 flex flex-wrap items-baseline gap-x-2 pl-7 text-sm">
                  {saving > 0 && <s className="text-[var(--color-muted)]">{formatPrice(compare)}</s>}
                  <span className="font-semibold">{formatPrice(price)} total today</span>
                  {saving > 0 && <span className="font-semibold text-[var(--color-pets-dark)]">save {formatPrice(compare - price)}</span>}
                </span>
              )}
              {selected && mode === 'subscribe' && (
                <span className="mt-3 block border-t border-[var(--color-orange)]/30 pl-7 pt-3">
                  <span className="grid gap-1.5 text-sm">
                    {PERKS.map((p) => (
                      <span key={p} className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-[var(--color-pets-dark)]" /> {p}
                      </span>
                    ))}
                  </span>
                  <span className="mt-3 flex items-center justify-between text-sm font-semibold">
                    Deliver every
                    <select
                      value={frequency}
                      onChange={(e) => setFrequency(Number(e.target.value) as Frequency)}
                      onClick={(e) => e.preventDefault()}
                      className="rounded border border-[var(--color-line)] bg-white px-3 py-1.5"
                    >
                      {[30, 60, 90].map((d) => (
                        <option key={d} value={d}>{d} days</option>
                      ))}
                    </select>
                  </span>
                </span>
              )}
            </label>
          );
        })}
      </div>

      <button ref={mainButton} disabled={!active} onClick={add} className="btn btn-primary mt-5 w-full py-4 disabled:opacity-50">
        {label}
      </button>
      <p className="mt-2 text-center text-xs text-[var(--color-muted)]">
        <Truck className="mr-1 inline h-3.5 w-3.5" aria-hidden />
        Free US shipping
        <DeliveryEstimate />
      </p>

      <ul className="mt-5 grid grid-cols-3 divide-x divide-[var(--color-line)] border-y border-[var(--color-line)] py-3 text-center text-xs text-[var(--color-ink)]">
        <li className="flex flex-col items-center gap-1 px-2"><Truck className="h-5 w-5" strokeWidth={1.25} aria-hidden /> Free US shipping</li>
        <li className="flex flex-col items-center gap-1 px-2"><ShieldCheck className="h-5 w-5" strokeWidth={1.25} aria-hidden /> 90-day money-back</li>
        <li className="flex flex-col items-center gap-1 px-2"><RefreshCw className="h-5 w-5" strokeWidth={1.25} aria-hidden /> Cancel anytime</li>
      </ul>

      {active && !buttonVisible && (
        <>
          {/* Phones: compact add bar. */}
          <div className="fixed inset-x-0 bottom-0 z-30 flex items-center gap-3 border-t border-[var(--color-line)] bg-[var(--color-canvas)]/95 px-4 py-3 backdrop-blur md:hidden">
            <div className="min-w-0 flex-1 text-sm">
              <p className="truncate font-bold">{product.name}</p>
              <p className="text-xs text-[var(--color-muted)]">
                {packTitle(pack.bottles)} · {mode === 'subscribe' ? `every ${frequency} days` : 'one-time'}
              </p>
            </div>
            <button onClick={add} className="btn btn-primary shrink-0 px-5 py-3">Add — {formatPrice(total)}</button>
          </div>
          {/* Desktop: section tabs + mini product + add to cart. */}
          <div className="fixed inset-x-0 bottom-0 z-30 hidden border-t border-[var(--color-line)] bg-[var(--color-canvas)]/95 backdrop-blur md:block">
            <div className="container flex items-center gap-6 px-6 py-3">
              <nav aria-label="Product sections" className="flex flex-1 gap-6 overflow-x-auto text-sm font-semibold">
                {sections.map((s) => (
                  <a key={s.id} href={`#${s.id}`} className="whitespace-nowrap py-2 hover:text-[var(--color-accent)]">{s.label}</a>
                ))}
              </nav>
              <div className="flex items-center gap-3">
                <ProductImage product={product} sizes="48px" className="h-12 w-12 rounded" />
                <div className="text-sm leading-tight">
                  <p className="font-semibold">{product.name}</p>
                  <p className="text-xs text-[var(--color-muted)]">{packTitle(pack.bottles)} · {formatPrice(total)}</p>
                </div>
                <button onClick={add} className="btn btn-primary px-6 py-3">Add to cart</button>
              </div>
            </div>
          </div>
        </>
      )}

      <div className="mt-4 flex flex-wrap justify-center gap-1.5">
        {PAYMENT_METHODS.map((m) => (
          <span key={m} className="rounded-sm border border-[var(--color-line)] bg-white px-2 py-0.5 text-[10px] font-semibold text-[var(--color-muted)]">
            {m}
          </span>
        ))}
      </div>
    </div>
  );
}

export function TrackViewItem({ product }: { product: Product }) {
  useEffect(() => track({ name: 'view_item', item: { id: product.slug, name: product.name, price: product.basePrice } }), [product.slug, product.name, product.basePrice]);
  return null;
}
