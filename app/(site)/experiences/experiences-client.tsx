"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Check, Heart, PartyPopper, UtensilsCrossed, DoorClosed } from "lucide-react"
import { PageHero } from "@/components/site/page-hero"
import type { Experience } from "@/lib/types"

const ease = [0.22, 1, 0.36, 1] as const

const categoryMeta: Record<Experience["category"], { label: string; icon: React.ElementType }> = {
  couples: { label: "For Couples", icon: Heart },
  tasting: { label: "Tasting Menus", icon: UtensilsCrossed },
  event: { label: "Special Events", icon: PartyPopper },
  private: { label: "Private Dining", icon: DoorClosed },
}

export function ExperiencesClient({ experiences }: { experiences: Experience[] }) {
  return (
    <div>
      <PageHero
        eyebrow="Beyond Dinner"
        title="Experiences"
        description="Tasting journeys, evenings for two, live music and private celebrations — every one of them composed with the same care as our plates."
      />

      <section className="relative py-10 md:py-16 pb-24">
        <div className="max-w-6xl mx-auto px-4 md:px-8 space-y-10">
          {experiences.map((exp, i) => {
            const meta = categoryMeta[exp.category]
            const Icon = meta.icon
            const reversed = i % 2 === 1
            return (
              <motion.article
                key={exp.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.9, ease }}
                className="group relative overflow-hidden rounded-3xl glass-card border-gradient hover:glow-gold transition-all duration-700"
              >
                <div className={`flex flex-col ${reversed ? "lg:flex-row-reverse" : "lg:flex-row"}`}>
                  <div className="relative lg:w-1/2 aspect-[16/9] lg:aspect-auto overflow-hidden">
                    <Image
                      src={exp.image}
                      alt={exp.title}
                      fill
                      className="object-cover brightness-[0.65] transition-all duration-1000 group-hover:scale-105"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                    <div
                      className={
                        reversed
                          ? "absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-l from-background/70 via-background/20 to-transparent"
                          : "absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-background/70 via-background/20 to-transparent"
                      }
                    />
                    {exp.badge && (
                      <div className="absolute top-6 left-6">
                        <div className="relative">
                          <div className="absolute inset-0 bg-primary/50 blur-lg rounded-full" />
                          <div className="relative px-4 py-2 bg-gradient-to-r from-primary/90 to-primary/70 backdrop-blur-md text-primary-foreground text-[10px] tracking-[0.2em] uppercase rounded-full border border-white/20">
                            {exp.badge}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="lg:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                    <div className="flex items-center gap-2 mb-5">
                      <Icon className="w-4 h-4 text-primary" />
                      <span className="text-[10px] tracking-[0.3em] uppercase text-primary">{meta.label}</span>
                    </div>

                    <h2 className="text-3xl md:text-4xl font-light tracking-wide mb-2 group-hover:text-gradient-gold transition-colors duration-500">
                      {exp.title}
                    </h2>
                    {exp.subtitle && (
                      <p className="text-xs tracking-[0.25em] uppercase text-muted-foreground mb-6">{exp.subtitle}</p>
                    )}

                    <p className="text-muted-foreground font-light leading-relaxed mb-8">{exp.description}</p>

                    {exp.features.length > 0 && (
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                        {exp.features.map((feature) => (
                          <li key={feature} className="flex items-start gap-2.5 text-sm text-muted-foreground font-light">
                            <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    )}

                    <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-white/10">
                      <p className="text-2xl md:text-3xl font-light text-gradient-gold">
                        ${exp.price}
                        {exp.priceLabel && (
                          <span className="text-xs text-muted-foreground tracking-[0.15em] uppercase ml-2">{exp.priceLabel}</span>
                        )}
                      </p>
                      <Link
                        href={`/reservations?experience=${exp.id}`}
                        className="group/btn inline-flex items-center gap-2 px-7 py-3 rounded-full border border-primary/40 text-primary text-[11px] tracking-[0.25em] uppercase hover:bg-primary/10 hover:glow-gold transition-all duration-300"
                      >
                        Book this experience
                        <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.article>
            )
          })}
        </div>
      </section>
    </div>
  )
}
