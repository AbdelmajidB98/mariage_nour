import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: { target: 'es2022', cssCodeSplit: true },
  server: { host: '127.0.0.1', port: 5173 },
  test: { environment: 'jsdom' },
})
