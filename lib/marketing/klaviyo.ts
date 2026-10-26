import 'server-only';
import { getSettings } from '@/lib/settings';

// Optional Klaviyo sync. Needs KLAVIYO_PRIVATE_KEY (env, secret) and a list ID in Admin → Settings.
// Every call is fire-and-forget: Klaviyo being down must never break checkout or sign-up.
const REVISION = '2026-10-15';
const BASE = () => process.env.KLAVIYO_API_BASE || 'https://a.klaviyo.com';

export const klaviyoConfigured = () => Boolean(process.env.KLAVIYO_PRIVATE_KEY);

async function call(path: string, body: unknown) {
  const key = process.env.KLAVIYO_PRIVATE_KEY;
  if (!key) return;
  try {
    const res = await fetch(`${BASE()}/api/${path}`, {
      method: 'POST',
      headers: {
        Authorization: `Klaviyo-API-Key ${key}`,
        revision: REVISION,
        'Content-Type': 'application/vnd.api+json',
        Accept: 'application/vnd.api+json',
      },
      body: JSON.stringify(body),
    });
    if (!res.ok) console.error(`Klaviyo ${path} failed: ${res.status} ${(await res.text()).slice(0, 300)}`);
  } catch (err) {
    console.error(`Klaviyo ${path} failed`, err);
  }
}

async function listRelationship() {
  const listId = (await getSettings()).klaviyo_list_id;
  return listId ? { list: { data: { type: 'list', id: listId } } } : null;
}

export async function klaviyoSubscribe(email: string, source: string) {
  const relationships = await listRelationship();
  if (!relationships) return;
  await call('profile-subscription-bulk-create-jobs', {
    data: {
      type: 'profile-subscription-bulk-create-job',
      attributes: {
        custom_source: `Noovit ${source}`,
        profiles: { data: [{ type: 'profile', attributes: { email, subscriptions: { email: { marketing: { consent: 'SUBSCRIBED' } } } } }] },
      },
      relationships,
    },
  });
}

export async function klaviyoUnsubscribe(email: string) {
  const relationships = await listRelationship();
  if (!relationships) return;
  await call('profile-subscription-bulk-delete-jobs', {
    data: {
      type: 'profile-subscription-bulk-delete-job',
      attributes: { profiles: { data: [{ type: 'profile', attributes: { email } }] } },
      relationships,
    },
  });
}

export async function klaviyoEvent(metric: string, email: string, uniqueId: string, value: number, properties: Record<string, unknown>) {
  await call('events', {
    data: {
      type: 'event',
      attributes: {
        properties,
        metric: { data: { type: 'metric', attributes: { name: metric } } },
        profile: { data: { type: 'profile', attributes: { email } } },
        value,
        value_currency: 'USD',
        unique_id: uniqueId,
      },
    },
  });
}
