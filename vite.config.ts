import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import path from "path"
// import { nodePolyfills } from 'vite-plugin-node-polyfills';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // nodePolyfills(),
],
// server: {
//     proxy: {
//       '/clarifai-api': {
//         target: 'https://api.clarifai.com',
//         changeOrigin: true,
//         rewrite: (path) => path.replace(/^\/clarifai-api/, '/v2'),
//       },
//     },
//   },
//   define: {
//     global: 'window',
//     'process.env': {}, 
//   },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: "dist",
    sourcemap: true,
  },
})

