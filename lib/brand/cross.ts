// The noovit mosaic cross: five tiles on a 3×3 grid. The ONLY cross used anywhere (owner, 3 Nov): logo, icon,
// labels, loader, favicon, the advisor button and website graphics.
export interface CrossTile {
  c: number; // column
  r: number; // row
  o: number; // opacity
  arm: 'core' | 'top' | 'right' | 'bottom' | 'left';
  ring: 0 | 1 | 2; // 0 = centre, 1 = inner, 2 = outer
}

export interface Cross {
  grid: number;
  tiles: CrossTile[];
}

export const MARK_CROSS: Cross = {
  grid: 3,
  tiles: [
    { c: 1, r: 1, o: 1, arm: 'core', ring: 0 },
    { c: 1, r: 0, o: 0.6, arm: 'top', ring: 1 },
    { c: 2, r: 1, o: 0.8, arm: 'right', ring: 1 },
    { c: 1, r: 2, o: 0.5, arm: 'bottom', ring: 1 },
    { c: 0, r: 1, o: 0.4, arm: 'left', ring: 1 },
  ],
};

export const CROSS_GAP = 0.16; // gap as a fraction of the tile
// Tile size for a cross whose overall width is `size`.
export const crossTile = (cross: Cross, size: number) => size / (cross.grid + (cross.grid - 1) * CROSS_GAP);
