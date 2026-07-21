"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, ShoppingBag, CalendarDays } from "lucide-react"
import { cn } from "@/lib/utils"
import { useCart } from "@/components/cart/cart-context"

const links = [
  { href: "/", label: "Home" },
  { href: "/menu", label: "Menu" },
  { href: "/about", label: "About" },
  { href: "/experiences", label: "Experiences" },
  { href: "/reservations", label: "Reservations" },
  { href: "/contact", label: "Contact" },
]

export function SiteNav({ name }: { name: string }) {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { count, setOpen } = useCart()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          "fixed top-0 left-0 right-0 z-[150] transition-all duration-500",
          scrolled ? "bg-background/85 backdrop-blur-2xl border-b border-white/5 py-3" : "bg-transparent py-5",
        )}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between gap-4">
          <Link href="/" className="group flex items-center gap-3">
            <span className="text-xl md:text-2xl font-light tracking-[0.35em] text-gradient-gold">{name}</span>
          </Link>

          <nav className="hidden lg:flex items-center gap-8">
            {links.map((link) => {
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "relative text-[11px] tracking-[0.25em] uppercase font-light transition-colors duration-300 elegant-underline",
                    isActive ? "text-primary" : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {link.label}
                  {isActive && (
                    <motion.span
                      layoutId="navActive"
                      className="absolute -bottom-1.5 left-0 right-0 h-px bg-gradient-to-r from-primary to-transparent"
                    />
                  )}
                </Link>
              )
            })}
          </nav>

          <div className="flex items-center gap-2 md:gap-3">
            <button
              onClick={() => setOpen(true)}
              className="relative w-10 h-10 flex items-center justify-center rounded-full glass-card hover:glow-gold transition-all duration-300"
              aria-label="Open cart"
            >
              <ShoppingBag className="w-4 h-4 text-muted-foreground" />
              {count > 0 && (
                <motion.span
                  key={count}
                  initial={{ scale: 0.5 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full bg-primary text-primary-foreground text-[10px]"
                >
                  {count}
                </motion.span>
              )}
            </button>

            <Link
              href="/reservations"
              className="hidden md:flex items-center gap-2 px-6 py-2.5 rounded-full border border-primary/40 text-primary text-[11px] tracking-[0.25em] uppercase hover:bg-primary/10 hover:glow-gold transition-all duration-300"
            >
              <CalendarDays className="w-3.5 h-3.5" />
              Reserve
            </Link>

            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="lg:hidden w-10 h-10 flex items-center justify-center rounded-full glass-card"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="fixed inset-0 z-[140] lg:hidden bg-background/97 backdrop-blur-2xl flex flex-col items-center justify-center gap-2"
          >
            {links.map((link, i) => (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.06, duration: 0.4 }}
              >
                <Link
                  href={link.href}
                  className={cn(
                    "block px-8 py-3 text-2xl font-light tracking-[0.25em] uppercase transition-colors",
                    pathname === link.href ? "text-gradient-gold" : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.4 }}
              className="mt-8"
            >
              <Link
                href="/reservations"
                className="px-10 py-4 rounded-full bg-gradient-to-r from-primary to-primary/80 text-primary-foreground tracking-[0.25em] uppercase text-sm"
              >
                Reserve a Table
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
