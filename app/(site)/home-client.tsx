"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, CalendarDays, Quote, Sparkles, Star } from "lucide-react"
import type { MenuItem, Experience, SiteSettings } from "@/lib/types"

type SignatureItem = MenuItem & { category: string }

interface HomeClientProps {
  settings: SiteSettings
  signatureItems: SignatureItem[]
  experiences: Experience[]
}

const testimonials = [
  {
    quote: "The single most transporting dinner of my life. Every course arrived like a small act of theatre.",
    author: "Eleanor Whitfield",
    role: "Food & Travel Columnist",
  },
  {
    quote: "Lumina doesn't serve dinner — it composes an evening. The chef's counter is worth crossing the country for.",
    author: "James Okafor",
    role: "Guest since 2019",
  },
  {
    quote: "We were engaged at the window table. They remembered our anniversary a year later, unprompted.",
    author: "Sofia & Daniel Reyes",
    role: "Regular Guests",
  },
]

const ease = [0.22, 1, 0.36, 1] as const

export function HomeClient({ settings, signatureItems, experiences }: HomeClientProps) {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800)
    return () => clearTimeout(timer)
  }, [])

  return (
    <>
      {/* Elegant loading screen */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease }}
            className="fixed inset-0 z-[400] bg-background flex items-center justify-center"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.6 }}
              className="text-center px-4"
            >
              <div className="relative w-20 h-20 md:w-24 md:h-24 mx-auto mb-8">
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
                className="text-3xl sm:text-4xl md:text-6xl font-light tracking-[0.3em] text-gradient-gold"
              >
                {settings.name}
              </motion.h2>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: isLoading ? 0 : 1 }} transition={{ duration: 0.8, delay: 0.3 }}>
        {/* ============ HERO ============ */}
        <section className="relative min-h-screen flex items-center justify-center text-center overflow-hidden pt-24">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <motion.div
              animate={{ scale: [1, 1.3, 1], opacity: [0.08, 0.15, 0.08], rotate: [0, 180, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-gradient-radial from-primary/30 via-primary/10 to-transparent blur-3xl"
            />
            <motion.div
              animate={{ y: [0, -30, 0], opacity: [0.05, 0.12, 0.05] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute top-1/3 right-1/4 w-[400px] h-[400px] rounded-full bg-primary/20 blur-[100px]"
            />
            <motion.div
              animate={{ y: [0, 30, 0], opacity: [0.05, 0.1, 0.05] }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
              className="absolute bottom-1/4 left-1/3 w-[300px] h-[300px] rounded-full bg-primary/15 blur-[80px]"
            />
          </div>

          <div className="relative z-10 px-4 pb-20">
            {settings.announcement && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="inline-flex items-center gap-2 px-5 py-2 mb-10 rounded-full glass-card border-gradient"
              >
                <Sparkles className="w-3.5 h-3.5 text-primary" />
                <span className="text-[11px] tracking-[0.2em] uppercase text-muted-foreground">{settings.announcement}</span>
              </motion.div>
            )}

            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1.2, delay: 0.3 }}
              className="flex items-center justify-center gap-6 mb-10"
            >
              <motion.div initial={{ width: 0 }} animate={{ width: 80 }} transition={{ duration: 1.2, delay: 0.5 }} className="h-px bg-gradient-to-r from-transparent to-primary/60" />
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} className="relative w-8 h-8">
                <div className="absolute inset-0 border border-primary/30 rotate-45" />
                <div className="absolute inset-2 border border-primary/50" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full pulse-glow" />
                </div>
              </motion.div>
              <motion.div initial={{ width: 0 }} animate={{ width: 80 }} transition={{ duration: 1.2, delay: 0.5 }} className="h-px bg-gradient-to-l from-transparent to-primary/60" />
            </motion.div>

            <div className="relative">
              <motion.h1
                initial={{ opacity: 0, letterSpacing: "0.6em", y: 20 }}
                animate={{ opacity: 1, letterSpacing: "0.4em", y: 0 }}
                transition={{ duration: 1.5, delay: 0.4, ease }}
                className="text-5xl sm:text-6xl md:text-8xl lg:text-[9rem] font-light tracking-[0.3em] md:tracking-[0.4em] text-gradient-gold mb-2"
              >
                {settings.name}
              </motion.h1>
              <div className="absolute inset-0 text-5xl sm:text-6xl md:text-8xl lg:text-[9rem] font-light tracking-[0.3em] md:tracking-[0.4em] text-primary/20 blur-2xl -z-10 select-none pointer-events-none">
                {settings.name}
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex items-center justify-center gap-4 mb-6"
            >
              <div className="w-12 h-px bg-gradient-to-r from-transparent to-primary/40" />
              <p className="text-sm md:text-base tracking-[0.35em] text-primary uppercase font-light">{settings.tagline}</p>
              <div className="w-12 h-px bg-gradient-to-l from-transparent to-primary/40" />
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
              className="mt-6 text-xl md:text-2xl lg:text-3xl text-muted-foreground font-light max-w-3xl mx-auto leading-relaxed tracking-wide"
            >
              {settings.heroSubtitle}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.2 }}
              className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link
                href="/menu"
                className="group flex items-center gap-3 px-10 py-4 rounded-full bg-gradient-to-r from-primary to-primary/80 text-primary-foreground tracking-[0.2em] uppercase text-sm hover:glow-gold-intense transition-shadow duration-500"
              >
                Explore the Menu
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/reservations"
                className="flex items-center gap-3 px-10 py-4 rounded-full border border-primary/40 text-primary tracking-[0.2em] uppercase text-sm hover:bg-primary/10 hover:glow-gold transition-all duration-500"
              >
                <CalendarDays className="w-4 h-4" />
                Reserve a Table
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.4 }}
              className="mt-16 inline-flex flex-wrap items-center justify-center gap-4 md:gap-0"
            >
              <div className="glass-card rounded-full md:rounded-r-none px-8 py-4 border-gradient">
                <p className="text-[10px] tracking-[0.25em] text-muted-foreground uppercase mb-1">Hours</p>
                <p className="text-sm text-foreground font-light tracking-wide">{settings.hoursTime}</p>
              </div>
              <div className="hidden md:block w-px h-12 bg-white/10" />
              <div className="glass-card rounded-full md:rounded-none px-8 py-4 border-gradient">
                <p className="text-[10px] tracking-[0.25em] text-muted-foreground uppercase mb-1">Executive Chef</p>
                <p className="text-sm text-foreground font-light tracking-wide">{settings.chef}</p>
              </div>
              <div className="hidden md:block w-px h-12 bg-white/10" />
              <div className="glass-card rounded-full md:rounded-l-none px-8 py-4 border-gradient">
                <p className="text-[10px] tracking-[0.25em] text-muted-foreground uppercase mb-1">Cuisine</p>
                <p className="text-sm text-foreground font-light tracking-wide">{settings.cuisine}</p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ============ SIGNATURE DISHES ============ */}
        <section className="relative py-24 md:py-32 overflow-hidden">
          <div className="max-w-6xl mx-auto px-4 md:px-8">
            <SectionHeading eyebrow="From the Kitchen" title="Signature Creations" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mt-14">
              {signatureItems.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.8, delay: i * 0.15, ease }}
                >
                  <Link href="/menu" className="group block relative overflow-hidden rounded-3xl glass-card hover:glow-gold transition-all duration-700">
                    <div className="relative aspect-[4/5] overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover transition-all duration-1000 group-hover:scale-110 brightness-[0.7] group-hover:brightness-[0.55]"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
                      <div className="absolute top-5 right-5">
                        <div className="relative">
                          <div className="absolute inset-0 bg-primary/50 blur-lg rounded-full" />
                          <div className="relative px-4 py-2 bg-gradient-to-r from-primary/90 to-primary/70 backdrop-blur-md text-primary-foreground text-[10px] tracking-[0.2em] uppercase rounded-full border border-white/20">
                            Signature
                          </div>
                        </div>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 p-7">
                        <p className="text-[10px] tracking-[0.3em] uppercase text-primary mb-2">{item.category}</p>
                        <h3 className="text-2xl font-light tracking-wide text-foreground group-hover:text-gradient-gold transition-colors duration-500">
                          {item.name}
                        </h3>
                        <div className="mt-3 flex items-center justify-between">
                          <span className="text-xl text-primary font-light">${item.price}</span>
                          <span className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center gap-1">
                            View menu <ArrowRight className="w-3 h-3" />
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ============ ABOUT TEASER ============ */}
        <section className="relative py-24 md:py-32 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <motion.div
              animate={{ opacity: [0.04, 0.09, 0.04] }}
              transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-1/2 left-0 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-primary/15 blur-[120px]"
            />
          </div>
          <div className="max-w-6xl mx-auto px-4 md:px-8 grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1, ease }}
            >
              <p className="text-[11px] tracking-[0.35em] text-primary uppercase mb-6">Our House</p>
              <h2 className="text-3xl md:text-5xl font-light tracking-wide leading-tight mb-8">
                A decade of light,<br />
                <span className="text-gradient-gold">fire and quiet ritual</span>
              </h2>
              <p className="text-muted-foreground text-lg font-light leading-relaxed mb-10">{settings.about.story[0]}</p>
              <Link
                href="/about"
                className="group inline-flex items-center gap-3 text-sm tracking-[0.25em] uppercase text-primary elegant-underline"
              >
                Discover our story
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1, ease }}
              className="grid grid-cols-2 gap-5"
            >
              {settings.about.stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 + i * 0.1 }}
                  className="glass-card border-gradient rounded-3xl p-8 text-center hover:glow-gold transition-all duration-500"
                >
                  <p className="text-4xl md:text-5xl font-light text-gradient-gold mb-3">{stat.value}</p>
                  <p className="text-[10px] tracking-[0.25em] uppercase text-muted-foreground">{stat.label}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ============ EXPERIENCES TEASER ============ */}
        {experiences.length > 0 && (
          <section className="relative py-24 md:py-32">
            <div className="max-w-6xl mx-auto px-4 md:px-8">
              <SectionHeading eyebrow="Beyond Dinner" title="Curated Experiences" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-14">
                {experiences.map((exp, i) => (
                  <motion.div
                    key={exp.id}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.8, delay: i * 0.15, ease }}
                  >
                    <Link
                      href="/experiences"
                      className="group flex flex-col md:flex-row overflow-hidden rounded-3xl glass-card border-gradient hover:glow-gold transition-all duration-700"
                    >
                      <div className="relative md:w-2/5 aspect-[16/10] md:aspect-auto overflow-hidden">
                        <Image
                          src={exp.image}
                          alt={exp.title}
                          fill
                          className="object-cover brightness-[0.7] transition-all duration-1000 group-hover:scale-110"
                          sizes="(max-width: 768px) 100vw, 40vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-background/60 to-transparent" />
                      </div>
                      <div className="flex-1 p-8 flex flex-col justify-center">
                        {exp.badge && (
                          <span className="self-start px-3 py-1 mb-4 rounded-full bg-primary/15 border border-primary/30 text-primary text-[9px] tracking-[0.25em] uppercase">
                            {exp.badge}
                          </span>
                        )}
                        <h3 className="text-2xl font-light tracking-wide group-hover:text-gradient-gold transition-colors duration-500 mb-2">
                          {exp.title}
                        </h3>
                        {exp.subtitle && <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-4">{exp.subtitle}</p>}
                        <p className="text-muted-foreground font-light text-sm leading-relaxed line-clamp-2 mb-5">{exp.description}</p>
                        <p className="text-primary text-xl font-light">
                          ${exp.price} <span className="text-xs text-muted-foreground tracking-wide">{exp.priceLabel}</span>
                        </p>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ============ TESTIMONIALS ============ */}
        <section className="relative py-24 md:py-32 overflow-hidden">
          <div className="max-w-6xl mx-auto px-4 md:px-8">
            <SectionHeading eyebrow="Voices" title="What Our Guests Say" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mt-14">
              {testimonials.map((t, i) => (
                <motion.blockquote
                  key={t.author}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.8, delay: i * 0.15, ease }}
                  className="glass-card border-gradient rounded-3xl p-8 flex flex-col hover:glow-gold transition-all duration-500"
                >
                  <Quote className="w-8 h-8 text-primary/40 mb-6" />
                  <p className="text-muted-foreground font-light italic leading-relaxed flex-1">{t.quote}</p>
                  <div className="mt-8 pt-6 border-t border-white/10">
                    <div className="flex gap-1 mb-3">
                      {Array.from({ length: 5 }).map((_, s) => (
                        <Star key={s} className="w-3.5 h-3.5 text-primary fill-primary" />
                      ))}
                    </div>
                    <p className="text-foreground font-light tracking-wide">{t.author}</p>
                    <p className="text-xs text-muted-foreground mt-1">{t.role}</p>
                  </div>
                </motion.blockquote>
              ))}
            </div>
          </div>
        </section>

        {/* ============ RESERVATION CTA ============ */}
        <section className="relative py-24 md:py-36 text-center overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [0.08, 0.16, 0.08] }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/20 blur-[130px]"
            />
          </div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease }}
            className="relative max-w-3xl mx-auto px-4"
          >
            <p className="text-[11px] tracking-[0.35em] text-primary uppercase mb-6">The Evening Awaits</p>
            <h2 className="text-4xl md:text-6xl font-light tracking-wide leading-tight mb-8">
              Your table is <span className="text-gradient-gold">waiting</span>
            </h2>
            <p className="text-muted-foreground text-lg font-light leading-relaxed mb-12 max-w-xl mx-auto">
              {settings.hoursDays}, {settings.hoursTime}. Choose your table, your occasion, and let us compose the rest.
            </p>
            <Link
              href="/reservations"
              className="group inline-flex items-center gap-3 px-12 py-5 rounded-full bg-gradient-to-r from-primary to-primary/80 text-primary-foreground tracking-[0.25em] uppercase text-sm hover:glow-gold-intense transition-shadow duration-500"
            >
              Book Your Evening
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </section>
      </motion.div>
    </>
  )
}

function SectionHeading({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8, ease }}
      className="text-center"
    >
      <div className="flex items-center justify-center gap-4 mb-6">
        <div className="w-10 h-px bg-gradient-to-r from-transparent to-primary/50" />
        <p className="text-[11px] tracking-[0.35em] text-primary uppercase">{eyebrow}</p>
        <div className="w-10 h-px bg-gradient-to-l from-transparent to-primary/50" />
      </div>
      <div className="relative inline-block">
        <h2 className="text-3xl md:text-5xl font-light tracking-[0.1em] uppercase">{title}</h2>
        <div className="absolute inset-0 text-3xl md:text-5xl font-light tracking-[0.1em] uppercase text-primary/10 blur-xl -z-10 select-none">
          {title}
        </div>
      </div>
    </motion.div>
  )
}
