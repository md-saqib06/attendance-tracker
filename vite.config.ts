// import path from "path"
// import react from "@vitejs/plugin-react-swc"
// import { defineConfig } from "vite"

// export default defineConfig({
//   plugins: [react()],
//   resolve: {
//     alias: {
//       "@": path.resolve(__dirname, "./src"),
//     },
//   },
// })

import path from "path";
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Increase the chunk size warning limit (default is 500 KB)
    chunkSizeWarningLimit: 500, // Increase to 1MB

    // Output options for chunking and splitting
    rollupOptions: {
      output: {
        // This option enables custom chunk splitting based on shared dependencies
        manualChunks: {
          // Split vendor libraries into a separate chunk
          vendor: [
            'react',
            'react-dom',
            'react-router-dom',
            '@clerk/clerk-react',
            '@clerk/react-router',
          ],
          // UI components chunk
          ui: [
            '@radix-ui/react-checkbox',
            '@radix-ui/react-dialog',
            '@radix-ui/react-label',
            '@radix-ui/react-popover',
            '@radix-ui/react-slot',
          ],
          // Utility libraries chunk
          utils: [
            'clsx',
            'class-variance-authority',
            'tailwind-merge',
            'date-fns',
            'lucide-react',
            'recharts',
          ],
          // Split further based on other criteria, such as large components or libraries
        },
      },
    },
    // Enable code-splitting for CSS files as well
    cssCodeSplit: true,
  },

  // Dependency optimization settings for pre-bundling
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@clerk/clerk-react',
      '@clerk/react-router',
      'clsx',
      'date-fns',
      'lucide-react',
      'recharts',
    ],
  },
});
