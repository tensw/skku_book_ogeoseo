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
    <nav className="fixed bottom-0 inset-x-0 z-50 bg-white border-t border-[#E8E8E8]">
      <div className="flex justify-around h-[56px] max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = activeTab === item.id
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className="flex flex-col items-center justify-center gap-0.5 flex-1"
              aria-label={item.label}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon className={cn(
                "w-[22px] h-[22px]",
                isActive ? "text-[#1E1E1E]" : "text-[#A0A0A0]"
              )} strokeWidth={isActive ? 2.5 : 1.5} />
              <span className={cn(
                "text-[10px]",
                isActive ? "text-[#1E1E1E] font-medium" : "text-[#A0A0A0]"
              )}>{item.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
