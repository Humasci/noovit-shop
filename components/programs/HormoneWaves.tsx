// Animated hero for "Perimenopause, Decoded" (23 Nov): two bead lines (estrogen, progesterone) that swing more and more
// unevenly, then settle low: an ILLUSTRATION of the idea "hormones swing rather than fall steadily", not real data.
// Pure SVG + CSS (draws in left to right, then the beads drift gently); still for prefers-reduced-motion.
const W = 640, H = 300;

// Smooth curve through points (Catmull-Rom → cubic Bézier).
function path(pts: [number, number][]) {
  let d = `M${pts[0][0]},${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] ?? p2;
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6], c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${c1[0].toFixed(1)},${c1[1].toFixed(1)} ${c2[0].toFixed(1)},${c2[1].toFixed(1)} ${p2[0]},${p2[1]}`;
  }
  return d;
}
// Regular cycles at first, then bigger, irregular swings (perimenopause), then low and flat (after menopause).
const estrogen: [number, number][] = [[0, 150], [40, 105], [80, 150], [120, 105], [160, 150], [200, 95], [240, 160], [275, 60], [320, 185], [350, 80], [400, 200], [430, 120], [470, 215], [510, 200], [560, 228], [600, 232], [640, 234]];
const progesterone: [number, number][] = [[0, 190], [40, 175], [80, 140], [120, 190], [160, 140], [200, 195], [240, 185], [280, 150], [320, 210], [360, 205], [400, 170], [440, 225], [480, 238], [540, 244], [600, 246], [640, 247]];

export function HormoneWaves({ className = '' }: { className?: string }) {
  return (
    <figure className={className}>
      <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label="Illustration: two hormone lines with regular waves that become larger and uneven, then settle low">
        <defs>
          <clipPath id="hw-reveal"><rect className="hw-reveal" x="0" y="0" width={W} height={H} /></clipPath>
        </defs>
        {[70, 150, 230].map((y) => <line key={y} x1="0" x2={W} y1={y} y2={y} stroke="currentColor" strokeOpacity="0.08" />)}
        <g clipPath="url(#hw-reveal)" fill="none" strokeLinecap="round">
          <path d={path(estrogen)} stroke="#A8467A" strokeWidth="9" strokeDasharray="0 13" className="hw-drift" />
          <path d={path(progesterone)} stroke="#4A6B94" strokeWidth="7" strokeDasharray="0 11" className="hw-drift hw-slow" />
        </g>
        <g fontFamily="var(--font-sans)" fontSize="13" fill="currentColor" fillOpacity="0.55">
          <text x="8" y="290">Regular cycles</text>
          <text x="250" y="290">Perimenopause: bigger, uneven swings</text>
          <text x="545" y="290">After menopause</text>
        </g>
      </svg>
      <figcaption className="mt-3 flex flex-wrap items-center gap-4 text-xs text-[var(--color-muted)]">
        <span className="flex items-center gap-1.5"><i className="h-2.5 w-2.5 rounded-full bg-[#A8467A]" /> Estrogen</span>
        <span className="flex items-center gap-1.5"><i className="h-2.5 w-2.5 rounded-full bg-[#4A6B94]" /> Progesterone</span>
        <span>Illustration of the pattern, not real data.</span>
      </figcaption>
      <style>{`
        .hw-reveal { transform-origin: 0 0; animation: hw-reveal 3.2s cubic-bezier(.3,.6,.3,1) both; }
        .hw-drift { animation: hw-drift 2.4s linear infinite; }
        .hw-slow { animation-duration: 3.2s; }
        @keyframes hw-reveal { from { transform: scaleX(0); } to { transform: scaleX(1); } }
        @keyframes hw-drift { to { stroke-dashoffset: -26; } }
        @media (prefers-reduced-motion: reduce) { .hw-reveal, .hw-drift { animation: none; } }
      `}</style>
    </figure>
  );
}
