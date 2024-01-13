import { sveltekit } from '@sveltejs/kit/vite';
import viteBasicSslPlugin from '@vitejs/plugin-basic-ssl';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [
    sveltekit(),
    {
      ...viteBasicSslPlugin(),
      apply: (config) => !!config.preview?.https
    }
  ],
  test: {
    include: ['src/**/*.{test,spec}.{js,ts}']
  }
});
