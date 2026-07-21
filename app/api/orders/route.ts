import { z } from "zod"
import { getDb, mutateDb, newId } from "@/lib/server/db"
import type { OrderItem } from "@/lib/types"

const orderSchema = z.object({
  customer: z.object({
    name: z.string().trim().min(2).max(120),
    phone: z.string().trim().min(5).max(40),
    email: z.string().trim().email().max(200).optional().or(z.literal("")),
    notes: z.string().trim().max(1000).optional(),
  }),
  type: z.enum(["pickup", "dine-in"]),
  items: z
    .array(z.object({ itemId: z.string().min(1), qty: z.number().int().min(1).max(20) }))
    .min(1)
    .max(50),
})

export async function POST(req: Request) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 })
  }

  const parsed = orderSchema.safeParse(body)
  if (!parsed.success) {
    return Response.json({ error: "Validation failed", issues: parsed.error.flatten() }, { status: 400 })
  }

  const db = getDb()
  if (!db.settings.ordering.enabled) {
    return Response.json({ error: "Online ordering is currently unavailable" }, { status: 503 })
  }

  // Prices always come from the server-side menu, never from the client
  const allItems = db.categories.flatMap((c) => c.items)
  const lines: OrderItem[] = []
  for (const line of parsed.data.items) {
    const item = allItems.find((i) => i.id === line.itemId && i.available !== false)
    if (!item) return Response.json({ error: `Item ${line.itemId} is not available` }, { status: 400 })
    lines.push({ itemId: item.id, name: item.name, price: item.price, qty: line.qty })
  }

  const subtotal = lines.reduce((sum, l) => sum + l.price * l.qty, 0)
  if (subtotal < db.settings.ordering.minOrder) {
    return Response.json({ error: `Minimum order is $${db.settings.ordering.minOrder}` }, { status: 400 })
  }

  const order = mutateDb((db) => {
    const record = {
      id: newId("ord"),
      code: `LM-${String(db.orders.length + 1).padStart(4, "0")}`,
      customer: {
        name: parsed.data.customer.name,
        phone: parsed.data.customer.phone,
        email: parsed.data.customer.email || undefined,
        notes: parsed.data.customer.notes,
      },
      type: parsed.data.type,
      items: lines,
      subtotal,
      total: subtotal,
      status: "new" as const,
      createdAt: new Date().toISOString(),
    }
    db.orders.push(record)
    return record
  })

  return Response.json({ order }, { status: 201 })
}
