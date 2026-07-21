import { getDb } from "@/lib/server/db"
import { ExperiencesClient } from "./experiences-client"

export const dynamic = "force-dynamic"

export const metadata = { title: "Experiences & Events | Lumina" }

export default function ExperiencesPage() {
  const db = getDb()
  const experiences = db.experiences.filter((e) => e.active)
  return <ExperiencesClient experiences={experiences} />
}
