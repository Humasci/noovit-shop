import type { Metadata } from 'next';
import Link from 'next/link';
import { Mail, Clock, RefreshCw } from 'lucide-react';
import { ContactForm } from '@/components/contact/ContactForm';
import { getSettings, supportEmail } from '@/lib/settings';

export const metadata: Metadata = {
  title: 'Contact Us — Noovit Customer Support',
  description: 'Questions about an order, a subscription or our supplements? Send us a message and we reply within one business day.',
  alternates: { canonical: '/contact' },
};

export default async function ContactPage() {
  const [email, settings] = await Promise.all([supportEmail(), getSettings()]);
  return (
    <>
      <section className="bg-[var(--color-soft)] py-16">
        <div className="container px-6">
          <h1 className="text-4xl md:text-5xl">Get in touch</h1>
          <p className="mt-3 max-w-2xl text-[var(--color-muted)]">Questions about an order, a subscription or a product? We reply within one business day.</p>
        </div>
      </section>

      <div className="container grid gap-10 px-6 py-16 lg:grid-cols-[1fr_2fr]">
        <aside className="space-y-6 text-sm">
          <div className="flex gap-4">
            <Mail className="h-5 w-5 shrink-0 text-[var(--color-accent)]" />
            <div>
              <h2 className="text-base">Email</h2>
              <a href={`mailto:${email}`} className="text-[var(--color-accent)] underline-offset-2 hover:underline">{email}</a>
            </div>
          </div>
          <div className="flex gap-4">
            <Clock className="h-5 w-5 shrink-0 text-[var(--color-accent)]" />
            <div>
              <h2 className="text-base">Hours</h2>
              <p className="text-[var(--color-muted)]">Monday to Friday, 9am–5pm ET</p>
            </div>
          </div>
          <div className="flex gap-4">
            <RefreshCw className="h-5 w-5 shrink-0 text-[var(--color-accent)]" />
            <div>
              <h2 className="text-base">Manage a subscription</h2>
              <p className="text-[var(--color-muted)]">
                Skip, change or cancel anytime from <Link href="/account" className="text-[var(--color-accent)] hover:underline">My Subscriptions</Link>.
              </p>
            </div>
          </div>
          {settings.business_address && <p className="text-[var(--color-muted)]">{settings.business_address}</p>}
        </aside>

        <div className="rounded-3xl border border-[var(--color-line)] p-6 md:p-8">
          <h2 className="mb-6 text-2xl">Send us a message</h2>
          <ContactForm email={email} />
        </div>
      </div>
    </>
  );
}
