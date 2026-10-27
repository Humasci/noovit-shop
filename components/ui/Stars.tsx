import { Star } from 'lucide-react';

export function Stars({ rating = 5, size = 16, className = '' }: { rating?: number; size?: number; className?: string }) {
  return (
    <span role="img" className={`inline-flex gap-0.5 ${className}`} aria-label={`Rated ${Math.round(rating * 10) / 10} out of 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          aria-hidden
          style={{ width: size, height: size }}
          className={i <= Math.round(rating) ? 'fill-[var(--color-green)] text-[var(--color-green)]' : 'text-gray-300'}
        />
      ))}
    </span>
  );
}
