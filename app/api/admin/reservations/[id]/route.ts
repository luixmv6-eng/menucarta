import { z } from "zod"
import { mutateDb } from "@/lib/server/db"
import { requireAdmin } from "@/lib/server/auth"

const patchSchema = z.object({
  status: z.enum(["pending", "confirmed", "cancelled"]),
})

type Ctx = { params: Promise<{ id: string }> }

export async function PATCH(req: Request, ctx: Ctx) {
  const denied = await requireAdmin()
  if (denied) return denied
  const { id } = await ctx.params

  const parsed = patchSchema.safeParse(await req.json().catch(() => null))
  if (!parsed.success) return Response.json({ error: "Validation failed" }, { status: 400 })

  const reservation = mutateDb((db) => {
    const res = db.reservations.find((r) => r.id === id)
    if (!res) return null
    res.status = parsed.data.status
    return res
  })
  if (!reservation) return Response.json({ error: "Reservation not found" }, { status: 404 })
  return Response.json({ reservation })
}

export async function DELETE(_req: Request, ctx: Ctx) {
  const denied = await requireAdmin()
  if (denied) return denied
  const { id } = await ctx.params

  const removed = mutateDb((db) => {
    const idx = db.reservations.findIndex((r) => r.id === id)
    if (idx === -1) return false
    db.reservations.splice(idx, 1)
    return true
  })
  if (!removed) return Response.json({ error: "Reservation not found" }, { status: 404 })
  return Response.json({ ok: true })
}
