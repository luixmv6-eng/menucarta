"use client"

import { motion } from "framer-motion"
import { UtensilsCrossed, ChefHat, Cake, Wine } from "lucide-react"
import { cn } from "@/lib/utils"
import type { MenuCategory } from "@/lib/menu-data"

interface MobileNavProps {
  categories: MenuCategory[]
  activeCategory: string
  onCategoryChange: (categoryId: string) => void
}

const iconMap: Record<string, React.ElementType> = {
  utensils: UtensilsCrossed,
  "chef-hat": ChefHat,
  cake: Cake,
  wine: Wine,
}

export function MobileNav({ categories, activeCategory, onCategoryChange }: MobileNavProps) {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="lg:hidden sticky top-0 z-50"
    >
      {/* Glassmorphism nav bar with elegant gradient border */}
      <div className="relative">
        {/* Top gradient border */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
        
        <div className="bg-background/90 backdrop-blur-2xl py-3 px-2 sm:px-4 safe-area-inset">
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar pb-1 -mb-1">
            {categories.map((category, index) => {
              const Icon = iconMap[category.icon] || UtensilsCrossed
              const isActive = activeCategory === category.id

              return (
                <motion.button
                  key={category.id}
                  onClick={() => onCategoryChange(category.id)}
                  initial={{ opacity: 0, y: -15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.08 }}
                  className={cn(
                    "relative flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-full transition-all duration-500 whitespace-nowrap flex-shrink-0 touch-manipulation",
                    isActive
                      ? "glass-card text-primary border border-primary/30 glow-gold"
                      : "text-muted-foreground active:bg-white/10"
                  )}
                >
                  <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span className="text-xs sm:text-sm tracking-[0.08em] sm:tracking-[0.1em] font-light">
                    {category.name}
                  </span>
                  
                  {/* Active dot indicator */}
                  {isActive && (
                    <motion.div
                      layoutId="mobileActiveIndicator"
                      className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                </motion.button>
              )
            })}
          </div>
        </div>
        
        {/* Bottom gradient border */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>
    </motion.nav>
  )
}
