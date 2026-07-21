"use client"

import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { X, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react"
import { useCart } from "./cart-context"

export function CartDrawer({ minOrder }: { minOrder: number }) {
  const { lines, subtotal, isOpen, setOpen, setQty, remove } = useCart()

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-[300] bg-black/70 backdrop-blur-md"
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 bottom-0 z-[301] w-full max-w-md bg-background border-l border-white/10 flex flex-col"
          >
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-light tracking-[0.15em] uppercase">Your Order</h2>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="w-10 h-10 flex items-center justify-center rounded-full glass-card hover:text-primary transition-colors"
                aria-label="Close cart"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-6">
              {lines.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center gap-4">
                  <div className="w-16 h-16 rounded-full glass-card flex items-center justify-center">
                    <ShoppingBag className="w-6 h-6 text-primary/60" />
                  </div>
                  <p className="text-muted-foreground font-light">Your order is empty.</p>
                  <Link
                    href="/menu"
                    onClick={() => setOpen(false)}
                    className="text-sm tracking-[0.2em] uppercase text-primary elegant-underline"
                  >
                    Explore the menu
                  </Link>
                </div>
              ) : (
                <ul className="space-y-5">
                  {lines.map((line) => (
                    <motion.li
                      key={line.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="flex gap-4 glass-card rounded-2xl p-4"
                    >
                      <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                        <Image src={line.image || "/placeholder.jpg"} alt={line.name} fill className="object-cover" sizes="64px" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className="font-light text-foreground leading-snug line-clamp-2">{line.name}</p>
                          <button
                            onClick={() => remove(line.id)}
                            className="text-muted-foreground hover:text-destructive-foreground transition-colors flex-shrink-0"
                            aria-label={`Remove ${line.name}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="mt-2 flex items-center justify-between">
                          <div className="flex items-center gap-3 rounded-full border border-white/10 px-2 py-1">
                            <button
                              onClick={() => setQty(line.id, line.qty - 1)}
                              className="w-6 h-6 flex items-center justify-center hover:text-primary transition-colors"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="text-sm w-4 text-center">{line.qty}</span>
                            <button
                              onClick={() => setQty(line.id, line.qty + 1)}
                              className="w-6 h-6 flex items-center justify-center hover:text-primary transition-colors"
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <span className="text-primary font-light">${line.price * line.qty}</span>
                        </div>
                      </div>
                    </motion.li>
                  ))}
                </ul>
              )}
            </div>

            {lines.length > 0 && (
              <div className="px-6 py-6 border-t border-white/10 space-y-4">
                <div className="flex items-center justify-between text-lg">
                  <span className="text-muted-foreground font-light">Subtotal</span>
                  <span className="text-gradient-gold font-light text-2xl">${subtotal}</span>
                </div>
                {subtotal < minOrder && (
                  <p className="text-xs text-muted-foreground tracking-wide">
                    Minimum order for online pickup is ${minOrder}.
                  </p>
                )}
                <Link
                  href="/order"
                  onClick={() => setOpen(false)}
                  className="block w-full text-center py-4 rounded-full bg-gradient-to-r from-primary to-primary/80 text-primary-foreground tracking-[0.2em] uppercase text-sm hover:glow-gold-intense transition-shadow"
                >
                  Proceed to Checkout
                </Link>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
