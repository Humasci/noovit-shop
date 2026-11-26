import { NextRequest, NextResponse } from 'next/server';
import { formLimited } from '@/lib/rate-limit';
import { db } from '@/lib/db/server';
import { dbConfigured } from '@/lib/config';
import { findProduct } from '@/data/products';
import { getStoreProducts } from '@/lib/catalog/server';
import { readReviewInvite } from '@/lib/reviews-invite';

export async function GET(req: NextRequest) {
  if (!dbConfigured()) return NextResponse.json({ reviews: [] });
  const slug = req.nextUrl.searchParams.get('slug');
  // free_product needs migration 0010; before it runs, read without it.
  const run = (cols: string) => {
    let query = db().from('reviews').select(cols).eq('status', 'approved').order('created_at', { ascending: false }).limit(50);
    if (slug) query = query.eq('product_slug', slug);
    return query;
  };
  let { data, error } = await run('id, product_slug, name, rating, title, body, verified_buyer, free_product, created_at');
  if (error && /free_product/.test(error.message)) ({ data, error } = await run('id, product_slug, name, rating, title, body, verified_buyer, created_at'));
  if (error) return NextResponse.json({ reviews: [] }, { status: 500 });
  return NextResponse.json({ reviews: data }, { headers: { 'Cache-Control': 's-maxage=300, stale-while-revalidate=600' } });
}

const clean = (v: unknown, max: number) => (typeof v === 'string' ? v.trim().slice(0, max) : '');

export async function POST(req: NextRequest) {
  if (!dbConfigured()) return NextResponse.json({ error: 'Reviews are not set up yet.' }, { status: 503 });
  const body = await req.json().catch(() => ({}));

  if (body.website) return NextResponse.json({ ok: true }); // honeypot: bots fill hidden fields

  // Reviewer programme: a personal invite link (free product). Name and email come from the invite, not the form.
  const invite = body.token ? readReviewInvite(String(body.token)) : null;
  if (body.token && !invite) return NextResponse.json({ error: 'This review link has expired. Please email hello@noovit.com.' }, { status: 400 });
  const slug = clean(body.slug, 100);
  const name = invite ? (clean(body.name, 80) || invite.n) : clean(body.name, 80);
  const email = invite ? invite.e : clean(body.email, 200).toLowerCase();
  if (invite && !invite.s.includes(slug)) return NextResponse.json({ error: 'This link is for other products.' }, { status: 400 });
  if (formLimited(req, 'reviews', email)) return NextResponse.json({ error: 'Too many requests. Please try again in a few minutes.' }, { status: 429 });
  const title = clean(body.title, 120);
  const text = clean(body.body, 2000);
  const rating = Number(body.rating);

  if (!findProduct(await getStoreProducts(), slug)) return NextResponse.json({ error: 'Please choose a product.' }, { status: 400 });
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

  if (invite) {
    const { data: dup } = await db().from('reviews').select('id').eq('email', email).eq('product_slug', slug).limit(1);
    if (dup?.length) return NextResponse.json({ error: 'You have already reviewed this product. Thank you!' }, { status: 409 });
  }

  const { error } = await db().from('reviews').insert({
    product_slug: slug,
    customer_id: purchase?.customer_id ?? null,
    name,
    email,
    rating,
    title,
    body: text,
    verified_buyer: Boolean(purchase),
    ...(invite ? { free_product: true } : {}),
  });
  // An invite review must carry its free-product label: never save one without it (needs migration 0010).
  if (error && invite && /free_product/.test(error.message)) return NextResponse.json({ error: 'Reviews from invite links open soon. Please try again in a day or two.' }, { status: 503 });
  if (error) return NextResponse.json({ error: 'Could not save your review.' }, { status: 500 });
  return NextResponse.json({ ok: true });
}
