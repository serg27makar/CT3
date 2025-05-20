import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'
import mkcert from "vite-plugin-mkcert";
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  publicPath: process.env.NODE_ENV === 'production'
      ? process.env.VUE_APP_BASE_URL
      : '/',
  server: {
    host: 'localhost',
    https: true,
    proxy: {
      '^/api': {
        target: 'https://cases.dev.advantageinvestigations.com',
        changeOrigin: true,
        headers: {
          "X-Forwarded-Host": "localhost:8080"
        }
      }
    },
  },
  plugins: [
    vue(),
    vueJsx(),
    vueDevTools(),
    mkcert(),
  ],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `$quietDeps: true;`
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    },
  },
})
