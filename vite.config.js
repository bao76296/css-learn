// vite.config.js
import { resolve } from 'path'
import { defineConfig } from 'vite'
console.log(resolve(__dirname, 'src/star/index.html'))

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        index:resolve(__dirname, 'index/index.html'),
        star: resolve(__dirname, 'star/index.html'),
        audioCanva: resolve(__dirname, 'audioCanvas/index.html'),

      },
    },
    cssCodeSplit: "lightningcss"
  },
  // css: {
  //   preprocessorOptions: {
  //     scss: {
  //       additionalData: `@import "./style.scss";`
  //     }
  //   }
  // },
})