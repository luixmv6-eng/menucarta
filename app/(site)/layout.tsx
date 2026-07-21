import { getDb } from "@/lib/server/db"
import { SiteShell } from "@/components/site/site-shell"

export const dynamic = "force-dynamic"

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  const db = getDb()
  return <SiteShell settings={db.settings}>{children}</SiteShell>
}
