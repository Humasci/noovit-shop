'use client';

import { useState, useSyncExternalStore } from 'react';
import { Check, Truck } from 'lucide-react';
import { Frequency, Product, PurchaseMode } from '@/types';
import { packOptions, maxSavingPercent } from '@/data/products';
import { PAYMENT_METHODS } from '@/data/content';
import toast from 'react-hot-toast';
import { useCart, cartFrequency } from '@/lib/store/cart';
import { formatPrice } from '@/lib/utils/format';

import { ProductImage, ImageVariant } from './ProductImage';

const VARIANTS: ImageVariant[] = ['front', 'capsules', 'duo', 'facts'];

export function Gallery({ product }: { product: Product }) {
  const [active, setActive] = useState(0);
  return (
    <div>
      <div className="overflow-hidden rounded-3xl bg-[var(--color-soft)]">
        <ProductImage product={product} variant={VARIANTS[active]} className="aspect-square w-full" />
      </div>
      <div className="mt-4 grid grid-cols-4 gap-3">
        {VARIANTS.map((v, i) => (
          <button
            key={v}
            onClick={() => setActive(i)}
            className={`overflow-hidden rounded-xl border-2 ${i === active ? 'border-[var(--color-navy)]' : 'border-transparent'}`}
            aria-label={`Show image ${i + 1}`}
          >
            <ProductImage product={product} variant={v} className="aspect-square w-full" />
          </button>
        ))}
      </div>
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

const PERKS = ['Change or cancel anytime', 'Price locked in for life', '90-day money-back guarantee', 'Priority customer support'];

export function PurchaseBox({ product }: { product: Product }) {
  const [mode, setMode] = useState<PurchaseMode>('subscribe');
  const [packIdx, setPackIdx] = useState(0);
  const [frequency, setFrequency] = useState<Frequency>(30);
  const addItem = useCart((s) => s.addItem);

  const options = packOptions(product, mode);
  const pack = options[Math.min(packIdx, options.length - 1)];

  return (
    <div>
      <p className="mb-5 flex items-center gap-2 text-sm">
        <Truck className="h-4 w-4 text-[var(--color-green)]" />
        Free delivery
        <DeliveryEstimate />
      </p>

      <div className="grid grid-cols-2 gap-2 rounded-full bg-[var(--color-soft)] p-1">
        {(['subscribe', 'one-time'] as const).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`rounded-full px-3 py-2.5 text-sm font-bold transition-colors ${mode === m ? 'bg-[var(--color-navy)] text-white' : ''}`}
          >
            {m === 'subscribe' ? `Subscribe & Save up to ${maxSavingPercent(product)}%` : 'One-Time Purchase'}
          </button>
        ))}
      </div>

      <div className="mt-4 space-y-3">
        {options.map((o, i) => {
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
                <input type="radio" name="pack" checked={selected} onChange={() => setPackIdx(i)} className="accent-[var(--color-navy)]" />
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
                    {o.bottles * product.servings}-day supply{i === 0 ? ' · Free shipping' : ''}
                  </span>
                </span>
              </span>
              <span className="text-right">
                <span className="block font-bold">{formatPrice(o.pricePerBottle)}</span>
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

      <button
        onClick={() => {
          const current = cartFrequency(useCart.getState().items);
          if (mode === 'subscribe' && current && current !== frequency) {
            toast(`All subscription items in your cart will now arrive every ${frequency} days.`);
          }
          addItem({ product, mode, bottles: pack.bottles, pricePerBottle: pack.pricePerBottle, frequency: mode === 'subscribe' ? frequency : undefined });
        }}
        className="btn btn-primary mt-5 w-full text-lg"
      >
        Add to Cart — {formatPrice(pack.pricePerBottle * pack.bottles)}
      </button>

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
              <Check className="mt-0.5 h-5 w-5 shrink-0 text-[var(--color-green)]" /> {b}
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

  return (
    <div>
      <div className="no-scrollbar flex gap-6 overflow-x-auto border-b border-[var(--color-line)]">
        {tabs.map((t, i) => (
          <button
            key={t.label}
            onClick={() => setActive(i)}
            className={`-mb-px shrink-0 border-b-2 pb-3 text-sm font-bold ${
              i === active ? 'border-[var(--color-navy)] text-[var(--color-navy)]' : 'border-transparent text-[var(--color-muted)]'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="pt-5 text-[var(--color-ink)]">{tabs[active].body}</div>
    </div>
  );
}
