'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { User, Package, Settings, CreditCard } from 'lucide-react';

export default function AccountPage() {
  return (
    <div className="min-h-screen bg-[var(--color-cream)] py-12">
      <div className="container mx-auto px-6">
        <h1 className="text-4xl font-bold mb-8">My Account</h1>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl p-8 shadow-sm text-center mb-8">
            <div className="mb-6">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[var(--color-primary)] mb-4">
                <User className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold mb-4">Account Features Coming Soon</h2>
              <p className="text-[var(--color-stone)] mb-6">
                We&apos;re building a comprehensive account dashboard where you&apos;ll be able to manage
                your orders, subscriptions, and preferences.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-[var(--color-mist)] rounded-lg">
                  <Package className="w-6 h-6 text-[var(--color-primary)]" />
                </div>
                <h3 className="text-xl font-semibold">Order History</h3>
              </div>
              <p className="text-[var(--color-stone)] text-sm">
                Track your past and current orders
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-[var(--color-mist)] rounded-lg">
                  <CreditCard className="w-6 h-6 text-[var(--color-primary)]" />
                </div>
                <h3 className="text-xl font-semibold">Subscriptions</h3>
              </div>
              <p className="text-[var(--color-stone)] text-sm">
                Manage your recurring orders
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-[var(--color-mist)] rounded-lg">
                  <Settings className="w-6 h-6 text-[var(--color-primary)]" />
                </div>
                <h3 className="text-xl font-semibold">Account Settings</h3>
              </div>
              <p className="text-[var(--color-stone)] text-sm">
                Update your profile and preferences
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-[var(--color-mist)] rounded-lg">
                  <User className="w-6 h-6 text-[var(--color-primary)]" />
                </div>
                <h3 className="text-xl font-semibold">Addresses</h3>
              </div>
              <p className="text-[var(--color-stone)] text-sm">
                Manage shipping and billing addresses
              </p>
            </div>
          </div>

          <div className="mt-8 text-center">
            <Link href="/shop">
              <Button variant="primary" size="lg">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
