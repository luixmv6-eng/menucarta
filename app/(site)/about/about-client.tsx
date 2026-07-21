"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Compass, Eye, Gem, HandHeart, Sparkles, Target } from "lucide-react"
import { PageHero } from "@/components/site/page-hero"
import type { SiteSettings } from "@/lib/types"

const ease = [0.22, 1, 0.36, 1] as const

const valueIcons = [Gem, Compass, HandHeart, Sparkles]

const team = [
  { name: "Marcus Chen", role: "Executive Chef", image: "/images/wagyu.jpg" },
  { name: "Isabelle Fontaine", role: "Pastry Chef", image: "/images/chocolate-sphere.jpg" },
  { name: "Rafael Ortiz", role: "Head Sommelier", image: "/images/champagne.jpg" },
  { name: "Amara Osei", role: "Director of Hospitality", image: "/images/martini.jpg" },
]

export function AboutClient({ settings }: { settings: SiteSettings }) {
  return (
    <div>
      <PageHero
        eyebrow="Our Story"
        title="About Us"
        description={`The people, the philosophy and the decade of evenings behind ${settings.name}.`}
      />

      {/* Story */}
      <section className="relative py-16 md:py-24">
        <div className="max-w-3xl mx-auto px-4 md:px-8">
          {settings.about.story.map((paragraph, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.8, delay: i * 0.1, ease }}
              className="text-lg md:text-xl text-muted-foreground font-light leading-relaxed mb-8 first-letter:text-5xl first-letter:text-gradient-gold first-letter:font-light first-letter:float-left first-letter:mr-3 first-letter:leading-none"
            >
              {paragraph}
            </motion.p>
          ))}
        </div>
      </section>

      {/* Stats band */}
      <section className="relative py-12 md:py-16">
        <div className="max-w-5xl mx-auto px-4 md:px-8 grid grid-cols-2 md:grid-cols-4 gap-5">
          {settings.about.stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1, ease }}
              className="glass-card border-gradient rounded-3xl p-8 text-center hover:glow-gold transition-all duration-500"
            >
              <p className="text-4xl md:text-5xl font-light text-gradient-gold mb-3">{stat.value}</p>
              <p className="text-[10px] tracking-[0.25em] uppercase text-muted-foreground">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            animate={{ opacity: [0.04, 0.1, 0.04], scale: [1, 1.15, 1] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] rounded-full bg-primary/15 blur-[130px]"
          />
        </div>
        <div className="relative max-w-5xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            { icon: Eye, title: "Our Vision", text: settings.about.vision },
            { icon: Target, title: "Our Mission", text: settings.about.mission },
          ].map(({ icon: Icon, title, text }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.8, delay: i * 0.15, ease }}
              className="glass-card border-gradient rounded-3xl p-10 md:p-12 hover:glow-gold transition-all duration-500"
            >
              <div className="relative w-12 h-12 mb-8">
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-lg" />
                <div className="relative w-full h-full flex items-center justify-center border border-primary/30 rounded-full">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
              </div>
              <h2 className="text-2xl md:text-3xl font-light tracking-[0.15em] uppercase mb-6 text-gradient-gold">{title}</h2>
              <p className="text-muted-foreground font-light text-lg leading-relaxed italic">"{text}"</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Values */}
      <section className="relative py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease }}
            className="text-center mb-14"
          >
            <p className="text-[11px] tracking-[0.35em] text-primary uppercase mb-6">What Guides Us</p>
            <h2 className="text-3xl md:text-5xl font-light tracking-[0.1em] uppercase">Our Values</h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {settings.about.values.map((value, i) => {
              const Icon = valueIcons[i % valueIcons.length]
              return (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.7, delay: i * 0.1, ease }}
                  className="glass-card border-gradient rounded-3xl p-8 text-center group hover:glow-gold transition-all duration-500"
                >
                  <div className="relative w-11 h-11 mx-auto mb-6">
                    <div className="absolute inset-0 bg-primary/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative w-full h-full flex items-center justify-center border border-primary/30 rounded-full">
                      <Icon className="w-4.5 h-4.5 text-primary" />
                    </div>
                  </div>
                  <h3 className="text-lg font-light tracking-[0.15em] uppercase mb-4">{value.title}</h3>
                  <p className="text-muted-foreground text-sm font-light leading-relaxed">{value.text}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="relative py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease }}
            className="text-center mb-14"
          >
            <p className="text-[11px] tracking-[0.35em] text-primary uppercase mb-6">The Hands Behind the House</p>
            <h2 className="text-3xl md:text-5xl font-light tracking-[0.1em] uppercase">Our Team</h2>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
            {team.map((member, i) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.7, delay: i * 0.1, ease }}
                className="group relative overflow-hidden rounded-3xl glass-card hover:glow-gold transition-all duration-700"
              >
                <div className="relative aspect-[3/4] overflow-hidden">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover brightness-[0.55] transition-all duration-1000 group-hover:scale-110 group-hover:brightness-[0.45]"
                    sizes="(max-width: 1024px) 50vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <p className="text-lg md:text-xl font-light tracking-wide group-hover:text-gradient-gold transition-colors duration-500">
                      {member.name}
                    </p>
                    <p className="text-[10px] tracking-[0.25em] uppercase text-primary mt-2">{member.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-20 md:py-28 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease }}
          className="max-w-2xl mx-auto px-4"
        >
          <h2 className="text-3xl md:text-5xl font-light tracking-wide mb-8">
            Come write the next <span className="text-gradient-gold">chapter</span> with us
          </h2>
          <Link
            href="/reservations"
            className="group inline-flex items-center gap-3 px-12 py-5 rounded-full bg-gradient-to-r from-primary to-primary/80 text-primary-foreground tracking-[0.25em] uppercase text-sm hover:glow-gold-intense transition-shadow duration-500"
          >
            Reserve a Table
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </section>
    </div>
  )
}
