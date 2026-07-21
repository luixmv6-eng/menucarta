import { getDb } from "@/lib/server/db"
import { AboutClient } from "./about-client"

export const dynamic = "force-dynamic"

export const metadata = { title: "About | Lumina" }

export default function AboutPage() {
  const db = getDb()
  return <AboutClient settings={db.settings} />
}
