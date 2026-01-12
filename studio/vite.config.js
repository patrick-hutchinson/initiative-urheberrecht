// vite.config.js
import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    host: '0.0.0.0',
    allowedHosts: ['admin.initiativeurheberrecht.at', '68.183.220.187', 'localhost']
  }
})
