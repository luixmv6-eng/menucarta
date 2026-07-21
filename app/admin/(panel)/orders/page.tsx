"use client"

import { useCallback, useEffect, useState } from "react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { PageTitle, AdminCard, StatusBadge, EmptyState, adminFetch } from "@/components/admin/admin-ui"
import type { Order } from "@/lib/types"

const statuses: Order["status"][] = ["new", "preparing", "ready", "completed", "cancelled"]
type Filter = "active" | "all" | Order["status"]

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [filter, setFilter] = useState<Filter>("active")
  const [loading, setLoading] = useState(true)

  const reload = useCallback(async () => {
    try {
      const data = await adminFetch<{ orders: Order[] }>("/api/admin/orders")
      setOrders(data.orders)
    } catch (e) {
      toast.error((e as Error).message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    reload()
    const timer = setInterval(reload, 30000) // keep the kitchen view fresh
    return () => clearInterval(timer)
  }, [reload])

  const setStatus = async (id: string, status: Order["status"]) => {
    try {
      await adminFetch(`/api/admin/orders/${id}`, { method: "PATCH", body: JSON.stringify({ status }) })
      toast.success(`Order marked ${status}`)
      await reload()
    } catch (e) {
      toast.error((e as Error).message)
    }
  }

  const filtered =
    filter === "all"
      ? orders
      : filter === "active"
        ? orders.filter((o) => ["new", "preparing", "ready"].includes(o.status))
        : orders.filter((o) => o.status === filter)

  if (loading) return <div className="h-96 rounded-3xl bg-white/5 animate-pulse" />

  return (
    <div>
      <PageTitle title="Orders" subtitle="Track every online order from received to served — refreshes automatically." />

      <div className="flex gap-2 mb-6 flex-wrap">
        {(["active", "all", ...statuses] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "px-4 py-2 rounded-full border text-[11px] tracking-[0.2em] uppercase transition-all",
              filter === f
                ? "border-primary/50 text-primary bg-primary/10"
                : "border-white/10 text-muted-foreground hover:border-primary/25",
            )}
          >
            {f}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState text="No orders in this view." />
      ) : (
        <div className="space-y-4">
          {filtered.map((o) => (
            <AdminCard key={o.id} className="p-6">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <h2 className="text-lg font-light tracking-[0.15em] text-gradient-gold">{o.code}</h2>
                    <StatusBadge status={o.status} />
                    <span className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground border border-white/10 rounded-full px-3 py-1">
                      {o.type}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    {o.customer.name} · {o.customer.phone}
                    {o.customer.email && ` · ${o.customer.email}`}
                  </p>
                  <p className="text-xs text-muted-foreground/60 mt-1">{new Date(o.createdAt).toLocaleString()}</p>
                </div>
                <p className="text-2xl font-light text-gradient-gold">${o.total}</p>
              </div>

              <ul className="rounded-2xl border border-white/5 divide-y divide-white/5 mb-4">
                {o.items.map((line) => (
                  <li key={line.itemId} className="flex items-center justify-between px-4 py-2.5 text-sm font-light">
                    <span>
                      {line.qty} × {line.name}
                    </span>
                    <span className="text-muted-foreground">${line.price * line.qty}</span>
                  </li>
                ))}
              </ul>

              {o.customer.notes && (
                <p className="text-sm text-muted-foreground/80 italic font-light mb-4">"{o.customer.notes}"</p>
              )}

              <div className="flex gap-2 flex-wrap">
                {statuses.map((s) => (
                  <button
                    key={s}
                    onClick={() => setStatus(o.id, s)}
                    disabled={o.status === s}
                    className={cn(
                      "px-4 py-1.5 rounded-full border text-[10px] tracking-[0.15em] uppercase transition-all",
                      o.status === s
                        ? "border-primary/50 text-primary bg-primary/10"
                        : "border-white/10 text-muted-foreground hover:border-primary/25",
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </AdminCard>
          ))}
        </div>
      )}
    </div>
  )
}
