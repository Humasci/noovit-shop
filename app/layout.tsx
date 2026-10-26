import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import { SITE_URL } from '@/lib/site';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'Noovit — Clean, Science-Driven Supplements',
  description:
    'Nutritionist-formulated, third-party tested supplements for gut health, sleep, joints, skin, energy and performance. Subscribe & save, 90-day guarantee.',
  keywords: ['supplements', 'magnesium', 'probiotic', 'collagen', 'creatine', 'vitamin d3 k2', 'menopause supplement'],
  openGraph: { siteName: 'Noovit', type: 'website', locale: 'en_US' },
  twitter: { card: 'summary_large_image' },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
        <Toaster position="bottom-center" />
      </body>
    </html>
  );
}
