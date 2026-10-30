import type { Metadata } from 'next';
import { Funnel_Display, Inter, Manrope } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import { SITE_URL } from '@/lib/site';
import { getSettings } from '@/lib/settings';

const base: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'Noovit — Clean, Science-Driven Supplements',
  description:
    'Clean, evidence-based supplements for gut health, sleep, joints, skin, energy and performance. Subscribe & save, free US shipping, 90-day guarantee.',
  keywords: ['supplements', 'magnesium', 'probiotic', 'collagen', 'creatine', 'vitamin d3 k2', 'menopause supplement'],
  openGraph: { siteName: 'Noovit', type: 'website', locale: 'en_US' },
  twitter: { card: 'summary_large_image' },
};

// On every page, including the pre-launch "Coming soon" page Google sees while the store is hidden.
export async function generateMetadata(): Promise<Metadata> {
  const { google_site_verification } = await getSettings();
  return google_site_verification ? { ...base, verification: { google: google_site_verification } } : base;
}

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const manrope = Manrope({ subsets: ['latin'], variable: '--font-manrope', display: 'swap' });
const funnel = Funnel_Display({ subsets: ['latin'], variable: '--font-funnel', display: 'swap' });

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-US" className={`${inter.variable} ${manrope.variable} ${funnel.variable}`}>
      <body className="antialiased">
        {children}
        <Toaster position="top-center" containerStyle={{ zIndex: 70 }} />
      </body>
    </html>
  );
}
