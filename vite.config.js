import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_');
  const stackroxUrl = (env.VITE_STACKROX_URL || '').replace(/\/+$/, '');

  return {
    base: process.env.NODE_ENV === 'production' ? '/prototype/' : '/',
    plugins: [react(), svgr()],
    server: {
      host: true,
      port: 5173,
      proxy: stackroxUrl ? {
        '/stackrox-api': {
          target: stackroxUrl,
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/stackrox-api/, ''),
        },
      } : undefined,
    },
  };
});
