"use client"

import { motion } from "framer-motion"

interface PageHeroProps {
  eyebrow: string
  title: string
  description?: string
}

export function PageHero({ eyebrow, title, description }: PageHeroProps) {
  return (
    <section className="relative pt-40 pb-16 md:pt-52 md:pb-24 text-center overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.25, 1], opacity: [0.06, 0.12, 0.06] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full bg-gradient-radial from-primary/25 via-primary/8 to-transparent blur-3xl"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 px-4 max-w-4xl mx-auto"
      >
        <div className="flex items-center justify-center gap-4 mb-8">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: 60 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="h-px bg-gradient-to-r from-transparent to-primary/60"
          />
          <p className="text-[11px] tracking-[0.35em] text-primary uppercase font-light">{eyebrow}</p>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: 60 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="h-px bg-gradient-to-l from-transparent to-primary/60"
          />
        </div>

        <div className="relative inline-block">
          <motion.h1
            initial={{ opacity: 0, letterSpacing: "0.35em", y: 20 }}
            animate={{ opacity: 1, letterSpacing: "0.2em", y: 0 }}
            transition={{ duration: 1.2, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="text-4xl sm:text-5xl md:text-7xl font-light tracking-[0.2em] text-gradient-gold uppercase"
          >
            {title}
          </motion.h1>
          <div className="absolute inset-0 text-4xl sm:text-5xl md:text-7xl font-light tracking-[0.2em] text-primary/15 blur-2xl -z-10 select-none uppercase">
            {title}
          </div>
        </div>

        {description && (
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-8 text-lg md:text-xl text-muted-foreground font-light leading-relaxed max-w-2xl mx-auto tracking-wide"
          >
            {description}
          </motion.p>
        )}

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="mt-10 mx-auto w-40 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent"
        />
      </motion.div>
    </section>
  )
}
