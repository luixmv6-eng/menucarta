import { z } from "zod"
import { mutateDb } from "@/lib/server/db"
import { requireAdmin } from "@/lib/server/auth"

const patchSchema = z.object({
  status: z.enum(["new", "preparing", "ready", "completed", "cancelled"]),
})

type Ctx = { params: Promise<{ id: string }> }

export async function PATCH(req: Request, ctx: Ctx) {
  const denied = await requireAdmin()
  if (denied) return denied
  const { id } = await ctx.params

  const parsed = patchSchema.safeParse(await req.json().catch(() => null))
  if (!parsed.success) return Response.json({ error: "Validation failed" }, { status: 400 })

  const order = mutateDb((db) => {
    const ord = db.orders.find((o) => o.id === id)
    if (!ord) return null
    ord.status = parsed.data.status
    return ord
  })
  if (!order) return Response.json({ error: "Order not found" }, { status: 404 })
  return Response.json({ order })
}
