// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import node from '@astrojs/node';
import icon from 'astro-icon';
import alpinejs from '@astrojs/alpinejs';

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: node({
    mode: 'standalone'
  }),
  integrations: [icon({
    include: {
      lucide: ['*']
    }
  }), alpinejs()],
  vite: {
    plugins: [tailwindcss()],
    build: {
      rollupOptions: {
        external: [/^@swc\/helpers/]
      }
    }
  }
});