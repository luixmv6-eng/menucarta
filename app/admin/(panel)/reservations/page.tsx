"use client"

import { useCallback, useEffect, useState } from "react"
import { Check, Trash2, X } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { PageTitle, AdminCard, StatusBadge, EmptyState, adminFetch } from "@/components/admin/admin-ui"
import type { Experience, Reservation, TableOption } from "@/lib/types"

type Filter = "all" | "pending" | "confirmed" | "cancelled"

export default function AdminReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [tables, setTables] = useState<TableOption[]>([])
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [filter, setFilter] = useState<Filter>("all")
  const [loading, setLoading] = useState(true)

  const reload = useCallback(async () => {
    try {
      const data = await adminFetch<{ reservations: Reservation[]; tables: TableOption[]; experiences: Experience[] }>(
        "/api/admin/reservations",
      )
      setReservations(data.reservations)
      setTables(data.tables)
      setExperiences(data.experiences)
    } catch (e) {
      toast.error((e as Error).message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    reload()
  }, [reload])

  const setStatus = async (id: string, status: Reservation["status"]) => {
    try {
      await adminFetch(`/api/admin/reservations/${id}`, { method: "PATCH", body: JSON.stringify({ status }) })
      toast.success(`Reservation ${status}`)
      await reload()
    } catch (e) {
      toast.error((e as Error).message)
    }
  }

  const remove = async (id: string) => {
    if (!confirm("Delete this reservation permanently?")) return
    try {
      await adminFetch(`/api/admin/reservations/${id}`, { method: "DELETE" })
      toast.success("Reservation deleted")
      await reload()
    } catch (e) {
      toast.error((e as Error).message)
    }
  }

  const filtered = filter === "all" ? reservations : reservations.filter((r) => r.status === filter)

  if (loading) return <div className="h-96 rounded-3xl bg-white/5 animate-pulse" />

  return (
    <div>
      <PageTitle title="Reservations" subtitle="Confirm, decline and review every request for a table." />

      <div className="flex gap-2 mb-6 flex-wrap">
        {(["all", "pending", "confirmed", "cancelled"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "px-5 py-2 rounded-full border text-[11px] tracking-[0.2em] uppercase transition-all",
              filter === f
                ? "border-primary/50 text-primary bg-primary/10"
                : "border-white/10 text-muted-foreground hover:border-primary/25",
            )}
          >
            {f} {f !== "all" && `(${reservations.filter((r) => r.status === f).length})`}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState text="No reservations in this view." />
      ) : (
        <div className="space-y-4">
          {filtered.map((r) => {
            const table = tables.find((t) => t.id === r.tableId)
            const exp = experiences.find((e) => e.id === r.experienceId)
            return (
              <AdminCard key={r.id} className="p-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h2 className="text-lg font-light tracking-wide">{r.name}</h2>
                      <StatusBadge status={r.status} />
                    </div>
                    <p className="text-sm text-primary mt-2 font-light">
                      {r.date} · {r.time} · {r.guests} {r.guests === 1 ? "guest" : "guests"} · {table?.name ?? r.tableId}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1.5">
                      {r.email} · {r.phone}
                      {r.occasion && ` · ${r.occasion}`}
                    </p>
                    {exp && <p className="text-xs text-muted-foreground mt-1">Experience: {exp.title}</p>}
                    {r.notes && <p className="text-sm text-muted-foreground/80 font-light italic mt-3">"{r.notes}"</p>}
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    {r.status !== "confirmed" && (
                      <button
                        onClick={() => setStatus(r.id, "confirmed")}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-[#008300]/40 text-[#4fbf4f] text-[11px] tracking-[0.15em] uppercase hover:bg-[#008300]/10 transition-all"
                      >
                        <Check className="w-3.5 h-3.5" /> Confirm
                      </button>
                    )}
                    {r.status !== "cancelled" && (
                      <button
                        onClick={() => setStatus(r.id, "cancelled")}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-red-500/30 text-red-400 text-[11px] tracking-[0.15em] uppercase hover:bg-red-500/10 transition-all"
                      >
                        <X className="w-3.5 h-3.5" /> Cancel
                      </button>
                    )}
                    <button
                      onClick={() => remove(r.id)}
                      className="w-9 h-9 flex items-center justify-center rounded-full glass-card hover:text-red-400 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </AdminCard>
            )
          })}
        </div>
      )}
    </div>
  )
}
