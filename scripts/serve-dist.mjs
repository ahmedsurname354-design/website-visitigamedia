import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { brotliCompress } from 'node:zlib';
import { promisify } from 'node:util';

const root = join(process.cwd(), 'dist');
const port = Number(process.env.PORT || 4173);
const types = { '.css': 'text/css', '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.json': 'application/json', '.mjs': 'text/javascript', '.png': 'image/png', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.woff': 'font/woff', '.woff2': 'font/woff2', '.xml': 'application/xml' };
const compress = promisify(brotliCompress);
const compressible = new Set(['.css', '.html', '.js', '.json', '.mjs', '.svg', '.xml']);

async function existingFile(path) {
  try { return (await stat(path)).isFile() ? path : null; } catch { return null; }
}

createServer(async (request, response) => {
  const pathname = decodeURIComponent(new URL(request.url || '/', 'http://localhost').pathname);
  const safePath = normalize(pathname).replace(/^([/\\]*\.\.[/\\])+/, '').replace(/^[/\\]+/, '');
  const direct = await existingFile(join(root, safePath));
  const routeIndex = await existingFile(join(root, safePath, 'index.html'));
  const found = direct || routeIndex;
  const file = found || join(root, '404.html');
  try {
    const body = await readFile(file);
    const extension = extname(file);
    const canUseBrotli = compressible.has(extension) && /\bbr\b/.test(request.headers['accept-encoding'] || '');
    const payload = canUseBrotli ? await compress(body) : body;
    response.writeHead(found ? 200 : 404, {
      'Content-Type': types[extension] || 'application/octet-stream',
      ...(canUseBrotli ? { 'Content-Encoding': 'br', Vary: 'Accept-Encoding' } : {}),
    });
    response.end(payload);
  } catch {
    response.writeHead(500, { 'Content-Type': 'text/plain' });
    response.end('Build output unavailable');
  }
}).listen(port, '127.0.0.1', () => console.log(`Static build: http://127.0.0.1:${port}`));
