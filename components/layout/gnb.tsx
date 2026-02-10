"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const menuItems = [
  { href: "/notices", label: "공지사항" },
  { href: "/reviews", label: "독서리뷰" },
  { href: "/discussions", label: "독토" },
  { href: "/guide", label: "독서가이드" },
  { href: "/talk", label: "톡톡" },
  { href: "/library", label: "내 서재" },
]

export function GNB() {
  const pathname = usePathname()

  return (
    <header className="fixed top-0 left-0 right-0 z-50 hidden border-b border-border bg-card/95 backdrop-blur-xl lg:block">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-8">
        <Link href="/" className="font-serif text-xl font-bold text-primary">
          오거서
        </Link>
        <nav className="flex items-center gap-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative px-3 py-2 text-sm font-medium transition-colors",
                  isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {item.label}
                {isActive && (
                  <span className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full bg-primary" />
                )}
              </Link>
            )
          })}
        </nav>
      </div>
    </header>
  )
}
