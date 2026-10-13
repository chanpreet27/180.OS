import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

function copy404Plugin() {
  return {
    name: 'copy-404',
    closeBundle() {
      const distPath = path.resolve(__dirname, 'dist')
      const indexPath = path.join(distPath, 'index.html')
      const notFoundPath = path.join(distPath, '404.html')
      if (fs.existsSync(indexPath)) {
        fs.copyFileSync(indexPath, notFoundPath)
      }
    }
  }
}

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/180.OS/' : '/',
  plugins: [react(), copy404Plugin()],
  server: {
    port: 8081,
    strictPort: true,
    host: true,
    watch: {
      ignored: ['**/ezgif-**/**', '**/.git/**']
    }
  }
}))
