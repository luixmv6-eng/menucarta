export interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  image: string
  tags: string[]
  isSignature?: boolean
  pairingNote?: string
  available?: boolean
}

export interface MenuCategory {
  id: string
  name: string
  description: string
  icon: string
  items: MenuItem[]
}

export interface Experience {
  id: string
  title: string
  subtitle?: string
  description: string
  price: number
  priceLabel?: string
  category: "event" | "couples" | "tasting" | "private"
  image: string
  badge?: string
  features: string[]
  featured?: boolean
  active: boolean
}

export interface TableOption {
  id: string
  name: string
  description: string
  capacityMin: number
  capacityMax: number
  minimumSpend: number
  perks: string[]
  active: boolean
}

export interface Reservation {
  id: string
  name: string
  email: string
  phone: string
  date: string
  time: string
  guests: number
  tableId: string
  experienceId?: string
  occasion?: string
  notes?: string
  status: "pending" | "confirmed" | "cancelled"
  createdAt: string
}

export interface OrderItem {
  itemId: string
  name: string
  price: number
  qty: number
}

export interface Order {
  id: string
  code: string
  customer: { name: string; phone: string; email?: string; notes?: string }
  type: "pickup" | "dine-in"
  items: OrderItem[]
  subtotal: number
  total: number
  status: "new" | "preparing" | "ready" | "completed" | "cancelled"
  createdAt: string
}

export interface ContactMessage {
  id: string
  name: string
  email: string
  subject: string
  message: string
  read: boolean
  createdAt: string
}

export interface AnalyticsEvent {
  id: string
  type: "page_view" | "item_view"
  name: string
  ts: string
}

export interface SiteSettings {
  name: string
  tagline: string
  heroSubtitle: string
  chef: string
  cuisine: string
  hoursDays: string
  hoursTime: string
  address1: string
  address2: string
  phone: string
  email: string
  instagram: string
  announcement: string
  about: {
    story: string[]
    vision: string
    mission: string
    values: { title: string; text: string }[]
    stats: { label: string; value: string }[]
  }
  ordering: {
    enabled: boolean
    minOrder: number
    pickupNote: string
  }
  reservationSlots: string[]
}

export interface DatabaseShape {
  settings: SiteSettings
  categories: MenuCategory[]
  experiences: Experience[]
  tables: TableOption[]
  reservations: Reservation[]
  orders: Order[]
  messages: ContactMessage[]
  analytics: AnalyticsEvent[]
}
