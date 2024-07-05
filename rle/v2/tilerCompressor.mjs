import { rleEncode } from "./RLE.mjs";
import { combineTilesIntoImage } from "./tiler.mjs";

const MAX_ITERATIONS = 10000000;

export function calculatePermutations(tiles, width, height) {
  const bestPermutation = {
    tiles: [],
    compressedSize: Infinity,
    originalPositions: [],
  };

  let currentTiles = Array.from(tiles);

  for (let iteration = 0; iteration < MAX_ITERATIONS; iteration++) {
    const shuffledTiles = generateRandomPermutation(currentTiles);

    const combinedImage = combineTilesIntoImage(
      shuffledTiles.tiles,
      width,
      height
    );
    const encodedImage = rleEncode(combinedImage);
    const compressedSize = encodedImage.length;

    if (compressedSize < bestPermutation.compressedSize) {
      bestPermutation.tiles = shuffledTiles.tiles;
      bestPermutation.compressedSize = compressedSize;
      bestPermutation.originalPositions = shuffledTiles.originalPositions;
      console.log(`New Best size: ${bestPermutation.compressedSize}`);
    }

    // Mutate to avoid too scarce randomness
    currentTiles = shuffledTiles.tiles;
  }

  return bestPermutation;
}

function generateRandomPermutation(tiles) {
  const results = {
    tiles: [],
    originalPositions: [],
  };

  const tileIndexes = tiles.map((_, index) => index);
  const shuffledIndexes = tileIndexes.sort(() => Math.random() - 0.5);
  for (let i = 0; i < tiles.length; i++) {
    results.tiles.push(tiles[shuffledIndexes[i]]);
    results.originalPositions.push(shuffledIndexes[i]);
  }

  return results;
}
