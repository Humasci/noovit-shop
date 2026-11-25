import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Your Account | Noovit',
  description: 'See your Noovit orders, tracking and subscriptions. We email you a secure sign-in link, no password needed.',
  robots: { index: false, follow: true },
};

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return children;
}
