import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';

const root = join(process.cwd(), 'dist');
const port = Number(process.env.PORT || 4173);
const types = { '.css': 'text/css', '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.json': 'application/json', '.mjs': 'text/javascript', '.png': 'image/png', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.woff': 'font/woff', '.woff2': 'font/woff2', '.xml': 'application/xml' };

async function existingFile(path) {
  try { return (await stat(path)).isFile() ? path : null; } catch { return null; }
}

createServer(async (request, response) => {
  const pathname = decodeURIComponent(new URL(request.url || '/', 'http://localhost').pathname);
  const safePath = normalize(pathname).replace(/^([/\\]*\.\.[/\\])+/, '').replace(/^[/\\]+/, '');
  const direct = await existingFile(join(root, safePath));
  const routeIndex = await existingFile(join(root, safePath, 'index.html'));
  const file = direct || routeIndex || join(root, 'index.html');
  try {
    const body = await readFile(file);
    response.writeHead(200, { 'Content-Type': types[extname(file)] || 'application/octet-stream' });
    response.end(body);
  } catch {
    response.writeHead(500, { 'Content-Type': 'text/plain' });
    response.end('Build output unavailable');
  }
}).listen(port, '127.0.0.1', () => console.log(`Static build: http://127.0.0.1:${port}`));
