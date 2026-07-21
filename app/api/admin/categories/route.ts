import { z } from "zod"
import { getDb, mutateDb, newId } from "@/lib/server/db"
import { requireAdmin } from "@/lib/server/auth"

const categorySchema = z.object({
  name: z.string().trim().min(1).max(80),
  description: z.string().trim().max(300).default(""),
  icon: z.string().trim().max(40).default("utensils"),
})

export async function GET() {
  const denied = await requireAdmin()
  if (denied) return denied
  return Response.json({ categories: getDb().categories })
}

export async function POST(req: Request) {
  const denied = await requireAdmin()
  if (denied) return denied

  const parsed = categorySchema.safeParse(await req.json().catch(() => null))
  if (!parsed.success) return Response.json({ error: "Validation failed", issues: parsed.error.flatten() }, { status: 400 })

  const category = mutateDb((db) => {
    const record = { ...parsed.data, id: newId("cat"), items: [] }
    db.categories.push(record)
    return record
  })
  return Response.json({ category }, { status: 201 })
}
