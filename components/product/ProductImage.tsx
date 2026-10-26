import React from 'react';
import { Product } from '@/types';

export type ImageVariant = 'front' | 'duo' | 'capsules' | 'facts';

const wrap = (text: string, max: number) => {
  const lines: string[] = [];
  let line = '';
  for (const word of text.split(' ')) {
    if ((line + ' ' + word).trim().length > max && line) {
      lines.push(line);
      line = word;
    } else {
      line = (line + ' ' + word).trim();
    }
  }
  lines.push(line);
  return lines;
};

function Bottle({ product, x, y, scale = 1 }: { product: Product; x: number; y: number; scale?: number }) {
  const pets = product.productType === 'pets';
  const jar = product.form === 'powder' || product.form === 'chews';
  const w = jar ? 170 : 140;
  const h = jar ? 190 : 220;
  const label = pets ? product.name.replace(/ for (Dogs|Cats)$/, '') : product.name;
  const lines = wrap(label.toUpperCase(), jar ? 13 : 11);
  const unit = { powder: 'SERVINGS', chews: 'SOFT CHEWS', capsules: 'CAPSULES', softgels: 'SOFTGELS' }[product.form];
  const count = jar ? product.servings : product.servings * 2;

  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <ellipse cx={w / 2} cy={h + 6} rx={w / 2 + 6} ry={10} fill="#000" opacity={0.08} />
      <rect x={jar ? 8 : 28} y={-34} width={jar ? w - 16 : w - 56} height={40} rx={8} fill="#1a1f2b" />
      <rect x={0} y={0} width={w} height={h} rx={jar ? 22 : 28} fill="#fff" />
      <rect x={0} y={0} width={w} height={h} rx={jar ? 22 : 28} fill="url(#shine)" />
      <rect x={0} y={jar ? 34 : 44} width={w} height={jar ? 126 : 140} fill={product.color} />
      <text x={w / 2} y={jar ? 58 : 70} textAnchor="middle" fontSize={13} fontWeight={800} letterSpacing={3} fill="#fff">
        {pets ? 'NOOVIT PETS' : 'NOOVIT'}
      </text>
      {lines.map((l, i) => (
        <text key={i} x={w / 2} y={(jar ? 92 : 108) + i * 19} textAnchor="middle" fontSize={16} fontWeight={800} fill="#fff">
          {l}
        </text>
      ))}
      <text x={w / 2} y={jar ? 150 : 172} textAnchor="middle" fontSize={9} fontWeight={600} letterSpacing={1.5} fill="#fff" opacity={0.85}>
        {count} {unit}
      </text>
    </g>
  );
}

export function ProductImage({
  product,
  variant = 'front',
  className = '',
}: {
  product: Product;
  variant?: ImageVariant;
  className?: string;
}) {
  if (variant === 'front' && product.images?.length) {
    return <img src={product.images[0]} alt={product.name} className={`object-cover ${className}`} loading="lazy" />;
  }
  const id = `${product.slug}-${variant}`;
  return (
    <svg viewBox="0 0 400 400" className={className} role="img" aria-label={`${product.name} ${variant}`}>
      <defs>
        <radialGradient id={`bg-${id}`} cx="50%" cy="40%" r="75%">
          <stop offset="0%" stopColor="#fff" />
          <stop offset="100%" stopColor={product.color} stopOpacity={0.22} />
        </radialGradient>
        <linearGradient id="shine" x1="0" x2="1">
          <stop offset="0%" stopColor="#000" stopOpacity={0.06} />
          <stop offset="35%" stopColor="#fff" stopOpacity={0} />
          <stop offset="80%" stopColor="#000" stopOpacity={0.05} />
        </linearGradient>
      </defs>
      <rect width={400} height={400} fill="#fff" />
      <rect width={400} height={400} fill={`url(#bg-${id})`} />

      {variant === 'front' && <Bottle product={product} x={product.form === 'powder' ? 115 : 130} y={110} />}

      {variant === 'duo' && (
        <>
          <Bottle product={product} x={60} y={130} scale={0.85} />
          <Bottle product={product} x={200} y={110} scale={0.95} />
        </>
      )}

      {variant === 'capsules' && (
        <>
          <Bottle product={product} x={70} y={110} scale={0.9} />
          {[[270, 270, 20], [310, 300, -30], [255, 320, 60], [320, 250, 80], [290, 335, -10]].map(([cx, cy, r], i) =>
            product.form === 'powder' ? (
              <circle key={i} cx={cx} cy={cy} r={14 - i} fill={product.color} opacity={0.5} />
            ) : product.form === 'chews' ? (
              <rect key={i} x={cx - 15} y={cy - 15} width={30} height={30} rx={9} transform={`rotate(${r} ${cx} ${cy})`} fill={product.color} opacity={0.75} />
            ) : (
              <g key={i} transform={`rotate(${r} ${cx} ${cy})`}>
                <rect x={cx - 22} y={cy - 9} width={44} height={18} rx={9} fill="#fff" stroke={product.color} strokeWidth={2} />
                <rect x={cx} y={cy - 9} width={22} height={18} rx={9} fill={product.color} opacity={0.7} />
              </g>
            )
          )}
        </>
      )}

      {variant === 'facts' && (
        <g transform="translate(70 40)">
          <rect width={260} height={320} rx={12} fill="#fff" stroke="#111" strokeWidth={2} />
          <text x={16} y={38} fontSize={22} fontWeight={800} fill="#111">
            {product.productType === 'pets' ? 'Active Ingredients' : 'Supplement Facts'}
          </text>
          <text x={16} y={60} fontSize={11} fill="#111">
            {product.productType === 'pets' ? `Per ${product.form === 'powder' ? 'scoop' : 'chew'}` : product.dosage.slice(0, 44)}
          </text>
          <line x1={16} x2={244} y1={72} y2={72} stroke="#111" strokeWidth={6} />
          {product.ingredients.slice(0, 7).map((ing, i) => (
            <g key={ing.name}>
              <text x={16} y={96 + i * 30} fontSize={11} fontWeight={600} fill="#111">
                {ing.name.length > 26 ? ing.name.slice(0, 25) + '…' : ing.name}
              </text>
              <text x={244} y={96 + i * 30} fontSize={11} textAnchor="end" fill="#111">{ing.amount}</text>
              <line x1={16} x2={244} y1={106 + i * 30} y2={106 + i * 30} stroke="#111" strokeWidth={0.75} />
            </g>
          ))}
          <text x={16} y={304} fontSize={9} fill="#555">Other: {product.otherIngredients.slice(0, 40)}</text>
        </g>
      )}
    </svg>
  );
}
