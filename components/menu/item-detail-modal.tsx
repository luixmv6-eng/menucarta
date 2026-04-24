"use client"

import { useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { X, Wine, Leaf, Fish, Flame, Award } from "lucide-react"
import type { MenuItem } from "@/lib/menu-data"

interface ItemDetailModalProps {
  item: MenuItem | null
  isOpen: boolean
  onClose: () => void
}

const tagIcons: Record<string, React.ElementType> = {
  "Seafood": Fish,
  "Vegetarian": Leaf,
  "Signature": Award,
  "Rich": Flame,
  "Luxurious": Award,
}

export function ItemDetailModal({ item, isOpen, onClose }: ItemDetailModalProps) {
  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", handleEscape)
    return () => window.removeEventListener("keydown", handleEscape)
  }, [onClose])

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && item && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            onClick={onClose}
            className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-xl"
          />

          {/* Modal Container */}
          <div className="fixed inset-0 z-[201] flex items-center justify-center p-4 md:p-8 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full max-w-4xl my-8"
            >
              {/* Close Button */}
              <motion.button
                onClick={onClose}
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.95 }}
                className="absolute -top-4 -right-4 md:top-4 md:right-4 z-10 w-12 h-12 flex items-center justify-center rounded-full glass-card border border-white/20 text-foreground hover:text-primary transition-colors"
              >
                <X className="w-5 h-5" />
              </motion.button>

              {/* Modal Content */}
              <div className="glass-card rounded-3xl overflow-hidden border border-white/10">
                <div className="grid grid-cols-1 md:grid-cols-2">
                  {/* Image Section */}
                  <div className="relative aspect-square md:aspect-auto">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:via-transparent md:to-background" />
                    
                    {/* Signature badge */}
                    {item.isSignature && (
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="absolute top-6 left-6"
                      >
                        <div className="relative">
                          <div className="absolute inset-0 bg-primary/60 blur-xl rounded-full" />
                          <div className="relative flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground text-xs tracking-[0.2em] uppercase font-medium rounded-full">
                            <Award className="w-4 h-4" />
                            Signature
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* Price badge - mobile */}
                    <div className="md:hidden absolute bottom-6 right-6">
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4 }}
                        className="relative"
                      >
                        <div className="absolute inset-0 bg-primary/40 blur-lg rounded-full" />
                        <div className="relative px-6 py-3 bg-background/90 backdrop-blur-xl rounded-full border border-primary/30">
                          <span className="text-2xl font-light text-primary">${item.price}</span>
                        </div>
                      </motion.div>
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="p-8 md:p-10 lg:p-12 flex flex-col justify-center">
                    {/* Price - desktop */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="hidden md:block mb-6"
                    >
                      <span className="text-4xl lg:text-5xl font-light text-gradient-gold">${item.price}</span>
                    </motion.div>

                    {/* Title */}
                    <motion.h2
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.25 }}
                      className="text-3xl md:text-4xl lg:text-5xl font-light tracking-wide text-foreground mb-6"
                    >
                      {item.name}
                    </motion.h2>

                    {/* Decorative line */}
                    <motion.div
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ delay: 0.3, duration: 0.6 }}
                      className="w-24 h-px bg-gradient-to-r from-primary/60 to-transparent mb-6 origin-left"
                    />

                    {/* Description */}
                    <motion.p
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.35 }}
                      className="text-lg md:text-xl text-muted-foreground leading-relaxed font-light mb-8"
                    >
                      {item.description}
                    </motion.p>

                    {/* Tags */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="flex flex-wrap gap-3 mb-8"
                    >
                      {item.tags.map((tag, index) => {
                        const TagIcon = tagIcons[tag]
                        return (
                          <motion.span
                            key={tag}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.45 + index * 0.05 }}
                            className="flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-xl text-muted-foreground text-sm tracking-[0.1em] uppercase rounded-full border border-white/10"
                          >
                            {TagIcon && <TagIcon className="w-3.5 h-3.5 text-primary/70" />}
                            {tag}
                          </motion.span>
                        )
                      })}
                    </motion.div>

                    {/* Pairing Note */}
                    {item.pairingNote && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="pt-6 border-t border-white/10"
                      >
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <Wine className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <p className="text-xs tracking-[0.2em] text-primary uppercase mb-2">
                              Sommelier Recommendation
                            </p>
                            <p className="text-base text-muted-foreground italic font-light">
                              {item.pairingNote}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>
              </div>

              {/* Decorative corner elements */}
              <div className="absolute -top-2 -left-2 w-16 h-16 pointer-events-none">
                <div className="absolute top-2 left-2 w-8 h-8 border-t-2 border-l-2 border-primary/30 rounded-tl-xl" />
              </div>
              <div className="absolute -bottom-2 -right-2 w-16 h-16 pointer-events-none">
                <div className="absolute bottom-2 right-2 w-8 h-8 border-b-2 border-r-2 border-primary/30 rounded-br-xl" />
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
