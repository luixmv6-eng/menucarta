"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import { MenuItemCard } from "./menu-item-card"
import type { MenuCategory, MenuItem } from "@/lib/menu-data"

interface MenuSectionProps {
  category: MenuCategory
  onItemClick: (item: MenuItem) => void
}

export function MenuSection({ category, onItemClick }: MenuSectionProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  // Determine layout pattern for asymmetrical grid
  const getItemVariant = (index: number): "normal" | "featured" | "compact" => {
    // First item of each section is featured (larger)
    if (index === 0) return "featured"
    // Every 5th item is compact
    if (index % 5 === 4) return "compact"
    return "normal"
  }

  return (
    <section id={category.id} className="py-12 md:py-20 lg:py-32 scroll-mt-20 md:scroll-mt-24" ref={ref}>
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="text-center mb-10 md:mb-16 lg:mb-20 px-2"
      >
        {/* Decorative element */}
        <div className="flex items-center justify-center gap-4 md:gap-6 mb-6 md:mb-10">
          <motion.div 
            initial={{ width: 0 }}
            animate={isInView ? { width: 40 } : {}}
            transition={{ duration: 1, delay: 0.2 }}
            className="h-px bg-gradient-to-r from-transparent to-primary/40 md:w-[60px]" 
          />
          
          {/* Elegant diamond ornament */}
          <motion.div 
            initial={{ rotate: 0, scale: 0, opacity: 0 }}
            animate={isInView ? { rotate: 45, scale: 1, opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="relative w-5 h-5 md:w-6 md:h-6"
          >
            <div className="absolute inset-0 border border-primary/40" />
            <div className="absolute inset-1 md:inset-1.5 bg-primary/20" />
            <motion.div 
              animate={{ opacity: [0.3, 0.8, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 bg-primary/20 blur-sm"
            />
          </motion.div>
          
          <motion.div 
            initial={{ width: 0 }}
            animate={isInView ? { width: 40 } : {}}
            transition={{ duration: 1, delay: 0.2 }}
            className="h-px bg-gradient-to-l from-transparent to-primary/40 md:w-[60px]" 
          />
        </div>

        <div className="relative inline-block">
          <motion.h2 
            initial={{ opacity: 0, letterSpacing: "0.1em", y: 20 }}
            animate={isInView ? { opacity: 1, letterSpacing: "0.2em", y: 0 } : {}}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-light tracking-[0.15em] md:tracking-[0.25em] text-foreground uppercase"
          >
            {category.name}
          </motion.h2>
          
          {/* Glow effect behind title */}
          <div className="absolute inset-0 text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-light tracking-[0.15em] md:tracking-[0.25em] text-primary/10 blur-xl -z-10 select-none pointer-events-none uppercase">
            {category.name}
          </div>
        </div>
        
        <motion.p 
          initial={{ opacity: 0, y: 15 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-muted-foreground text-base md:text-lg lg:text-xl xl:text-2xl font-light italic max-w-xs sm:max-w-md lg:max-w-lg mx-auto mt-4 md:mt-6 tracking-wide"
        >
          {category.description}
        </motion.p>

        {/* Decorative line */}
        <motion.div 
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : {}}
          transition={{ duration: 1, delay: 0.5 }}
          className="mt-6 md:mt-10 mx-auto w-24 md:w-40 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" 
        />
      </motion.div>

      {/* Asymmetrical Menu Items Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 lg:gap-10">
        {category.items.map((item, index) => (
          <MenuItemCard 
            key={item.id} 
            item={item} 
            index={index}
            variant={getItemVariant(index)}
            onItemClick={onItemClick}
          />
        ))}
      </div>
    </section>
  )
}
