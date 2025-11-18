'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ShoppingCart, Menu, X, User } from 'lucide-react';
import { useCart } from '@/lib/store/cart';

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const itemCount = useCart((state) => state.getItemCount());

  const navigation = [
    { name: 'Shop', href: '/shop' },
    { name: 'About', href: '/about' },
    { name: 'Learn', href: '/learn' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[var(--color-cream)] border-b border-[var(--color-mist)] backdrop-blur-sm bg-opacity-95">
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="text-3xl font-bold text-[var(--color-primary)]">
              <span style={{ fontFamily: 'Poppins, sans-serif' }}>Noovit</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-[var(--color-charcoal)] hover:text-[var(--color-primary)] font-medium transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-4">
            {/* Account Icon */}
            <Link
              href="/account"
              className="text-[var(--color-charcoal)] hover:text-[var(--color-primary)] transition-colors"
            >
              <User className="w-6 h-6" />
            </Link>

            {/* Cart Icon */}
            <Link
              href="/cart"
              className="relative text-[var(--color-charcoal)] hover:text-[var(--color-primary)] transition-colors"
            >
              <ShoppingCart className="w-6 h-6" />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-[var(--color-primary)] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-[var(--color-charcoal)] hover:text-[var(--color-primary)] transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-[var(--color-mist)] pt-4 animate-slide-in">
            <div className="flex flex-col space-y-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-[var(--color-charcoal)] hover:text-[var(--color-primary)] font-medium transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};
