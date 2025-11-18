import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "Noovit - Natural Supplements for Focus, Energy & Wellness",
  description: "Premium natural supplements backed by science. Enhance focus, energy, and overall well-being with Lion's Mane, Spirulina, Moringa, Melatonin, and Creatine.",
  keywords: ["supplements", "natural wellness", "nootropics", "lions mane", "spirulina", "moringa", "melatonin", "creatine"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Header />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
        <Toaster
          position="bottom-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: 'var(--color-charcoal)',
              color: 'white',
            },
            success: {
              iconTheme: {
                primary: 'var(--color-primary)',
                secondary: 'white',
              },
            },
          }}
        />
      </body>
    </html>
  );
}
