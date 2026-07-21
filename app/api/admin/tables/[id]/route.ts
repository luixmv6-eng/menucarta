import { z } from "zod"
import { mutateDb } from "@/lib/server/db"
import { requireAdmin } from "@/lib/server/auth"

const patchSchema = z.object({
  name: z.string().trim().min(1).max(80).optional(),
  description: z.string().trim().max(300).optional(),
  capacityMin: z.number().int().min(1).max(100).optional(),
  capacityMax: z.number().int().min(1).max(100).optional(),
  minimumSpend: z.number().min(0).max(1000000).optional(),
  perks: z.array(z.string().trim().min(1).max(120)).max(8).optional(),
  active: z.boolean().optional(),
})

type Ctx = { params: Promise<{ id: string }> }

export async function PATCH(req: Request, ctx: Ctx) {
  const denied = await requireAdmin()
  if (denied) return denied
  const { id } = await ctx.params

  const parsed = patchSchema.safeParse(await req.json().catch(() => null))
  if (!parsed.success) return Response.json({ error: "Validation failed" }, { status: 400 })

  const table = mutateDb((db) => {
    const t = db.tables.find((x) => x.id === id)
    if (!t) return null
    Object.assign(t, parsed.data)
    return t
  })
  if (!table) return Response.json({ error: "Table not found" }, { status: 404 })
  return Response.json({ table })
}

export async function DELETE(_req: Request, ctx: Ctx) {
  const denied = await requireAdmin()
  if (denied) return denied
  const { id } = await ctx.params

  const removed = mutateDb((db) => {
    const idx = db.tables.findIndex((t) => t.id === id)
    if (idx === -1) return false
    db.tables.splice(idx, 1)
    return true
  })
  if (!removed) return Response.json({ error: "Table not found" }, { status: 404 })
  return Response.json({ ok: true })
}
