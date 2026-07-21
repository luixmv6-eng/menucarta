"use client"

import { useEffect, useState } from "react"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { CalendarDays, DollarSign, Eye, MessageSquare, ShoppingBag, UtensilsCrossed } from "lucide-react"
import { PageTitle, AdminCard, StatusBadge, EmptyState, adminFetch } from "@/components/admin/admin-ui"
import type { Order, Reservation } from "@/lib/types"

// Validated on the Lumina dark surface (#141221): each chart carries a single
// series, so colors identify panels, never adjacent marks.
const COLOR_VIEWS = "#c98500"
const COLOR_ORDERS = "#3987e5"
const COLOR_RESERVATIONS = "#d55181"
const COLOR_SALES = "#008300"

interface Metrics {
  totals: {
    views: number
    itemViews: number
    orders: number
    activeOrders: number
    revenue: number
    reservations: number
    pendingReservations: number
    unreadMessages: number
    dishes: number
  }
  days: { date: string; label: string; views: number; orders: number; reservations: number }[]
  topItems: { name: string; views: number }[]
  topSellers: { name: string; qty: number; revenue: number }[]
  recentReservations: Reservation[]
  recentOrders: Order[]
}

const axisTick = { fill: "oklch(0.55 0.025 60)", fontSize: 11, fontFamily: "inherit" }
const gridStroke = "rgba(255,255,255,0.06)"

function ChartTooltip({ active, payload, label, unit }: { active?: boolean; payload?: { value: number }[]; label?: string; unit: string }) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-xl border border-white/10 bg-[#141221]/95 backdrop-blur-xl px-4 py-2.5 shadow-xl">
      <p className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground mb-1">{label}</p>
      <p className="text-sm text-foreground font-light">
        {payload[0].value} {unit}
      </p>
    </div>
  )
}

