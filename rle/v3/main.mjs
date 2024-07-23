import { pngToRaw, rawToPNG } from "./PNG.mjs";
import { binaryRLEEncode, binaryRLEDecode } from "./BitRLE.mjs";
import {
  readBinaryImage,
  setBitsPerPixel,
  writeBinaryImage,
} from "./BinaryData.mjs";

const MAX_PALETTE_LENGTH = 16;

const images = [
  {
    filename: "poke01.png",
    width: 40,
    height: 40,
    firstColor: "249,249,249,255",
  },
  {
    filename: "poke02.png",
    width: 56,
    height: 55,
    firstColor: "249,249,249,255",
  },
  {
    filename: "sf2-ryu.png",
    width: 64,
    height: 96,
    firstColor: "0,0,0,0",
  },
];

function asciiDrawRawImage(palette, image, width) {
  console.log("Palette:", palette);
  for (let index = 0; index < image.length; index += width) {
    console.log(
      image
        .slice(index, index + width)
        .map((c) => c.toString(16))
        .join("")
    );
  }
  console.log("Raw image size:", image.length, "\n");
}

// RLE packets displayed as `0*<hexadecimal-count-value>`
function asciiDrawRLEData(image) {
  let result = [];
  let rlePacketCount = 0;

  let i = 0;
  while (i < image.length) {
    if (image[i] === 0) {
      i++;
      rlePacketCount = image[i];
      result.push(`0*${rlePacketCount.toString(16).padStart(2, "0")}`);
    } else {
      result.push(image[i]);
    }
    i++;
  }
  console.log(result.join(" "));

  console.log("RLE data image size:", image.length, "\n");
}

images.forEach(({ filename, width, height, firstColor }) => {
  let { palette, image } = pngToRaw(filename, firstColor);
  let bitsPerPixel = Math.ceil(Math.log2(palette.length));

  if (palette.length > MAX_PALETTE_LENGTH) {
    console.log(
      `> ${filename}: Palettes larger than ${MAX_PALETTE_LENGTH} colors not currently supported, skipped`
    );
    return;
  }

  setBitsPerPixel(bitsPerPixel);
  console.log("Bits per pixel:", bitsPerPixel);

  asciiDrawRawImage(palette, image, width);

  // In-memory RLE

  let binaryEncodedImage = binaryRLEEncode(image);
  asciiDrawRLEData(binaryEncodedImage);

  let binaryDecodedImage = binaryRLEDecode(binaryEncodedImage);
  asciiDrawRawImage(palette, binaryDecodedImage, width);

  let areEqual = image.every((v, i) => v === binaryDecodedImage[i]);
  console.log("Decoded image equal?", areEqual);
  if (!areEqual) {
    console.log("> Decoded image is not equal, not saving PNG");
    return;
  }

  rawToPNG(palette, binaryDecodedImage, width, height, `new_${filename}`);

  // Writing & Reading binary-RLE data

  writeBinaryImage(binaryDecodedImage, width, height, `new_${filename}.bin`);

  const {
    width: readWidth,
    height: readHeight,
    data: readImage,
  } = readBinaryImage(`new_${filename}.bin`);
  console.log(
    "Read binary image dimensions & size:",
    readWidth,
    readHeight,
    readImage.length
  );

  areEqual = image.every((v, i) => v === readImage[i]);
  console.log("Read image equal?", areEqual);
  if (!areEqual) {
    console.log("> Read image is not equal, not saving PNG");
    return;
  }

  rawToPNG(palette, readImage, width, height, `new_read_${filename}`);
});
