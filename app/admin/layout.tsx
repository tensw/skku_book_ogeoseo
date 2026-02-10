import { AdminSidebar } from "@/components/layout/admin-sidebar"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar />
      <main className="lg:pl-60">
        <div className="mx-auto max-w-5xl p-6">
          {children}
        </div>
      </main>
    </div>
  )
}
