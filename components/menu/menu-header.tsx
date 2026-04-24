"use client"

import { motion } from "framer-motion"

export function MenuHeader() {
  return (
    <header className="relative py-24 md:py-40 lg:py-48 text-center overflow-hidden">
      {/* Ambient background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Main gradient orb */}
        <motion.div
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.08, 0.15, 0.08],
            rotate: [0, 180, 360]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-gradient-radial from-primary/30 via-primary/10 to-transparent blur-3xl"
        />
        
        {/* Secondary accent orbs */}
        <motion.div
          animate={{ 
            y: [0, -30, 0],
            opacity: [0.05, 0.12, 0.05]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute top-1/3 right-1/4 w-[400px] h-[400px] rounded-full bg-primary/20 blur-[100px]"
        />
        <motion.div
          animate={{ 
            y: [0, 30, 0],
            opacity: [0.05, 0.10, 0.05]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-1/4 left-1/3 w-[300px] h-[300px] rounded-full bg-primary/15 blur-[80px]"
        />
      </div>

      {/* Decorative vertical lines */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          initial={{ height: 0 }}
          animate={{ height: 120 }}
          transition={{ duration: 1.5, delay: 0.5 }}
          className="absolute top-0 left-1/2 -translate-x-1/2 w-px bg-gradient-to-b from-transparent via-primary/40 to-transparent" 
        />
        <motion.div 
          initial={{ height: 0 }}
          animate={{ height: 120 }}
          transition={{ duration: 1.5, delay: 0.7 }}
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-px bg-gradient-to-t from-transparent via-primary/40 to-transparent" 
        />
      </div>

      {/* Floating decorative elements */}
      <motion.div
        animate={{ y: [-10, 10, -10], rotate: [0, 5, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-20 left-[15%] w-1 h-1 bg-primary/40 rounded-full"
      />
      <motion.div
        animate={{ y: [10, -10, 10], rotate: [0, -5, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute top-32 right-[20%] w-1.5 h-1.5 bg-primary/30 rounded-full"
      />
      <motion.div
        animate={{ y: [-5, 15, -5] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute bottom-32 left-[25%] w-1 h-1 bg-primary/50 rounded-full"
      />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 px-4"
      >
        {/* Decorative flourish */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.3 }}
          className="flex items-center justify-center gap-6 mb-10"
        >
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: 80 }}
            transition={{ duration: 1.2, delay: 0.5 }}
            className="h-px bg-gradient-to-r from-transparent to-primary/60" 
          />
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="relative w-8 h-8"
          >
            <div className="absolute inset-0 border border-primary/30 rotate-45" />
            <div className="absolute inset-2 border border-primary/50" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-primary rounded-full pulse-glow" />
            </div>
          </motion.div>
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: 80 }}
            transition={{ duration: 1.2, delay: 0.5 }}
            className="h-px bg-gradient-to-l from-transparent to-primary/60" 
          />
        </motion.div>

        {/* Logo/Brand Name */}
        <div className="relative">
          <motion.h1
            initial={{ opacity: 0, letterSpacing: "0.6em", y: 20 }}
            animate={{ opacity: 1, letterSpacing: "0.4em", y: 0 }}
            transition={{ duration: 1.5, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="text-4xl sm:text-6xl md:text-8xl lg:text-[10rem] font-light tracking-[0.2em] sm:tracking-[0.3em] md:tracking-[0.4em] text-gradient-gold mb-2"
          >
            LUMINA
          </motion.h1>
          
          {/* Subtle glow behind text */}
          <div className="absolute inset-0 text-4xl sm:text-6xl md:text-8xl lg:text-[10rem] font-light tracking-[0.2em] sm:tracking-[0.3em] md:tracking-[0.4em] text-primary/20 blur-2xl -z-10 select-none pointer-events-none">
            LUMINA
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex items-center justify-center gap-4 mb-6"
        >
          <div className="w-12 h-px bg-gradient-to-r from-transparent to-primary/40" />
          <p className="text-sm md:text-base tracking-[0.35em] text-primary uppercase font-light">
            Fine Dining Experience
          </p>
          <div className="w-12 h-px bg-gradient-to-l from-transparent to-primary/40" />
        </motion.div>

        {/* Elegant separator */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="mt-8 mx-auto w-48 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent"
        />

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="mt-10 text-xl md:text-2xl lg:text-3xl text-muted-foreground font-light max-w-3xl mx-auto leading-relaxed tracking-wide"
        >
          Where culinary artistry meets timeless elegance
        </motion.p>

        {/* Info pills with glassmorphism */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.4 }}
          className="mt-16 inline-flex flex-wrap items-center justify-center gap-4 md:gap-0"
        >
          <div className="glass-card rounded-l-full md:rounded-l-full rounded-r-full md:rounded-r-none px-8 py-4 border-gradient">
            <p className="text-[10px] tracking-[0.25em] text-muted-foreground uppercase mb-1">Hours</p>
            <p className="text-sm text-foreground font-light tracking-wide">6 PM - 11 PM</p>
          </div>
          <div className="hidden md:block w-px h-12 bg-white/10" />
          <div className="glass-card rounded-full md:rounded-none px-8 py-4 border-gradient">
            <p className="text-[10px] tracking-[0.25em] text-muted-foreground uppercase mb-1">Executive Chef</p>
            <p className="text-sm text-foreground font-light tracking-wide">Marcus Chen</p>
          </div>
          <div className="hidden md:block w-px h-12 bg-white/10" />
          <div className="glass-card rounded-r-full md:rounded-r-full rounded-l-full md:rounded-l-none px-8 py-4 border-gradient">
            <p className="text-[10px] tracking-[0.25em] text-muted-foreground uppercase mb-1">Cuisine</p>
            <p className="text-sm text-foreground font-light tracking-wide">Modern Fusion</p>
          </div>
        </motion.div>
      </motion.div>
    </header>
  )
}
