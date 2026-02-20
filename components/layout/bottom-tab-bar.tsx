"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { CalendarDays, BookOpenText, PenLine, MessageCircle, Bell } from "lucide-react"
import { cn } from "@/lib/utils"

const tabs = [
  { href: "/programs", label: "프로그램", icon: CalendarDays },
  { href: "/guide", label: "추천도서", icon: BookOpenText },
  { href: "/reviews", label: "서평", icon: PenLine },
  { href: "/talk", label: "톡톡", icon: MessageCircle },
  { href: "/notices", label: "공지", icon: Bell },
]

export function BottomTabBar() {
  const pathname = usePathname()

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl lg:hidden"
      aria-label="하단 탭 메뉴"
    >
      <div className="flex items-center justify-around px-2 pt-1.5 pb-1">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = pathname === tab.href || pathname.startsWith(tab.href + "/")
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                "flex flex-col items-center gap-0.5 px-3 py-1.5 text-[10px] font-medium transition-colors",
                isActive
                  ? "text-brand"
                  : "text-muted-foreground"
              )}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon size={20} className={cn(isActive && "text-brand")} />
              <span>{tab.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
