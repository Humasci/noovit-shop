import { Star } from 'lucide-react';

export function Stars({ rating = 5, size = 16, className = '' }: { rating?: number; size?: number; className?: string }) {
  return (
    <span className={`inline-flex gap-0.5 ${className}`} aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          style={{ width: size, height: size }}
          className={i <= Math.round(rating) ? 'fill-[var(--color-green)] text-[var(--color-green)]' : 'text-gray-300'}
        />
      ))}
    </span>
  );
}
