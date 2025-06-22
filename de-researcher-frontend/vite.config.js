import { defineConfig } from 'vite'
import path from 'path'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    global: 'globalThis',  // Add this line to fix "global is not defined"
  },
  resolve: {
    alias: {
      buffer: 'buffer',
      "@": path.resolve(__dirname, "./src"),
      
    },
  },
})
