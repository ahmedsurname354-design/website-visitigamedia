import { readdir, rename, stat, unlink, writeFile } from 'node:fs/promises';
import { join, extname } from 'node:path';
import sharp from 'sharp';

const roots = ['public', 'src/assets'];
const imageExtensions = new Set(['.jpg', '.jpeg', '.png']);
const skipRecentMinutes = Number(process.env.SKIP_RECENT_MINUTES ?? 0);
const cutoff = Date.now() - skipRecentMinutes * 60_000;
let beforeTotal = 0;
let afterTotal = 0;
let count = 0;

async function filesIn(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(entries.map(async (entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? filesIn(path) : imageExtensions.has(extname(entry.name).toLowerCase()) ? [path] : [];
  }));
  return nested.flat();
}

for (const root of roots) {
  for (const path of await filesIn(root)) {
    const fileStats = await stat(path);
    if (skipRecentMinutes > 0 && fileStats.mtimeMs > cutoff) continue;
    const before = fileStats.size;
    const image = sharp(path).rotate();
    const metadata = await image.metadata();
    const extension = extname(path).toLowerCase();
    const output = extension === '.png'
      ? image.resize({ width: 1920, withoutEnlargement: true }).png({ compressionLevel: 9, adaptiveFiltering: true, palette: !metadata.hasAlpha, quality: 85 })
      : image.resize({ width: 1920, withoutEnlargement: true }).jpeg({ quality: 82, mozjpeg: true, progressive: true });
    const temp = `${path}.optimizing`;
    const backup = `${path}.original`;
    await writeFile(temp, await output.toBuffer());
    try {
      await rename(path, backup);
    } catch (error) {
      await unlink(temp).catch(() => undefined);
      if (error && typeof error === 'object' && 'code' in error && error.code === 'EBUSY') {
        process.stdout.write(`${path}: skipped (file is in use)\n`);
        continue;
      }
      throw error;
    }
    try {
      await rename(temp, path);
      await unlink(backup);
    } catch (error) {
      await rename(backup, path).catch(() => undefined);
      throw error;
    }
    const after = (await stat(path)).size;
    beforeTotal += before;
    afterTotal += after;
    count += 1;
    process.stdout.write(`${path}: ${(before / 1024).toFixed(0)} KB → ${(after / 1024).toFixed(0)} KB\n`);
  }
}

process.stdout.write(`\nOptimized ${count} images: ${(beforeTotal / 1024 / 1024).toFixed(2)} MB → ${(afterTotal / 1024 / 1024).toFixed(2)} MB\n`);
