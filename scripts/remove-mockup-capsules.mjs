// Removes the two capsules from Supliful's bottle photo. The bottle is a cylinder, so each covered pixel takes its
// column's own colour from just above the capsules, scaled by how the mirrored (left) side of the bottle changes
// further down (label ring, base curve). The floor right of the bottle is copied from clean floor on the same row.
import sharp from 'sharp';
(async () => {
  const [src, out] = process.argv.slice(2);
  const { data, info } = await sharp(src).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const W = info.width;
  const CX = 505, EDGE = 720, REF = 735, X0 = 585, Y1 = 912, FLOORX = 885;
  const px = (x, y, c) => data[(y * W + x) * 3 + c];
  const o = Buffer.from(data);
  // Right-hand outline per row, mirrored from the left outline (the dark rim where the base curves in).
  const lum = (x, y) => (px(x, y, 0) + px(x, y, 1) + px(x, y, 2)) / 3;
  const rawEdge = (y) => {
    if (y < 846 || y > 884) return EDGE;
    let best = 288; for (let x = 288; x <= 345; x++) if (lum(x, y) < lum(best, y)) best = x;
    return 2 * CX - best;
  };
  const edges = new Map();
  const edge = (y) => { if (!edges.has(y)) { let t = 0; for (let d = -2; d <= 2; d++) t += rawEdge(y + d); edges.set(y, t / 5); } return edges.get(y); };
  const smooth = (t) => (t <= 0 ? 0 : t >= 1 ? 1 : t * t * (3 - 2 * t));
  for (let y = REF; y < Y1 + 20; y++) for (let x = X0; x < FLOORX; x++) {
    // Feather in from the left, top and bottom so the rebuilt patch has no seams.
    const a = smooth((x - X0) / 30) * smooth((y - REF) / 8) * (1 - smooth((y - Y1) / 20));
    if (a <= 0) continue;
    const xm = 2 * CX - x;
    for (let c = 0; c < 3; c++) {
      const e = edge(y); const inside = Math.max(0, Math.min(1, e - x + 0.5));
      let v = 0;
      if (inside > 0) {
        const ref = (px(x, REF, c) + px(x, REF - 3, c) + px(x, REF - 6, c)) / 3;
        const mref = (px(xm, REF, c) + px(xm, REF - 3, c) + px(xm, REF - 6, c)) / 3;
        v = Math.min(255, ref * (px(xm, y, c) / Math.max(1, mref)));
      }
      v = v * inside + px(FLOORX, y, c) * (1 - inside);
      o[(y * W + x) * 3 + c] = Math.round(v * a + px(x, y, c) * (1 - a));
    }
  }
  await sharp(o, { raw: { width: W, height: info.height, channels: 3 } }).jpeg({ quality: 90, mozjpeg: true }).toFile(out);
  console.log('ok');
})();
