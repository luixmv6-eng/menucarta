"use client"

import { motion } from "framer-motion"
import { UtensilsCrossed, ChefHat, Cake, Wine } from "lucide-react"
import { cn } from "@/lib/utils"
import type { MenuCategory } from "@/lib/menu-data"

interface SidebarNavProps {
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

export function SidebarNav({ categories, activeCategory, onCategoryChange }: SidebarNavProps) {
  return (
    <motion.nav
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="hidden lg:flex fixed left-6 xl:left-10 top-1/2 -translate-y-1/2 z-50 flex-col gap-2"
    >
      {/* Elegant sidebar container */}
      <div className="relative glass-card rounded-2xl p-4 border-gradient">
        {/* Subtle glow */}
        <div className="absolute inset-0 rounded-2xl bg-primary/5 blur-2xl -z-10 opacity-50" />
        
        {categories.map((category, index) => {
          const Icon = iconMap[category.icon] || UtensilsCrossed
          const isActive = activeCategory === category.id

          return (
            <motion.button
              key={category.id}
              onClick={() => onCategoryChange(category.id)}
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
              className={cn(
                "relative flex items-center gap-4 px-5 py-4 rounded-xl transition-all duration-500 w-full group",
                isActive
                  ? "bg-primary/15 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-white/5"
              )}
            >
              {/* Active indicator with glow */}
              {isActive && (
                <>
                  <motion.div
                    layoutId="sidebarActive"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-10 bg-gradient-to-b from-primary via-primary to-primary/50 rounded-full"
                    transition={{ type: "spring", stiffness: 400, damping: 35 }}
                  />
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-10 bg-primary rounded-full blur-md" />
                </>
              )}

              <Icon className={cn(
                "w-5 h-5 transition-all duration-500",
                isActive ? "text-primary" : "group-hover:scale-110 group-hover:text-primary/80"
              )} />
              
              <span className="text-sm tracking-[0.1em] font-light whitespace-nowrap">
                {category.name}
              </span>

              {/* Subtle hover glow */}
              <motion.div
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 0.1 }}
                className="absolute inset-0 bg-primary rounded-xl pointer-events-none"
              />
            </motion.button>
          )
        })}
      </div>

      {/* Decorative elements */}
      <div className="flex flex-col items-center gap-2 mt-4">
        <div className="w-px h-12 bg-gradient-to-b from-border to-transparent" />
        <motion.div 
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="w-1.5 h-1.5 bg-primary/50 rounded-full"
        />
        <div className="w-px h-8 bg-gradient-to-b from-transparent to-border/30" />
      </div>
    </motion.nav>
  )
}
