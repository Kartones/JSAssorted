import { pngToRaw, rawToPNG } from "./PNG.mjs";
import { rleDecode, rleEncode } from "./RLE.mjs";

const images = [
  //5310 vs 3616 = ~32% saving in size
  {
    filename: "sf2-ryu.png",
    width: 59,
    height: 90,
  },
  // 4000 vs 2740 = ~31% saving in size
  {
    filename: "knights-of-the-round.png",
    width: 50,
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
  console.log("Raw image size:", image.length, "\n");
}

images.forEach(({ filename, width, height }) => {
  let { palette, image } = pngToRaw(filename);
  asciiDrawRawImage(palette, image, width);

  let encodedImage = rleEncode(image);
  console.log("RLE encoded image size:", encodedImage.length);

  let decodedImage = rleDecode(encodedImage);
  console.log(
    "Images equal?",
    image.every((v, i) => v === decodedImage[i])
  );
  asciiDrawRawImage(palette, decodedImage, width);

  rawToPNG(palette, decodedImage, width, height, `new_${filename}`);
});
