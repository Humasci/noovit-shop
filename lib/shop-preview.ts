// A readable hint cookie (not a credential) so the buy buttons show for staff and preview-link holders in coming-soon
// mode. Checkout itself still checks the signed, httpOnly admin/preview cookies (lib/launch-request.ts).
export const SHOP_PREVIEW_HINT = 'noovit_shop_preview';
