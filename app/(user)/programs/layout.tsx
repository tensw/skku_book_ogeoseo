"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { usePrograms } from "@/lib/program-context"

export default function ProgramsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { customPrograms } = usePrograms()

  // 기본 탭 + 활성화된 커스텀 프로그램
  const programTabs = [
    { href: "/programs", label: "전체", exact: true },
    { href: "/programs/create", label: "번독 개설" },
    ...customPrograms
      .filter((p) => p.isActive)
      .map((p) => ({
        href: `/programs/${p.id}`,
        label: p.name.length > 8 ? p.name.slice(0, 8) + "..." : p.name,
      })),
  ]

  return (
    <div className="flex flex-col">
      {/* LNB - Local Navigation Bar */}
      <div className="border-b border-border bg-card px-5 sm:px-8">
        <div className="flex gap-1 overflow-x-auto no-scrollbar">
          {programTabs.map((tab) => {
            const isActive = tab.exact
              ? pathname === tab.href
              : pathname === tab.href || pathname.startsWith(tab.href + "/")
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={cn(
                  "relative flex-shrink-0 px-4 py-3 text-sm font-medium transition-colors whitespace-nowrap",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {tab.label}
                {isActive && (
                  <span className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full bg-primary" />
                )}
              </Link>
            )
          })}
        </div>
      </div>

      {/* Page Content */}
      {children}
    </div>
  )
}
