/// <reference types="vitest" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],

  server: {
    proxy: {
      '/api': {
        target: 'http://api.mantran.et.br:35390',
        changeOrigin: true,
        secure: false, // necessário para HTTPS com certificado auto-assinado (localhost)
      },
    },
  },

  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./src/test/setupTests.ts",
    css: true,
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      include: ["src/**/*.{js,jsx,ts,tsx}"],
      exclude: ["src/test/**", "**/*.d.ts"],
    },
  },
});
