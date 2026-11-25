import 'server-only';

// "Continue with Google" for the customer account (26 Nov). Plain OAuth 2 code flow, no library: we ask Google only
// for the email address, then start the same session an emailed link would. On when both env values are set.
export const googleConfigured = () => Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);
export const GOOGLE_STATE_COOKIE = 'noovit_g_state';
export const googleRedirectUri = (origin: string) => `${origin}/api/account/google/callback`;

export function googleAuthUrl(origin: string, state: string) {
  const q = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID!,
    redirect_uri: googleRedirectUri(origin),
    response_type: 'code',
    scope: 'openid email',
    state,
    prompt: 'select_account',
  });
  return `https://accounts.google.com/o/oauth2/v2/auth?${q}`;
}

// Local end-to-end tests only (STRIPE_MOCK_PORT is never set in production): the token call goes to the fake server.
const tokenUrl = () => (process.env.STRIPE_MOCK_PORT && process.env.GOOGLE_TOKEN_URL) || 'https://oauth2.googleapis.com/token';

// Swaps the one-time code for Google's ID token and returns the verified email, or null. The token comes straight
// from Google over TLS in exchange for our client secret, so its claims are checked but its signature need not be
// (Google's OpenID Connect guide, "Obtain user information from the ID token").
export async function googleEmailFromCode(code: string, origin: string): Promise<string | null> {
  try {
    const res = await fetch(tokenUrl(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ code, client_id: process.env.GOOGLE_CLIENT_ID!, client_secret: process.env.GOOGLE_CLIENT_SECRET!, redirect_uri: googleRedirectUri(origin), grant_type: 'authorization_code' }),
      cache: 'no-store',
    });
    if (!res.ok) return null;
    const { id_token } = (await res.json()) as { id_token?: string };
    const part = id_token?.split('.')[1];
    if (!part) return null;
    const c = JSON.parse(Buffer.from(part, 'base64url').toString('utf8')) as { iss?: string; aud?: string; exp?: number; email?: string; email_verified?: boolean | string };
    const issOk = c.iss === 'https://accounts.google.com' || c.iss === 'accounts.google.com';
    const verified = c.email_verified === true || c.email_verified === 'true';
    if (!issOk || c.aud !== process.env.GOOGLE_CLIENT_ID || !c.exp || c.exp * 1000 < Date.now() || !verified || !c.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(c.email)) return null;
    return c.email.trim().toLowerCase();
  } catch (e) {
    console.error('Google sign-in failed', e);
    return null;
  }
}
