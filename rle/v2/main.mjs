import { TILE_SIZE } from "./constants.mjs";
import { pngToRaw, rawToPNG } from "./PNG.mjs";
import { rleDecode, rleEncode } from "./RLE.mjs";
import { combineTilesIntoImage, splitIntoCharacterTiles } from "./tiler.mjs";
import { calculatePermutations } from "./tilerCompressor.mjs";

const images = [
  {
    filename: "sf2-ryu.png",
    width: 64,
    height: 96,
  },
  {
    filename: "knights-of-the-round.png",
    width: 64,
    height: 80,
  },
];

function asciiDrawRawImage(palette, image, width) {
  console.log("Palette:", palette);
  for (let index = 0; index < image.length; index += width) {
    // drawing hex values will only work fine for up to 16 colors, but the examples are exactly 16 colors
    console.log(
      image
        .slice(index, index + width)
        .map((c) => c.toString(16))
        .join("")
    );
  }
}

images.forEach(({ filename, width, height }) => {
  let { palette, image } = pngToRaw(filename);
  console.log("Raw image size:", image.length);
  // asciiDrawRawImage(palette, image, width);

  let encodedImage = rleEncode(image);
  console.log("RLE encoded image size:", encodedImage.length);

  const tiles = splitIntoCharacterTiles(image, width, height);
  console.log(`Split into ${tiles.length} tiles`);

  const combinedImage = combineTilesIntoImage(tiles, width, height);
  rawToPNG(palette, combinedImage, width, height, `combined_${filename}`);

  const bestPermutation = calculatePermutations(tiles, width, height);
  console.log("Best permutation size:", bestPermutation.compressedSize);
  console.log("Best permutation ordering:", bestPermutation.originalPositions);
  console.log(
    "Better than original sprite?",
    bestPermutation.compressedSize < encodedImage.length
  );

  const optimalTilesImage = combineTilesIntoImage(
    bestPermutation.tiles,
    width,
    height
  );
  rawToPNG(palette, optimalTilesImage, width, height, `optimal_${filename}`);

  // Uncomment to see original tiles
  // tiles.forEach((tile, index) => {
  //   rawToPNG(palette, tile, TILE_SIZE, TILE_SIZE, `${index}_${filename}`);
  // });

  // let decodedImage = rleDecode(encodedImage);
  // console.log(
  //   "Images equal?",
  //   image.every((v, i) => v === decodedImage[i])
  // );
  // asciiDrawRawImage(palette, decodedImage, width);

  // rawToPNG(palette, decodedImage, width, height, `new_${filename}`);
});
