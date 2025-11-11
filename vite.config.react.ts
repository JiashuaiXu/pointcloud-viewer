import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// React 版本配置
export default defineConfig({
  plugins: [react()],
  root: '.',
  publicDir: 'public',
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src-react'),
      '@shared': resolve(__dirname, 'shared'),
    },
  },
  server: {
    port: 8082,
    open: true,
  },
  build: {
    outDir: 'dist-react',
    sourcemap: true,
    rollupOptions: {
      input: resolve(__dirname, 'src-react/index.html'),
    },
  },
})

