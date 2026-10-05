import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'apps/storybook/dist');
const chrome = process.env.CHROME_BIN || 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe';
if (!fs.existsSync(path.join(dist, 'iframe.html'))) throw new Error('Build Storybook before checking assembly landmarks.');
if (!fs.existsSync(chrome)) throw new Error('Set CHROME_BIN to a Chrome executable.');

const mime = { '.js': 'text/javascript', '.css': 'text/css', '.html': 'text/html', '.json': 'application/json', '.svg': 'image/svg+xml' };
const server = http.createServer((request, response) => {
  const route = decodeURIComponent(new URL(request.url, 'http://127.0.0.1').pathname);
  if (route === '/__phase4-landmarks.html') {
    response.setHeader('Content-Type', 'text/html');
    response.end(fs.readFileSync(path.join(root, 'tests/phase4-landmarks.html')));
    return;
  }
  const filePath = path.resolve(dist, `.${route}`);
  if (!filePath.startsWith(`${dist}${path.sep}`) || !fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
    response.writeHead(404).end();
    return;
  }
  response.setHeader('Content-Type', mime[path.extname(filePath)] || 'application/octet-stream');
  fs.createReadStream(filePath).pipe(response);
});

await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const tempRoot = path.join(root, '.tmp');
fs.mkdirSync(tempRoot, { recursive: true });
const profile = fs.mkdtempSync(path.join(tempRoot, 'phase4-landmarks-'));
if (!profile.startsWith(`${tempRoot}${path.sep}`)) throw new Error('Unsafe Chrome profile path.');

try {
  const url = `http://127.0.0.1:${server.address().port}/__phase4-landmarks.html`;
  const args = [
    '--headless=new', '--disable-gpu', '--no-first-run', '--no-sandbox', '--disable-extensions',
    `--user-data-dir=${profile}`, '--virtual-time-budget=90000', '--dump-dom', url,
  ];
  const result = await new Promise((resolve, reject) => {
    const child = spawn(chrome, args, { windowsHide: true });
    let stdout = '';
    let stderr = '';
    const timer = setTimeout(() => child.kill(), 120000);
    child.stdout.setEncoding('utf8').on('data', chunk => { stdout += chunk; });
    child.stderr.setEncoding('utf8').on('data', chunk => { stderr += chunk; });
    child.on('error', reject);
    child.on('close', code => {
      clearTimeout(timer);
      resolve({ code, stdout, stderr });
    });
  });
  const match = result.stdout.match(/PHASE4_LANDMARKS ([^<]+)<\/div>/);
  if (!match) throw new Error(`Landmark fixture did not finish (exit ${result.code}). ${result.stderr.slice(0, 500)}`);
  console.log(match[1]);
  if (match[1].includes(':fail')) process.exitCode = 1;
} finally {
  await new Promise(resolve => server.close(resolve));
  fs.rmSync(profile, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 });
}
