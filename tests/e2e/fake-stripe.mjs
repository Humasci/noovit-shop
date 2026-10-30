// Minimal stateful fake of the Stripe endpoints the app calls, with realistic objects.
import http from 'http';

const price = (id, lookup, amount, meta, interval) => ({
  id, object: 'price', product: `noovit_${meta.slug}`, lookup_key: lookup, unit_amount: amount, currency: 'usd', nickname: lookup, active: true,
  recurring: interval ? { interval: 'day', interval_count: interval } : null, metadata: meta,
});
const PRICES = {
  price_mag1: price('price_mag1', 'noovit_magnesium-complex_once_1b', 3500, { slug: 'magnesium-complex', mode: 'one-time', bottles: '1' }),
  price_cre1: price('price_cre1', 'noovit_creatine_once_1b', 4000, { slug: 'creatine', mode: 'one-time', bottles: '1' }),
  price_pro2: price('price_pro2', 'noovit_probiotic-complex_sub_2b_60d', 6500, { slug: 'probiotic-complex', mode: 'subscribe', bottles: '2', frequency_days: '60' }, 60),
};
const STORE = { products: {}, coupons: [], promos: [] };
let seq = 0;

const address = { line1: '1 Main St', line2: 'Apt 4', city: 'Austin', state: 'TX', postal_code: '73301', country: 'US' };
const customer = { id: 'cus_1', object: 'customer', email: 'jane@example.com', name: 'Jane Doe', shipping: null };
let sub = {
  id: 'sub_1', object: 'subscription', customer: 'cus_1', status: 'active', cancel_at_period_end: false, pause_collection: null, metadata: {},
  items: { object: 'list', data: [{ id: 'si_1', price: PRICES.price_pro2, quantity: 1, current_period_end: 1800000000 }], has_more: false },
};
const session = (id, mode, extra = {}) => ({
  id, object: 'checkout.session', status: 'complete', payment_status: 'paid', mode, currency: 'usd',
  customer: 'cus_1', customer_details: { email: 'jane@example.com', name: 'Jane Doe' },
  collected_information: { shipping_details: { name: 'Jane Doe', address } },
  subscription: mode === 'subscription' ? 'sub_1' : null, invoice: mode === 'subscription' ? 'in_1' : null,
  payment_intent: mode === 'payment' ? 'pi_1' : null,
  amount_subtotal: mode === 'payment' ? 11000 : 6500, amount_total: mode === 'payment' ? 11908 : 7036,
  total_details: { amount_discount: 0, amount_tax: mode === 'payment' ? 908 : 536, amount_shipping: 0 },
  metadata: { age_confirmed: String(mode === 'payment') }, recovered_from: null, consent: null,
  ...extra,
});
const SESSIONS = {
  cs_pay: session('cs_pay', 'payment'),
  cs_sub: session('cs_sub', 'subscription'),
  cs_rec: session('cs_rec', 'payment', { payment_intent: 'pi_rec', recovered_from: 'cs_exp1', consent: { promotions: 'opt_in' }, customer_details: { email: 'sam@example.com', name: 'Sam Lee' }, amount_subtotal: 3500, amount_total: 3500, total_details: { amount_discount: 0, amount_tax: 0, amount_shipping: 0 } }),
};
const item = (id, qty, p, desc) => ({ id, object: 'item', quantity: qty, price: p, description: desc, amount_total: p.unit_amount * qty });
const LINES = {
  cs_pay: [item('li_1', 2, PRICES.price_mag1, 'Magnesium Complex'), item('li_2', 1, PRICES.price_cre1, 'Creatine')],
  cs_sub: [item('li_3', 1, PRICES.price_pro2, 'Probiotic Complex')],
  cs_rec: [item('li_4', 1, PRICES.price_mag1, 'Magnesium Complex')],
  cs_exp1: [item('li_5', 1, PRICES.price_mag1, 'Magnesium Complex')],
  cs_exp2: [item('li_6', 2, PRICES.price_mag1, 'Magnesium Complex')],
  cs_exp3: [item('li_7', 1, PRICES.price_cre1, 'Creatine')],
};
const list = (data) => ({ object: 'list', data, has_more: false, url: '/v1/x' });

function parseForm(body) {
  const out = {};
  for (const [k, v] of new URLSearchParams(body)) {
    const parts = k.replace(/\]/g, '').split('[');
    let o = out;
    parts.forEach((p, i) => {
      if (i === parts.length - 1) o[p] = v;
      else o = o[p] ??= {};
    });
  }
  return out;
}
const activeByLookup = (key) => Object.values(PRICES).find((x) => x.lookup_key === key && x.active);

