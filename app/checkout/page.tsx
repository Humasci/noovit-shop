'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { CreditCard, Lock } from 'lucide-react';

export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-[var(--color-cream)] py-12">
      <div className="container mx-auto px-6">
        <h1 className="text-4xl font-bold mb-8">Secure Checkout</h1>

        <div className="max-w-2xl mx-auto bg-white rounded-xl p-8 shadow-sm text-center">
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[var(--color-primary)] mb-4">
              <Lock className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold mb-4">Checkout Coming Soon</h2>
            <p className="text-[var(--color-stone)] mb-6">
              We&apos;re currently setting up our secure Stripe payment integration. This page will enable
              you to complete your purchase with confidence.
            </p>
          </div>

          <div className="border-t border-[var(--color-mist)] pt-6 mb-6">
            <h3 className="font-semibold mb-4 flex items-center justify-center gap-2">
              <CreditCard className="w-5 h-5" />
              Upcoming Payment Options
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-[var(--color-stone)]">
              <div>Credit Card</div>
              <div>PayPal</div>
              <div>Apple Pay</div>
              <div>Google Pay</div>
            </div>
          </div>

          <Link href="/cart">
            <Button variant="primary" size="lg">
              Back to Cart
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
