import { readdir, stat } from 'node:fs/promises';
import { join, extname } from 'node:path';
import sharp from 'sharp';

const roots = ['public/portfolio', 'public/products'];
const widths = [320, 640, 960];

async function imageFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await imageFiles(path));
    else if (/\.(?:png|jpe?g|webp)$/i.test(entry.name) && !/-\d+\.webp$/i.test(entry.name)) files.push(path);
  }
  return files;
}

let generated = 0;
for (const root of roots) {
  for (const source of await imageFiles(root)) {
    const input = sharp(source).rotate();
    for (const width of widths) {
      const target = source.replace(new RegExp(`${extname(source)}$`, 'i'), `-${width}.webp`);
      try { await stat(target); continue; } catch { /* generate missing variant */ }
      await input.clone().resize({ width, withoutEnlargement: true }).webp({ quality: 72, effort: 5 }).toFile(target);
      generated += 1;
    }
  }
}

console.log(`Generated ${generated} responsive image variants.`);
