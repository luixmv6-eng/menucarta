"use client"

import { useCallback, useEffect, useState } from "react"
import Image from "next/image"
import { AnimatePresence } from "framer-motion"
import { Pencil, Plus, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { PageTitle, AdminCard, EmptyState, Modal, Labeled, adminFetch } from "@/components/admin/admin-ui"
import { Switch } from "@/components/ui/switch"
import type { Experience } from "@/lib/types"

interface ExpForm {
  id?: string
  title: string
  subtitle: string
  description: string
  price: string
  priceLabel: string
  category: Experience["category"]
  image: string
  badge: string
  features: string
  featured: boolean
  active: boolean
}

const emptyForm: ExpForm = {
  title: "",
  subtitle: "",
  description: "",
  price: "",
  priceLabel: "per guest",
  category: "event",
  image: "",
  badge: "",
  features: "",
  featured: false,
  active: true,
}

const categoryLabels: Record<Experience["category"], string> = {
  couples: "For Couples",
  tasting: "Tasting Menu",
  event: "Special Event",
  private: "Private Dining",
}

export default function AdminExperiencesPage() {
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [form, setForm] = useState<ExpForm | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const reload = useCallback(async () => {
    try {
      const data = await adminFetch<{ experiences: Experience[] }>("/api/admin/experiences")
      setExperiences(data.experiences)
    } catch (e) {
      toast.error((e as Error).message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    reload()
  }, [reload])

  const save = async () => {
    if (!form) return
    const price = Number(form.price)
    if (!form.title.trim() || Number.isNaN(price) || price < 0) {
      toast.error("A title and a valid price are required")
      return
    }
    setSaving(true)
    const payload = {
      title: form.title.trim(),
      subtitle: form.subtitle.trim() || undefined,
      description: form.description.trim(),
      price,
      priceLabel: form.priceLabel.trim() || undefined,
      category: form.category,
      image: form.image.trim() || "/placeholder.jpg",
      badge: form.badge.trim() || undefined,
      features: form.features.split("\n").map((f) => f.trim()).filter(Boolean).slice(0, 10),
      featured: form.featured,
      active: form.active,
    }
    try {
      if (form.id) {
        await adminFetch(`/api/admin/experiences/${form.id}`, { method: "PATCH", body: JSON.stringify(payload) })
        toast.success("Experience updated")
      } else {
        await adminFetch("/api/admin/experiences", { method: "POST", body: JSON.stringify(payload) })
        toast.success("Experience created")
      }
      setForm(null)
      await reload()
    } catch (e) {
      toast.error((e as Error).message)
    } finally {
      setSaving(false)
    }
  }

  const remove = async (exp: Experience) => {
    if (!confirm(`Delete "${exp.title}"? This cannot be undone.`)) return
    try {
      await adminFetch(`/api/admin/experiences/${exp.id}`, { method: "DELETE" })
      toast.success("Experience deleted")
      await reload()
    } catch (e) {
      toast.error((e as Error).message)
    }
  }

  const toggleActive = async (exp: Experience) => {
    try {
      await adminFetch(`/api/admin/experiences/${exp.id}`, {
        method: "PATCH",
        body: JSON.stringify({ active: !exp.active }),
      })
      await reload()
    } catch (e) {
      toast.error((e as Error).message)
    }
  }

  if (loading) return <div className="h-96 rounded-3xl bg-white/5 animate-pulse" />

  return (
    <div>
      <PageTitle
        title="Experiences & Events"
        subtitle="Couple combos, tasting menus, live evenings and private dining packages."
        actions={
          <button
            onClick={() => setForm(emptyForm)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-primary to-primary/80 text-primary-foreground text-[11px] tracking-[0.2em] uppercase hover:glow-gold transition-all"
          >
            <Plus className="w-3.5 h-3.5" /> New Experience
          </button>
        }
      />

      {experiences.length === 0 ? (
        <EmptyState text="No experiences yet — create the first one." />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {experiences.map((exp) => (
            <AdminCard key={exp.id} className={cn("p-0 overflow-hidden", !exp.active && "opacity-60")}>
              <div className="relative h-36">
                <Image src={exp.image || "/placeholder.jpg"} alt={exp.title} fill className="object-cover brightness-[0.6]" sizes="600px" />
                <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className="px-3 py-1 rounded-full bg-black/50 backdrop-blur-xl border border-white/10 text-[9px] tracking-[0.2em] uppercase text-white/90">
                    {categoryLabels[exp.category]}
                  </span>
                  {exp.featured && (
                    <span className="px-3 py-1 rounded-full bg-primary/80 text-primary-foreground text-[9px] tracking-[0.2em] uppercase">
                      Featured on Home
                    </span>
                  )}
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h2 className="text-lg font-light tracking-wide">{exp.title}</h2>
                    {exp.subtitle && <p className="text-xs text-muted-foreground mt-0.5">{exp.subtitle}</p>}
                  </div>
                  <p className="text-xl font-light text-gradient-gold whitespace-nowrap">${exp.price}</p>
                </div>
                <p className="text-sm text-muted-foreground font-light mt-3 line-clamp-2">{exp.description}</p>
                <div className="flex items-center justify-between mt-5 pt-4 border-t border-white/5">
                  <div className="flex items-center gap-2.5">
                    <Switch checked={exp.active} onCheckedChange={() => toggleActive(exp)} />
                    <span className="text-xs text-muted-foreground">{exp.active ? "Visible" : "Hidden"}</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        setForm({
                          id: exp.id,
                          title: exp.title,
                          subtitle: exp.subtitle ?? "",
                          description: exp.description,
                          price: String(exp.price),
                          priceLabel: exp.priceLabel ?? "",
                          category: exp.category,
                          image: exp.image,
                          badge: exp.badge ?? "",
                          features: exp.features.join("\n"),
                          featured: !!exp.featured,
                          active: exp.active,
                        })
                      }
                      className="w-9 h-9 flex items-center justify-center rounded-full glass-card hover:text-primary transition-colors"
                      title="Edit"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => remove(exp)}
                      className="w-9 h-9 flex items-center justify-center rounded-full glass-card hover:text-red-400 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </AdminCard>
          ))}
        </div>
      )}

      <AnimatePresence>
        {form && (
          <Modal onClose={() => setForm(null)} title={form.id ? "Edit Experience" : "New Experience"}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Labeled label="Title" full>
                <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Constellation for Two" className="input-lux" />
              </Labeled>
              <Labeled label="Subtitle" full>
                <input value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} placeholder="Couples Tasting Combo" className="input-lux" />
              </Labeled>
              <Labeled label="Description" full>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="input-lux resize-none" />
              </Labeled>
              <Labeled label="Price ($)">
                <input type="number" min={0} value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="320" className="input-lux" />
              </Labeled>
              <Labeled label="Price label">
                <input value={form.priceLabel} onChange={(e) => setForm({ ...form, priceLabel: e.target.value })} placeholder="per couple" className="input-lux" />
              </Labeled>
              <Labeled label="Category">
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as Experience["category"] })} className="input-lux">
                  <option value="couples">For Couples</option>
                  <option value="tasting">Tasting Menu</option>
                  <option value="event">Special Event</option>
                  <option value="private">Private Dining</option>
                </select>
              </Labeled>
              <Labeled label="Badge">
                <input value={form.badge} onChange={(e) => setForm({ ...form, badge: e.target.value })} placeholder="Most Loved" className="input-lux" />
              </Labeled>
              <Labeled label="Image URL" full>
                <input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="/images/champagne.jpg or https://..." className="input-lux" />
              </Labeled>
              <Labeled label="Features (one per line)" full>
                <textarea value={form.features} onChange={(e) => setForm({ ...form, features: e.target.value })} rows={4} placeholder={"7 shared courses\n2 glasses of champagne"} className="input-lux resize-none" />
              </Labeled>
              <div className="flex items-center justify-between rounded-2xl border border-white/10 px-4 py-3">
                <span className="text-sm font-light text-muted-foreground">Featured on home</span>
                <Switch checked={form.featured} onCheckedChange={(v) => setForm({ ...form, featured: v })} />
              </div>
              <div className="flex items-center justify-between rounded-2xl border border-white/10 px-4 py-3">
                <span className="text-sm font-light text-muted-foreground">Visible on site</span>
                <Switch checked={form.active} onCheckedChange={(v) => setForm({ ...form, active: v })} />
              </div>
            </div>
            <button
              onClick={save}
              disabled={saving}
              className="mt-6 w-full py-3.5 rounded-full bg-gradient-to-r from-primary to-primary/80 text-primary-foreground tracking-[0.2em] uppercase text-sm hover:glow-gold transition-all disabled:opacity-50"
            >
              {saving ? "Saving..." : form.id ? "Save Changes" : "Create Experience"}
            </button>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  )
}
