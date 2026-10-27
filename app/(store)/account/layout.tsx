import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Subscriptions — Noovit',
  description: 'Change, skip or cancel your Noovit subscription. We email you a secure sign-in link, no password needed.',
  robots: { index: false, follow: true },
};

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return children;
}
