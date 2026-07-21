import { z } from "zod"
import { getDb, mutateDb, newId } from "@/lib/server/db"
import { requireAdmin } from "@/lib/server/auth"

const tableSchema = z.object({
  name: z.string().trim().min(1).max(80),
  description: z.string().trim().max(300).default(""),
  capacityMin: z.number().int().min(1).max(100),
  capacityMax: z.number().int().min(1).max(100),
  minimumSpend: z.number().min(0).max(1000000),
  perks: z.array(z.string().trim().min(1).max(120)).max(8).default([]),
  active: z.boolean().default(true),
})

export async function GET() {
  const denied = await requireAdmin()
  if (denied) return denied
  return Response.json({ tables: getDb().tables })
}

export async function POST(req: Request) {
  const denied = await requireAdmin()
  if (denied) return denied

  const parsed = tableSchema.safeParse(await req.json().catch(() => null))
  if (!parsed.success) return Response.json({ error: "Validation failed", issues: parsed.error.flatten() }, { status: 400 })
  if (parsed.data.capacityMin > parsed.data.capacityMax) {
    return Response.json({ error: "capacityMin cannot exceed capacityMax" }, { status: 400 })
  }

  const table = mutateDb((db) => {
    const record = { ...parsed.data, id: newId("table") }
    db.tables.push(record)
    return record
  })
  return Response.json({ table }, { status: 201 })
}
