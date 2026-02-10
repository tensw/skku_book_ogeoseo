"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet"

const menuItems = [
  { href: "/notices", label: "공지사항" },
  { href: "/reviews", label: "독서리뷰" },
  { href: "/discussions", label: "독토" },
  { href: "/guide", label: "독서가이드" },
  { href: "/talk", label: "톡톡" },
  { href: "/library", label: "내 서재" },
  { href: "/admin", label: "관리자" },
]

export function MobileMenu() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  return (
    <div className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-card/95 backdrop-blur-xl lg:hidden">
      <div className="flex h-16 items-center px-4">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <button
              className="mr-3 rounded-md p-2 text-muted-foreground hover:text-foreground"
              aria-label="메뉴 열기"
            >
              <Menu size={22} />
            </button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-0">
            <SheetTitle className="sr-only">메뉴</SheetTitle>
            <div className="border-b border-border px-6 py-5">
              <Link
                href="/"
                onClick={() => setOpen(false)}
                className="font-serif text-xl font-bold text-primary"
              >
                오거서
              </Link>
              <p className="mt-1 text-xs text-muted-foreground">독서 토론 플랫폼</p>
            </div>
            <nav className="flex flex-col gap-1 p-4">
              {menuItems.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "rounded-lg px-4 py-2.5 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    {item.label}
                  </Link>
                )
              })}
            </nav>
          </SheetContent>
        </Sheet>
        <Link href="/" className="font-serif text-lg font-bold text-primary">
          오거서
        </Link>
      </div>
    </div>
  )
}
