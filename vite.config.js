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
        workBrandNarrative: `${root}work-brand-narrative.html`,
        // 給特定客戶的報價頁，不進選單／導覽／sitemap，只靠 /private-services 網址存取
        privateServices: `${root}private-services.html`,
      },
    },
  },
});
