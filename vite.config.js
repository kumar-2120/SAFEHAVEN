import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: Number(process.env.PORT) || 2222,
    strictPort: true,
  },
  preview: {
    host: '0.0.0.0',
    port: Number(process.env.PORT) || 2222,
    strictPort: true,
  },
})
