import { z } from "zod"
import { cookies } from "next/headers"
import { checkCredentials, createSessionToken, SESSION_COOKIE, sessionCookieOptions } from "@/lib/server/auth"

const loginSchema = z.object({
  user: z.string().min(1).max(100),
  password: z.string().min(1).max(200),
})

export async function POST(req: Request) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 })
  }
  const parsed = loginSchema.safeParse(body)
  if (!parsed.success) return Response.json({ error: "Missing credentials" }, { status: 400 })

  if (!checkCredentials(parsed.data.user, parsed.data.password)) {
    return Response.json({ error: "Invalid username or password" }, { status: 401 })
  }

  const store = await cookies()
  store.set(SESSION_COOKIE, createSessionToken(), sessionCookieOptions())
  return Response.json({ ok: true })
}
