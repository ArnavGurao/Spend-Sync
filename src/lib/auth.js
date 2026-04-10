import { betterAuth } from "better-auth"
import { drizzleAdapter } from "@better-auth/drizzle-adapter"
import { useRuntimeConfig } from "nitro/runtime-config"

import * as schema from "@/db/schema"
import { db } from "@/src/lib/db"

const runtimeConfig = useRuntimeConfig()

function requireConfig(name, value) {
  if (!value) {
    // throw new Error(`Missing required runtime config: ${name}`)
  }
  return value
}

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "sqlite",
    schema,
  }),
  baseURL: requireConfig("APP_BETTER_AUTH_URL", runtimeConfig.betterAuthUrl),
  trustedOrigins: ["http://localhost:3000", "http://localhost:5000"],
  basePath: "/api/auth",
  secret: requireConfig(
    "APP_BETTER_AUTH_SECRET",
    runtimeConfig.betterAuthSecret,
  ),
  socialProviders: {
    google: {
      clientId: requireConfig(
        "APP_GOOGLE_CLIENT_ID",
        runtimeConfig.googleClientId,
      ),
      clientSecret: requireConfig(
        "APP_GOOGLE_CLIENT_SECRET",
        runtimeConfig.googleClientSecret,
      ),
    },
  },
})
