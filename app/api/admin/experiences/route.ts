import { z } from "zod"
import { getDb, mutateDb, newId } from "@/lib/server/db"
import { requireAdmin } from "@/lib/server/auth"

const experienceSchema = z.object({
  title: z.string().trim().min(1).max(120),
  subtitle: z.string().trim().max(160).optional(),
  description: z.string().trim().max(1000).default(""),
  price: z.number().min(0).max(1000000),
  priceLabel: z.string().trim().max(60).optional(),
  category: z.enum(["event", "couples", "tasting", "private"]),
  image: z.string().trim().max(500).default("/placeholder.jpg"),
  badge: z.string().trim().max(40).optional(),
  features: z.array(z.string().trim().min(1).max(120)).max(10).default([]),
  featured: z.boolean().default(false),
  active: z.boolean().default(true),
})

export async function GET() {
  const denied = await requireAdmin()
  if (denied) return denied
  return Response.json({ experiences: getDb().experiences })
}

export async function POST(req: Request) {
  const denied = await requireAdmin()
  if (denied) return denied

  const parsed = experienceSchema.safeParse(await req.json().catch(() => null))
  if (!parsed.success) return Response.json({ error: "Validation failed", issues: parsed.error.flatten() }, { status: 400 })

  const experience = mutateDb((db) => {
    const record = { ...parsed.data, id: newId("exp"), image: parsed.data.image || "/placeholder.jpg" }
    db.experiences.push(record)
    return record
  })
  return Response.json({ experience }, { status: 201 })
}
