import { getDb } from "@/lib/server/db"
import { MenuClient } from "./menu-client"

export const dynamic = "force-dynamic"

export const metadata = { title: "Menu | Lumina" }

export default function MenuPage() {
  const db = getDb()
  const categories = db.categories
    .map((cat) => ({ ...cat, items: cat.items.filter((i) => i.available !== false) }))
    .filter((cat) => cat.items.length > 0)

  return <MenuClient categories={categories} orderingEnabled={db.settings.ordering.enabled} />
}
