import { defineConfig } from "nitro"

export default defineConfig({
  serverDir: "./src",
  ignore: ["routes/**/*.{jsx,tsx,d.ts}"], // our client routes should not end up in the server bundle!,
  runtimeConfig: {
    databaseUrl: "",
    databaseAuthToken: "",
    betterAuthSecret: "",
    betterAuthUrl: "",
    googleClientId: "",
    googleClientSecret: "",
    nitro: {
      envPrefix: "APP_",
    },
  },
})
