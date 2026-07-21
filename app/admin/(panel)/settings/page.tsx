"use client"

import { useCallback, useEffect, useState } from "react"
import { AnimatePresence } from "framer-motion"
import { Pencil, Plus, Save, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { PageTitle, AdminCard, EmptyState, Modal, Labeled, adminFetch } from "@/components/admin/admin-ui"
import { Switch } from "@/components/ui/switch"
import type { SiteSettings, TableOption } from "@/lib/types"

interface TableForm {
  id?: string
  name: string
  description: string
  capacityMin: string
  capacityMax: string
  minimumSpend: string
  perks: string
  active: boolean
}

const emptyTableForm: TableForm = {
  name: "",
  description: "",
  capacityMin: "1",
  capacityMax: "4",
  minimumSpend: "0",
  perks: "",
  active: true,
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null)
  const [tables, setTables] = useState<TableOption[]>([])
  const [tableForm, setTableForm] = useState<TableForm | null>(null)
  const [saving, setSaving] = useState(false)

  const reload = useCallback(async () => {
    try {
      const data = await adminFetch<{ settings: SiteSettings; tables: TableOption[] }>("/api/admin/settings")
      setSettings(data.settings)
      setTables(data.tables)
    } catch (e) {
      toast.error((e as Error).message)
    }
  }, [])

  useEffect(() => {
    reload()
  }, [reload])

  const saveSettings = async () => {
    if (!settings) return
    setSaving(true)
    try {
      await adminFetch("/api/admin/settings", { method: "PUT", body: JSON.stringify(settings) })
      toast.success("Site settings saved — changes are live")
    } catch (e) {
      toast.error((e as Error).message)
    } finally {
      setSaving(false)
    }
  }

  const saveTable = async () => {
    if (!tableForm) return
    const capacityMin = Number(tableForm.capacityMin)
    const capacityMax = Number(tableForm.capacityMax)
    const minimumSpend = Number(tableForm.minimumSpend)
    if (!tableForm.name.trim() || Number.isNaN(capacityMin) || Number.isNaN(capacityMax) || capacityMin > capacityMax) {
      toast.error("Check the table name and capacity range")
      return
    }
    const payload = {
      name: tableForm.name.trim(),
      description: tableForm.description.trim(),
      capacityMin,
      capacityMax,
      minimumSpend: Number.isNaN(minimumSpend) ? 0 : minimumSpend,
      perks: tableForm.perks.split("\n").map((p) => p.trim()).filter(Boolean).slice(0, 8),
      active: tableForm.active,
    }
    try {
      if (tableForm.id) {
        await adminFetch(`/api/admin/tables/${tableForm.id}`, { method: "PATCH", body: JSON.stringify(payload) })
        toast.success("Table updated")
      } else {
        await adminFetch("/api/admin/tables", { method: "POST", body: JSON.stringify(payload) })
        toast.success("Table type created")
      }
      setTableForm(null)
      await reload()
    } catch (e) {
      toast.error((e as Error).message)
    }
  }

  const deleteTable = async (t: TableOption) => {
    if (!confirm(`Delete table type "${t.name}"?`)) return
    try {
      await adminFetch(`/api/admin/tables/${t.id}`, { method: "DELETE" })
      toast.success("Table type deleted")
      await reload()
    } catch (e) {
      toast.error((e as Error).message)
    }
  }

  if (!settings) return <div className="h-96 rounded-3xl bg-white/5 animate-pulse" />

  const set = (patch: Partial<SiteSettings>) => setSettings({ ...settings, ...patch })
  const setAbout = (patch: Partial<SiteSettings["about"]>) => set({ about: { ...settings.about, ...patch } })

  return (
    <div className="space-y-8 pb-24">
      <PageTitle
        title="Site Settings"
        subtitle="Everything the public site shows — identity, texts, hours, ordering and tables."
        actions={
          <button
            onClick={saveSettings}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-primary to-primary/80 text-primary-foreground text-[11px] tracking-[0.2em] uppercase hover:glow-gold transition-all disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" /> {saving ? "Saving..." : "Save All Changes"}
          </button>
        }
      />

      {/* Identity */}
      <AdminCard>
        <h2 className="text-sm tracking-[0.2em] uppercase text-muted-foreground mb-6">Identity</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Labeled label="Restaurant name">
            <input value={settings.name} onChange={(e) => set({ name: e.target.value })} className="input-lux" />
          </Labeled>
          <Labeled label="Tagline">
            <input value={settings.tagline} onChange={(e) => set({ tagline: e.target.value })} className="input-lux" />
          </Labeled>
          <Labeled label="Hero subtitle" full>
            <input value={settings.heroSubtitle} onChange={(e) => set({ heroSubtitle: e.target.value })} className="input-lux" />
          </Labeled>
          <Labeled label="Announcement banner (empty to hide)" full>
            <input value={settings.announcement} onChange={(e) => set({ announcement: e.target.value })} className="input-lux" />
          </Labeled>
          <Labeled label="Executive chef">
            <input value={settings.chef} onChange={(e) => set({ chef: e.target.value })} className="input-lux" />
          </Labeled>
          <Labeled label="Cuisine">
            <input value={settings.cuisine} onChange={(e) => set({ cuisine: e.target.value })} className="input-lux" />
          </Labeled>
        </div>
      </AdminCard>

      {/* Contact & hours */}
      <AdminCard>
        <h2 className="text-sm tracking-[0.2em] uppercase text-muted-foreground mb-6">Contact & Hours</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Labeled label="Address line 1">
            <input value={settings.address1} onChange={(e) => set({ address1: e.target.value })} className="input-lux" />
          </Labeled>
          <Labeled label="Address line 2">
            <input value={settings.address2} onChange={(e) => set({ address2: e.target.value })} className="input-lux" />
          </Labeled>
          <Labeled label="Phone">
            <input value={settings.phone} onChange={(e) => set({ phone: e.target.value })} className="input-lux" />
          </Labeled>
          <Labeled label="Email">
            <input value={settings.email} onChange={(e) => set({ email: e.target.value })} className="input-lux" />
          </Labeled>
          <Labeled label="Instagram URL">
            <input value={settings.instagram} onChange={(e) => set({ instagram: e.target.value })} className="input-lux" />
          </Labeled>
          <Labeled label="Open days">
            <input value={settings.hoursDays} onChange={(e) => set({ hoursDays: e.target.value })} className="input-lux" />
          </Labeled>
          <Labeled label="Open hours">
            <input value={settings.hoursTime} onChange={(e) => set({ hoursTime: e.target.value })} className="input-lux" />
          </Labeled>
        </div>
      </AdminCard>

      {/* About */}
      <AdminCard>
        <h2 className="text-sm tracking-[0.2em] uppercase text-muted-foreground mb-6">About Page — Story, Vision & Mission</h2>
        <div className="space-y-4">
          <Labeled label="Story (one paragraph per line block, separated by a blank line)" full>
            <textarea
              value={settings.about.story.join("\n\n")}
              onChange={(e) => setAbout({ story: e.target.value.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean).slice(0, 6) })}
              rows={8}
              className="input-lux resize-none"
            />
          </Labeled>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Labeled label="Vision">
              <textarea value={settings.about.vision} onChange={(e) => setAbout({ vision: e.target.value })} rows={4} className="input-lux resize-none" />
            </Labeled>
            <Labeled label="Mission">
              <textarea value={settings.about.mission} onChange={(e) => setAbout({ mission: e.target.value })} rows={4} className="input-lux resize-none" />
            </Labeled>
          </div>

          <div>
            <p className="text-[10px] tracking-[0.25em] uppercase text-muted-foreground mb-3">Values</p>
            <div className="space-y-3">
              {settings.about.values.map((v, i) => (
                <div key={i} className="grid grid-cols-1 md:grid-cols-[200px_1fr_auto] gap-3">
                  <input
                    value={v.title}
                    onChange={(e) => {
                      const values = [...settings.about.values]
                      values[i] = { ...values[i], title: e.target.value }
                      setAbout({ values })
                    }}
                    placeholder="Title"
                    className="input-lux"
                  />
                  <input
                    value={v.text}
                    onChange={(e) => {
                      const values = [...settings.about.values]
                      values[i] = { ...values[i], text: e.target.value }
                      setAbout({ values })
                    }}
                    placeholder="Text"
                    className="input-lux"
                  />
                  <button
                    onClick={() => setAbout({ values: settings.about.values.filter((_, j) => j !== i) })}
                    className="w-11 h-11 flex items-center justify-center rounded-xl glass-card hover:text-red-400 transition-colors"
                    title="Remove value"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {settings.about.values.length < 8 && (
                <button
                  onClick={() => setAbout({ values: [...settings.about.values, { title: "", text: "" }] })}
                  className="flex items-center gap-2 text-[11px] tracking-[0.2em] uppercase text-primary hover:text-primary/80 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" /> Add value
                </button>
              )}
            </div>
          </div>

          <div>
            <p className="text-[10px] tracking-[0.25em] uppercase text-muted-foreground mb-3">Stats</p>
            <div className="space-y-3">
              {settings.about.stats.map((s, i) => (
                <div key={i} className="grid grid-cols-1 md:grid-cols-[160px_1fr_auto] gap-3">
                  <input
                    value={s.value}
                    onChange={(e) => {
                      const stats = [...settings.about.stats]
                      stats[i] = { ...stats[i], value: e.target.value }
                      setAbout({ stats })
                    }}
                    placeholder="Value (e.g. 10)"
                    className="input-lux"
                  />
                  <input
                    value={s.label}
                    onChange={(e) => {
                      const stats = [...settings.about.stats]
                      stats[i] = { ...stats[i], label: e.target.value }
                      setAbout({ stats })
                    }}
                    placeholder="Label"
                    className="input-lux"
                  />
                  <button
                    onClick={() => setAbout({ stats: settings.about.stats.filter((_, j) => j !== i) })}
                    className="w-11 h-11 flex items-center justify-center rounded-xl glass-card hover:text-red-400 transition-colors"
                    title="Remove stat"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {settings.about.stats.length < 8 && (
                <button
                  onClick={() => setAbout({ stats: [...settings.about.stats, { value: "", label: "" }] })}
                  className="flex items-center gap-2 text-[11px] tracking-[0.2em] uppercase text-primary hover:text-primary/80 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" /> Add stat
                </button>
              )}
            </div>
          </div>
        </div>
      </AdminCard>

      {/* Ordering */}
      <AdminCard>
        <h2 className="text-sm tracking-[0.2em] uppercase text-muted-foreground mb-6">Online Ordering</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center justify-between rounded-2xl border border-white/10 px-4 py-3 md:col-span-2">
            <span className="text-sm font-light text-muted-foreground">Accept online orders</span>
            <Switch
              checked={settings.ordering.enabled}
              onCheckedChange={(v) => set({ ordering: { ...settings.ordering, enabled: v } })}
            />
          </div>
          <Labeled label="Minimum order ($)">
            <input
              type="number"
              min={0}
              value={settings.ordering.minOrder}
              onChange={(e) => set({ ordering: { ...settings.ordering, minOrder: Number(e.target.value) || 0 } })}
              className="input-lux"
            />
          </Labeled>
          <Labeled label="Pickup note (shown at checkout)">
            <input
              value={settings.ordering.pickupNote}
              onChange={(e) => set({ ordering: { ...settings.ordering, pickupNote: e.target.value } })}
              className="input-lux"
            />
          </Labeled>
        </div>
      </AdminCard>

      {/* Reservation slots */}
      <AdminCard>
        <h2 className="text-sm tracking-[0.2em] uppercase text-muted-foreground mb-6">Reservation Time Slots</h2>
        <Labeled label="Comma separated (e.g. 6:00 PM, 6:30 PM)" full>
          <input
            value={settings.reservationSlots.join(", ")}
            onChange={(e) => set({ reservationSlots: e.target.value.split(",").map((s) => s.trim()).filter(Boolean).slice(0, 30) })}
            className="input-lux"
          />
        </Labeled>
      </AdminCard>

      {/* Tables */}
      <AdminCard>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-sm tracking-[0.2em] uppercase text-muted-foreground">Table Types (Reservations)</h2>
          <button
            onClick={() => setTableForm(emptyTableForm)}
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-primary/40 text-primary text-[11px] tracking-[0.2em] uppercase hover:bg-primary/10 transition-all"
          >
            <Plus className="w-3.5 h-3.5" /> New Table Type
          </button>
        </div>
        {tables.length === 0 ? (
          <EmptyState text="No table types — guests cannot reserve until one exists." />
        ) : (
          <div className="space-y-3">
            {tables.map((t) => (
              <div key={t.id} className="flex items-center gap-4 rounded-2xl border border-white/5 bg-white/[0.02] p-4">
                <div className="flex-1 min-w-0">
                  <p className="font-light">{t.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {t.capacityMin}–{t.capacityMax} guests{t.minimumSpend > 0 && ` · min. spend $${t.minimumSpend}`} ·{" "}
                    {t.active ? "active" : "hidden"}
                  </p>
                </div>
                <button
                  onClick={() =>
                    setTableForm({
                      id: t.id,
                      name: t.name,
                      description: t.description,
                      capacityMin: String(t.capacityMin),
                      capacityMax: String(t.capacityMax),
                      minimumSpend: String(t.minimumSpend),
                      perks: t.perks.join("\n"),
                      active: t.active,
                    })
                  }
                  className="w-9 h-9 flex items-center justify-center rounded-full glass-card hover:text-primary transition-colors"
                  title="Edit"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => deleteTable(t)}
                  className="w-9 h-9 flex items-center justify-center rounded-full glass-card hover:text-red-400 transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </AdminCard>

      <div className="flex justify-end">
        <button
          onClick={saveSettings}
          disabled={saving}
          className="flex items-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-primary to-primary/80 text-primary-foreground text-sm tracking-[0.2em] uppercase hover:glow-gold-intense transition-all disabled:opacity-50"
        >
          <Save className="w-4 h-4" /> {saving ? "Saving..." : "Save All Changes"}
        </button>
      </div>

      <AnimatePresence>
        {tableForm && (
          <Modal onClose={() => setTableForm(null)} title={tableForm.id ? "Edit Table Type" : "New Table Type"}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Labeled label="Name" full>
                <input value={tableForm.name} onChange={(e) => setTableForm({ ...tableForm, name: e.target.value })} placeholder="Window Table" className="input-lux" />
              </Labeled>
              <Labeled label="Description" full>
                <input value={tableForm.description} onChange={(e) => setTableForm({ ...tableForm, description: e.target.value })} className="input-lux" />
              </Labeled>
              <Labeled label="Min guests">
                <input type="number" min={1} value={tableForm.capacityMin} onChange={(e) => setTableForm({ ...tableForm, capacityMin: e.target.value })} className="input-lux" />
              </Labeled>
              <Labeled label="Max guests">
                <input type="number" min={1} value={tableForm.capacityMax} onChange={(e) => setTableForm({ ...tableForm, capacityMax: e.target.value })} className="input-lux" />
              </Labeled>
              <Labeled label="Minimum spend ($, 0 for none)">
                <input type="number" min={0} value={tableForm.minimumSpend} onChange={(e) => setTableForm({ ...tableForm, minimumSpend: e.target.value })} className="input-lux" />
              </Labeled>
              <div className="flex items-center justify-between rounded-2xl border border-white/10 px-4 py-3">
                <span className="text-sm font-light text-muted-foreground">Available to book</span>
                <Switch checked={tableForm.active} onCheckedChange={(v) => setTableForm({ ...tableForm, active: v })} />
              </div>
              <Labeled label="Perks (one per line)" full>
                <textarea value={tableForm.perks} onChange={(e) => setTableForm({ ...tableForm, perks: e.target.value })} rows={3} className="input-lux resize-none" />
              </Labeled>
            </div>
            <button
              onClick={saveTable}
              className="mt-6 w-full py-3.5 rounded-full bg-gradient-to-r from-primary to-primary/80 text-primary-foreground tracking-[0.2em] uppercase text-sm hover:glow-gold transition-all"
            >
              {tableForm.id ? "Save Changes" : "Create Table Type"}
            </button>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  )
}
