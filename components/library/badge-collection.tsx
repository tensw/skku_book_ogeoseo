"use client"

import { Award } from "lucide-react"
import { KDCBadge } from "@/components/kdc-badge"
import type { KDCBadgeData } from "@/components/kdc-badge"

interface BadgeCollectionProps {
  badges: KDCBadgeData[]
  totalBadges: number
  onBadgeClick: (id: string) => void
}

export function BadgeCollection({ badges, totalBadges, onBadgeClick }: BadgeCollectionProps) {
  return (
    <section className="mx-5 overflow-hidden rounded-3xl border border-border bg-card shadow-lg sm:mx-8">
      <div
        className="h-1.5 w-full"
        style={{
          background: "linear-gradient(90deg, hsl(var(--brand-mid)), hsl(var(--brand-light)), hsl(var(--brand-accent)), hsl(var(--brand-light)), hsl(var(--brand-mid)))",
        }}
      />
      <div className="p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-sm font-bold text-foreground">
            <Award size={16} className="text-emerald" />
            지식 뱃지 진열장
          </h2>
          <span className="text-[10px] text-muted-foreground">
            {totalBadges}/10개 획득
          </span>
        </div>
        <div className="grid grid-cols-5 gap-x-2 gap-y-4">
          {badges.map((badge) => (
            <KDCBadge
              key={badge.id}
              badge={badge}
              onClick={badge.earned ? () => onBadgeClick(badge.id) : undefined}
            />
          ))}
        </div>
      </div>
      <div
        className="h-0.5 w-full"
        style={{
          background: "linear-gradient(90deg, transparent, hsl(var(--brand-accent)), hsl(var(--mint)), hsl(var(--brand-accent)), transparent)",
        }}
      />
    </section>
  )
}
