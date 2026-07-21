import { getDb } from "@/lib/server/db"
import { ContactClient } from "./contact-client"

export const dynamic = "force-dynamic"

export const metadata = { title: "Contact | Lumina" }

export default function ContactPage() {
  const db = getDb()
  return <ContactClient settings={db.settings} />
}
