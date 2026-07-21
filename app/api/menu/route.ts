import { getDb } from "@/lib/server/db"

export const dynamic = "force-dynamic"

export async function GET() {
  const db = getDb()
  const categories = db.categories.map((cat) => ({
    ...cat,
    items: cat.items.filter((item) => item.available !== false),
  }))
  return Response.json({ categories })
}
