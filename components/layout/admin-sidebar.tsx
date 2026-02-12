"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Megaphone,
  PenTool,
  BookOpen,
  Calendar,
  Menu,
  ArrowLeft,
} from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet"

const adminMenuItems = [
  { href: "/admin", label: "대시보드", icon: LayoutDashboard },
  { href: "/admin/notices", label: "공지사항 관리", icon: Megaphone },
  { href: "/admin/reviews", label: "서평 관리", icon: PenTool },
  { href: "/admin/classics", label: "고전100선 관리", icon: BookOpen },
  { href: "/admin/programs", label: "프로그램 관리", icon: Calendar },
]

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname()

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-border px-6 py-5">
        <Link
          href="/admin"
          onClick={onNavigate}
          className="font-serif text-xl font-bold text-primary"
        >
          오거서
        </Link>
        <p className="mt-1 text-xs text-muted-foreground">관리자</p>
      </div>
      <nav className="flex flex-1 flex-col gap-1 p-4">
        {adminMenuItems.map((item) => {
          const Icon = item.icon
          const isActive =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon size={18} />
              {item.label}
            </Link>
          )
        })}
      </nav>
      <div className="border-t border-border p-4">
        <Link
          href="/"
          onClick={onNavigate}
          className="flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <ArrowLeft size={16} />
          사이트로 돌아가기
        </Link>
      </div>
    </div>
  )
}

export function AdminSidebar() {
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-60 border-r border-border bg-card lg:block">
        <SidebarContent />
      </aside>

      {/* Mobile header + drawer */}
      <div className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-card/95 backdrop-blur-xl lg:hidden">
        <div className="flex h-14 items-center px-4">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <button
                className="mr-3 rounded-md p-2 text-muted-foreground hover:text-foreground"
                aria-label="관리자 메뉴 열기"
              >
                <Menu size={22} />
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 p-0">
              <SheetTitle className="sr-only">관리자 메뉴</SheetTitle>
              <SidebarContent onNavigate={() => setOpen(false)} />
            </SheetContent>
          </Sheet>
          <span className="font-serif text-lg font-bold text-primary">
            오거서
          </span>
          <span className="ml-2 text-xs text-muted-foreground">관리자</span>
        </div>
      </div>
    </>
  )
}
