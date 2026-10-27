// The noovit mosaic cross comes in two versions, one definition each:
//  - MARK: five tiles on a 3×3 grid. The logo mark: the noovit wordmark, the n⁺ icon and the bottle labels.
//    Bold enough to read as a "+" at small sizes.
//  - LARGE: nine tiles on a 5×5 grid (a centre and two per arm), fading outwards. For the breathing loader and
//    large graphics, where the extra detail shows.
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

export const LARGE_CROSS: Cross = {
  grid: 5,
  tiles: [
    { c: 2, r: 2, o: 1, arm: 'core', ring: 0 },
    { c: 2, r: 1, o: 0.75, arm: 'top', ring: 1 },
    { c: 2, r: 0, o: 0.45, arm: 'top', ring: 2 },
    { c: 3, r: 2, o: 0.9, arm: 'right', ring: 1 },
    { c: 4, r: 2, o: 0.6, arm: 'right', ring: 2 },
    { c: 2, r: 3, o: 0.65, arm: 'bottom', ring: 1 },
    { c: 2, r: 4, o: 0.35, arm: 'bottom', ring: 2 },
    { c: 1, r: 2, o: 0.55, arm: 'left', ring: 1 },
    { c: 0, r: 2, o: 0.3, arm: 'left', ring: 2 },
  ],
};

export const CROSS_GAP = 0.16; // gap as a fraction of the tile
// Tile size for a cross whose overall width is `size`.
export const crossTile = (cross: Cross, size: number) => size / (cross.grid + (cross.grid - 1) * CROSS_GAP);
