import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const resolvePort = () => {
  const rawPort = process.env.PORT || process.env.CODESANDBOX_PORT || '2222'
  const parsedPort = Number.parseInt(rawPort, 10)
  return Number.isNaN(parsedPort) ? 2222 : parsedPort
}

const serverConfig = {
  host: '0.0.0.0',
  port: resolvePort(),
  strictPort: true,
  allowedHosts: true,
}

export default defineConfig({
  plugins: [react()],
  server: serverConfig,
  preview: serverConfig,
})
