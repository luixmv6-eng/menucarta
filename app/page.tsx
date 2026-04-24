"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion"
import { MenuHeader } from "@/components/menu/menu-header"
import { SidebarNav } from "@/components/menu/sidebar-nav"
import { MobileNav } from "@/components/menu/mobile-nav"
import { MenuSection } from "@/components/menu/menu-section"
import { MenuFooter } from "@/components/menu/menu-footer"
import { ItemDetailModal } from "@/components/menu/item-detail-modal"
import { menuCategories, type MenuItem } from "@/lib/menu-data"
import Lenis from "lenis"

export default function MenuPage() {
  const [activeCategory, setActiveCategory] = useState(menuCategories[0].id)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isHovering, setIsHovering] = useState(false)

  // High performance mouse tracking without React re-renders
  const mouseX = useMotionValue(-100)
  const mouseY = useMotionValue(-100)
  const cursorX = useSpring(mouseX, { damping: 25, stiffness: 400, mass: 0.1 })
  const cursorY = useSpring(mouseY, { damping: 25, stiffness: 400, mass: 0.1 })
  const dotX = useSpring(mouseX, { damping: 28, stiffness: 500, mass: 0.1 })
  const dotY = useSpring(mouseY, { damping: 28, stiffness: 500, mass: 0.1 })

  useEffect(() => {
    // Smooth scroll setup
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    })

    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    // Mouse movement tracker
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)
    }
    
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (target.tagName.toLowerCase() === 'button' || target.tagName.toLowerCase() === 'a' || target.closest('button') || target.closest('a')) {
        setIsHovering(true)
      } else {
        setIsHovering(false)
      }
    }

    window.addEventListener("mousemove", handleMouseMove, { passive: true })
    window.addEventListener("mouseover", handleMouseOver, { passive: true })

    const timer = setTimeout(() => setIsLoading(false), 800)
    return () => {
      clearTimeout(timer)
      lenis.destroy()
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseover", handleMouseOver)
    }
  }, [])

  const handleCategoryChange = (categoryId: string) => {
    setActiveCategory(categoryId)
    const element = document.getElementById(categoryId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  const handleItemClick = (item: MenuItem) => {
    setSelectedItem(item)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setTimeout(() => setSelectedItem(null), 300)
  }

  // Track active section on scroll
  useEffect(() => {
    let ticking = false
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const sections = menuCategories.map(cat => ({
            id: cat.id,
            element: document.getElementById(cat.id)
          }))

          const scrollPosition = window.scrollY + 250

          for (let i = sections.length - 1; i >= 0; i--) {
            const section = sections[i]
            if (section.element && section.element.offsetTop <= scrollPosition) {
              setActiveCategory(section.id)
              break
            }
          }
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <>
      {/* Dynamic Cursor */}
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 rounded-full border border-primary/40 pointer-events-none z-[9999] hidden md:block mix-blend-difference"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: "-50%",
          translateY: "-50%"
        }}
        animate={{
          scale: isHovering ? 1.5 : 1,
          backgroundColor: isHovering ? "rgba(212, 175, 55, 0.2)" : "transparent"
        }}
        transition={{ scale: { duration: 0.2 }, backgroundColor: { duration: 0.2 } }}
      />
      <motion.div
        className="fixed top-0 left-0 w-2 h-2 bg-primary rounded-full pointer-events-none z-[10000] hidden md:block mix-blend-difference"
        style={{
          x: dotX,
          y: dotY,
          translateX: "-50%",
          translateY: "-50%"
        }}
      />

      {/* Noise texture overlay for luxury feel */}
      <div className="noise-overlay pointer-events-none" />

      {/* Item Detail Modal */}
      <ItemDetailModal
        item={selectedItem}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />

      {/* Elegant Loading Screen */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[100] bg-background flex items-center justify-center"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.6 }}
              className="text-center px-4"
            >
              {/* Elegant animated rings */}
              <div className="relative w-20 h-20 md:w-24 md:h-24 mx-auto mb-8 md:mb-10">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 border border-primary/20 rounded-full"
                />
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-2 md:inset-3 border border-primary/30 rounded-full"
                />
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-4 md:inset-6 border border-primary/50 rounded-full"
                />
                <motion.div
                  animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <div className="w-2 h-2 bg-primary rounded-full glow-gold" />
                </motion.div>
              </div>

              <motion.h2
                initial={{ opacity: 0, letterSpacing: "0.6em" }}
                animate={{ opacity: 1, letterSpacing: "0.3em" }}
                transition={{ duration: 1.5, delay: 0.3 }}
                className="text-3xl sm:text-4xl md:text-6xl font-light tracking-[0.2em] sm:tracking-[0.3em] md:tracking-[0.4em] text-gradient-gold mb-4 md:mb-6"
              >
                LUMINA
              </motion.h2>
              
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: 100 }}
                transition={{ duration: 1, delay: 0.8 }}
                className="h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent mx-auto mb-4 md:mb-6 md:w-[120px]"
              />
              
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 1 }}
                className="text-[10px] md:text-xs tracking-[0.2em] md:tracking-[0.3em] text-muted-foreground uppercase"
              >
                Preparing your experience
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoading ? 0 : 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="min-h-screen"
      >
        {/* Sticky Sidebar Navigation - Desktop */}
        <SidebarNav
          categories={menuCategories}
          activeCategory={activeCategory}
          onCategoryChange={handleCategoryChange}
        />

        {/* Mobile Navigation */}
        <MobileNav
          categories={menuCategories}
          activeCategory={activeCategory}
          onCategoryChange={handleCategoryChange}
        />

        <MenuHeader />

        {/* Menu Content - offset for sidebar on desktop */}
        <div className="lg:pl-48 xl:pl-56">
          <div className="max-w-6xl mx-auto px-3 sm:px-4 md:px-8 lg:px-10">
            {menuCategories.map((category) => (
              <MenuSection 
                key={category.id} 
                category={category}
                onItemClick={handleItemClick}
              />
            ))}
          </div>
        </div>

        <MenuFooter />
      </motion.main>
    </>
  )
}
