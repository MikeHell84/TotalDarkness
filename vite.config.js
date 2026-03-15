import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'serve-redemthor-static',
      configureServer(server) {
        // Usar 'pre' para ejecutar ANTES del middleware de Vite
        server.middlewares.use((req, res, next) => {
          // Servir archivos estáticos de redemthor directamente
          if (req.url === '/redemthor' || req.url === '/redemthor/') {
            req.url = '/redemthor/index.html';
          }
          // Servir archivos estáticos de el-ropero directamente
          if (req.url === '/el-ropero' || req.url === '/el-ropero/') {
            req.url = '/el-ropero/index.html';
          }
          next();
        });
      }
    }
  ],
  build: {
    // Optimizaciones para producción
    target: 'es2020',
    minify: 'esbuild',  // Usar esbuild en lugar de terser (más rápido y sin dependencias)
    // Configuración de chunks
    rollupOptions: {
      output: {
        // Use a function to split large node_modules into dedicated chunks
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router-dom')) return 'react-vendor';
            if (id.includes('three')) return 'three-vendor';
            if (id.includes('cytoscape')) return 'cytoscape-vendor';
            if (id.includes('katex')) return 'katex-vendor';
            if (id.includes('mermaid')) return 'mermaid-vendor';
            if (id.includes('lucide-react')) return 'ui-vendor';
            // fallback: put other node_modules into a vendors chunk
            return 'vendor';
          }
        },
        // Nombre de archivos con hash para cache busting
        entryFileNames: 'js/[name].[hash].js',
        chunkFileNames: 'js/[name].[hash].js',
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.');
          const ext = info[info.length - 1];
          if (/png|jpe?g|gif|svg|webp|ico/.test(ext)) {
            return `images/[name].[hash][extname]`;
          } else if (/woff|woff2|ttf|otf|eot/.test(ext)) {
            return `fonts/[name].[hash][extname]`;
          } else if (ext === 'css') {
            return `css/[name].[hash][extname]`;
          }
          return `[name].[hash][extname]`;
        },
      },
    },
    // Límites de tamaño
    reportCompressedSize: true,
    chunkSizeWarningLimit: 1000,
    // Ubicación del build
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true,
    // Source maps solo en desarrollo
    sourcemap: false,
  },
  server: {
    host: 'localhost',
    port: 5173,
    open: false,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/api'),
        // Allow some static files (dev fallbacks) to be served from Vite `public/`
        // instead of proxying to the backend. This prevents ECONNREFUSED
        // when the backend is down and lets `public/api/*.json` be used.
        bypass: (req, res, proxyOptions) => {
          try {
            if (!req || !req.url) return;
            // If a request is for the diagramas JSON stub, serve it directly
            if (req.url.includes('/diagramas-flujo.json')) {
              return req.url;
            }
            // Also allow any other static JSON under /api to be served locally
            if (req.url.endsWith('.json')) {
              return req.url;
            }
          } catch (err) {
            // swallow errors and let proxy handle the request
          }
        },
      },
    },
  }
})
