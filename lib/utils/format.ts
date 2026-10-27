export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
};

export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
};

export const calculateDiscountPercentage = (
  originalPrice: number,
  currentPrice: number
): number => {
  return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
};

export const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-');
};

// Responsive srcset for Unsplash photos (their CDN resizes and serves AVIF/WebP); other URLs are left alone.
export function unsplashSrcSet(url: string, widths = [640, 828, 1200, 1920]) {
  if (!/^https:\/\/images\.unsplash\.com\//.test(url)) return undefined;
  const base = url.replace(/([?&])w=\d+&?/, '$1').replace(/[?&]$/, '');
  const join = base.includes('?') ? '&' : '?';
  return widths.map((w) => `${base}${join}w=${w}&auto=format ${w}w`).join(', ');
}
