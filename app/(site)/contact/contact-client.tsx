"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Check, Clock, Mail, MapPin, Phone } from "lucide-react"
import { toast } from "sonner"
import { PageHero } from "@/components/site/page-hero"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import type { SiteSettings } from "@/lib/types"

const ease = [0.22, 1, 0.36, 1] as const

const faqs = [
  {
    q: "Do you accommodate dietary restrictions?",
    a: "Absolutely. Note your restrictions when reserving, or tell your server — the kitchen adapts nearly every course, including the tasting menus, for vegetarian, gluten-free and most allergy requirements.",
  },
  {
    q: "Is there a dress code?",
    a: "Smart elegant. Jackets are appreciated but not required; we kindly ask guests to avoid sportswear and beachwear.",
  },
  {
    q: "Can I bring my own wine?",
    a: "You are welcome to bring a special bottle. Corkage is $50 per bottle, waived if you also select a bottle from our cellar.",
  },
  {
    q: "How does the cancellation policy work?",
    a: "Reservations can be cancelled free of charge up to 24 hours before your seating. Later cancellations and no-shows for parties of 5+ incur a $50 per-guest fee.",
  },
  {
    q: "Do you host private events?",
    a: "Yes — our Private Dining Room seats 8 to 18 guests, and the full house can be reserved for larger celebrations. Write to us with your date and we will compose a proposal.",
  },
]

export function ContactClient({ settings }: { settings: SiteSettings }) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, subject, message }),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error ?? "We could not send your message")
        return
      }
      setSent(true)
    } catch {
      toast.error("Network error — please try again")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div>
      <PageHero
        eyebrow="Reach Us"
        title="Contact"
        description="A question, a celebration to plan, or simply a hello — we read every message personally."
      />

      <section className="max-w-6xl mx-auto px-4 md:px-8 pb-24 grid grid-cols-1 lg:grid-cols-5 gap-10">
        {/* Info cards */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease }}
          className="lg:col-span-2 space-y-5"
        >
          {[
            { icon: MapPin, title: "Visit", lines: [settings.address1, settings.address2] },
            { icon: Clock, title: "Hours", lines: [settings.hoursDays, settings.hoursTime] },
            { icon: Phone, title: "Call", lines: [settings.phone, "For same-day reservations"] },
            { icon: Mail, title: "Write", lines: [settings.email, "We reply within a day"] },
          ].map(({ icon: Icon, title, lines }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1, ease }}
              className="glass-card border-gradient rounded-3xl p-7 flex items-start gap-5 hover:glow-gold transition-all duration-500 group"
            >
              <div className="relative w-11 h-11 flex-shrink-0">
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative w-full h-full flex items-center justify-center border border-primary/30 rounded-full">
                  <Icon className="w-4 h-4 text-primary" />
                </div>
              </div>
              <div>
                <h3 className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground mb-2">{title}</h3>
                <p className="text-foreground font-light tracking-wide">{lines[0]}</p>
                <p className="text-muted-foreground text-sm mt-1 font-light">{lines[1]}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease }}
          className="lg:col-span-3"
        >
          {sent ? (
            <div className="glass-card border-gradient rounded-3xl p-12 md:p-16 text-center h-full flex flex-col items-center justify-center">
              <div className="relative w-16 h-16 mb-8">
                <div className="absolute inset-0 bg-primary/30 rounded-full blur-2xl" />
                <div className="relative w-full h-full flex items-center justify-center border border-primary/40 rounded-full">
                  <Check className="w-6 h-6 text-primary" />
                </div>
              </div>
              <h2 className="text-2xl md:text-3xl font-light text-gradient-gold tracking-wide mb-4">Message Sent</h2>
              <p className="text-muted-foreground font-light leading-relaxed max-w-sm">
                Thank you, {name.split(" ")[0]}. Our team will get back to you at {email} shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="glass-card border-gradient rounded-3xl p-8 md:p-10 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <label className="block">
                  <span className="block text-[10px] tracking-[0.25em] uppercase text-muted-foreground mb-2.5">Name</span>
                  <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Jane Doe" className="input-lux" />
                </label>
                <label className="block">
                  <span className="block text-[10px] tracking-[0.25em] uppercase text-muted-foreground mb-2.5">Email</span>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="input-lux"
                  />
                </label>
              </div>
              <label className="block">
                <span className="block text-[10px] tracking-[0.25em] uppercase text-muted-foreground mb-2.5">Subject</span>
                <input
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Private event, feedback, press..."
                  className="input-lux"
                />
              </label>
              <label className="block">
                <span className="block text-[10px] tracking-[0.25em] uppercase text-muted-foreground mb-2.5">Message</span>
                <textarea
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={7}
                  placeholder="Tell us everything..."
                  className="input-lux resize-none"
                />
              </label>
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 rounded-full bg-gradient-to-r from-primary to-primary/80 text-primary-foreground tracking-[0.25em] uppercase text-sm hover:glow-gold-intense transition-shadow duration-500 disabled:opacity-50"
              >
                {submitting ? "Sending..." : "Send Message"}
              </button>
            </form>
          )}
        </motion.div>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-4 md:px-8 pb-28">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease }}
          className="text-center mb-12"
        >
          <p className="text-[11px] tracking-[0.35em] text-primary uppercase mb-6">Good to Know</p>
          <h2 className="text-3xl md:text-4xl font-light tracking-[0.1em] uppercase">Frequent Questions</h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2, ease }}
          className="glass-card border-gradient rounded-3xl px-6 md:px-10 py-4"
        >
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`faq-${i}`} className="border-white/10">
                <AccordionTrigger className="text-left font-light text-base md:text-lg tracking-wide hover:text-primary hover:no-underline transition-colors">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground font-light leading-relaxed text-base">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </section>
    </div>
  )
}
