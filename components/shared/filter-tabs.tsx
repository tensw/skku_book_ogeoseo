"use client"

import { cn } from "@/lib/utils"

interface Tab {
  id: string
  label: string
  color?: string
}

interface FilterTabsProps {
  tabs: Tab[]
  activeTab: string
  onTabChange: (id: string) => void
  className?: string
}

export function FilterTabs({ tabs, activeTab, onTabChange, className }: FilterTabsProps) {
  return (
    <div className={cn("no-scrollbar flex gap-2 overflow-x-auto", className)}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={cn(
            "flex-shrink-0 rounded-full px-4 py-2 text-xs font-semibold transition-all",
            activeTab === tab.id
              ? (tab.color || "bg-primary text-primary-foreground") + " shadow-md"
              : "bg-muted text-muted-foreground hover:bg-border"
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}
