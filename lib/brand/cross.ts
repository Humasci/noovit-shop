// The noovit mosaic cross: nine square tiles on a 5×5 grid (a centre tile and two per arm), strongest at the
// centre and fading outwards. One definition shared by the logo, the n⁺ icon, the labels and the loader.
export interface CrossTile {
  c: number; // column 0–4
  r: number; // row 0–4
  o: number; // opacity
  arm: 'core' | 'top' | 'right' | 'bottom' | 'left';
  ring: 0 | 1 | 2; // 0 = centre, 1 = inner, 2 = outer
}

export const CROSS_TILES: CrossTile[] = [
  { c: 2, r: 2, o: 1, arm: 'core', ring: 0 },
  { c: 2, r: 1, o: 0.75, arm: 'top', ring: 1 },
  { c: 2, r: 0, o: 0.45, arm: 'top', ring: 2 },
  { c: 3, r: 2, o: 0.9, arm: 'right', ring: 1 },
  { c: 4, r: 2, o: 0.6, arm: 'right', ring: 2 },
  { c: 2, r: 3, o: 0.65, arm: 'bottom', ring: 1 },
  { c: 2, r: 4, o: 0.35, arm: 'bottom', ring: 2 },
  { c: 1, r: 2, o: 0.55, arm: 'left', ring: 1 },
  { c: 0, r: 2, o: 0.3, arm: 'left', ring: 2 },
];

export const CROSS_GRID = 5;
export const CROSS_GAP = 0.16; // gap as a fraction of the tile
// Tile size for a cross whose overall width is `size`.
export const crossTile = (size: number) => size / (CROSS_GRID + (CROSS_GRID - 1) * CROSS_GAP);
