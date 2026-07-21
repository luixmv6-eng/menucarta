import { z } from "zod"
import { mutateDb } from "@/lib/server/db"
import { requireAdmin } from "@/lib/server/auth"

const patchSchema = z.object({ read: z.boolean() })

type Ctx = { params: Promise<{ id: string }> }

export async function PATCH(req: Request, ctx: Ctx) {
  const denied = await requireAdmin()
  if (denied) return denied
  const { id } = await ctx.params

  const parsed = patchSchema.safeParse(await req.json().catch(() => null))
  if (!parsed.success) return Response.json({ error: "Validation failed" }, { status: 400 })

  const message = mutateDb((db) => {
    const msg = db.messages.find((m) => m.id === id)
    if (!msg) return null
    msg.read = parsed.data.read
    return msg
  })
  if (!message) return Response.json({ error: "Message not found" }, { status: 404 })
  return Response.json({ message })
}

export async function DELETE(_req: Request, ctx: Ctx) {
  const denied = await requireAdmin()
  if (denied) return denied
  const { id } = await ctx.params

  const removed = mutateDb((db) => {
    const idx = db.messages.findIndex((m) => m.id === id)
    if (idx === -1) return false
    db.messages.splice(idx, 1)
    return true
  })
  if (!removed) return Response.json({ error: "Message not found" }, { status: 404 })
  return Response.json({ ok: true })
}