http.createServer((req, res) => {
  let body = '';
  req.on('data', (c) => (body += c));
  req.on('end', () => {
    const url = new URL(req.url, 'http://x');
    const p = url.pathname;
    console.log(req.method, decodeURIComponent(req.url), body ? decodeURIComponent(body).slice(0, 900) : '', req.headers['idempotency-key'] ? `[idem ${req.headers['idempotency-key']}]` : '');
    const send = (code, obj) => { res.writeHead(code, { 'Content-Type': 'application/json' }); res.end(JSON.stringify(obj)); };
    const missing = (msg) => send(404, { error: { type: 'invalid_request_error', code: 'resource_missing', message: msg } });
    let m;

    // Klaviyo stand-in (KLAVIYO_API_BASE points here)
    if (p.startsWith('/api/') && req.method === 'POST') { res.writeHead(202, { 'Content-Type': 'application/json' }); return res.end('{}'); }

    // Prices
    if (req.method === 'GET' && p === '/v1/prices' && url.searchParams.get('product')) {
      return send(200, list(Object.values(PRICES).filter((x) => x.product === url.searchParams.get('product') && x.active)));
    }
    if (req.method === 'GET' && p === '/v1/prices') {
      const keys = [...url.searchParams.entries()].filter(([k]) => k.startsWith('lookup_keys')).map(([, v]) => v);
      return send(200, list(keys.map(activeByLookup).filter(Boolean)));
    }
    if (req.method === 'POST' && p === '/v1/prices') {
      const f = parseForm(body);
      if (f.transfer_lookup_key === 'true') for (const x of Object.values(PRICES)) if (x.lookup_key === f.lookup_key) x.lookup_key = null;
      const id = 'price_gen' + ++seq;
      PRICES[id] = {
        id, object: 'price', product: f.product, lookup_key: f.lookup_key, unit_amount: Number(f.unit_amount), currency: f.currency, nickname: f.nickname, active: true,
        recurring: f.recurring ? { interval: f.recurring.interval, interval_count: Number(f.recurring.interval_count) } : null, metadata: f.metadata ?? {},
      };
      return send(200, PRICES[id]);
    }
    if ((m = p.match(/^\/v1\/prices\/(\w+)$/))) {
      if (req.method === 'POST' && parseForm(body).active === 'false') PRICES[m[1]].active = false;
      return PRICES[m[1]] ? send(200, PRICES[m[1]]) : missing('No such price');
    }

    // Products
    if (p === '/v1/products' && req.method === 'POST') {
      const f = parseForm(body);
      STORE.products[f.id] = { id: f.id, object: 'product', name: f.name, active: f.active !== 'false', metadata: f.metadata ?? {}, images: f.images ? Object.values(f.images) : [] };
      return send(200, STORE.products[f.id]);
    }
    if (p === '/v1/products') return send(200, list(Object.values(STORE.products).filter((x) => x.active)));
    if ((m = p.match(/^\/v1\/products\/([\w-]+)$/))) {
      const prod = STORE.products[m[1]];
      if (!prod) return missing('No such product');
      if (req.method === 'POST') {
        const f = parseForm(body);
        Object.assign(prod, { name: f.name ?? prod.name, active: f.active !== 'false' });
        if (f.images) prod.images = Object.values(f.images);
      }
      return send(200, prod);
    }

    // Checkout
    if (req.method === 'POST' && p === '/v1/checkout/sessions') {
      // Remember what the app asked for so cs_new completes with the same metadata and discounts.
      const f = parseForm(body);
      const sub = f.mode === 'subscription';
      const discounts = f.discounts ? Object.values(f.discounts).map((d) => ({ coupon: d.coupon ?? null, promotion_code: d.promotion_code ?? null })) : [];
      const gross = sub ? 6500 : 7000;
      const off = discounts.length ? Math.round(gross * 0.1) : 0;
      SESSIONS.cs_new = session('cs_new', sub ? 'subscription' : 'payment', {
        customer_details: { email: 'fan@example.com', name: 'Fan One' },
        metadata: f.metadata ?? {}, discounts, payment_intent: sub ? null : 'pi_new',
        amount_subtotal: gross, amount_total: gross - off, total_details: { amount_discount: off, amount_tax: 0, amount_shipping: 0 },
      });
      LINES.cs_new = sub ? [item('li_n2', 1, PRICES.price_pro2, 'Probiotic Complex')] : [item('li_n1', 2, PRICES.price_mag1, 'Magnesium Complex')];
      return send(200, { id: 'cs_new', object: 'checkout.session', url: 'https://checkout.stripe.com/c/pay/cs_new' });
    }
    // Code typed at checkout (no share link): uses the newest promotion code; cs_self is the partner buying with their own code.
    if ((m = p.match(/^\/v1\/checkout\/sessions\/(cs_code|cs_self)$/))) {
      const promo = STORE.promos[STORE.promos.length - 1];
      const email = m[1] === 'cs_self' ? 'sarah@example.com' : 'buyer@example.com';
      const sess = session(m[1], 'payment', {
        customer: null, customer_details: { email, name: 'Buyer' }, payment_intent: m[1] === 'cs_self' ? 'pi_self' : 'pi_code', metadata: {},
        discounts: [{ coupon: null, promotion_code: promo?.id ?? null }],
        amount_subtotal: 3500, amount_total: 3150, total_details: { amount_discount: 350, amount_tax: 0, amount_shipping: 0 },
      });
      return send(200, { ...sess, line_items: list(LINES.cs_rec) });
    }
    if ((m = p.match(/^\/v1\/checkout\/sessions\/(cs_code|cs_self)\/line_items$/))) return send(200, list(LINES.cs_rec));
    if ((m = p.match(/^\/v1\/promotion_codes\/(\w+)$/)) && req.method === 'POST') {
      const promo = STORE.promos.find((x) => x.id === m[1]);
      if (!promo) return missing('No such promotion code');
      const f = parseForm(body);
      if (f.active) promo.active = f.active === 'true';
      return send(200, promo);
    }
    if ((m = p.match(/^\/v1\/checkout\/sessions\/(\w+)\/line_items$/))) return LINES[m[1]] ? send(200, list(LINES[m[1]])) : missing('No such session');
    if ((m = p.match(/^\/v1\/checkout\/sessions\/(\w+)$/))) return SESSIONS[m[1]] ? send(200, { ...SESSIONS[m[1]], line_items: list(LINES[m[1]]) }) : missing('No such session');

    // Customers, subscriptions, invoices
    if (p === '/v1/customers/cus_1' && req.method === 'POST') { customer.shipping = { name: 'Jane Doe', address }; return send(200, customer); }
    if (p === '/v1/customers/cus_1') return send(200, customer);
    if (p === '/v1/customers') return send(200, list(url.searchParams.get('email') === 'jane@example.com' ? [customer] : []));
    if (p === '/v1/subscriptions/sub_1' && req.method === 'POST') {
      const params = new URLSearchParams(body);
      if (params.get('pause_collection[behavior]')) sub = { ...sub, pause_collection: { behavior: 'void' } };
      if (params.has('pause_collection') && params.get('pause_collection') === '') sub = { ...sub, pause_collection: null };
      if (params.get('cancel_at_period_end')) sub = { ...sub, cancel_at_period_end: params.get('cancel_at_period_end') === 'true' };
      return send(200, sub);
    }
    if (p === '/v1/subscriptions/sub_1' && req.method === 'DELETE') { sub = { ...sub, status: 'canceled' }; return send(200, sub); }
    if (p === '/v1/subscriptions/sub_1') return send(200, sub);
    if (p === '/v1/invoices/in_1') return send(200, { id: 'in_1', object: 'invoice', payments: list([{ payment: { payment_intent: 'pi_sub1' } }]) });
    // Full renewal invoice: the webhook re-fetches it rather than trusting the event payload.
    if (p === '/v1/invoices/in_2') return send(200, { id: 'in_2', object: 'invoice', billing_reason: 'subscription_cycle', customer: 'cus_1', customer_email: 'jane@example.com', currency: 'usd', subtotal: 6500, amount_paid: 6500, total_discount_amounts: [], total_taxes: [], parent: { subscription_details: { subscription: 'sub_1' } }, payments: list([{ payment: { payment_intent: 'pi_sub2' } }]) });
    if (p === '/v1/invoices/in_2/lines') return send(200, list([{ id: 'il_1', object: 'line_item', quantity: 1, pricing: { price_details: { price: 'price_pro2' } } }]));
    if (p === '/v1/refunds') return send(200, { id: 're_1', object: 'refund' });
    if (p === '/v1/billing_portal/sessions') return send(200, { id: 'bps_1', url: 'https://billing.stripe.com/p/session/test_123' });

    // Discounts
    if (p === '/v1/promotion_codes' && req.method === 'GET') return send(200, list(STORE.promos));
    if ((m = p.match(/^\/v1\/coupons\/([\w-]+)$/))) {
      const c = STORE.coupons.find((x) => x.id === m[1]);
      return c ? send(200, c) : missing('No such coupon');
    }
    if (p === '/v1/coupons') {
      const f = parseForm(body);
      const c = { id: f.id || 'co_' + ++seq, object: 'coupon', percent_off: f.percent_off ? Number(f.percent_off) : null, amount_off: f.amount_off ? Number(f.amount_off) : null, duration: f.duration, duration_in_months: f.duration_in_months ? Number(f.duration_in_months) : null };
      STORE.coupons.push(c);
      return send(200, c);
    }
    if (p === '/v1/promotion_codes') {
      const f = parseForm(body);
      const promo = {
        id: 'promo_' + ++seq, object: 'promotion_code', code: f.code, active: true, times_redeemed: 0,
        max_redemptions: f.max_redemptions ? Number(f.max_redemptions) : null, expires_at: f.expires_at ? Number(f.expires_at) : null,
        promotion: { type: 'coupon', coupon: STORE.coupons.find((c) => c.id === f.promotion.coupon) },
        restrictions: { minimum_amount: f.restrictions?.minimum_amount ? Number(f.restrictions.minimum_amount) : null, first_time_transaction: f.restrictions?.first_time_transaction === 'true' },
      };
      STORE.promos.push(promo);
      return send(200, promo);
    }
    send(404, { error: { message: `fake-stripe: unhandled ${req.method} ${p}` } });
  });
}).listen(12120, () => console.log('fake stripe on 12120'));
