# IHD Lab "LabFlow" partner API: notes for the kit integration (25 Nov 2026)

Read from the public docs at https://labflow.ihdlab.com/ (v4 reference, first 100k characters) and
https://www.ihdlab.com/digital-health-partners. No sandbox access yet; confirm the open points with IHD.

## What it offers
- **Two ways to order:** the partner portal (manual), or the REST API. Both exist, so launch can start on the portal.
- **API versions:** v3 (default: orders, kits, inbox polling, providers) and v4 (opt-in per organization: FHIR-shaped JSON,
  signed webhooks, event outbox). Same key for both, sent as the `x-api-key` header. Keys arrive through a one-time link at onboarding.
- **Hosts (v4):** staging `https://labflow-staging.ihdlab.com/api/v4/partner`, production `https://labflow.ihdlab.com/api/v4/partner`.
- **Fulfilment:** IHD's own 3PL ships the kit (generic or white-labeled box), overnight, with return shipping.
- **Results:** to our platform by API, or patients view them in IHD's HIPAA portal. Most results 24–72 hours after the sample arrives.
- **Compliance:** CLIA 05D2040304, California licence, FDA registration; New York and Maryland licences listed. CAP and BAA terms not stated: ask.

## v4 endpoints we would use
| Call | Use |
|---|---|
| `POST /orders/kit` | Create a kit order after a paid checkout (`serviceRequest`, `recipient` with name and address) |
| `GET /orders/{orderId}`, `GET /orders` | Order status for Admin |
| `GET /practitioners` | The ordering providers on our account (for `serviceRequest.requester`) |
| `POST /webhooks/endpoints` | Register our webhook; returns a signing secret once |
| `GET /events` | Event log, to reconcile missed webhooks |

**Webhooks:** `order.created`, `order.registered`, `order.status.changed`, `order.shipment.updated`, `order.received`,
`order.rejected`, `order.resulted`, `order.cancelled`, `order.documents.available`. Signed with HMAC-SHA256 over
`{X-LabFlow-Timestamp}.{rawBody}` (header `X-LabFlow-Signature: v1,<hex>`); de-duplicate on `X-LabFlow-Event-Id`; reject
timestamps older than 5 minutes; answer 2xx within 30 seconds (retries up to 10 times). Payloads are "summary" tier: no patient details.

## How it maps onto the site (plan)
1. **Launch (manual):** paid kit orders appear in Admin → Fulfilment like supplement orders; the owner enters them in IHD's portal.
2. **Phase 2 (API, about 2–3 days of work once sandbox access exists):** on `checkout.session.completed` for a kit, call
   `POST /orders/kit`; store IHD's order id on the order; a new `/api/ihd/webhook` route updates status and sends the
   "kit shipped / sample received / results ready" emails from noovit.com (never naming the test in the subject).
3. **Results stay with IHD** (their portal). We store status only, never results, so we stay outside HIPAA-covered data
   and the FTC Health Breach Notification Rule exposure stays small.

## Open questions for IHD
- Is v4 enabled for new partners, and can we get staging access now?
- Does the patient register the kit (date of birth, sex) on IHD's portal, or must we collect it at checkout?
- Who is the ordering provider on consumer orders: their physician network automatically, or one we pick from `GET /practitioners`?
- State exclusions at order time (does the API reject NY/NJ/RI, or must we block them at checkout?).
- No idempotency key is documented for `POST /orders/kit`: how do they prevent duplicate orders on a retry?
