"use client"

import { motion } from "framer-motion"
import { MapPin, Phone, Clock, Instagram, Mail } from "lucide-react"

export function MenuFooter() {
  return (
    <footer className="relative py-24 md:py-40 text-center overflow-hidden">
      {/* Ambient background */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{ 
            opacity: [0.03, 0.08, 0.03],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/20 blur-[120px]"
        />
      </div>

      {/* Top border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="relative max-w-5xl mx-auto px-4"
      >
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <div className="relative inline-block">
            <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-light tracking-[0.2em] sm:tracking-[0.35em] text-gradient-gold">
              LUMINA
            </h2>
            <div className="absolute inset-0 text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-light tracking-[0.2em] sm:tracking-[0.35em] text-primary/15 blur-2xl -z-10 select-none">
              LUMINA
            </div>
          </div>
          
          <div className="flex items-center justify-center gap-4 mt-4">
            <div className="w-8 h-px bg-gradient-to-r from-transparent to-primary/40" />
            <p className="text-xs tracking-[0.3em] text-primary uppercase">
              Fine Dining Experience
            </p>
            <div className="w-8 h-px bg-gradient-to-l from-transparent to-primary/40" />
          </div>
        </motion.div>

        {/* Info cards with glassmorphism */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="glass-card rounded-2xl p-8 border-gradient group hover:glow-gold transition-all duration-500"
          >
            <div className="relative w-10 h-10 mx-auto mb-5">
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative w-full h-full flex items-center justify-center border border-primary/30 rounded-full">
                <MapPin className="w-4 h-4 text-primary" />
              </div>
            </div>
            <h3 className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground mb-3">Location</h3>
            <p className="text-foreground font-light tracking-wide">123 Culinary Avenue</p>
            <p className="text-muted-foreground text-sm mt-1">Manhattan, NY 10013</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="glass-card rounded-2xl p-8 border-gradient group hover:glow-gold transition-all duration-500"
          >
            <div className="relative w-10 h-10 mx-auto mb-5">
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative w-full h-full flex items-center justify-center border border-primary/30 rounded-full">
                <Clock className="w-4 h-4 text-primary" />
              </div>
            </div>
            <h3 className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground mb-3">Hours</h3>
            <p className="text-foreground font-light tracking-wide">Tuesday - Sunday</p>
            <p className="text-muted-foreground text-sm mt-1">6:00 PM - 11:00 PM</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="glass-card rounded-2xl p-8 border-gradient group hover:glow-gold transition-all duration-500"
          >
            <div className="relative w-10 h-10 mx-auto mb-5">
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative w-full h-full flex items-center justify-center border border-primary/30 rounded-full">
                <Phone className="w-4 h-4 text-primary" />
              </div>
            </div>
            <h3 className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground mb-3">Reservations</h3>
            <p className="text-foreground font-light tracking-wide">+1 (212) 555-0123</p>
            <p className="text-muted-foreground text-sm mt-1">reservations@lumina.com</p>
          </motion.div>
        </div>

        {/* Social links */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex items-center justify-center gap-5 mb-16"
        >
          {[
            { icon: Instagram, href: "#" },
            { icon: Mail, href: "#" },
          ].map(({ icon: Icon, href }, i) => (
            <a 
              key={i}
              href={href} 
              className="group relative p-4 rounded-full glass-card border-gradient hover:glow-gold transition-all duration-500"
            >
              <div className="absolute inset-0 bg-primary/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity blur-lg" />
              <Icon className="relative w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors duration-300" />
            </a>
          ))}
        </motion.div>

        {/* Elegant divider */}
        <div className="flex items-center justify-center gap-6 mb-10">
          <div className="h-px w-20 bg-gradient-to-r from-transparent to-white/15" />
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="w-2 h-2 border border-primary/40"
          />
          <div className="h-px w-20 bg-gradient-to-l from-transparent to-white/15" />
        </div>

        {/* Legal text */}
        <p className="text-muted-foreground/70 text-sm leading-relaxed font-light max-w-xl mx-auto mb-6">
          Please inform your server of any dietary restrictions or allergies.
          A discretionary service charge of 20% will be added to parties of 6 or more.
        </p>

        <div className="flex items-center justify-center gap-4 text-[10px] tracking-widest text-muted-foreground/50 uppercase">
          <span>Menu prices subject to change</span>
          <span className="w-1 h-1 bg-white/20 rounded-full" />
          <span>Tax not included</span>
        </div>

        {/* Copyright */}
        <motion.p 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-14 text-[10px] text-muted-foreground/30 tracking-[0.2em] uppercase"
        >
          {new Date().getFullYear()} Lumina Restaurant. All rights reserved.
        </motion.p>
      </motion.div>
    </footer>
  )
}
