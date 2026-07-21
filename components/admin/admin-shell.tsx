"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  LayoutDashboard,
  UtensilsCrossed,
  CalendarDays,
  ShoppingBag,
  Sparkles,
  MessageSquare,
  Settings,
  LogOut,
  ExternalLink,
  Menu as MenuIcon,
  X,
} from "lucide-react"
import { Toaster } from "sonner"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/menu", label: "Menu", icon: UtensilsCrossed },
  { href: "/admin/reservations", label: "Reservations", icon: CalendarDays },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { href: "/admin/experiences", label: "Experiences", icon: Sparkles },
  { href: "/admin/messages", label: "Messages", icon: MessageSquare },
  { href: "/admin/settings", label: "Site Settings", icon: Settings },
]

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" }).catch(() => {})
    router.push("/admin/login")
    router.refresh()
  }

  const nav = (
    <nav className="flex-1 px-4 space-y-1">
      {navItems.map((item) => {
        const isActive = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href)
        const Icon = item.icon
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setMobileOpen(false)}
            className={cn(
              "relative flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all duration-300 group",
              isActive ? "bg-primary/15 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-white/5",
            )}
          >
            {isActive && (
              <motion.div
                layoutId="adminNavActive"
                className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-primary to-primary/50 rounded-full"
                transition={{ type: "spring", stiffness: 400, damping: 35 }}
              />
            )}
            <Icon className="w-4.5 h-4.5" />
            <span className="text-sm tracking-[0.08em] font-light">{item.label}</span>
          </Link>
        )
      })}
    </nav>
  )

  const footer = (
    <div className="px-4 pb-6 space-y-1">
      <Link
        href="/"
        target="_blank"
        className="flex items-center gap-3.5 px-4 py-3 rounded-xl text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all duration-300"
      >
        <ExternalLink className="w-4.5 h-4.5" />
        <span className="text-sm tracking-[0.08em] font-light">View Site</span>
      </Link>
      <button
        onClick={logout}
        className="w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-muted-foreground hover:text-red-400 hover:bg-red-400/5 transition-all duration-300"
      >
        <LogOut className="w-4.5 h-4.5" />
        <span className="text-sm tracking-[0.08em] font-light">Sign Out</span>
      </button>
    </div>
  )

  return (
    <div className="min-h-screen flex">
      <Toaster
        position="bottom-right"
        theme="dark"
        toastOptions={{
          style: {
            background: "oklch(0.10 0.02 280)",
            border: "1px solid oklch(0.78 0.12 55 / 0.25)",
            color: "oklch(0.97 0.01 60)",
          },
        }}
      />

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-64 border-r border-white/5 bg-background/60 fixed inset-y-0 left-0 z-40">
        <div className="px-8 py-8">
          <Link href="/admin" className="block">
            <span className="text-2xl font-light tracking-[0.3em] text-gradient-gold">LUMINA</span>
            <span className="block mt-1.5 text-[9px] tracking-[0.35em] uppercase text-muted-foreground">
              Control Panel
            </span>
          </Link>
        </div>
        {nav}
        {footer}
      </aside>

      {/* Mobile header + drawer */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-5 py-4 bg-background/90 backdrop-blur-xl border-b border-white/5">
        <Link href="/admin" className="text-lg font-light tracking-[0.3em] text-gradient-gold">
          LUMINA
        </Link>
        <button
          onClick={() => setMobileOpen((v) => !v)}
          className="w-10 h-10 flex items-center justify-center rounded-full glass-card"
          aria-label="Toggle admin menu"
        >
          {mobileOpen ? <X className="w-4 h-4" /> : <MenuIcon className="w-4 h-4" />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 z-30 bg-background/97 backdrop-blur-xl pt-24 pb-8 flex flex-col"
          >
            {nav}
            {footer}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content */}
      <main className="flex-1 lg:ml-64 pt-20 lg:pt-0 min-w-0">
        <div className="px-5 md:px-10 py-8 md:py-10 max-w-7xl">{children}</div>
      </main>
    </div>
  )
}
