import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';

await rm('dist', { recursive: true, force: true });
await mkdir('dist', { recursive: true });

const html = await readFile('index.html', 'utf8');
const productionHtml = html
  .replace('<link rel="stylesheet" href="/src/styles.css" />', '<link rel="stylesheet" href="./styles.css">')
  .replace('<script type="module" src="/src/main.js"></script>', '<script defer src="./main.js"></script>');

await writeFile('dist/index.html', productionHtml);
await cp('src/styles.css', 'dist/styles.css');
await cp('src/main.js', 'dist/main.js');
if (existsSync('public')) await cp('public', 'dist', { recursive: true });
console.log('Artist OS build completed in dist/');
