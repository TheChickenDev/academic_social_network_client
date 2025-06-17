import path from 'path'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      stream: 'stream-browserify',
      buffer: 'buffer',
      util: 'util',
      events: 'events',
      process: 'process/browser'
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler'
      }
    }
  },
  define: {
    global: 'globalThis'
  },
  optimizeDeps: {
    include: ['buffer', 'process', 'stream', 'events', 'util']
  }
})
