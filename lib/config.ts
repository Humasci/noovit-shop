export const stripeConfigured = () => Boolean(process.env.STRIPE_SECRET_KEY);

export const dbConfigured = () => Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);

export const fulfilmentSupplier = () => process.env.FULFILMENT_SUPPLIER || 'manual';
