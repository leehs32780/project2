import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { loadEnv } from "vite";
import { amadeusPlugin } from "./amadeusPlugin.js";
import { skyFinderDbPlugin } from "./DB/skyFinderDbPlugin.js";

export default defineConfig(({ mode }) => {
  Object.assign(process.env, loadEnv(mode, process.cwd(), ""));
  return {
    plugins: [react(), amadeusPlugin(), skyFinderDbPlugin()],
  };
});
