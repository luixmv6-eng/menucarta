import { z } from "zod"
import { mutateDb } from "@/lib/server/db"
import { requireAdmin } from "@/lib/server/auth"

const patchSchema = z.object({
  name: z.string().trim().min(1).max(80).optional(),
  description: z.string().trim().max(300).optional(),
  icon: z.string().trim().max(40).optional(),
})

type Ctx = { params: Promise<{ id: string }> }

export async function PATCH(req: Request, ctx: Ctx) {
  const denied = await requireAdmin()
  if (denied) return denied
  const { id } = await ctx.params

  const parsed = patchSchema.safeParse(await req.json().catch(() => null))
  if (!parsed.success) return Response.json({ error: "Validation failed" }, { status: 400 })

  const category = mutateDb((db) => {
    const cat = db.categories.find((c) => c.id === id)
    if (!cat) return null
    Object.assign(cat, parsed.data)
    return cat
  })
  if (!category) return Response.json({ error: "Category not found" }, { status: 404 })
  return Response.json({ category })
}

export async function DELETE(_req: Request, ctx: Ctx) {
  const denied = await requireAdmin()
  if (denied) return denied
  const { id } = await ctx.params

  const removed = mutateDb((db) => {
    const idx = db.categories.findIndex((c) => c.id === id)
    if (idx === -1) return false
    db.categories.splice(idx, 1)
    return true
  })
  if (!removed) return Response.json({ error: "Category not found" }, { status: 404 })
  return Response.json({ ok: true })
}
