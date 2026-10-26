export type Role = 'owner' | 'manager' | 'fulfilment';

export type Permission =
  | 'overview'
  | 'orders'
  | 'orders.money' // refunds, cancellations, manual orders
  | 'fulfilment'
  | 'subscriptions'
  | 'customers'
  | 'products'
  | 'reviews'
  | 'marketing' // discounts, subscribers, abandoned carts
  | 'content' // homepage, blog
  | 'reports'
  | 'settings'
  | 'staff';

const ALL: Permission[] = [
  'overview', 'orders', 'orders.money', 'fulfilment', 'subscriptions', 'customers', 'products',
  'reviews', 'marketing', 'content', 'reports', 'settings', 'staff',
];

export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  owner: ALL,
  manager: ALL.filter((p) => p !== 'staff'),
  fulfilment: ['overview', 'orders', 'fulfilment', 'customers'],
};

export const ROLE_LABELS: Record<Role, { label: string; description: string }> = {
  owner: { label: 'Owner', description: 'Everything, including staff accounts.' },
  manager: { label: 'Manager', description: 'Everything except managing staff.' },
  fulfilment: { label: 'Fulfilment', description: 'Orders, fulfilment and customers. No refunds, prices or marketing.' },
};

export const can = (role: Role, permission: Permission) => ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
