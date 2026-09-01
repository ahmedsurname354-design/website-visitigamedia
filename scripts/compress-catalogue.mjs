import { readdir, rename, stat, unlink, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { PDFDocument } from 'pdf-lib';
import sharp from 'sharp';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const pagesDirectory = path.join(root, 'public', 'products', 'catalogue-pages');
const outputPath = path.join(root, 'public', 'products', 'product-catalogue-2026.pdf');
const temporaryPath = `${outputPath}.tmp`;

const pageFiles = (await readdir(pagesDirectory))
  .filter((file) => /^page-\d+\.png$/i.test(file))
  .sort((left, right) => left.localeCompare(right, undefined, { numeric: true }));

if (pageFiles.length === 0) throw new Error('No catalogue page images were found.');

const document = await PDFDocument.create();

for (const pageFile of pageFiles) {
  const source = path.join(pagesDirectory, pageFile);
  const image = sharp(source).rotate().resize({ width: 1200, withoutEnlargement: true });
  const metadata = await image.metadata();
  const jpeg = await image.jpeg({ quality: 70, mozjpeg: true, progressive: true }).toBuffer();
  const embedded = await document.embedJpg(jpeg);
  const width = metadata.width ?? embedded.width;
  const height = metadata.height ?? embedded.height;
  const page = document.addPage([width, height]);
  page.drawImage(embedded, { x: 0, y: 0, width, height });
}

const bytes = await document.save({ useObjectStreams: true });
await writeFile(temporaryPath, bytes);
await unlink(outputPath).catch(() => undefined);
await rename(temporaryPath, outputPath);

const result = await stat(outputPath);
console.log(`Compressed ${pageFiles.length} catalogue pages to ${(result.size / 1024 / 1024).toFixed(2)} MiB.`);
