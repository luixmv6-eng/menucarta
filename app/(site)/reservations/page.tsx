import { getDb } from "@/lib/server/db"
import { ReservationsClient } from "./reservations-client"

export const dynamic = "force-dynamic"

export const metadata = { title: "Reservations | Lumina" }

export default function ReservationsPage() {
  const db = getDb()
  return (
    <ReservationsClient
      tables={db.tables.filter((t) => t.active)}
      experiences={db.experiences.filter((e) => e.active)}
      slots={db.settings.reservationSlots}
      phone={db.settings.phone}
    />
  )
}
