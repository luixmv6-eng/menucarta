import { getDb } from "@/lib/server/db"
import { HomeClient } from "./home-client"

export const dynamic = "force-dynamic"

export default function HomePage() {
  const db = getDb()
  const signatureItems = db.categories
    .flatMap((cat) => cat.items.filter((i) => i.isSignature && i.available !== false).map((i) => ({ ...i, category: cat.name })))
    .slice(0, 3)
  const featuredExperiences = db.experiences.filter((e) => e.active && e.featured).slice(0, 2)

  return <HomeClient settings={db.settings} signatureItems={signatureItems} experiences={featuredExperiences} />
}
