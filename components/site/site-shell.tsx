"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { motion, useMotionValue, useSpring } from "framer-motion"
import Lenis from "lenis"
import { Toaster } from "sonner"
import { CartProvider } from "@/components/cart/cart-context"
import { CartDrawer } from "@/components/cart/cart-drawer"
import { SiteNav } from "./site-nav"
import { SiteFooter } from "./site-footer"
import type { SiteSettings } from "@/lib/types"

function TrackPageView() {
  const pathname = usePathname()
  useEffect(() => {
    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "page_view", name: pathname }),
    }).catch(() => {})
  }, [pathname])
  return null
}

export function SiteShell({ settings, children }: { settings: SiteSettings; children: React.ReactNode }) {
  const [isHovering, setIsHovering] = useState(false)

  const mouseX = useMotionValue(-100)
  const mouseY = useMotionValue(-100)
  const cursorX = useSpring(mouseX, { damping: 25, stiffness: 400, mass: 0.1 })
  const cursorY = useSpring(mouseY, { damping: 25, stiffness: 400, mass: 0.1 })
  const dotX = useSpring(mouseX, { damping: 28, stiffness: 500, mass: 0.1 })
  const dotY = useSpring(mouseY, { damping: 28, stiffness: 500, mass: 0.1 })

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    })

    let rafId: number
    function raf(time: number) {
      lenis.raf(time)
      rafId = requestAnimationFrame(raf)
    }
    rafId = requestAnimationFrame(raf)

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)
    }
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (target.closest("button") || target.closest("a") || target.closest("[role=button]")) {
        setIsHovering(true)
      } else {
        setIsHovering(false)
      }
    }

    window.addEventListener("mousemove", handleMouseMove, { passive: true })
    window.addEventListener("mouseover", handleMouseOver, { passive: true })

    return () => {
      cancelAnimationFrame(rafId)
      lenis.destroy()
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseover", handleMouseOver)
    }
  }, [mouseX, mouseY])

  return (
    <CartProvider>
      <TrackPageView />

      {/* Dynamic cursor */}
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 rounded-full border border-primary/40 pointer-events-none z-[9999] hidden md:block mix-blend-difference"
        style={{ x: cursorX, y: cursorY, translateX: "-50%", translateY: "-50%" }}
        animate={{
          scale: isHovering ? 1.5 : 1,
          backgroundColor: isHovering ? "rgba(212, 175, 55, 0.2)" : "transparent",
        }}
        transition={{ scale: { duration: 0.2 }, backgroundColor: { duration: 0.2 } }}
      />
      <motion.div
        className="fixed top-0 left-0 w-2 h-2 bg-primary rounded-full pointer-events-none z-[10000] hidden md:block mix-blend-difference"
        style={{ x: dotX, y: dotY, translateX: "-50%", translateY: "-50%" }}
      />

      <div className="noise-overlay pointer-events-none" />

      <SiteNav name={settings.name} />
      <CartDrawer minOrder={settings.ordering.minOrder} />
      <Toaster position="bottom-center" theme="dark" toastOptions={{ style: { background: "oklch(0.10 0.02 280)", border: "1px solid oklch(0.78 0.12 55 / 0.25)", color: "oklch(0.97 0.01 60)" } }} />

      <main className="min-h-screen">{children}</main>

      <SiteFooter settings={settings} />
    </CartProvider>
  )
}
