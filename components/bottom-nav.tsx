"use client"

import { Home, BookOpenCheck, BookOpen, PenTool, MessageCircle } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { id: "home", label: "홈", icon: Home, activeColor: "text-primary" },
  { id: "discussions", label: "독토", icon: BookOpenCheck, activeColor: "text-emerald" },
  { id: "library", label: "내 서재", icon: BookOpen, activeColor: "text-tangerine" },
  { id: "review", label: "서평", icon: PenTool, activeColor: "text-mint" },
  { id: "talk", label: "톡톡", icon: MessageCircle, activeColor: "text-primary" },
]

export function BottomNav({
  activeTab,
  onTabChange,
}: {
  activeTab: string
  onTabChange: (tab: string) => void
}) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card/95 backdrop-blur-xl">
      <div className="mx-auto flex items-center justify-around py-2 sm:py-3 lg:max-w-3xl">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = activeTab === item.id
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={cn(
                "relative flex flex-col items-center gap-0.5 px-3 py-1.5 transition-all",
                isActive
                  ? item.activeColor
                  : "text-muted-foreground hover:text-foreground"
              )}
              aria-label={item.label}
              aria-current={isActive ? "page" : undefined}
            >
              {isActive && (
                <span className="absolute -top-2 h-0.5 w-6 rounded-full bg-current" />
              )}
              <Icon size={20} strokeWidth={isActive ? 2.5 : 1.5} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
