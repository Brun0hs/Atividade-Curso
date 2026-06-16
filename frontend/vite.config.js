import { defineConfig } from 'vite'

// https://vite.dev/config/
// App em JavaScript puro (ES Modules) — sem framework, sem plugins.
export default defineConfig({
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    watch: {
      // Polling é necessário para o HMR funcionar dentro do Docker
      // quando o código é montado via bind mount no Windows/macOS.
      usePolling: true,
      interval: 100,
    },
    hmr: {
      host: 'localhost',
      port: 5173,
    },
  },
})
