import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import UnheadVite from "@unhead/addons/vite"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    UnheadVite(),
  ],
})
