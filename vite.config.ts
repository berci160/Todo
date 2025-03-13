import svgr from '@svgr/rollup';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import eslint from 'vite-plugin-eslint';
import viteTsConfigPaths from 'vite-tsconfig-paths';
// TS bug
// eslint-disable-next-line import/no-unresolved
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  root: 'src',
  publicDir: '../public',
  plugins: [tailwindcss(), viteTsConfigPaths(), react(), eslint(), svgr()],
});
