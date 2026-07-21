"use client"

import { useCallback, useEffect, useState } from "react"
import { Mail, MailOpen, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { PageTitle, AdminCard, EmptyState, adminFetch } from "@/components/admin/admin-ui"
import type { ContactMessage } from "@/lib/types"

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [loading, setLoading] = useState(true)

  const reload = useCallback(async () => {
    try {
      const data = await adminFetch<{ messages: ContactMessage[] }>("/api/admin/messages")
      setMessages(data.messages)
    } catch (e) {
      toast.error((e as Error).message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    reload()
  }, [reload])

  const toggleRead = async (msg: ContactMessage) => {
    try {
      await adminFetch(`/api/admin/messages/${msg.id}`, { method: "PATCH", body: JSON.stringify({ read: !msg.read }) })
      await reload()
    } catch (e) {
      toast.error((e as Error).message)
    }
  }

  const remove = async (id: string) => {
    if (!confirm("Delete this message permanently?")) return
    try {
      await adminFetch(`/api/admin/messages/${id}`, { method: "DELETE" })
      toast.success("Message deleted")
      await reload()
    } catch (e) {
      toast.error((e as Error).message)
    }
  }

  if (loading) return <div className="h-96 rounded-3xl bg-white/5 animate-pulse" />

  return (
    <div>
      <PageTitle
        title="Messages"
        subtitle={`Inbox from the contact form — ${messages.filter((m) => !m.read).length} unread.`}
      />

      {messages.length === 0 ? (
        <EmptyState text="No messages yet." />
      ) : (
        <div className="space-y-4">
          {messages.map((msg) => (
            <AdminCard key={msg.id} className={cn("p-6", msg.read && "opacity-70")}>
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h2 className="text-lg font-light tracking-wide">{msg.subject}</h2>
                    {!msg.read && (
                      <span className="px-2.5 py-0.5 rounded-full bg-primary/15 border border-primary/30 text-primary text-[9px] tracking-[0.2em] uppercase">
                        New
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1.5">
                    {msg.name} · {msg.email} · {new Date(msg.createdAt).toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground/90 font-light leading-relaxed mt-4 whitespace-pre-wrap">
                    {msg.message}
                  </p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <a
                    href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject)}`}
                    className="px-4 py-2 rounded-full border border-primary/40 text-primary text-[11px] tracking-[0.15em] uppercase hover:bg-primary/10 transition-all"
                  >
                    Reply
                  </a>
                  <button
                    onClick={() => toggleRead(msg)}
                    className="w-9 h-9 flex items-center justify-center rounded-full glass-card hover:text-primary transition-colors"
                    title={msg.read ? "Mark as unread" : "Mark as read"}
                  >
                    {msg.read ? <Mail className="w-4 h-4" /> : <MailOpen className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => remove(msg.id)}
                    className="w-9 h-9 flex items-center justify-center rounded-full glass-card hover:text-red-400 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </AdminCard>
          ))}
        </div>
      )}
    </div>
  )
}
