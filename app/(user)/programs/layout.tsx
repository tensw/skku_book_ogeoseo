"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const programTabs = [
  { href: "/programs/dokmo", label: "독모" },
  { href: "/programs/dokto", label: "독토" },
]

export default function ProgramsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="flex flex-col">
      {/* LNB - Local Navigation Bar */}
      <div className="border-b border-border bg-card px-5 sm:px-8">
        <div className="flex gap-1">
          {programTabs.map((tab) => {
            const isActive = pathname === tab.href || pathname.startsWith(tab.href + "/")
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={cn(
                  "relative px-4 py-3 text-sm font-medium transition-colors",
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
