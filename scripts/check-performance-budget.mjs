import { readFile, readdir, stat } from 'node:fs/promises';
import { join } from 'node:path';
import { gzipSync } from 'node:zlib';

const dist = join(process.cwd(), 'dist');
const html = await readFile(join(dist, 'index.html'), 'utf8');
const script = html.match(/src="(\/assets\/index-[^"]+\.js)"/)?.[1];
const stylesheet = html.match(/href="(\/assets\/index-[^"]+\.css)"/)?.[1];
if (!script || !stylesheet) throw new Error('Aset awal tidak ditemukan pada dist/index.html.');

async function gzipBytes(path) { return gzipSync(await readFile(join(dist, path))).byteLength; }
const js = await gzipBytes(script);
const css = await gzipBytes(stylesheet);
const hero = (await stat(join(dist, 'hero-640.webp'))).size;
const assets = await readdir(join(dist, 'assets'));
const logoName = assets.find((name) => /^logo-visitiga-.*\.webp$/.test(name));
const logo = logoName ? (await stat(join(dist, 'assets', logoName))).size : 0;
const total = js + css + hero + logo;
const budgets = [
  ['initial JavaScript gzip', js, 120 * 1024], ['CSS gzip', css, 22 * 1024],
  ['mobile hero', hero, 60 * 1024], ['initial transfer', total, 220 * 1024],
];
let failed = false;
for (const [label, value, maximum] of budgets) {
  const pass = value <= maximum;
  console.log(`[budget] ${pass ? 'PASS' : 'FAIL'} ${label}: ${(value / 1024).toFixed(1)} KiB / ${(maximum / 1024).toFixed(0)} KiB`);
  if (!pass) failed = true;
}
if (failed) process.exitCode = 1;
