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
