import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  // W dev mode używaj '/', w production '/elektryczny/'
  base: mode === 'production' ? '/elektryczny/' : '/',
}))
