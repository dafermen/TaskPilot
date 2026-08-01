import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

function documentationDirectoryIndexes() {
  return {
    name: 'taskpilot-documentation-directory-indexes',
    configureServer(server) {
      server.middlewares.use((request, response, next) => {
        const [pathname, query = ''] = (request.url || '').split('?');
        if (pathname.startsWith('/docs/') && pathname.endsWith('/')) {
          request.url = `${pathname}index.html${query ? `?${query}` : ''}`;
        }
        next();
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), documentationDirectoryIndexes()],
});
