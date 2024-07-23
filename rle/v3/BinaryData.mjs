import { readFileSync, writeFileSync } from "fs";

let BITS_PER_PIXEL = 2;
// a byte
const WORD_SIZE = 8;

export function setBitsPerPixel(value) {
  BITS_PER_PIXEL = value;
}

export function writeBinaryImage(data, width, height, filePath) {
  const buffer = Buffer.alloc(
    2 + Math.ceil(data.length / (WORD_SIZE / BITS_PER_PIXEL)),
    0,
    "binary"
  );

  let byte = 0;
  let bitCount = 0;
  let bufferIndex = 2;

  buffer[0] = width;
  buffer[1] = height;

  // read color (OR-ing), shift left, and repeat until we have a byte
  for (let i = 0; i < data.length; i++) {
    byte = byte << BITS_PER_PIXEL;
    byte |= data[i];
    bitCount += BITS_PER_PIXEL;

    if (bitCount === WORD_SIZE) {
      buffer[bufferIndex++] = byte;
      byte = 0;
      bitCount = 0;
    }
  }
  // write trailing byte, if needed
  if (bitCount > 0) {
    byte = byte << (WORD_SIZE - bitCount);
    buffer[bufferIndex] = byte;
  }

  writeFileSync(filePath, buffer);

  console.log(`Wrote binary image to: ${filePath} (size: ${buffer.length})`);
}

export function readBinaryImage(filePath) {
  // example with 2 bits per pixel: 0b11 = 3; 0b100 = 4; 0b1 = 1; 4 - 1 = 3; So, the mask is `0b11`
  const rightmostBitsMask = (1 << BITS_PER_PIXEL) - 1;

  const buffer = readFileSync(filePath);
  const data = [];
  const width = buffer[0];
  const height = buffer[1];

  for (let i = 2; i < buffer.length; i++) {
    for (let bitCount = 0; bitCount < WORD_SIZE; bitCount += BITS_PER_PIXEL) {
      data.push(
        (buffer[i] >> (WORD_SIZE - BITS_PER_PIXEL - bitCount)) &
          rightmostBitsMask
      );
    }
  }

  return { width, height, data };
}
