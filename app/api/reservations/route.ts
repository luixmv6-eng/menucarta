import { z } from "zod"
import { getDb, mutateDb, newId } from "@/lib/server/db"

const reservationSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(200),
  phone: z.string().trim().min(5).max(40),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  time: z.string().trim().min(1).max(20),
  guests: z.number().int().min(1).max(30),
  tableId: z.string().trim().min(1),
  experienceId: z.string().trim().optional(),
  occasion: z.string().trim().max(120).optional(),
  notes: z.string().trim().max(1000).optional(),
})

export async function POST(req: Request) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 })
  }

  const parsed = reservationSchema.safeParse(body)
  if (!parsed.success) {
    return Response.json({ error: "Validation failed", issues: parsed.error.flatten() }, { status: 400 })
  }

  const db = getDb()
  const table = db.tables.find((t) => t.id === parsed.data.tableId && t.active)
  if (!table) return Response.json({ error: "Unknown table selection" }, { status: 400 })
  if (parsed.data.guests < table.capacityMin || parsed.data.guests > table.capacityMax) {
    return Response.json(
      { error: `${table.name} seats ${table.capacityMin} to ${table.capacityMax} guests` },
      { status: 400 },
    )
  }
  if (parsed.data.experienceId) {
    const exp = db.experiences.find((e) => e.id === parsed.data.experienceId && e.active)
    if (!exp) return Response.json({ error: "Unknown experience selection" }, { status: 400 })
  }
  const today = new Date().toISOString().slice(0, 10)
  if (parsed.data.date < today) {
    return Response.json({ error: "Reservation date must be in the future" }, { status: 400 })
  }

  const reservation = mutateDb((db) => {
    const record = {
      ...parsed.data,
      id: newId("res"),
      status: "pending" as const,
      createdAt: new Date().toISOString(),
    }
    db.reservations.push(record)
    return record
  })

  return Response.json({ reservation }, { status: 201 })
}
