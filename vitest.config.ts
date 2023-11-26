/// <reference types="vitest"/>

// https://vitejs.dev/config/
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsxPlugin from "@vitejs/plugin-vue-jsx";

export default defineConfig({
  plugins: [
    vue(),
    vueJsxPlugin()
  ],
  test: {
    globals: true,
    environment: 'jsdom'
  }
})
