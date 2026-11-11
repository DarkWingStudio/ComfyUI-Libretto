import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";

export default defineConfig({
  plugins: [vue()],
  build: {
    outDir: "dist",
    emptyOutDir: true,
    lib: {
      entry: path.resolve(__dirname, "src/extension.ts"),
      formats: ["es"],
      fileName: () => "libretto.js",
    },
    rollupOptions: {
      external: ["../../scripts/app.js"],
      output: {
        paths: {
          "../../scripts/app.js": "../../scripts/app.js",
        },
        assetFileNames: "assets/[name].[ext]",
      },
    },
  },
  define: {
    "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV || "production"),
  },
});
