import { getDb } from "@/lib/server/db"
import { OrderClient } from "./order-client"

export const dynamic = "force-dynamic"

export const metadata = { title: "Your Order | Lumina" }

export default function OrderPage() {
  const db = getDb()
  return <OrderClient ordering={db.settings.ordering} phone={db.settings.phone} />
}
