import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import colors from './src/styles/colors'
import path from 'path'
// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss()],
   resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
   theme: {
    extend: {
      colors: {
        primary: colors.primary,
        secondary: colors.secondary,
        accent: colors.accent,
        background: colors.background,
        danger: colors.danger,
      },
    },
  },
})
