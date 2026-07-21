"use client"

import { useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Armchair, CalendarDays, Check, PartyPopper, Sparkles, Users } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { PageHero } from "@/components/site/page-hero"
import type { Experience, TableOption } from "@/lib/types"

const ease = [0.22, 1, 0.36, 1] as const

interface ReservationsClientProps {
  tables: TableOption[]
  experiences: Experience[]
  slots: string[]
  phone: string
}

const occasions = ["None", "Birthday", "Anniversary", "Engagement", "Business Dinner", "Celebration"]

export function ReservationsClient(props: ReservationsClientProps) {
  return (
    <Suspense fallback={null}>
      <ReservationsForm {...props} />
    </Suspense>
  )
}

function ReservationsForm({ tables, experiences, slots, phone }: ReservationsClientProps) {
  const searchParams = useSearchParams()
  const preselected = searchParams.get("experience") ?? ""

  const [tableId, setTableId] = useState(tables[0]?.id ?? "")
  const [experienceId, setExperienceId] = useState(
    experiences.some((e) => e.id === preselected) ? preselected : "",
  )
  const [date, setDate] = useState("")
  const [time, setTime] = useState(slots[0] ?? "")
  const [guests, setGuests] = useState(2)
  const [occasion, setOccasion] = useState("None")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [notes, setNotes] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [confirmed, setConfirmed] = useState<{ id: string } | null>(null)

  const selectedTable = tables.find((t) => t.id === tableId)
  const minDate = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 10)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!date) {
      toast.error("Please choose a date for your reservation")
      return
    }
    setSubmitting(true)
    try {
      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone: phoneNumber,
          date,
          time,
          guests,
          tableId,
          experienceId: experienceId || undefined,
          occasion: occasion === "None" ? undefined : occasion,
          notes: notes || undefined,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error ?? "We could not process your reservation")
        return
      }
      setConfirmed({ id: data.reservation.id })
    } catch {
      toast.error("Network error — please try again")
    } finally {
      setSubmitting(false)
    }
  }

  if (confirmed) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 pt-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, ease }}
          className="glass-card border-gradient rounded-3xl p-10 md:p-16 text-center max-w-xl"
        >
          <div className="relative w-20 h-20 mx-auto mb-8">
            <div className="absolute inset-0 bg-primary/30 rounded-full blur-2xl" />
            <div className="relative w-full h-full flex items-center justify-center border border-primary/40 rounded-full">
              <Check className="w-8 h-8 text-primary" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-light tracking-wide text-gradient-gold mb-6">Request Received</h1>
          <p className="text-muted-foreground font-light leading-relaxed mb-4">
            Thank you, {name.split(" ")[0]}. Our maître d' will confirm your evening within a few hours by email or
            phone.
          </p>
          <p className="text-sm text-muted-foreground/70 font-light">
            {selectedTable?.name} · {date} · {time} · {guests} {guests === 1 ? "guest" : "guests"}
          </p>
          <div className="mt-10 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
          <p className="mt-6 text-xs tracking-[0.2em] uppercase text-muted-foreground/60">
            Need to change something? Call us at {phone}
          </p>
        </motion.div>
      </div>
    )
  }

  return (
    <div>
      <PageHero
        eyebrow="Join Us"
        title="Reservations"
        description="Choose your table, your evening and your occasion — we will compose the rest."
      />

      <form onSubmit={handleSubmit} className="max-w-5xl mx-auto px-4 md:px-8 pb-28 space-y-16">
        {/* Step 1 — Table */}
        <StepBlock number="01" icon={Armchair} title="Choose Your Table">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {tables.map((table) => {
              const isActive = tableId === table.id
              return (
                <motion.button
                  key={table.id}
                  type="button"
                  onClick={() => setTableId(table.id)}
                  whileTap={{ scale: 0.98 }}
                  className={cn(
                    "relative text-left glass-card rounded-3xl p-7 transition-all duration-500 border",
                    isActive ? "border-primary/50 glow-gold" : "border-white/5 hover:border-primary/20",
                  )}
                >
                  {isActive && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-5 right-5 w-7 h-7 rounded-full bg-primary flex items-center justify-center"
                    >
                      <Check className="w-4 h-4 text-primary-foreground" />
                    </motion.div>
                  )}
                  <h3 className={cn("text-xl font-light tracking-wide mb-2", isActive && "text-gradient-gold")}>
                    {table.name}
                  </h3>
                  <p className="text-sm text-muted-foreground font-light leading-relaxed mb-4">{table.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {table.perks.map((perk) => (
                      <span
                        key={perk}
                        className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] tracking-[0.12em] uppercase text-muted-foreground"
                      >
                        {perk}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground/80 tracking-wide">
                    <span className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-primary/70" />
                      {table.capacityMin}–{table.capacityMax} guests
                    </span>
                    {table.minimumSpend > 0 && <span>Min. spend ${table.minimumSpend}</span>}
                  </div>
                </motion.button>
              )
            })}
          </div>
        </StepBlock>

        {/* Step 2 — Experience */}
        <StepBlock number="02" icon={Sparkles} title="Add an Experience" optional>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setExperienceId("")}
              className={cn(
                "text-left glass-card rounded-2xl p-5 transition-all duration-500 border",
                !experienceId ? "border-primary/50 glow-gold" : "border-white/5 hover:border-primary/20",
              )}
            >
              <p className={cn("font-light tracking-wide", !experienceId && "text-gradient-gold")}>À la carte evening</p>
              <p className="text-xs text-muted-foreground mt-1 font-light">Order freely from the full menu</p>
            </button>
            {experiences.map((exp) => {
              const isActive = experienceId === exp.id
              return (
                <button
                  key={exp.id}
                  type="button"
                  onClick={() => setExperienceId(exp.id)}
                  className={cn(
                    "text-left glass-card rounded-2xl p-5 transition-all duration-500 border",
                    isActive ? "border-primary/50 glow-gold" : "border-white/5 hover:border-primary/20",
                  )}
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className={cn("font-light tracking-wide", isActive && "text-gradient-gold")}>{exp.title}</p>
                    <span className="text-primary text-sm whitespace-nowrap">${exp.price}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 font-light line-clamp-1">
                    {exp.subtitle ?? exp.description}
                  </p>
                </button>
              )
            })}
          </div>
        </StepBlock>

        {/* Step 3 — Date & guests */}
        <StepBlock number="03" icon={CalendarDays} title="Pick Date & Party">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <Field label="Date">
              <input
                type="date"
                required
                min={minDate}
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="input-lux"
              />
            </Field>
            <Field label="Time">
              <select value={time} onChange={(e) => setTime(e.target.value)} className="input-lux">
                {slots.map((slot) => (
                  <option key={slot} value={slot}>
                    {slot}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Guests">
              <select value={guests} onChange={(e) => setGuests(Number(e.target.value))} className="input-lux">
                {Array.from({ length: 20 }, (_, i) => i + 1).map((n) => (
                  <option key={n} value={n}>
                    {n} {n === 1 ? "guest" : "guests"}
                  </option>
                ))}
              </select>
            </Field>
          </div>
          {selectedTable && (guests < selectedTable.capacityMin || guests > selectedTable.capacityMax) && (
            <p className="mt-4 text-sm text-primary/90 font-light">
              {selectedTable.name} seats {selectedTable.capacityMin} to {selectedTable.capacityMax} guests — please
              adjust your party or pick another table.
            </p>
          )}
        </StepBlock>

        {/* Step 4 — Details */}
        <StepBlock number="04" icon={PartyPopper} title="Your Details">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Field label="Full name">
              <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Jane Doe" className="input-lux" />
            </Field>
            <Field label="Email">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="input-lux"
              />
            </Field>
            <Field label="Phone">
              <input
                required
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+1 (555) 000-0000"
                className="input-lux"
              />
            </Field>
            <Field label="Occasion">
              <select value={occasion} onChange={(e) => setOccasion(e.target.value)} className="input-lux">
                {occasions.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            </Field>
            <div className="md:col-span-2">
              <Field label="Special requests">
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                  placeholder="Allergies, dietary restrictions, surprises we should know about..."
                  className="input-lux resize-none"
                />
              </Field>
            </div>
          </div>
        </StepBlock>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease }}
          className="text-center"
        >
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center gap-3 px-14 py-5 rounded-full bg-gradient-to-r from-primary to-primary/80 text-primary-foreground tracking-[0.25em] uppercase text-sm hover:glow-gold-intense transition-shadow duration-500 disabled:opacity-50"
          >
            <AnimatePresence mode="wait" initial={false}>
              {submitting ? (
                <motion.span key="sending" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  Composing your evening...
                </motion.span>
              ) : (
                <motion.span key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  Request Reservation
                </motion.span>
              )}
            </AnimatePresence>
          </button>
          <p className="mt-5 text-xs text-muted-foreground/60 tracking-wide font-light">
            Reservations are confirmed by our team within a few hours. For same-day requests call {phone}.
          </p>
        </motion.div>
      </form>
    </div>
  )
}

function StepBlock({
  number,
  icon: Icon,
  title,
  optional,
  children,
}: {
  number: string
  icon: React.ElementType
  title: string
  optional?: boolean
  children: React.ReactNode
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8, ease }}
    >
      <div className="flex items-center gap-4 mb-8">
        <span className="text-4xl font-light text-primary/25">{number}</span>
        <div className="w-10 h-10 flex items-center justify-center border border-primary/30 rounded-full">
          <Icon className="w-4 h-4 text-primary" />
        </div>
        <h2 className="text-xl md:text-2xl font-light tracking-[0.15em] uppercase">
          {title}
          {optional && <span className="ml-3 text-[10px] tracking-[0.25em] text-muted-foreground/60">Optional</span>}
        </h2>
        <div className="flex-1 h-px bg-gradient-to-r from-primary/20 to-transparent" />
      </div>
      {children}
    </motion.section>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-[10px] tracking-[0.25em] uppercase text-muted-foreground mb-2.5">{label}</span>
      {children}
    </label>
  )
}
