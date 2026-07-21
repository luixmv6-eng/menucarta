import { createHmac, timingSafeEqual } from "node:crypto"
import { cookies } from "next/headers"

const SECRET = process.env.LUMINA_SESSION_SECRET || "lumina-dev-secret-change-in-production"
const ADMIN_USER = process.env.LUMINA_ADMIN_USER || "admin"
const ADMIN_PASSWORD = process.env.LUMINA_ADMIN_PASSWORD || "lumina2026"

export const SESSION_COOKIE = "lumina_admin_session"
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7 // 7 days

function sign(payload: string): string {
  return createHmac("sha256", SECRET).update(payload).digest("base64url")
}

export function checkCredentials(user: string, password: string): boolean {
  return safeEquals(user, ADMIN_USER) && safeEquals(password, ADMIN_PASSWORD)
}

function safeEquals(a: string, b: string): boolean {
  const ba = Buffer.from(a)
  const bb = Buffer.from(b)
  if (ba.length !== bb.length) return false
  return timingSafeEqual(ba, bb)
}

export function createSessionToken(): string {
  const payload = Buffer.from(JSON.stringify({ u: ADMIN_USER, exp: Date.now() + SESSION_TTL_MS })).toString("base64url")
  return `${payload}.${sign(payload)}`
}

export function verifySessionToken(token: string | undefined): boolean {
  if (!token) return false
  const [payload, sig] = token.split(".")
  if (!payload || !sig) return false
  if (!safeEquals(sig, sign(payload))) return false
  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as { exp: number }
    return typeof data.exp === "number" && data.exp > Date.now()
  } catch {
    return false
  }
}

export async function isAdminSession(): Promise<boolean> {
  const store = await cookies()
  return verifySessionToken(store.get(SESSION_COOKIE)?.value)
}

/** Guard for admin API routes. Returns a 401 Response when unauthorized, null when OK. */
export async function requireAdmin(): Promise<Response | null> {
  if (await isAdminSession()) return null
  return Response.json({ error: "Unauthorized" }, { status: 401 })
}

export function sessionCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_TTL_MS / 1000,
  }
}
