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
        'grafica-carteleria': resolve(__dirname, 'grafica-carteleria.html'),
        'via-publica': resolve(__dirname, 'via-publica.html'),
      },
    },
  },
})
