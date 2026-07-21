import { z } from "zod"
import { getDb, mutateDb } from "@/lib/server/db"
import { requireAdmin } from "@/lib/server/auth"

const settingsSchema = z.object({
  name: z.string().trim().min(1).max(60),
  tagline: z.string().trim().max(120),
  heroSubtitle: z.string().trim().max(200),
  chef: z.string().trim().max(80),
  cuisine: z.string().trim().max(80),
  hoursDays: z.string().trim().max(80),
  hoursTime: z.string().trim().max(80),
  address1: z.string().trim().max(120),
  address2: z.string().trim().max(120),
  phone: z.string().trim().max(40),
  email: z.string().trim().max(200),
  instagram: z.string().trim().max(300),
  announcement: z.string().trim().max(200),
  about: z.object({
    story: z.array(z.string().trim().max(1000)).max(6),
    vision: z.string().trim().max(1000),
    mission: z.string().trim().max(1000),
    values: z.array(z.object({ title: z.string().trim().max(60), text: z.string().trim().max(300) })).max(8),
    stats: z.array(z.object({ label: z.string().trim().max(60), value: z.string().trim().max(20) })).max(8),
  }),
  ordering: z.object({
    enabled: z.boolean(),
    minOrder: z.number().min(0).max(100000),
    pickupNote: z.string().trim().max(300),
  }),
  reservationSlots: z.array(z.string().trim().min(1).max(20)).min(1).max(30),
})

export async function GET() {
  const denied = await requireAdmin()
  if (denied) return denied
  const db = getDb()
  return Response.json({ settings: db.settings, tables: db.tables })
}

export async function PUT(req: Request) {
  const denied = await requireAdmin()
  if (denied) return denied

  const parsed = settingsSchema.safeParse(await req.json().catch(() => null))
  if (!parsed.success) return Response.json({ error: "Validation failed", issues: parsed.error.flatten() }, { status: 400 })

  const settings = mutateDb((db) => {
    db.settings = parsed.data
    return db.settings
  })
  return Response.json({ settings })
}
