import { createWriteStream, readFileSync } from "fs";
import { PNG } from "pngjs";

export function pngToRaw(pngFilePath, firstColor) {
  // Sprites often have the first palette color as transparent
  const palette = [firstColor];
  const rawImage = [];

  const fileData = readFileSync(pngFilePath);
  let pngData = PNG.sync.read(fileData, {
    filterType: -1,
  });

  for (let y = 0; y < pngData.height; y++) {
    for (let x = 0; x < pngData.width; x++) {
      // Advance 4 bytes per pixel (RGBA)
      const index = (pngData.width * y + x) << 2;
      const rgba = {
        R: pngData.data[index],
        G: pngData.data[index + 1],
        B: pngData.data[index + 2],
        Alpha: pngData.data[index + 3],
      };
      const paletteColorKey = `${rgba.R},${rgba.G},${rgba.B},${rgba.Alpha}`;
      let paletteColorIndex = palette.findIndex((k) => k === paletteColorKey);
      if (paletteColorIndex === -1) {
        palette.push(paletteColorKey);
        paletteColorIndex = palette.length - 1;
      }
      rawImage.push(paletteColorIndex);
    }
  }

  return {
    palette,
    image: rawImage,
  };
}

export function rawToPNG(palette, rawImage, width, height, pngFilePath) {
  const pngData = new PNG({
    width,
    height,
    colorType: 6,
  });

  const paletteColors = palette.map((color) => {
    const values = color.split(",").map((value) => parseInt(value));
    return {
      R: values[0],
      G: values[1],
      B: values[2],
      Alpha: values[3],
    };
  });

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const rgba = paletteColors[rawImage[y * width + x]];
      // Advance 4 bytes per pixel (RGBA)
      const index = (width * y + x) << 2;
      pngData.data[index] = rgba.R;
      pngData.data[index + 1] = rgba.G;
      pngData.data[index + 2] = rgba.B;
      pngData.data[index + 3] = rgba.Alpha;
    }
  }

  pngData.pack().pipe(createWriteStream(pngFilePath));
}
