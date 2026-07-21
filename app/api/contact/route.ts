import { z } from "zod"
import { mutateDb, newId } from "@/lib/server/db"

const contactSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(200),
  subject: z.string().trim().min(2).max(200),
  message: z.string().trim().min(5).max(3000),
})

export async function POST(req: Request) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 })
  }

  const parsed = contactSchema.safeParse(body)
  if (!parsed.success) {
    return Response.json({ error: "Validation failed", issues: parsed.error.flatten() }, { status: 400 })
  }

  const message = mutateDb((db) => {
    const record = { ...parsed.data, id: newId("msg"), read: false, createdAt: new Date().toISOString() }
    db.messages.push(record)
    return record
  })

  return Response.json({ message }, { status: 201 })
}