export function DashboardClient() {
  const [metrics, setMetrics] = useState<Metrics | null>(null)
  const [error, setError] = useState("")

  useEffect(() => {
    adminFetch<Metrics>("/api/admin/metrics")
      .then(setMetrics)
      .catch((e: Error) => setError(e.message))
  }, [])

  if (error) return <EmptyState text={error} />
  if (!metrics) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-10 w-64 rounded-xl bg-white/5" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-32 rounded-3xl bg-white/5" />
          ))}
        </div>
        <div className="h-80 rounded-3xl bg-white/5" />
      </div>
    )
  }

  const { totals } = metrics

  const kpis = [
    { label: "Page views (all time)", value: totals.views.toLocaleString(), icon: Eye, note: `${totals.itemViews} dish views` },
    { label: "Revenue", value: `$${totals.revenue.toLocaleString()}`, icon: DollarSign, note: `${totals.orders} orders total` },
    { label: "Reservations", value: totals.reservations.toLocaleString(), icon: CalendarDays, note: `${totals.pendingReservations} pending` },
    { label: "Active orders", value: totals.activeOrders.toLocaleString(), icon: ShoppingBag, note: `${totals.unreadMessages} unread messages` },
  ]

  return (
    <div className="space-y-8">
      <PageTitle title="Dashboard" subtitle="A live pulse of the house — traffic, orders and reservations." />

      {/* KPI tiles */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {kpis.map(({ label, value, icon: Icon, note }) => (
          <AdminCard key={label} className="p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground">{label}</span>
              <Icon className="w-4 h-4 text-primary/70" />
            </div>
            <p className="text-3xl md:text-4xl font-light text-foreground">{value}</p>
            <p className="mt-2 text-xs text-muted-foreground/70 font-light">{note}</p>
          </AdminCard>
        ))}
      </div>

      {/* Traffic over 14 days */}
      <AdminCard>
        <h2 className="text-sm tracking-[0.2em] uppercase text-muted-foreground mb-6">Page views — last 14 days</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={metrics.days} margin={{ top: 4, right: 8, left: -18, bottom: 0 }}>
              <defs>
                <linearGradient id="viewsFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={COLOR_VIEWS} stopOpacity={0.35} />
                  <stop offset="100%" stopColor={COLOR_VIEWS} stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke={gridStroke} vertical={false} />
              <XAxis dataKey="label" tick={axisTick} axisLine={false} tickLine={false} interval="preserveStartEnd" />
              <YAxis tick={axisTick} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip content={<ChartTooltip unit="views" />} cursor={{ stroke: "rgba(255,255,255,0.15)" }} />
              <Area type="monotone" dataKey="views" stroke={COLOR_VIEWS} strokeWidth={2} fill="url(#viewsFill)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </AdminCard>

      {/* Orders & reservations per day — small multiples */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <AdminCard>
          <h2 className="text-sm tracking-[0.2em] uppercase text-muted-foreground mb-6">Orders per day</h2>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={metrics.days} margin={{ top: 4, right: 8, left: -18, bottom: 0 }}>
                <CartesianGrid stroke={gridStroke} vertical={false} />
                <XAxis dataKey="label" tick={axisTick} axisLine={false} tickLine={false} interval="preserveStartEnd" />
                <YAxis tick={axisTick} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip content={<ChartTooltip unit="orders" />} cursor={{ fill: "rgba(255,255,255,0.04)" }} />
                <Bar dataKey="orders" fill={COLOR_ORDERS} radius={[4, 4, 0, 0]} maxBarSize={18} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </AdminCard>

        <AdminCard>
          <h2 className="text-sm tracking-[0.2em] uppercase text-muted-foreground mb-6">Reservations per day</h2>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={metrics.days} margin={{ top: 4, right: 8, left: -18, bottom: 0 }}>
                <CartesianGrid stroke={gridStroke} vertical={false} />
                <XAxis dataKey="label" tick={axisTick} axisLine={false} tickLine={false} interval="preserveStartEnd" />
                <YAxis tick={axisTick} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip content={<ChartTooltip unit="reservations" />} cursor={{ fill: "rgba(255,255,255,0.04)" }} />
                <Bar dataKey="reservations" fill={COLOR_RESERVATIONS} radius={[4, 4, 0, 0]} maxBarSize={18} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </AdminCard>
      </div>

      {/* Top dishes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <AdminCard>
          <h2 className="text-sm tracking-[0.2em] uppercase text-muted-foreground mb-6">Most viewed dishes</h2>
          {metrics.topItems.length === 0 ? (
            <EmptyState text="No dish views tracked yet — they appear when guests open dishes on the menu." />
          ) : (
            <div style={{ height: Math.max(160, metrics.topItems.length * 44) }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={metrics.topItems} layout="vertical" margin={{ top: 0, right: 24, left: 8, bottom: 0 }}>
                  <CartesianGrid stroke={gridStroke} horizontal={false} />
                  <XAxis type="number" tick={axisTick} axisLine={false} tickLine={false} allowDecimals={false} />
                  <YAxis type="category" dataKey="name" tick={{ ...axisTick, fill: "oklch(0.85 0.02 60)" }} width={150} axisLine={false} tickLine={false} />
                  <Tooltip content={<ChartTooltip unit="views" />} cursor={{ fill: "rgba(255,255,255,0.04)" }} />
                  <Bar dataKey="views" fill={COLOR_VIEWS} radius={[0, 4, 4, 0]} maxBarSize={16} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </AdminCard>

        <AdminCard>
          <h2 className="text-sm tracking-[0.2em] uppercase text-muted-foreground mb-6">Best sellers (by quantity)</h2>
          {metrics.topSellers.length === 0 ? (
            <EmptyState text="No orders yet — best sellers appear once orders come in." />
          ) : (
            <div style={{ height: Math.max(160, metrics.topSellers.length * 44) }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={metrics.topSellers} layout="vertical" margin={{ top: 0, right: 24, left: 8, bottom: 0 }}>
                  <CartesianGrid stroke={gridStroke} horizontal={false} />
                  <XAxis type="number" tick={axisTick} axisLine={false} tickLine={false} allowDecimals={false} />
                  <YAxis type="category" dataKey="name" tick={{ ...axisTick, fill: "oklch(0.85 0.02 60)" }} width={150} axisLine={false} tickLine={false} />
                  <Tooltip content={<ChartTooltip unit="sold" />} cursor={{ fill: "rgba(255,255,255,0.04)" }} />
                  <Bar dataKey="qty" fill={COLOR_SALES} radius={[0, 4, 4, 0]} maxBarSize={16} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </AdminCard>
      </div>

      {/* Recent activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <AdminCard>
          <h2 className="text-sm tracking-[0.2em] uppercase text-muted-foreground mb-6">Latest reservations</h2>
          {metrics.recentReservations.length === 0 ? (
            <EmptyState text="No reservations yet." />
          ) : (
            <ul className="divide-y divide-white/5">
              {metrics.recentReservations.map((r) => (
                <li key={r.id} className="py-3.5 flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="font-light truncate">{r.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {r.date} · {r.time} · {r.guests} guests
                    </p>
                  </div>
                  <StatusBadge status={r.status} />
                </li>
              ))}
            </ul>
          )}
        </AdminCard>

        <AdminCard>
          <h2 className="text-sm tracking-[0.2em] uppercase text-muted-foreground mb-6">Latest orders</h2>
          {metrics.recentOrders.length === 0 ? (
            <EmptyState text="No orders yet." />
          ) : (
            <ul className="divide-y divide-white/5">
              {metrics.recentOrders.map((o) => (
                <li key={o.id} className="py-3.5 flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="font-light truncate">
                      {o.code} · {o.customer.name}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {o.items.reduce((s, l) => s + l.qty, 0)} items · ${o.total}
                    </p>
                  </div>
                  <StatusBadge status={o.status} />
                </li>
              ))}
            </ul>
          )}
        </AdminCard>
      </div>

      <p className="text-xs text-muted-foreground/50 font-light flex items-center gap-2">
        <UtensilsCrossed className="w-3.5 h-3.5" />
        {totals.dishes} dishes currently on the menu — manage them in the Menu section.
      </p>
    </div>
  )
}
