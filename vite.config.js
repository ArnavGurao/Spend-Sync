import { defineConfig } from "vite"
import { nitro } from "nitro/vite"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import myPlugin from "./my-plugin.js"

export default defineConfig({
  plugins: [myPlugin(), tailwindcss(), react(), nitro()],
  resolve: {
    tsconfigPaths: true,
  },
})
