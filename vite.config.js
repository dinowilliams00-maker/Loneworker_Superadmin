import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
  ],
  resolve: {
    alias: [
      // More specific aliases MUST come before the generic 'src' alias
      { find: "src/components", replacement: path.resolve(__dirname, './src/Components/common') },
      { find: "src/utils", replacement: path.resolve(__dirname, './src/Components/common/utils') },
      { find: "src", replacement: path.resolve(__dirname, './src') },
    ],
  },
  server: {
    watch: {
      usePolling: false,
    },
  },
})
