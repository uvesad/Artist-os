import { serve } from './server.js';
serve('.', Number(process.env.PORT || 5173), 'Artist OS dev server');
