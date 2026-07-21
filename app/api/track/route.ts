import { z } from "zod"
import { trackEvent } from "@/lib/server/db"

const trackSchema = z.object({
  type: z.enum(["page_view", "item_view"]),
  name: z.string().trim().min(1).max(200),
})

export async function POST(req: Request) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 })
  }
  const parsed = trackSchema.safeParse(body)
  if (!parsed.success) return Response.json({ error: "Validation failed" }, { status: 400 })

  trackEvent(parsed.data.type, parsed.data.name)
  return Response.json({ ok: true })
}
