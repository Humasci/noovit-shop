import { Product } from '@/types';

export interface OrderLine {
  product_slug: string;
  product_name: string;
  supplier_sku: string | null;
  bottles: number;
  quantity: number;
}

export interface ShipLine {
  name: string;
  sku: string | null;
  units: number;
  bundle?: string;
}

// What the supplier actually ships: bundles become their component products.
export function shipLines(items: OrderLine[], catalog: Product[], currentSku: Map<string, string | null>): ShipLine[] {
  const bySlug = new Map(catalog.map((p) => [p.slug, p]));
  return items.flatMap((i) => {
    const bundle = bySlug.get(i.product_slug)?.bundleItems;
    if (!bundle?.length) {
      return [{ name: i.product_name, sku: i.supplier_sku ?? currentSku.get(i.product_slug) ?? null, units: i.bottles * i.quantity }];
    }
    return bundle.map((b) => ({
      name: bySlug.get(b.slug)?.name ?? b.slug,
      sku: currentSku.get(b.slug) ?? null,
      units: b.quantity * i.bottles * i.quantity,
      bundle: i.product_name,
    }));
  });
}
