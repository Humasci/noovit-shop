import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  title: 'Noovit — Clean, Science-Driven Supplements',
  description:
    'Nutritionist-formulated, third-party tested supplements for gut health, sleep, joints, skin, energy and performance. Subscribe & save, 90-day guarantee.',
  keywords: ['supplements', 'magnesium', 'probiotic', 'collagen', 'creatine', 'vitamin d3 k2', 'menopause supplement'],
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
