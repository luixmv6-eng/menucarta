"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { SidebarNav } from "@/components/menu/sidebar-nav"
import { MobileNav } from "@/components/menu/mobile-nav"
import { MenuSection } from "@/components/menu/menu-section"
import { ItemDetailModal } from "@/components/menu/item-detail-modal"
import { PageHero } from "@/components/site/page-hero"
import type { MenuCategory, MenuItem } from "@/lib/types"

interface MenuClientProps {
  categories: MenuCategory[]
  orderingEnabled: boolean
}

export function MenuClient({ categories, orderingEnabled }: MenuClientProps) {
  const [activeCategory, setActiveCategory] = useState(categories[0]?.id ?? "")
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleCategoryChange = (categoryId: string) => {
    setActiveCategory(categoryId)
    const element = document.getElementById(categoryId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  const handleItemClick = (item: MenuItem) => {
    setSelectedItem(item)
    setIsModalOpen(true)
    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "item_view", name: item.name }),
    }).catch(() => {})
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setTimeout(() => setSelectedItem(null), 300)
  }

  // Track active section on scroll
  useEffect(() => {
    let ticking = false
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollPosition = window.scrollY + 250
          for (let i = categories.length - 1; i >= 0; i--) {
            const element = document.getElementById(categories[i].id)
            if (element && element.offsetTop <= scrollPosition) {
              setActiveCategory(categories[i].id)
              break
            }
          }
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [categories])

  return (
    <>
      <ItemDetailModal
        item={selectedItem}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        allowOrdering={orderingEnabled}
      />

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}>
        <SidebarNav categories={categories} activeCategory={activeCategory} onCategoryChange={handleCategoryChange} />
        <MobileNav categories={categories} activeCategory={activeCategory} onCategoryChange={handleCategoryChange} />

        <PageHero
          eyebrow="The Collection"
          title="The Menu"
          description="An exquisite culinary journey through artfully crafted dishes. Tap any creation to discover its story — and add it to your order."
        />

        <div className="lg:pl-48 xl:pl-56">
          <div className="max-w-6xl mx-auto px-3 sm:px-4 md:px-8 lg:px-10 pb-16">
            {categories.map((category) => (
              <MenuSection key={category.id} category={category} onItemClick={handleItemClick} />
            ))}
          </div>
        </div>
      </motion.div>
    </>
  )
}
