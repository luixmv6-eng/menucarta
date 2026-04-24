"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { Eye } from "lucide-react"
import type { MenuItem } from "@/lib/menu-data"

interface MenuItemCardProps {
  item: MenuItem
  index: number
  variant?: "normal" | "featured" | "compact"
  onItemClick: (item: MenuItem) => void
}

export function MenuItemCard({ item, index, variant = "normal", onItemClick }: MenuItemCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [imageError, setImageError] = useState(false)

  const isFeatured = variant === "featured"
  const isCompact = variant === "compact"

  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ 
        duration: 0.8, 
        delay: index * 0.1,
        ease: [0.22, 1, 0.36, 1]
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onItemClick(item)}
      className={cn(
        "group relative cursor-pointer",
        isFeatured && "md:col-span-2"
      )}
    >
      {/* Card with elegant border gradient */}
      <div 
        className={cn(
          "relative overflow-hidden rounded-2xl md:rounded-3xl",
          "glass-card",
          "transition-all duration-700",
          "shadow-xl shadow-black/20",
          "active:scale-[0.98] touch-manipulation",
          isHovered && "glow-gold shadow-2xl shadow-black/30"
        )}
      >
        {/* Image Container */}
        <div className={cn(
          "relative overflow-hidden",
          isFeatured 
            ? "aspect-[4/3] md:aspect-[16/9]" 
            : isCompact 
              ? "aspect-[4/3]" 
              : "aspect-[4/3] md:aspect-[3/2]"
        )}>
          {!imageError ? (
            <Image
              src={item.image}
              alt={item.name}
              fill
              className={cn(
                "object-cover transition-all duration-1000 ease-out",
                isHovered ? "scale-110 brightness-[0.5]" : "scale-100 brightness-[0.75]"
              )}
              onError={() => setImageError(true)}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              priority={index < 2}
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-secondary via-muted to-background flex items-center justify-center">
              <div className="w-12 h-12 border border-primary/30 rotate-45" />
            </div>
          )}
          
          {/* Elegant gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          
          {/* Signature badge with glow */}
          {item.isSignature && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="absolute top-3 right-3 md:top-5 md:right-5"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-primary/50 blur-lg rounded-full" />
                <div className="relative px-3 py-1.5 md:px-4 md:py-2 bg-gradient-to-r from-primary/90 to-primary/70 backdrop-blur-md text-primary-foreground text-[9px] md:text-[10px] tracking-[0.2em] uppercase font-medium rounded-full border border-white/20">
                  Signature
                </div>
              </div>
            </motion.div>
          )}

          {/* View details indicator on hover */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: isHovered ? 1 : 0, scale: isHovered ? 1 : 0.8 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            <div className="flex items-center gap-2 px-5 py-3 bg-background/80 backdrop-blur-xl rounded-full border border-primary/30">
              <Eye className="w-4 h-4 text-primary" />
              <span className="text-sm tracking-[0.1em] text-foreground">View Details</span>
            </div>
          </motion.div>

          {/* Elegant tags - only show first tag on mobile */}
          <div className="absolute bottom-3 left-3 md:bottom-5 md:left-5 flex flex-wrap gap-1.5 md:gap-2">
            {item.tags.slice(0, 2).map((tag, i) => (
              <span
                key={tag}
                className={cn(
                  "px-2.5 py-1 md:px-3 md:py-1.5 bg-black/50 backdrop-blur-xl text-white/90 text-[9px] md:text-[10px] tracking-[0.12em] uppercase rounded-full border border-white/10",
                  i > 0 && "hidden md:inline-flex"
                )}
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Shimmer effect on hover */}
          <motion.div
            initial={{ x: "-100%", opacity: 0 }}
            animate={{ 
              x: isHovered ? "200%" : "-100%",
              opacity: isHovered ? 1 : 0
            }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 pointer-events-none"
          />
        </div>

        {/* Content */}
        <div className={cn(
          "p-4 md:p-6 lg:p-7",
          isFeatured && "md:p-8 lg:p-10"
        )}>
          <div className="flex items-start justify-between gap-3 md:gap-6 mb-2 md:mb-3">
            <h3 className={cn(
              "font-light tracking-wide text-foreground transition-colors duration-500 line-clamp-2",
              "group-hover:text-gradient-gold",
              isFeatured 
                ? "text-xl md:text-2xl lg:text-3xl" 
                : "text-lg md:text-xl lg:text-2xl"
            )}>
              {item.name}
            </h3>
            <div className="relative flex-shrink-0">
              <span className={cn(
                "font-light text-primary whitespace-nowrap",
                isFeatured ? "text-xl md:text-2xl lg:text-3xl" : "text-lg md:text-xl lg:text-2xl"
              )}>
                ${item.price}
              </span>
              {/* Price glow on hover */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: isHovered ? 0.5 : 0 }}
                className="absolute inset-0 bg-primary/30 blur-lg -z-10"
              />
            </div>
          </div>

          {/* Decorative line */}
          <motion.div 
            initial={{ scaleX: 0 }}
            animate={{ scaleX: isHovered ? 1 : 0.3 }}
            transition={{ duration: 0.5 }}
            className="w-12 md:w-16 h-px bg-gradient-to-r from-primary/60 to-transparent mb-2 md:mb-3 origin-left"
          />

          {/* Description - shorter on mobile */}
          <p className={cn(
            "text-muted-foreground leading-relaxed font-light line-clamp-2",
            isFeatured ? "text-sm md:text-base lg:text-lg" : "text-xs md:text-sm lg:text-base"
          )}>
            {item.description}
          </p>

          {/* Tap hint on mobile */}
          <p className="md:hidden mt-3 text-[10px] tracking-[0.15em] text-primary/50 uppercase">
            Tap for details
          </p>
        </div>

        {/* Decorative corner accents */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: isHovered ? 1 : 0, scale: isHovered ? 1 : 0 }}
          transition={{ duration: 0.4 }}
          className="absolute top-0 left-0 w-12 h-12 md:w-16 md:h-16 pointer-events-none"
        >
          <div className="absolute top-3 left-3 md:top-5 md:left-5 w-6 h-6 md:w-8 md:h-8 border-t border-l border-primary/50 rounded-tl-lg" />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: isHovered ? 1 : 0, scale: isHovered ? 1 : 0 }}
          transition={{ duration: 0.4 }}
          className="absolute bottom-0 right-0 w-12 h-12 md:w-16 md:h-16 pointer-events-none"
        >
          <div className="absolute bottom-3 right-3 md:bottom-5 md:right-5 w-6 h-6 md:w-8 md:h-8 border-b border-r border-primary/50 rounded-br-lg" />
        </motion.div>

        {/* Inner glow on hover */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0 pointer-events-none rounded-2xl md:rounded-3xl"
          style={{
            boxShadow: "inset 0 0 60px oklch(0.78 0.12 55 / 0.05)"
          }}
        />
      </div>
    </motion.article>
  )
}
