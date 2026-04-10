import { defineConfig } from "nitro"

export default defineConfig({
  serverDir: "./src",
  ignore: ["routes/**/*.{jsx,tsx}"], // our client routes should not end up in the server bundle!
})
