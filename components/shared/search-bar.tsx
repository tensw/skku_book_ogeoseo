"use client"

import { Search } from "lucide-react"
import { cn } from "@/lib/utils"

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export function SearchBar({ value, onChange, placeholder = "검색...", className }: SearchBarProps) {
  return (
    <div role="search" className={cn("flex items-center gap-2 rounded-2xl border border-border bg-card px-3 py-2.5 shadow-sm", className)}>
      <Search size={16} className="text-muted-foreground" aria-hidden="true" />
      <input
        type="search"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label={placeholder}
        className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
      />
    </div>
  )
}
