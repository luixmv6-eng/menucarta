import { getDb } from "@/lib/server/db"
import { requireAdmin } from "@/lib/server/auth"

export const dynamic = "force-dynamic"

export async function GET() {
  const denied = await requireAdmin()
  if (denied) return denied

  const db = getDb()
  const now = new Date()
  const days: { date: string; label: string; views: number; orders: number; reservations: number }[] = []
  for (let i = 13; i >= 0; i--) {
    const d = new Date(now)
    d.setDate(d.getDate() - i)
    const key = d.toISOString().slice(0, 10)
    days.push({
      date: key,
      label: d.toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" }),
      views: 0,
      orders: 0,
      reservations: 0,
    })
  }
  const byDate = new Map(days.map((d) => [d.date, d]))

  for (const ev of db.analytics) {
    if (ev.type !== "page_view") continue
    const bucket = byDate.get(ev.ts.slice(0, 10))
    if (bucket) bucket.views++
  }
  for (const o of db.orders) {
    const bucket = byDate.get(o.createdAt.slice(0, 10))
    if (bucket) bucket.orders++
  }
  for (const r of db.reservations) {
    const bucket = byDate.get(r.createdAt.slice(0, 10))
    if (bucket) bucket.reservations++
  }

  // Most-viewed dishes
  const itemViews = new Map<string, number>()
  for (const ev of db.analytics) {
    if (ev.type !== "item_view") continue
    itemViews.set(ev.name, (itemViews.get(ev.name) ?? 0) + 1)
  }
  const topItems = [...itemViews.entries()]
    .map(([name, views]) => ({ name, views }))
    .sort((a, b) => b.views - a.views)
    .slice(0, 6)

  // Best sellers by ordered quantity
  const sold = new Map<string, { qty: number; revenue: number }>()
  for (const o of db.orders) {
    if (o.status === "cancelled") continue
    for (const line of o.items) {
      const entry = sold.get(line.name) ?? { qty: 0, revenue: 0 }
      entry.qty += line.qty
      entry.revenue += line.qty * line.price
      sold.set(line.name, entry)
    }
  }
  const topSellers = [...sold.entries()]
    .map(([name, v]) => ({ name, ...v }))
    .sort((a, b) => b.qty - a.qty)
    .slice(0, 6)

  const activeOrders = db.orders.filter((o) => ["new", "preparing", "ready"].includes(o.status))
  const revenue = db.orders.filter((o) => o.status !== "cancelled").reduce((sum, o) => sum + o.total, 0)

  return Response.json({
    totals: {
      views: db.analytics.filter((e) => e.type === "page_view").length,
      itemViews: db.analytics.filter((e) => e.type === "item_view").length,
      orders: db.orders.length,
      activeOrders: activeOrders.length,
      revenue,
      reservations: db.reservations.length,
      pendingReservations: db.reservations.filter((r) => r.status === "pending").length,
      unreadMessages: db.messages.filter((m) => !m.read).length,
      dishes: db.categories.reduce((sum, c) => sum + c.items.length, 0),
    },
    days,
    topItems,
    topSellers,
    recentReservations: [...db.reservations].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1)).slice(0, 5),
    recentOrders: [...db.orders].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1)).slice(0, 5),
  })
}
