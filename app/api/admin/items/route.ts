import { z } from "zod"
import { mutateDb, newId } from "@/lib/server/db"
import { requireAdmin } from "@/lib/server/auth"

const itemSchema = z.object({
  categoryId: z.string().trim().min(1),
  name: z.string().trim().min(1).max(120),
  description: z.string().trim().max(600).default(""),
  price: z.number().min(0).max(100000),
  image: z.string().trim().max(500).default("/placeholder.jpg"),
  tags: z.array(z.string().trim().min(1).max(40)).max(8).default([]),
  isSignature: z.boolean().default(false),
  pairingNote: z.string().trim().max(300).optional(),
  available: z.boolean().default(true),
})

export async function POST(req: Request) {
  const denied = await requireAdmin()
  if (denied) return denied

  const parsed = itemSchema.safeParse(await req.json().catch(() => null))
  if (!parsed.success) return Response.json({ error: "Validation failed", issues: parsed.error.flatten() }, { status: 400 })

  const { categoryId, ...fields } = parsed.data
  const item = mutateDb((db) => {
    const cat = db.categories.find((c) => c.id === categoryId)
    if (!cat) return null
    const record = { ...fields, id: newId("item"), image: fields.image || "/placeholder.jpg" }
    cat.items.push(record)
    return record
  })
  if (!item) return Response.json({ error: "Category not found" }, { status: 404 })
  return Response.json({ item }, { status: 201 })
}
