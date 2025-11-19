import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// React 版本配置
export default defineConfig({
  plugins: [react()],
  root: resolve(__dirname, 'src-react'), // 将 root 设置为 src-react 目录
  publicDir: resolve(__dirname, 'public'),
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src-react'),
      '@shared': resolve(__dirname, 'shared'),
    },
    preserveSymlinks: false,
  },
  server: {
    port: 8082,
    open: true,
  },
  build: {
    outDir: resolve(__dirname, 'dist-react'),
    sourcemap: true,
    rollupOptions: {
      input: resolve(__dirname, 'src-react/index.html'),
    },
  },
})

