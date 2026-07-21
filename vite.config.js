import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';

const root = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: `${root}index.html`,
        about: `${root}about.html`,
        workSyncManagement: `${root}work-sync-management.html`,
      },
    },
  },
});
