import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { createReadStream, existsSync } from 'node:fs';
import { extname, join, normalize } from 'node:path';

const mime = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
};

export function serve(root, port, label) {
  const server = createServer(async (req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const cleanPath = normalize(decodeURIComponent(url.pathname)).replace(/^\.\.(\/|\\|$)/, '');
    let filePath = join(root, cleanPath === '/' ? 'index.html' : cleanPath);

    if (!existsSync(filePath)) filePath = join(root, 'index.html');

    try {
      res.setHeader('Content-Type', mime[extname(filePath)] || 'application/octet-stream');
      createReadStream(filePath).pipe(res);
    } catch {
      res.statusCode = 500;
      res.end('Error serving Artist OS');
    }
  });

  server.listen(port, '0.0.0.0', async () => {
    const host = `http://localhost:${port}`;
    console.log(`${label} running at ${host}`);
    try {
      const html = await readFile(join(root, 'index.html'), 'utf8');
      if (!html.includes('Artist OS')) console.warn('index.html loaded, but title check did not find Artist OS.');
    } catch {}
  });
}
