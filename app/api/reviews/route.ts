import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/server';
import { dbConfigured } from '@/lib/config';
import { getProductBySlug } from '@/data/products';

export async function GET(req: NextRequest) {
  if (!dbConfigured()) return NextResponse.json({ reviews: [] });
  const slug = req.nextUrl.searchParams.get('slug');
  let query = db()
    .from('reviews')
    .select('id, product_slug, name, rating, title, body, verified_buyer, created_at')
    .eq('status', 'approved')
    .order('created_at', { ascending: false })
    .limit(50);
  if (slug) query = query.eq('product_slug', slug);
  const { data, error } = await query;
  if (error) return NextResponse.json({ reviews: [] }, { status: 500 });
  return NextResponse.json({ reviews: data }, { headers: { 'Cache-Control': 's-maxage=300, stale-while-revalidate=600' } });
}

const clean = (v: unknown, max: number) => (typeof v === 'string' ? v.trim().slice(0, max) : '');

export async function POST(req: NextRequest) {
  if (!dbConfigured()) return NextResponse.json({ error: 'Reviews are not set up yet.' }, { status: 503 });
  const body = await req.json().catch(() => ({}));

  if (body.website) return NextResponse.json({ ok: true }); // honeypot: bots fill hidden fields

  const slug = clean(body.slug, 100);
  const name = clean(body.name, 80);
  const email = clean(body.email, 200).toLowerCase();
  const title = clean(body.title, 120);
  const text = clean(body.body, 2000);
  const rating = Number(body.rating);

  if (!getProductBySlug(slug)) return NextResponse.json({ error: 'Please choose a product.' }, { status: 400 });
  if (!name || !title || !text || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Please fill in all fields.' }, { status: 400 });
  }
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) return NextResponse.json({ error: 'Invalid rating.' }, { status: 400 });

  const { data: purchase } = await db()
    .from('orders')
    .select('id, customer_id, order_items!inner(product_slug)')
    .eq('email', email)
    .eq('order_items.product_slug', slug)
    .limit(1)
    .maybeSingle();

  const { error } = await db().from('reviews').insert({
    product_slug: slug,
    customer_id: purchase?.customer_id ?? null,
    name,
    email,
    rating,
    title,
    body: text,
    verified_buyer: Boolean(purchase),
  });
  if (error) return NextResponse.json({ error: 'Could not save your review.' }, { status: 500 });
  return NextResponse.json({ ok: true });
}
