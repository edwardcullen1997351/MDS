import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { build } from 'esbuild';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const chrome = 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe';
if (!fs.existsSync(chrome)) {
  throw new Error('Chrome is required for the browser focus test.');
}

const angularBundle = await build({
  entryPoints: [path.join(root, 'packages/angular/src/utils/focus-trap.ts')],
  bundle: true,
  format: 'esm',
  platform: 'browser',
  target: 'es2022',
  write: false,
});
const reactBundle = await build({
  entryPoints: [path.join(root, 'tests/phase3-focus-react.tsx')],
  bundle: true,
  format: 'iife',
  platform: 'browser',
  target: 'es2022',
  write: false,
});

const server = http.createServer((request, response) => {
  const relative = decodeURIComponent(new URL(request.url, 'http://127.0.0.1').pathname);
  if (relative === '/__phase3-angular.js') {
    response.setHeader('Content-Type', 'text/javascript');
    response.end(angularBundle.outputFiles[0].contents);
    return;
  }
  if (relative === '/__phase3-react.js') {
    response.setHeader('Content-Type', 'text/javascript');
    response.end(reactBundle.outputFiles[0].contents);
    return;
  }
  const filePath = path.resolve(root, `.${relative}`);
  if (!filePath.startsWith(`${root}${path.sep}`) || !fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
    response.writeHead(404).end();
    return;
  }
  response.setHeader('Content-Type', filePath.endsWith('.js') ? 'text/javascript' : 'text/html');
  fs.createReadStream(filePath).pipe(response);
});

await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const address = server.address();
const tempRoot = path.join(root, '.tmp');
fs.mkdirSync(tempRoot, { recursive: true });

try {
  for (const [name, fixture] of [
    ['Angular', 'tests/phase3-focus-angular.html'],
    ['React', 'tests/phase3-focus-react.html'],
  ]) {
    const profile = fs.mkdtempSync(path.join(tempRoot, 'phase3-chrome-'));
    if (!profile.startsWith(`${tempRoot}${path.sep}`)) throw new Error('Unsafe Chrome profile path.');
    try {
      const args = [
        '--headless=new', '--disable-gpu', '--no-first-run', '--no-sandbox', '--disable-extensions',
        `--user-data-dir=${profile}`, '--virtual-time-budget=3000', '--dump-dom',
        `http://127.0.0.1:${address.port}/${fixture}`,
      ];
      const result = await new Promise((resolve, reject) => {
        const child = spawn(chrome, args, { windowsHide: true });
        let stdout = '';
        let stderr = '';
        const timer = setTimeout(() => child.kill(), 25000);
        child.stdout.setEncoding('utf8').on('data', chunk => { stdout += chunk; });
        child.stderr.setEncoding('utf8').on('data', chunk => { stderr += chunk; });
        child.on('error', reject);
        child.on('close', code => {
          clearTimeout(timer);
          resolve({ code, stdout, stderr });
        });
      });
      const match = result.stdout.match(/PHASE3_RESULT ([^<]+)<\/div>/);
      if (!match) {
        throw new Error(`${name} browser fixture did not finish (exit ${result.code}). ${result.stderr.slice(0, 500)}`);
      }
      console.log(`${name}: ${match[1]}`);
      if (match[1].includes(':fail')) process.exitCode = 1;
    } finally {
      fs.rmSync(profile, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 });
    }
  }
} finally {
  await new Promise(resolve => server.close(resolve));
}
