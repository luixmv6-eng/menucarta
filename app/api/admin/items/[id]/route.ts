import { z } from "zod"
import { mutateDb, newId } from "@/lib/server/db"
import { requireAdmin } from "@/lib/server/auth"

const patchSchema = z.object({
  categoryId: z.string().trim().min(1).optional(),
  name: z.string().trim().min(1).max(120).optional(),
  description: z.string().trim().max(600).optional(),
  price: z.number().min(0).max(100000).optional(),
  image: z.string().trim().max(500).optional(),
  tags: z.array(z.string().trim().min(1).max(40)).max(8).optional(),
  isSignature: z.boolean().optional(),
  pairingNote: z.string().trim().max(300).optional().nullable(),
  available: z.boolean().optional(),
})

type Ctx = { params: Promise<{ id: string }> }

export async function PATCH(req: Request, ctx: Ctx) {
  const denied = await requireAdmin()
  if (denied) return denied
  const { id } = await ctx.params

  const parsed = patchSchema.safeParse(await req.json().catch(() => null))
  if (!parsed.success) return Response.json({ error: "Validation failed", issues: parsed.error.flatten() }, { status: 400 })

  const item = mutateDb((db) => {
    for (const cat of db.categories) {
      const idx = cat.items.findIndex((i) => i.id === id)
      if (idx === -1) continue
      const current = cat.items[idx]
      const { categoryId, pairingNote, ...fields } = parsed.data
      Object.assign(current, fields)
      if (pairingNote !== undefined) current.pairingNote = pairingNote ?? undefined
      // Move between categories when requested
      if (categoryId && categoryId !== cat.id) {
        const target = db.categories.find((c) => c.id === categoryId)
        if (!target) return null
        cat.items.splice(idx, 1)
        target.items.push(current)
      }
      return current
    }
    return null
  })
  if (!item) return Response.json({ error: "Item or target category not found" }, { status: 404 })
  return Response.json({ item })
}

export async function DELETE(_req: Request, ctx: Ctx) {
  const denied = await requireAdmin()
  if (denied) return denied
  const { id } = await ctx.params

  const removed = mutateDb((db) => {
    for (const cat of db.categories) {
      const idx = cat.items.findIndex((i) => i.id === id)
      if (idx !== -1) {
        cat.items.splice(idx, 1)
        return true
      }
    }
    return false
  })
  if (!removed) return Response.json({ error: "Item not found" }, { status: 404 })
  return Response.json({ ok: true })
}
