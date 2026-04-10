import type { auth } from "@/src/lib/auth"

declare module "h3" {
  interface H3EventContext {
    user: NonNullable<Awaited<ReturnType<typeof auth.api.getSession>>>["user"]
    session: NonNullable<
      Awaited<ReturnType<typeof auth.api.getSession>>
    >["session"]
  }
}
