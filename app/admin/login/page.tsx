"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Lock } from "lucide-react"

export default function AdminLoginPage() {
  const router = useRouter()
  const [user, setUser] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSubmitting(true)
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user, password }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setError(data.error ?? "Invalid credentials")
        return
      }
      router.push("/admin")
      router.refresh()
    } catch {
      setError("Network error — please try again")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.06, 0.12, 0.06] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/20 blur-[130px]"
        />
      </div>
      <div className="noise-overlay pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-md"
      >
        <div className="text-center mb-10">
          <h1 className="text-4xl font-light tracking-[0.35em] text-gradient-gold mb-3">LUMINA</h1>
          <p className="text-[11px] tracking-[0.3em] uppercase text-muted-foreground">Restaurant Control Panel</p>
        </div>

        <form onSubmit={handleSubmit} className="glass-card border-gradient rounded-3xl p-8 md:p-10 space-y-5">
          <div className="relative w-12 h-12 mx-auto mb-2">
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-lg" />
            <div className="relative w-full h-full flex items-center justify-center border border-primary/30 rounded-full">
              <Lock className="w-5 h-5 text-primary" />
            </div>
          </div>

          <label className="block">
            <span className="block text-[10px] tracking-[0.25em] uppercase text-muted-foreground mb-2.5">Username</span>
            <input required value={user} onChange={(e) => setUser(e.target.value)} placeholder="admin" className="input-lux" autoComplete="username" />
          </label>
          <label className="block">
            <span className="block text-[10px] tracking-[0.25em] uppercase text-muted-foreground mb-2.5">Password</span>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="input-lux"
              autoComplete="current-password"
            />
          </label>

          {error && <p className="text-sm text-red-400 font-light text-center">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-4 rounded-full bg-gradient-to-r from-primary to-primary/80 text-primary-foreground tracking-[0.25em] uppercase text-sm hover:glow-gold-intense transition-shadow duration-500 disabled:opacity-50"
          >
            {submitting ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </motion.div>
    </div>
  )
}
