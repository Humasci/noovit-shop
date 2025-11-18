import React from 'react';
import Link from 'next/link';
import { Mail, Instagram, Facebook, Twitter } from 'lucide-react';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[var(--color-charcoal)] text-white">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold" style={{ fontFamily: 'Poppins, sans-serif', color: 'var(--color-sage-light)' }}>
              Noovit
            </h3>
            <p className="text-gray-300 text-sm">
              Natural supplements for focus, energy, and wellness. Science-backed. Pure ingredients.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-[var(--color-sage-light)] transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-[var(--color-sage-light)] transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-[var(--color-sage-light)] transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h4 className="font-semibold mb-4 text-[var(--color-sage-light)]">Shop</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/shop?category=focus" className="text-gray-300 hover:text-white transition-colors">
                  Focus & Cognition
                </Link>
              </li>
              <li>
                <Link href="/shop?category=energy" className="text-gray-300 hover:text-white transition-colors">
                  Energy
                </Link>
              </li>
              <li>
                <Link href="/shop?category=sleep" className="text-gray-300 hover:text-white transition-colors">
                  Sleep Support
                </Link>
              </li>
              <li>
                <Link href="/shop?category=recovery" className="text-gray-300 hover:text-white transition-colors">
                  Recovery
                </Link>
              </li>
              <li>
                <Link href="/shop?category=nutrition" className="text-gray-300 hover:text-white transition-colors">
                  Nutrition
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-semibold mb-4 text-[var(--color-sage-light)]">Company</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-gray-300 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/learn" className="text-gray-300 hover:text-white transition-colors">
                  Learn
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-300 hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-semibold mb-4 text-[var(--color-sage-light)]">Stay Updated</h4>
            <p className="text-gray-300 text-sm mb-4">
              Subscribe to get special offers and wellness tips.
            </p>
            <form className="flex flex-col space-y-2">
              <input
                type="email"
                placeholder="Your email"
                className="px-4 py-2 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--color-sage-light)]"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-[var(--color-sage)] hover:bg-[var(--color-sage-light)] rounded-lg font-medium transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
          <p>&copy; {currentYear} Noovit. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="/privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms of Service
            </Link>
            <Link href="/shipping" className="hover:text-white transition-colors">
              Shipping Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
