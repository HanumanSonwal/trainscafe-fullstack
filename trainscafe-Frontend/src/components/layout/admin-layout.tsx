import { AdminSidebar } from "./admin-sidebar"
import { AdminHeader } from "./admin-header"

export function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <div className="flex min-h-screen">

      <AdminSidebar />

      <div className="flex flex-col flex-1">

        <AdminHeader />

        <main className="p-6 bg-muted/30 flex-1">
          {children}
        </main>

      </div>

    </div>
  )
}