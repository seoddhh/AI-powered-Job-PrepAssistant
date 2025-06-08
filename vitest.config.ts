import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  test: {
    environment: "jsdom",
 codex/add-personalinfoform-test
    setupFiles: "./vitest.setup.ts",
    globals: true,

  },
});
