"use client"

import { useCallback, useEffect, useState } from "react"
import Image from "next/image"
import { AnimatePresence } from "framer-motion"
import { Award, Pencil, Plus, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { PageTitle, AdminCard, EmptyState, Modal, Labeled, adminFetch } from "@/components/admin/admin-ui"
import { Switch } from "@/components/ui/switch"
import type { MenuCategory, MenuItem } from "@/lib/types"

interface ItemForm {
  id?: string
  categoryId: string
  name: string
  description: string
  price: string
  image: string
  tags: string
  isSignature: boolean
  pairingNote: string
  available: boolean
}

const emptyItemForm = (categoryId: string): ItemForm => ({
  categoryId,
  name: "",
  description: "",
  price: "",
  image: "",
  tags: "",
  isSignature: false,
  pairingNote: "",
  available: true,
})

interface CategoryForm {
  id?: string
  name: string
  description: string
  icon: string
}

export default function AdminMenuPage() {
  const [categories, setCategories] = useState<MenuCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [itemForm, setItemForm] = useState<ItemForm | null>(null)
  const [categoryForm, setCategoryForm] = useState<CategoryForm | null>(null)
  const [saving, setSaving] = useState(false)

  const reload = useCallback(async () => {
    try {
      const data = await adminFetch<{ categories: MenuCategory[] }>("/api/admin/categories")
      setCategories(data.categories)
    } catch (e) {
      toast.error((e as Error).message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    reload()
  }, [reload])

  const saveItem = async () => {
    if (!itemForm) return
    const price = Number(itemForm.price)
    if (!itemForm.name.trim() || Number.isNaN(price) || price < 0) {
      toast.error("A name and a valid price are required")
      return
    }
    setSaving(true)
    const payload = {
      categoryId: itemForm.categoryId,
      name: itemForm.name.trim(),
      description: itemForm.description.trim(),
      price,
      image: itemForm.image.trim() || "/placeholder.jpg",
      tags: itemForm.tags.split(",").map((t) => t.trim()).filter(Boolean).slice(0, 8),
      isSignature: itemForm.isSignature,
      pairingNote: itemForm.pairingNote.trim() || undefined,
      available: itemForm.available,
    }
    try {
      if (itemForm.id) {
        await adminFetch(`/api/admin/items/${itemForm.id}`, { method: "PATCH", body: JSON.stringify(payload) })
        toast.success("Dish updated")
      } else {
        await adminFetch("/api/admin/items", { method: "POST", body: JSON.stringify(payload) })
        toast.success("Dish added to the menu")
      }
      setItemForm(null)
      await reload()
    } catch (e) {
      toast.error((e as Error).message)
    } finally {
      setSaving(false)
    }
  }

  const deleteItem = async (item: MenuItem) => {
    if (!confirm(`Delete "${item.name}" from the menu? This cannot be undone.`)) return
    try {
      await adminFetch(`/api/admin/items/${item.id}`, { method: "DELETE" })
      toast.success("Dish removed")
      await reload()
    } catch (e) {
      toast.error((e as Error).message)
    }
  }

  const toggleAvailable = async (item: MenuItem) => {
    try {
      await adminFetch(`/api/admin/items/${item.id}`, {
        method: "PATCH",
        body: JSON.stringify({ available: !(item.available !== false) }),
      })
      await reload()
    } catch (e) {
      toast.error((e as Error).message)
    }
  }

  const saveCategory = async () => {
    if (!categoryForm || !categoryForm.name.trim()) {
      toast.error("Category name is required")
      return
    }
    setSaving(true)
    const payload = {
      name: categoryForm.name.trim(),
      description: categoryForm.description.trim(),
      icon: categoryForm.icon.trim() || "utensils",
    }
    try {
      if (categoryForm.id) {
        await adminFetch(`/api/admin/categories/${categoryForm.id}`, { method: "PATCH", body: JSON.stringify(payload) })
        toast.success("Category updated")
      } else {
        await adminFetch("/api/admin/categories", { method: "POST", body: JSON.stringify(payload) })
        toast.success("Category created")
      }
      setCategoryForm(null)
      await reload()
    } catch (e) {
      toast.error((e as Error).message)
    } finally {
      setSaving(false)
    }
  }

  const deleteCategory = async (cat: MenuCategory) => {
    if (!confirm(`Delete category "${cat.name}" and its ${cat.items.length} dishes? This cannot be undone.`)) return
    try {
      await adminFetch(`/api/admin/categories/${cat.id}`, { method: "DELETE" })
      toast.success("Category deleted")
      await reload()
    } catch (e) {
      toast.error((e as Error).message)
    }
  }

  if (loading) {
    return <div className="h-96 rounded-3xl bg-white/5 animate-pulse" />
  }

  return (
    <div>
      <PageTitle
        title="Menu Manager"
        subtitle="Add, edit or remove dishes and categories — changes go live instantly."
        actions={
          <div className="flex gap-3">
            <button
              onClick={() => setCategoryForm({ name: "", description: "", icon: "utensils" })}
              className="px-5 py-2.5 rounded-full border border-primary/40 text-primary text-[11px] tracking-[0.2em] uppercase hover:bg-primary/10 transition-all"
            >
              New Category
            </button>
            <button
              onClick={() => setItemForm(emptyItemForm(categories[0]?.id ?? ""))}
              disabled={categories.length === 0}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-primary to-primary/80 text-primary-foreground text-[11px] tracking-[0.2em] uppercase hover:glow-gold transition-all disabled:opacity-50"
            >
              <Plus className="w-3.5 h-3.5" /> New Dish
            </button>
          </div>
        }
      />

      {categories.length === 0 ? (
        <EmptyState text="No categories yet — create one to start building the menu." />
      ) : (
        <div className="space-y-8">
          {categories.map((cat) => (
            <AdminCard key={cat.id}>
              <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                <div>
                  <h2 className="text-xl font-light tracking-[0.15em] uppercase">{cat.name}</h2>
                  <p className="text-xs text-muted-foreground mt-1 font-light">
                    {cat.description || "No description"} · {cat.items.length} dishes
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setItemForm(emptyItemForm(cat.id))}
                    className="w-9 h-9 flex items-center justify-center rounded-full glass-card hover:text-primary transition-colors"
                    title="Add dish to this category"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setCategoryForm({ id: cat.id, name: cat.name, description: cat.description, icon: cat.icon })}
                    className="w-9 h-9 flex items-center justify-center rounded-full glass-card hover:text-primary transition-colors"
                    title="Edit category"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteCategory(cat)}
                    className="w-9 h-9 flex items-center justify-center rounded-full glass-card hover:text-red-400 transition-colors"
                    title="Delete category"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {cat.items.length === 0 ? (
                <p className="text-sm text-muted-foreground/60 font-light py-4">No dishes in this category yet.</p>
              ) : (
                <div className="space-y-3">
                  {cat.items.map((item) => (
                    <div
                      key={item.id}
                      className={cn(
                        "flex items-center gap-4 rounded-2xl border border-white/5 bg-white/[0.02] p-3.5 transition-opacity",
                        item.available === false && "opacity-50",
                      )}
                    >
                      <div className="relative w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 hidden sm:block">
                        <Image src={item.image || "/placeholder.jpg"} alt={item.name} fill className="object-cover" sizes="56px" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-light truncate">{item.name}</p>
                          {item.isSignature && <Award className="w-3.5 h-3.5 text-primary flex-shrink-0" />}
                        </div>
                        <p className="text-xs text-muted-foreground truncate mt-0.5">{item.description}</p>
                      </div>
                      <span className="text-primary font-light whitespace-nowrap">${item.price}</span>
                      <div className="flex items-center gap-1.5" title="Visible on the public menu">
                        <Switch checked={item.available !== false} onCheckedChange={() => toggleAvailable(item)} />
                      </div>
                      <button
                        onClick={() =>
                          setItemForm({
                            id: item.id,
                            categoryId: cat.id,
                            name: item.name,
                            description: item.description,
                            price: String(item.price),
                            image: item.image,
                            tags: item.tags.join(", "),
                            isSignature: !!item.isSignature,
                            pairingNote: item.pairingNote ?? "",
                            available: item.available !== false,
                          })
                        }
                        className="w-9 h-9 flex items-center justify-center rounded-full glass-card hover:text-primary transition-colors flex-shrink-0"
                        title="Edit dish"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteItem(item)}
                        className="w-9 h-9 flex items-center justify-center rounded-full glass-card hover:text-red-400 transition-colors flex-shrink-0"
                        title="Delete dish"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </AdminCard>
          ))}
        </div>
      )}

      {/* Item form modal */}
      <AnimatePresence>
        {itemForm && (
          <Modal onClose={() => setItemForm(null)} title={itemForm.id ? "Edit Dish" : "New Dish"}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Labeled label="Name" full>
                <input value={itemForm.name} onChange={(e) => setItemForm({ ...itemForm, name: e.target.value })} placeholder="Seared Hokkaido Scallops" className="input-lux" />
              </Labeled>
              <Labeled label="Description" full>
                <textarea value={itemForm.description} onChange={(e) => setItemForm({ ...itemForm, description: e.target.value })} rows={3} placeholder="Hand-dived scallops with..." className="input-lux resize-none" />
              </Labeled>
              <Labeled label="Price ($)">
                <input type="number" min={0} step="0.5" value={itemForm.price} onChange={(e) => setItemForm({ ...itemForm, price: e.target.value })} placeholder="38" className="input-lux" />
              </Labeled>
              <Labeled label="Category">
                <select value={itemForm.categoryId} onChange={(e) => setItemForm({ ...itemForm, categoryId: e.target.value })} className="input-lux">
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </Labeled>
              <Labeled label="Image URL" full>
                <input value={itemForm.image} onChange={(e) => setItemForm({ ...itemForm, image: e.target.value })} placeholder="/images/scallops.jpg or https://..." className="input-lux" />
              </Labeled>
              <Labeled label="Tags (comma separated)" full>
                <input value={itemForm.tags} onChange={(e) => setItemForm({ ...itemForm, tags: e.target.value })} placeholder="Seafood, Gluten-Free" className="input-lux" />
              </Labeled>
              <Labeled label="Sommelier pairing note" full>
                <input value={itemForm.pairingNote} onChange={(e) => setItemForm({ ...itemForm, pairingNote: e.target.value })} placeholder="Pairs beautifully with Chablis Premier Cru" className="input-lux" />
              </Labeled>
              <div className="flex items-center justify-between rounded-2xl border border-white/10 px-4 py-3">
                <span className="text-sm font-light text-muted-foreground">Signature dish</span>
                <Switch checked={itemForm.isSignature} onCheckedChange={(v) => setItemForm({ ...itemForm, isSignature: v })} />
              </div>
              <div className="flex items-center justify-between rounded-2xl border border-white/10 px-4 py-3">
                <span className="text-sm font-light text-muted-foreground">Visible on menu</span>
                <Switch checked={itemForm.available} onCheckedChange={(v) => setItemForm({ ...itemForm, available: v })} />
              </div>
            </div>
            <button
              onClick={saveItem}
              disabled={saving}
              className="mt-6 w-full py-3.5 rounded-full bg-gradient-to-r from-primary to-primary/80 text-primary-foreground tracking-[0.2em] uppercase text-sm hover:glow-gold transition-all disabled:opacity-50"
            >
              {saving ? "Saving..." : itemForm.id ? "Save Changes" : "Add Dish"}
            </button>
          </Modal>
        )}

        {categoryForm && (
          <Modal onClose={() => setCategoryForm(null)} title={categoryForm.id ? "Edit Category" : "New Category"}>
            <div className="space-y-4">
              <Labeled label="Name" full>
                <input value={categoryForm.name} onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })} placeholder="Desserts" className="input-lux" />
              </Labeled>
              <Labeled label="Description" full>
                <input value={categoryForm.description} onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })} placeholder="Indulgent endings to complete your journey" className="input-lux" />
              </Labeled>
              <Labeled label="Icon" full>
                <select value={categoryForm.icon} onChange={(e) => setCategoryForm({ ...categoryForm, icon: e.target.value })} className="input-lux">
                  <option value="utensils">Utensils</option>
                  <option value="chef-hat">Chef Hat</option>
                  <option value="cake">Cake</option>
                  <option value="wine">Wine</option>
                </select>
              </Labeled>
            </div>
            <button
              onClick={saveCategory}
              disabled={saving}
              className="mt-6 w-full py-3.5 rounded-full bg-gradient-to-r from-primary to-primary/80 text-primary-foreground tracking-[0.2em] uppercase text-sm hover:glow-gold transition-all disabled:opacity-50"
            >
              {saving ? "Saving..." : categoryForm.id ? "Save Changes" : "Create Category"}
            </button>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  )
}

