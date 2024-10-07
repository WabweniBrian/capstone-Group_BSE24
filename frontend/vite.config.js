import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "https://capstone-mern.vercel.app",
        changeOrigin: true,
        secure: false,
      },
    },
  },
  base: "./",
});
