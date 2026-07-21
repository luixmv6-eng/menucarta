import { getDb } from "@/lib/server/db"
import { requireAdmin } from "@/lib/server/auth"

export async function GET() {
  const denied = await requireAdmin()
  if (denied) return denied
  const orders = [...getDb().orders].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
  return Response.json({ orders })
}
