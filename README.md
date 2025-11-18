# Noovit E-Commerce Website

A modern, full-featured e-commerce website for **Noovit**, a premium supplement brand focused on natural wellness products. Built with Next.js 14, TypeScript, and Tailwind CSS.

## Overview

Noovit is a health and wellness brand offering science-backed supplements including Lion's Mane, Spirulina, Moringa, Melatonin, and Creatine. The website provides a seamless shopping experience with features like product filtering, shopping cart, subscription options, and more.

## Features

### Completed Features

- **Homepage**: Beautiful hero section with featured products and value propositions
- **Product Catalog**: Filterable shop page with category navigation
- **Product Detail Pages**: Comprehensive product information with benefits, ingredients, and dosage
- **Shopping Cart**: Full cart management with subscription toggle and quantity controls
- **About Page**: Brand story and company values
- **Contact Page**: Contact form and business information
- **Learn Section**: Educational content about wellness and supplements
- **Responsive Design**: Mobile-first approach with smooth animations
- **State Management**: Zustand for cart persistence
- **Design System**: Custom color palette aligned with wellness branding

### Coming Soon

- **Stripe Integration**: Secure payment processing
- **User Authentication**: Account creation and login
- **Order Management**: Track orders and subscriptions
- **Email Marketing**: Klaviyo/Mailchimp integration
- **Product Reviews**: Customer testimonials and ratings
- **Blog CMS**: Full blog functionality with categories

## Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Notifications**: [React Hot Toast](https://react-hot-toast.com/)
- **Payment Processing**: Stripe (integration pending)

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/noovit-shop.git
cd noovit-shop
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
noovit-shop/
├── app/                      # Next.js app directory
│   ├── about/               # About page
│   ├── account/             # Account management (placeholder)
│   ├── cart/                # Shopping cart page
│   ├── checkout/            # Checkout page (placeholder)
│   ├── contact/             # Contact page
│   ├── learn/               # Blog/learning resources
│   ├── products/[slug]/     # Dynamic product pages
│   ├── shop/                # Product catalog
│   ├── layout.tsx           # Root layout with Header/Footer
│   ├── page.tsx             # Homepage
│   └── globals.css          # Global styles and design system
├── components/              # React components
│   ├── layout/             # Header, Footer
│   ├── product/            # ProductCard
│   └── ui/                 # Reusable UI components (Button, etc.)
├── data/                   # Product data and content
├── lib/                    # Utilities and configurations
│   ├── store/             # Zustand stores
│   └── utils/             # Helper functions
├── types/                  # TypeScript type definitions
└── public/                 # Static assets
```

## Design System

### Color Palette

The Noovit brand uses a natural, calming color palette:

- **Primary (Sage)**: `#7a9b7f` - Main brand color
- **Earth**: `#d4c5b0` - Secondary accent
- **Clay**: `#b89b7c` - Tertiary accent
- **Cream**: `#faf8f5` - Background
- **Charcoal**: `#2d2d2d` - Text

### Typography

- **Headings**: Poppins (bold, modern)
- **Body**: Inter (clean, readable)

## Key Pages

1. **Homepage** (`/`): Hero section, featured products, categories, testimonials
2. **Shop** (`/shop`): All products with category filtering
3. **Product Detail** (`/products/[slug]`): Full product information
4. **Cart** (`/cart`): Review items and proceed to checkout
5. **About** (`/about`): Brand story and values
6. **Contact** (`/contact`): Contact form and information
7. **Learn** (`/learn`): Educational content

## Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Adding Products

Products are defined in `data/products.ts`. To add a new product:

1. Add product object to the `products` array
2. Include all required fields (name, price, category, etc.)
3. Add product images to the `public/products/` directory

### Customization

- **Colors**: Edit CSS variables in `app/globals.css`
- **Components**: Modify components in `components/` directory
- **Product Data**: Update `data/products.ts`
- **Types**: Add/modify types in `types/index.ts`

## Future Enhancements

- [ ] Stripe payment integration
- [ ] User authentication (NextAuth.js)
- [ ] Product reviews and ratings
- [ ] Wishlist functionality
- [ ] Advanced filtering (price range, benefits)
- [ ] Email marketing integration
- [ ] Blog CMS integration
- [ ] Product search functionality
- [ ] Related products recommendations
- [ ] Subscription management dashboard
- [ ] Order tracking
- [ ] Admin dashboard

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the project to [Vercel](https://vercel.com)
3. Configure environment variables
4. Deploy

### Other Platforms

The project can be deployed to any platform that supports Next.js:
- Netlify
- AWS Amplify
- Railway
- Digital Ocean

## License

This project is private and proprietary.

## Contact

For questions or support, contact: support@noovit.com
