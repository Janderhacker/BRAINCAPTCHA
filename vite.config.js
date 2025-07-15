import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig(({ mode }) => {
  if (mode === 'lib') {
    return {
      build: {
        lib: {
          entry: resolve(__dirname, 'src/braincaptcha-standalone.js'),
          name: 'BrainCaptcha',
          fileName: 'braincaptcha',
          formats: ['iife', 'es', 'cjs']
        },
        rollupOptions: {
          output: {
            banner: '/* BrainCaptcha v1.0.0 - MIT License */',
            extend: true
          }
        }
      }
    }
  }
  
  return {
    // Default development config
    root: '.',
    build: {
      outDir: 'dist',
      emptyOutDir: true
    }
  }
})
