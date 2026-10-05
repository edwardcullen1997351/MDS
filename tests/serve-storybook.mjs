import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'apps/storybook/dist');
if (!fs.existsSync(path.join(dist, 'index.json'))) {
  throw new Error('Build Storybook before running accessibility tests.');
}
const mime = { '.js': 'text/javascript', '.css': 'text/css', '.html': 'text/html', '.json': 'application/json', '.svg': 'image/svg+xml', '.woff2': 'font/woff2' };
http.createServer((request, response) => {
  const route = decodeURIComponent(new URL(request.url, 'http://127.0.0.1').pathname);
  const filePath = path.resolve(dist, `.${route}`);
  if (!filePath.startsWith(`${dist}${path.sep}`) || !fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
    response.writeHead(404).end();
    return;
  }
  response.setHeader('Content-Type', mime[path.extname(filePath)] || 'application/octet-stream');
  fs.createReadStream(filePath).pipe(response);
}).listen(4173, '127.0.0.1', () => console.log('Storybook assets ready at http://127.0.0.1:4173'));
