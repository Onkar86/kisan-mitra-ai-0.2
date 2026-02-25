import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  base: '/kisan-mitra-ai-0.2/',
  plugins: [react(), tailwindcss()],
});