import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath, URL } from "node:url";

const createAlias = (path) => fileURLToPath(new URL(path, import.meta.url));

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": createAlias("./src"),
      "@formatters": createAlias("./src/utils/formatters.js"),
      "@validators": createAlias("./src/utils/validators.js"),
      "@constants": createAlias("./src/utils/constants.js"),
      "@helpers": createAlias("./src/utils/helpers.js"),
      "@utils": createAlias("./src/utils"),
      "@components": createAlias("./src/components"),
      "@pages": createAlias("./src/pages"),
      "@hooks": createAlias("./src/hooks"),
      "@services": createAlias("./src/services"),
      "@context": createAlias("./src/context"),
      "@assets": createAlias("./src/assets"),
      "@styles": createAlias("./src/styles"),
    },
  },
});
