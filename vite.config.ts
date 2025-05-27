import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: '/',
  server: {
    host: "::",
    port: 8080,
    fs: {
      // Allow serving files from audio directory
      allow: ['..', './public/audio']
    }
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // تحسين الضغط والتقسيم
    rollupOptions: {
      output: {
        // Cache busting with hash in filenames
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          // Keep audio files in their original location without hash
          if (assetInfo.name && /\.(mp3|webm|wav|ogg)$/.test(assetInfo.name)) {
            return 'audio/[name].[ext]';
          }
          return 'assets/[name]-[hash].[ext]';
        },
        manualChunks: {
          // تقسيم المكتبات الكبيرة
          vendor: ['react', 'react-dom'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-tabs'],
          motion: ['framer-motion'],
          icons: ['lucide-react'],
          supabase: ['@supabase/supabase-js'],
          router: ['react-router-dom'],
          query: ['@tanstack/react-query']
        }
      }
    },
    // ضغط أفضل
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: mode === 'production',
        drop_debugger: mode === 'production',
        pure_funcs: mode === 'production' ? ['console.log', 'console.info'] : []
      }
    },
    // تحسين حجم الملفات
    chunkSizeWarningLimit: 1000,
    // ضغط CSS
    cssMinify: true,
    // تحسين للـ Cloudflare Pages
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    // تحسين الأداء
    target: 'es2020'
  },
  // ضغط الخادم التطويري
  preview: {
    headers: {
      'Cache-Control': 'public, max-age=31536000'
    }
  }
}));
