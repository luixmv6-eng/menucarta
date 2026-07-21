"use client"

import { motion } from "framer-motion"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

export function PageTitle({ title, subtitle, actions }: { title: string; subtitle?: string; actions?: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
      <div>
        <h1 className="text-3xl md:text-4xl font-light tracking-[0.1em] text-gradient-gold">{title}</h1>
        {subtitle && <p className="mt-2 text-sm text-muted-foreground font-light tracking-wide">{subtitle}</p>}
      </div>
      {actions}
    </div>
  )
}

const statusStyles: Record<string, string> = {
  pending: "bg-[#c98500]/15 text-[#e9b04a] border-[#c98500]/30",
  confirmed: "bg-[#008300]/15 text-[#4fbf4f] border-[#008300]/30",
  cancelled: "bg-red-500/10 text-red-400 border-red-500/25",
  new: "bg-[#3987e5]/15 text-[#6aa8ef] border-[#3987e5]/30",
  preparing: "bg-[#c98500]/15 text-[#e9b04a] border-[#c98500]/30",
  ready: "bg-[#d55181]/15 text-[#e57ba2] border-[#d55181]/30",
  completed: "bg-[#008300]/15 text-[#4fbf4f] border-[#008300]/30",
}

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-3 py-1 rounded-full border text-[10px] tracking-[0.15em] uppercase",
        statusStyles[status] ?? "bg-white/5 text-muted-foreground border-white/10",
      )}
    >
      {status}
    </span>
  )
}

export function AdminCard({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("glass-card border-gradient rounded-3xl p-6 md:p-8", className)}>{children}</div>
}

export function EmptyState({ text }: { text: string }) {
  return (
    <div className="text-center py-16 text-muted-foreground font-light tracking-wide">
      <div className="w-10 h-10 mx-auto mb-4 border border-primary/30 rotate-45" />
      {text}
    </div>
  )
}

export function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-md"
      />
      <div className="fixed inset-0 z-[201] flex items-center justify-center p-4 overflow-y-auto pointer-events-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.97, y: 20 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full max-w-2xl my-8 glass-card border-gradient rounded-3xl p-7 md:p-9 bg-background/95 pointer-events-auto"
        >
          <div className="flex items-center justify-between mb-7">
            <h2 className="text-xl font-light tracking-[0.15em] uppercase text-gradient-gold">{title}</h2>
            <button
              onClick={onClose}
              className="w-9 h-9 flex items-center justify-center rounded-full glass-card hover:text-primary transition-colors"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          {children}
        </motion.div>
      </div>
    </>
  )
}

export function Labeled({ label, full, children }: { label: string; full?: boolean; children: React.ReactNode }) {
  return (
    <label className={cn("block", full && "md:col-span-2")}>
      <span className="block text-[10px] tracking-[0.25em] uppercase text-muted-foreground mb-2">{label}</span>
      {children}
    </label>
  )
}

export async function adminFetch<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
  })
  if (res.status === 401) {
    window.location.href = "/admin/login"
    throw new Error("Unauthorized")
  }
  const data = await res.json()
  if (!res.ok) throw new Error(data.error ?? "Request failed")
  return data as T
}
