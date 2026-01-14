import sharp from "sharp";
import fs from "fs";
import path from "path";

export async function generateImageSizes(
  buffer: Buffer,
  outputDir: string,
  baseName: string
) {
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const sizes = [
    { key: "large", width: 1600 },
    { key: "medium", width: 800 },
    { key: "thumb", width: 300 },
  ];

  const result: any = {};

  // original
  const originalPath = path.join(outputDir, `${baseName}-original.webp`);
  await sharp(buffer).webp({ quality: 85 }).toFile(originalPath);
  result.original = originalPath.replace("uploads", "");

  for (const size of sizes) {
    const filePath = path.join(outputDir, `${baseName}-${size.key}.webp`);

    await sharp(buffer)
      .resize(size.width)
      .webp({ quality: 80 })
      .toFile(filePath);

    result[size.key] = filePath.replace("uploads", "");
  }

  return result;
}
