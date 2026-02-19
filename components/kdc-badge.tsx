"use client"

import React from "react"
import { cn } from "@/lib/utils"

export interface KDCBadgeData {
  id: string
  label: string
  icon: React.ReactNode
  earned: boolean
  count: number
  gradient: string
  borderGradient: string
}

export function KDCBadge({ badge, onClick }: { badge: KDCBadgeData; onClick?: () => void }) {
  return (
    <div
      className={cn("flex flex-col items-center gap-1.5", onClick && badge.earned ? "cursor-pointer" : "")}
      onClick={badge.earned ? onClick : undefined}
      role={onClick && badge.earned ? "button" : undefined}
      tabIndex={onClick && badge.earned ? 0 : undefined}
      onKeyDown={onClick && badge.earned ? (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onClick(); } } : undefined}
      aria-label={badge.earned ? `${badge.label} (${badge.id}) 뱃지 - ${badge.count}개 획득${onClick ? ", 클릭하여 서평 보기" : ""}` : `${badge.label} (${badge.id}) 뱃지 - 미획득`}
    >
      <div
        className={cn(
          "relative flex h-14 w-14 items-center justify-center rounded-full",
          badge.earned ? "opacity-100" : "opacity-30 grayscale"
        )}
      >
        {/* Outer metallic ring with enhanced gradient */}
        <div
          className="absolute inset-0 rounded-full p-[2.5px]"
          style={{
            background: badge.earned
              ? badge.borderGradient
              : "linear-gradient(135deg, hsl(var(--disabled-border)), hsl(var(--disabled-bg-dark)), hsl(var(--disabled-border)))",
            boxShadow: badge.earned
              ? "0 2px 8px rgba(6, 78, 59, 0.25), inset 0 1px 2px rgba(255,255,255,0.4)"
              : "none",
          }}
        >
          {/* Inner metallic face */}
          <div
            className="flex h-full w-full items-center justify-center rounded-full"
            style={{
              background: badge.earned
                ? badge.gradient
                : "linear-gradient(135deg, hsl(var(--disabled-bg)), hsl(var(--disabled-bg-dark)))",
            }}
          >
            <div className={cn("text-lg", badge.earned ? "text-white" : "text-gray-400")}>
              {badge.icon}
            </div>
          </div>
        </div>

        {/* Multi-layer metallic shine overlay */}
        {badge.earned && (
          <>
            <div
              className="pointer-events-none absolute inset-[3px] rounded-full opacity-25"
              style={{
                background:
                  "linear-gradient(135deg, rgba(255,255,255,0.9) 0%, transparent 40%, rgba(255,255,255,0.15) 100%)",
              }}
            />
            <div
              className="pointer-events-none absolute inset-[3px] rounded-full opacity-15"
              style={{
                background:
                  "radial-gradient(ellipse at 30% 20%, rgba(255,255,255,0.8) 0%, transparent 50%)",
              }}
            />
          </>
        )}

        {/* Count indicator */}
        {badge.earned && badge.count > 0 && (
          <div
            className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full text-[8px] font-bold text-white shadow-sm"
            style={{
              background: "linear-gradient(135deg, hsl(var(--brand-mid)), hsl(var(--brand-light)))",
            }}
          >
            {badge.count}
          </div>
        )}
      </div>

      <div className="text-center">
        <p className="text-[8px] font-bold text-muted-foreground">
          {badge.id}
        </p>
        <p
          className={cn(
            "text-[9px] font-medium",
            badge.earned ? "text-foreground" : "text-muted-foreground"
          )}
        >
          {badge.label}
        </p>
      </div>
    </div>
  )
}
