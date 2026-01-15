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
    { key: "medium", width: 800 },
  ];

  const result: Record<string, string> = {};

  // Extract public path base (everything AFTER /public)
  const publicBasePath =
    "/" + path.relative(
      path.join(process.cwd(), "public"),
      outputDir
    ).replace(/\\/g, "/");

  /* =====================
     ORIGINAL
  ====================== */
  const originalFileName = `${baseName}-original.webp`;
  const originalDiskPath = path.join(outputDir, originalFileName);

  await sharp(buffer)
    .webp({ quality: 85 })
    .toFile(originalDiskPath);

  result.original = `${publicBasePath}/${originalFileName}`;

  /* =====================
     RESIZED
  ====================== */
  for (const size of sizes) {
    const fileName = `${baseName}-${size.key}.webp`;
    const diskPath = path.join(outputDir, fileName);

    await sharp(buffer)
      .resize(size.width)
      .webp({ quality: 80 })
      .toFile(diskPath);

    result[size.key] = `${publicBasePath}/${fileName}`;
  }

  return result;
}
