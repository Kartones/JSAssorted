import { TILE_SIZE } from "./constants.mjs";

// Note: No error handling, assumes perfect multiplier of 16x16 image size
export function splitIntoCharacterTiles(image, width, height) {
  const tiles = [];

  for (let y = 0; y < height; y += TILE_SIZE) {
    for (let x = 0; x < width; x += TILE_SIZE) {
      const tile = [];
      for (let tileY = 0; tileY < TILE_SIZE; tileY++) {
        for (let tileX = 0; tileX < TILE_SIZE; tileX++) {
          const index = width * (y + tileY) + (x + tileX);
          tile.push(image[index]);
        }
      }
      tiles.push(tile);
    }
  }
  return tiles;
}

export function combineTilesIntoImage(tiles, width, height) {
  const imageSize = width * height;
  const image = Array(imageSize).fill(0);
  const remainingTiles = Array.from(tiles);

  for (let y = 0; y < height; y += TILE_SIZE) {
    for (let x = 0; x < width; x += TILE_SIZE) {
      const tile = remainingTiles.shift();
      for (let tileY = 0; tileY < TILE_SIZE; tileY++) {
        for (let tileX = 0; tileX < TILE_SIZE; tileX++) {
          const index = width * (y + tileY) + (x + tileX);
          image[index] = tile[tileY * TILE_SIZE + tileX];
        }
      }
    }
  }
  return image;
}
