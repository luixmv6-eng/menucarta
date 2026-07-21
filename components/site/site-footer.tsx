"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { MapPin, Phone, Clock, Instagram, Mail } from "lucide-react"
import type { SiteSettings } from "@/lib/types"

const footerLinks = [
  { href: "/menu", label: "Menu" },
  { href: "/about", label: "About" },
  { href: "/experiences", label: "Experiences" },
  { href: "/reservations", label: "Reservations" },
  { href: "/contact", label: "Contact" },
]

export function SiteFooter({ settings }: { settings: SiteSettings }) {
  return (
    <footer className="relative py-24 md:py-32 text-center overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{ opacity: [0.03, 0.08, 0.03], scale: [1, 1.1, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/20 blur-[120px]"
        />
      </div>

      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="relative max-w-5xl mx-auto px-4"
      >
        <div className="mb-12">
          <div className="relative inline-block">
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-light tracking-[0.2em] sm:tracking-[0.35em] text-gradient-gold">
              {settings.name}
            </h2>
            <div className="absolute inset-0 text-3xl sm:text-5xl md:text-6xl font-light tracking-[0.2em] sm:tracking-[0.35em] text-primary/15 blur-2xl -z-10 select-none">
              {settings.name}
            </div>
          </div>
          <div className="flex items-center justify-center gap-4 mt-4">
            <div className="w-8 h-px bg-gradient-to-r from-transparent to-primary/40" />
            <p className="text-xs tracking-[0.3em] text-primary uppercase">{settings.tagline}</p>
            <div className="w-8 h-px bg-gradient-to-l from-transparent to-primary/40" />
          </div>
        </div>

        {/* Quick navigation */}
        <nav className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 mb-14">
          {footerLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[11px] tracking-[0.25em] uppercase text-muted-foreground hover:text-primary transition-colors elegant-underline"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14">
          {[
            {
              icon: MapPin,
              title: "Location",
              lines: [settings.address1, settings.address2],
            },
            {
              icon: Clock,
              title: "Hours",
              lines: [settings.hoursDays, settings.hoursTime],
            },
            {
              icon: Phone,
              title: "Reservations",
              lines: [settings.phone, settings.email],
            },
          ].map(({ icon: Icon, title, lines }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 * (i + 1) }}
              className="glass-card rounded-2xl p-8 border-gradient group hover:glow-gold transition-all duration-500"
            >
              <div className="relative w-10 h-10 mx-auto mb-5">
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative w-full h-full flex items-center justify-center border border-primary/30 rounded-full">
                  <Icon className="w-4 h-4 text-primary" />
                </div>
              </div>
              <h3 className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground mb-3">{title}</h3>
              <p className="text-foreground font-light tracking-wide">{lines[0]}</p>
              <p className="text-muted-foreground text-sm mt-1">{lines[1]}</p>
            </motion.div>
          ))}
        </div>

        <div className="flex items-center justify-center gap-5 mb-14">
          {[
            { icon: Instagram, href: settings.instagram },
            { icon: Mail, href: `mailto:${settings.email}` },
          ].map(({ icon: Icon, href }, i) => (
            <a
              key={i}
              href={href}
              target="_blank"
              rel="noreferrer"
              className="group relative p-4 rounded-full glass-card border-gradient hover:glow-gold transition-all duration-500"
            >
              <div className="absolute inset-0 bg-primary/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity blur-lg" />
              <Icon className="relative w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors duration-300" />
            </a>
          ))}
        </div>

        <div className="flex items-center justify-center gap-6 mb-8">
          <div className="h-px w-20 bg-gradient-to-r from-transparent to-white/15" />
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="w-2 h-2 border border-primary/40"
          />
          <div className="h-px w-20 bg-gradient-to-l from-transparent to-white/15" />
        </div>

        <p className="text-muted-foreground/70 text-sm leading-relaxed font-light max-w-xl mx-auto mb-6">
          Please inform your server of any dietary restrictions or allergies. A discretionary service charge of 20%
          will be added to parties of 6 or more.
        </p>

        <p className="text-[10px] text-muted-foreground/30 tracking-[0.2em] uppercase">
          {new Date().getFullYear()} {settings.name} Restaurant. All rights reserved.
        </p>
      </motion.div>
    </footer>
  )
}
