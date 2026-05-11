import { existsSync } from 'node:fs';
import { serve } from './server.js';

if (!existsSync('dist/index.html')) {
  console.error('No existe dist/index.html. Ejecuta npm run build antes de npm run preview.');
  process.exit(1);
}
serve('dist', Number(process.env.PORT || 4173), 'Artist OS preview');
