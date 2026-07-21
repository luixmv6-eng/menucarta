import { redirect } from "next/navigation"
import { isAdminSession } from "@/lib/server/auth"
import { AdminShell } from "@/components/admin/admin-shell"

export const dynamic = "force-dynamic"

export default async function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  if (!(await isAdminSession())) {
    redirect("/admin/login")
  }
  return <AdminShell>{children}</AdminShell>
}
