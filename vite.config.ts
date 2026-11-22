import { fileURLToPath, URL } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    rolldownOptions: {
      output: {
        strictExecutionOrder: true,
        codeSplitting: {
          groups: [
            {
              name: 'react-runtime',
              test: /node_modules\/(react|react-dom|scheduler)\//,
              priority: 30,
            },
            {
              name: 'three',
              test: /node_modules\/three\//,
              priority: 20,
              maxSize: 350000,
            },
            {
              name: 'three-renderer',
              test: /@react-three|react-reconciler|react-use-measure|suspend-react/,
              priority: 15,
              maxSize: 250000,
            },
            {
              name: 'motion',
              test: /motion-dom|motion-utils|framer-motion/,
              priority: 10,
              maxSize: 250000,
            },
            {
              name: 'radix',
              test: /@radix-ui|radix-ui/,
              priority: 5,
              maxSize: 250000,
            },
          ],
        },
      },
    },
  },
  test: {
    environment: 'jsdom',
    maxWorkers: 2,
    include: ['src/**/*.test.{ts,tsx}'],
    setupFiles: ['./src/test/setup.ts'],
  },
})
