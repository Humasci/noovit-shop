import MOL3D from '@/data/molecules3d.json';

// Shared 3D ball-and-stick renderer (21 Nov). Used by scripts/test-art.ts, scripts/infographic.ts and
// scripts/social-templates.ts. Owner-approved style for all new molecule art.
// ---------- 3D ball-and-stick (21 Nov, owner: "more 3D texture and defined") ----------
// PubChem 3D conformer (data/molecules3d.json, scripts/build-molecules3d.py), hydrogens included, only rotated and scaled.
// Atoms are glossy spheres (specular highlight, coloured body, dark rim), bonds are shaded cylinders split in the two
// atoms' colours, double bonds drawn as two thinner cylinders, everything painted back to front with depth fade.
type M3 = { cid: number; atoms: [string, number, number, number][]; bonds: [number, number, number][]; computed?: string };
export const hasMol3d = (key: string) => key in (MOL3D as object);
export const mol3dSource = (key: string) => { const m = (MOL3D as unknown as Record<string, M3>)[key]; return m?.computed ? `3D model computed from PubChem CID ${m.cid} (${m.computed})` : `3D structure: PubChem CID ${m?.cid} (computed conformer)`; };
export const CPK: Record<string, string> = { C: '#8E95AE', H: '#EEF0F6', O: '#E0443E', N: '#3E6FD8', I: '#940094', P: '#F08A24' };
const RAD: Record<string, number> = { C: 0.42, H: 0.25, O: 0.4, N: 0.4, I: 0.6, P: 0.5 }; // ball-and-stick radii, in Å
export interface Mol3dOpts { id?: string; hydrogens?: boolean; zoom?: number; zoomAt?: 'oxygen' | 'centre'; scale?: number }
export function mol3d(key: string, cx: number, cy: number, w: number, h: number, yaw = 0.5, pitch = 0.35, roll = 0, opts: Mol3dOpts = {}) {
  const full = (MOL3D as unknown as Record<string, M3>)[key];
  if (!full) return { defs: '', body: '', cid: 0 };
  // Optional: hide hydrogens (large molecules in small spaces); indices are remapped, bonds to H dropped.
  const keep = full.atoms.map((a, i) => (opts.hydrogens === false && a[0] === 'H' ? -1 : i)).filter((i) => i >= 0);
  const map = new Map(keep.map((i, j) => [i, j]));
  const m: M3 = { ...full, atoms: keep.map((i) => full.atoms[i]), bonds: full.bonds.filter(([a, b]) => map.has(a) && map.has(b)).map(([a, b, o]) => [map.get(a)!, map.get(b)!, o]) };
  const pre = opts.id ?? key;
  const rot = ([x, y, z]: number[]) => {
    let X = x * Math.cos(roll) - y * Math.sin(roll), Y = x * Math.sin(roll) + y * Math.cos(roll), Z = z;
    [X, Z] = [X * Math.cos(yaw) + Z * Math.sin(yaw), -X * Math.sin(yaw) + Z * Math.cos(yaw)];
    [Y, Z] = [Y * Math.cos(pitch) - Z * Math.sin(pitch), Y * Math.sin(pitch) + Z * Math.cos(pitch)];
    return [X, Y, Z];
  };
  const P = m.atoms.map(([, x, y, z]) => rot([x, y, z]));
  const xs = P.map((p) => p[0]), ys = P.map((p) => p[1]), zs = P.map((p) => p[2]);
  const pad = 0.7;
  let s = Math.min(w / (Math.max(...xs) - Math.min(...xs) + pad * 2), h / (Math.max(...ys) - Math.min(...ys) + pad * 2)) * (opts.scale ?? 1);
  let mx = (Math.max(...xs) + Math.min(...xs)) / 2, my = (Math.max(...ys) + Math.min(...ys)) / 2;
  if (opts.zoom) {
    s *= opts.zoom;
    if (opts.zoomAt !== 'centre') { // close-up centred on the oxygens (e.g. CoQ10's quinone ring)
      const oi = m.atoms.map((a, i) => (a[0] === 'O' ? i : -1)).filter((i) => i >= 0);
      if (oi.length) { mx = oi.reduce((t, i) => t + P[i][0], 0) / oi.length; my = oi.reduce((t, i) => t + P[i][1], 0) / oi.length; }
    }
  }
  const zmin = Math.min(...zs), zmax = Math.max(...zs);
  const depth = (z: number) => (z - zmin) / (zmax - zmin || 1); // 0 far, 1 near (z towards viewer)
  const S = P.map(([x, y, z]) => ({ x: cx + (x - mx) * s, y: cy - (y - my) * s, d: depth(z) }));
  const defs: string[] = [];
  const seen = new Set<string>();
  const ball = (e: string) => { const id = `a3-${pre}-${e}`; if (!seen.has(id)) { seen.add(id); const c = CPK[e] ?? CPK.C; defs.push(`<radialGradient id="${id}" cx="0.36" cy="0.32" r="0.72" fx="0.3" fy="0.26"><stop offset="0" stop-color="#ffffff"/><stop offset="0.12" stop-color="#ffffff" stop-opacity="0.9"/><stop offset="0.3" stop-color="${c}"/><stop offset="0.82" stop-color="${c}" stop-opacity="0.92"/><stop offset="1" stop-color="#05061a"/></radialGradient>`); } return id; };
  const items: { z: number; svg: string }[] = [];
  const fade = (d: number) => (0.55 + 0.45 * d).toFixed(2);
  const bondR = 0.12 * s;
  for (const [a, b, order] of m.bonds) {
    const A = S[a], B = S[b];
    const ea = m.atoms[a][0], eb = m.atoms[b][0];
    const L = Math.hypot(B.x - A.x, B.y - A.y) || 1, nx = -(B.y - A.y) / L, ny = (B.x - A.x) / L;
    const offs = order === 2 ? [-1, 1] : order === 3 ? [-1.4, 0, 1.4] : [0];
    const r = order > 1 ? bondR * 0.62 : bondR;
    const mxp = (A.x + B.x) / 2, myp = (A.y + B.y) / 2;
    for (const o of offs) {
      const ox = nx * o * r * 1.35, oy = ny * o * r * 1.35;
      const seg = (x1: number, y1: number, x2: number, y2: number, e: string, d: number) => {
        const c = CPK[e] ?? CPK.C;
        // cylinder: dark core stroke, body, then a thin highlight offset towards the light (top left)
        return `<g opacity="${fade(d)}"><line x1="${(x1 + ox).toFixed(1)}" y1="${(y1 + oy).toFixed(1)}" x2="${(x2 + ox).toFixed(1)}" y2="${(y2 + oy).toFixed(1)}" stroke="#05061a" stroke-width="${(r * 2.3).toFixed(1)}" stroke-linecap="round"/><line x1="${(x1 + ox).toFixed(1)}" y1="${(y1 + oy).toFixed(1)}" x2="${(x2 + ox).toFixed(1)}" y2="${(y2 + oy).toFixed(1)}" stroke="${c}" stroke-width="${(r * 2).toFixed(1)}" stroke-linecap="round"/><line x1="${(x1 + ox - r * 0.35).toFixed(1)}" y1="${(y1 + oy - r * 0.45).toFixed(1)}" x2="${(x2 + ox - r * 0.35).toFixed(1)}" y2="${(y2 + oy - r * 0.45).toFixed(1)}" stroke="#ffffff" stroke-opacity="0.45" stroke-width="${(r * 0.55).toFixed(1)}" stroke-linecap="round"/></g>`;
      };
      items.push({ z: (A.d * 0.75 + B.d * 0.25) - 0.02, svg: seg(A.x, A.y, mxp, myp, ea, A.d) });
      items.push({ z: (B.d * 0.75 + A.d * 0.25) - 0.02, svg: seg(mxp, myp, B.x, B.y, eb, B.d) });
    }
  }
  m.atoms.forEach(([e], i) => {
    const A = S[i], r = (RAD[e] ?? RAD.C) * s * (0.9 + 0.2 * A.d);
    items.push({ z: A.d, svg: `<g opacity="${fade(A.d)}"><circle cx="${A.x.toFixed(1)}" cy="${(A.y + r * 0.08).toFixed(1)}" r="${(r * 1.04).toFixed(1)}" fill="#05061a" fill-opacity="0.6"/><circle cx="${A.x.toFixed(1)}" cy="${A.y.toFixed(1)}" r="${r.toFixed(1)}" fill="url(#${ball(e)})"/></g>` });
  });
  items.sort((p, q) => p.z - q.z);
  return { defs: defs.join(''), body: items.map((i) => i.svg).join(''), cid: m.cid };
}

