import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

// Vue 版本配置
export default defineConfig({
  plugins: [vue()],
  root: '.',
  publicDir: 'public',
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src-vue'),
      '@shared': resolve(__dirname, 'shared'),
    },
  },
  server: {
    port: 8081,
    open: true,
  },
  build: {
    outDir: 'dist-vue',
    sourcemap: true,
    rollupOptions: {
      input: resolve(__dirname, 'src-vue/index.html'),
    },
  },
})

