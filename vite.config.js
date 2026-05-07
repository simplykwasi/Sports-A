import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Vite config for the React frontend build.
export default defineConfig({
  plugins: [react()],
})
