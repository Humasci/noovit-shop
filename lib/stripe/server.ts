import Stripe from 'stripe';

let client: Stripe | undefined;

export function stripe() {
  if (!client) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) throw new Error('STRIPE_SECRET_KEY is not set');
    // STRIPE_MOCK_PORT points the client at a local stripe-mock server for testing.
    const mockPort = process.env.STRIPE_MOCK_PORT;
    client = new Stripe(key, mockPort ? { host: '127.0.0.1', port: Number(mockPort), protocol: 'http' } : undefined);
  }
  return client;
}
