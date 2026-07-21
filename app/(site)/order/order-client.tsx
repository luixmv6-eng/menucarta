"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Check, Minus, Plus, ShoppingBag, Store, Trash2, UtensilsCrossed } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { PageHero } from "@/components/site/page-hero"
import { useCart } from "@/components/cart/cart-context"
import type { SiteSettings } from "@/lib/types"

const ease = [0.22, 1, 0.36, 1] as const

interface OrderClientProps {
  ordering: SiteSettings["ordering"]
  phone: string
}

export function OrderClient({ ordering, phone }: OrderClientProps) {
  const { lines, subtotal, setQty, remove, clear } = useCart()
  const [type, setType] = useState<"pickup" | "dine-in">("pickup")
  const [name, setName] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [email, setEmail] = useState("")
  const [notes, setNotes] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [placed, setPlaced] = useState<{ code: string } | null>(null)

  const belowMinimum = subtotal < ordering.minOrder

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (lines.length === 0) return
    setSubmitting(true)
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: { name, phone: phoneNumber, email: email || undefined, notes: notes || undefined },
          type,
          items: lines.map((l) => ({ itemId: l.id, qty: l.qty })),
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error ?? "We could not place your order")
        return
      }
      setPlaced({ code: data.order.code })
      clear()
    } catch {
      toast.error("Network error — please try again")
    } finally {
      setSubmitting(false)
    }
  }

  if (!ordering.enabled) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 pt-24 text-center">
        <div className="glass-card border-gradient rounded-3xl p-12 max-w-lg">
          <h1 className="text-3xl font-light text-gradient-gold mb-4">Ordering Paused</h1>
          <p className="text-muted-foreground font-light">
            Online ordering is currently unavailable. Please call us at {phone}.
          </p>
        </div>
      </div>
    )
  }

  if (placed) {
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
          <h1 className="text-3xl md:text-4xl font-light tracking-wide text-gradient-gold mb-4">Order Received</h1>
          <p className="text-5xl font-light tracking-[0.2em] text-foreground my-8">{placed.code}</p>
          <p className="text-muted-foreground font-light leading-relaxed mb-2">
            Keep this code — mention it when you arrive.
          </p>
          <p className="text-sm text-muted-foreground/70 font-light">{ordering.pickupNote}</p>
          <div className="mt-10">
            <Link
              href="/menu"
              className="inline-flex items-center gap-2 text-sm tracking-[0.2em] uppercase text-primary elegant-underline"
            >
              Back to the menu <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div>
      <PageHero
        eyebrow="À la Maison"
        title="Your Order"
        description={ordering.pickupNote}
      />

      {lines.length === 0 ? (
        <div className="max-w-lg mx-auto px-4 pb-28 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease }}
            className="glass-card border-gradient rounded-3xl p-12"
          >
            <div className="w-16 h-16 mx-auto mb-6 rounded-full glass-card flex items-center justify-center">
              <ShoppingBag className="w-6 h-6 text-primary/60" />
            </div>
            <p className="text-muted-foreground font-light mb-8">Your order is empty — the menu awaits.</p>
            <Link
              href="/menu"
              className="inline-flex items-center gap-3 px-10 py-4 rounded-full bg-gradient-to-r from-primary to-primary/80 text-primary-foreground tracking-[0.2em] uppercase text-sm hover:glow-gold-intense transition-shadow"
            >
              Explore the Menu
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="max-w-5xl mx-auto px-4 md:px-8 pb-28 grid grid-cols-1 lg:grid-cols-5 gap-10">
          {/* Cart lines */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease }}
            className="lg:col-span-3 space-y-4"
          >
            {lines.map((line) => (
              <div key={line.id} className="glass-card border-gradient rounded-3xl p-5 flex gap-5 items-center">
                <div className="relative w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0">
                  <Image src={line.image || "/placeholder.jpg"} alt={line.name} fill className="object-cover" sizes="80px" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-light text-lg tracking-wide line-clamp-1">{line.name}</p>
                  <p className="text-primary text-sm mt-1">${line.price} each</p>
                </div>
                <div className="flex items-center gap-3 rounded-full border border-white/10 px-3 py-1.5">
                  <button type="button" onClick={() => setQty(line.id, line.qty - 1)} className="hover:text-primary transition-colors" aria-label="Decrease">
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-5 text-center">{line.qty}</span>
                  <button type="button" onClick={() => setQty(line.id, line.qty + 1)} className="hover:text-primary transition-colors" aria-label="Increase">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <p className="w-16 text-right text-lg font-light text-gradient-gold">${line.price * line.qty}</p>
                <button type="button" onClick={() => remove(line.id)} className="text-muted-foreground hover:text-destructive-foreground transition-colors" aria-label="Remove">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </motion.div>

          {/* Checkout */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease }}
            className="lg:col-span-2"
          >
            <div className="glass-card border-gradient rounded-3xl p-8 space-y-5 lg:sticky lg:top-28">
              <div className="grid grid-cols-2 gap-3">
                {(
                  [
                    { value: "pickup", label: "Pickup", icon: Store },
                    { value: "dine-in", label: "Dine In", icon: UtensilsCrossed },
                  ] as const
                ).map(({ value, label, icon: Icon }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setType(value)}
                    className={cn(
                      "flex items-center justify-center gap-2 py-3.5 rounded-2xl border text-sm tracking-[0.15em] uppercase transition-all duration-300",
                      type === value
                        ? "border-primary/50 text-primary bg-primary/10 glow-gold"
                        : "border-white/10 text-muted-foreground hover:border-primary/20",
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                  </button>
                ))}
              </div>

              <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" className="input-lux" />
              <input required value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="Phone" className="input-lux" />
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email (optional)" className="input-lux" />
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} placeholder="Notes for the kitchen (optional)" className="input-lux resize-none" />

              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <span className="text-muted-foreground font-light tracking-wide">Subtotal</span>
                <span className="text-3xl font-light text-gradient-gold">${subtotal}</span>
              </div>

              {belowMinimum && (
                <p className="text-xs text-primary/90 font-light">
                  Minimum order is ${ordering.minOrder}. Add ${ordering.minOrder - subtotal} more to continue.
                </p>
              )}

              <button
                type="submit"
                disabled={submitting || belowMinimum}
                className="w-full py-4 rounded-full bg-gradient-to-r from-primary to-primary/80 text-primary-foreground tracking-[0.25em] uppercase text-sm hover:glow-gold-intense transition-shadow duration-500 disabled:opacity-40"
              >
                {submitting ? "Placing order..." : "Place Order"}
              </button>
              <p className="text-[11px] text-muted-foreground/60 text-center font-light">
                Payment is settled at the restaurant. Tax not included.
              </p>
            </div>
          </motion.div>
        </form>
      )}
    </div>
  )
}
