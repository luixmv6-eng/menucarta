import { z } from "zod"
import { mutateDb } from "@/lib/server/db"
import { requireAdmin } from "@/lib/server/auth"

const patchSchema = z.object({
  title: z.string().trim().min(1).max(120).optional(),
  subtitle: z.string().trim().max(160).optional(),
  description: z.string().trim().max(1000).optional(),
  price: z.number().min(0).max(1000000).optional(),
  priceLabel: z.string().trim().max(60).optional(),
  category: z.enum(["event", "couples", "tasting", "private"]).optional(),
  image: z.string().trim().max(500).optional(),
  badge: z.string().trim().max(40).optional().nullable(),
  features: z.array(z.string().trim().min(1).max(120)).max(10).optional(),
  featured: z.boolean().optional(),
  active: z.boolean().optional(),
})

type Ctx = { params: Promise<{ id: string }> }

export async function PATCH(req: Request, ctx: Ctx) {
  const denied = await requireAdmin()
  if (denied) return denied
  const { id } = await ctx.params

  const parsed = patchSchema.safeParse(await req.json().catch(() => null))
  if (!parsed.success) return Response.json({ error: "Validation failed", issues: parsed.error.flatten() }, { status: 400 })

  const experience = mutateDb((db) => {
    const exp = db.experiences.find((e) => e.id === id)
    if (!exp) return null
    const { badge, ...fields } = parsed.data
    Object.assign(exp, fields)
    if (badge !== undefined) exp.badge = badge ?? undefined
    return exp
  })
  if (!experience) return Response.json({ error: "Experience not found" }, { status: 404 })
  return Response.json({ experience })
}

export async function DELETE(_req: Request, ctx: Ctx) {
  const denied = await requireAdmin()
  if (denied) return denied
  const { id } = await ctx.params

  const removed = mutateDb((db) => {
    const idx = db.experiences.findIndex((e) => e.id === id)
    if (idx === -1) return false
    db.experiences.splice(idx, 1)
    return true
  })
  if (!removed) return Response.json({ error: "Experience not found" }, { status: 404 })
  return Response.json({ ok: true })
}
