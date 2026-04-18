import { resolve } from 'path'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: '/calpe-vial/',
  plugins: [
    tailwindcss(),
  ],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        estructuras: resolve(__dirname, 'estructuras.html'),
        impresiones: resolve(__dirname, 'impresiones.html'),
        'publicidad-led': resolve(__dirname, 'publicidad-led.html'),
      },
    },
  },
})
