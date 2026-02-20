"use client"

import { Award } from "lucide-react"
import { cn } from "@/lib/utils"

interface StampBoardProps {
  totalReviews: number
}

export function StampBoard({ totalReviews }: StampBoardProps) {
  return (
    <section className="mx-5 overflow-hidden rounded-3xl border border-amber-200 bg-gradient-to-br from-amber-50 to-yellow-50 shadow-lg sm:mx-8">
      {/* Premium Gold Header */}
      <div
        className="h-1 w-full"
        style={{
          background: "linear-gradient(90deg, hsl(var(--gold-copper)), hsl(var(--gold)), hsl(var(--gold-dark)), hsl(var(--gold)), hsl(var(--gold-copper)))",
        }}
      />
      <div className="flex items-center justify-between px-5 pt-4">
        <h2 className="flex items-center gap-2 text-sm font-bold text-amber-800">
          <Award size={16} className="text-amber-600" />
          서평 스탬프
        </h2>
        <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-700">
          {totalReviews}/20개 수집
        </span>
      </div>

      {/* Stamp Grid */}
      <div className="grid grid-cols-5 gap-3 p-4" role="img" aria-label={`서평 스탬프 ${totalReviews}/20개 수집`}>
        {Array.from({ length: 20 }).map((_, index) => {
          const isFilled = index < totalReviews
          const isReward10 = index === 9
          const isReward20 = index === 19
          return (
            <div key={index} className="relative flex items-center justify-center" aria-hidden="true">
              {isFilled ? (
                <div className="relative">
                  <svg
                    viewBox="0 0 40 48"
                    className="h-12 w-10 drop-shadow-md"
                    style={{ filter: "drop-shadow(0 2px 4px rgba(212, 165, 116, 0.4))" }}
                  >
                    <defs>
                      <linearGradient id={`goldGradient-${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="hsl(var(--gold))" />
                        <stop offset="30%" stopColor="hsl(var(--gold-dark))" />
                        <stop offset="50%" stopColor="hsl(var(--gold))" />
                        <stop offset="70%" stopColor="hsl(var(--gold-copper))" />
                        <stop offset="100%" stopColor="hsl(var(--gold-dark))" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M20 2 C20 2 8 10 6 22 C4 32 10 40 20 46 C30 40 36 32 34 22 C32 10 20 2 20 2 Z"
                      fill={`url(#goldGradient-${index})`}
                      stroke="hsl(var(--gold-dark))"
                      strokeWidth="1"
                    />
                    <path d="M20 8 L20 42" stroke="hsl(var(--gold-dark))" strokeWidth="0.5" opacity="0.5" />
                    <path d="M20 15 C15 20 12 28 14 36" stroke="hsl(var(--gold-dark))" strokeWidth="0.3" fill="none" opacity="0.4" />
                    <path d="M20 15 C25 20 28 28 26 36" stroke="hsl(var(--gold-dark))" strokeWidth="0.3" fill="none" opacity="0.4" />
                    <ellipse cx="15" cy="18" rx="4" ry="6" fill="rgba(255,255,255,0.2)" />
                  </svg>
                </div>
              ) : (
                <div className="flex h-12 w-10 items-center justify-center rounded-lg border-2 border-dashed border-amber-200 bg-amber-50/50">
                  <span className="text-[10px] font-medium text-amber-300">{index + 1}</span>
                </div>
              )}
              {isReward10 && (
                <div className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-orange-400 to-orange-600 text-[8px] font-bold text-white shadow-sm">
                  🎁
                </div>
              )}
              {isReward20 && (
                <div className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-purple-400 to-purple-600 text-[8px] font-bold text-white shadow-sm">
                  🏆
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Reward Info */}
      <div className="border-t border-amber-200 bg-gradient-to-r from-amber-100/50 to-yellow-100/50 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={cn(
              "flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-bold shadow-sm",
              totalReviews >= 10
                ? "bg-gradient-to-br from-orange-400 to-orange-600 text-white"
                : "bg-amber-100 text-amber-400"
            )}>
              10
            </div>
            <span className={cn("text-xs", totalReviews >= 10 ? "font-semibold text-orange-600" : "text-amber-600")}>
              {totalReviews >= 10 ? "🎉 스타벅스 기프티콘 획득!" : "스타벅스 기프티콘"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className={cn(
              "flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-bold shadow-sm",
              totalReviews >= 20
                ? "bg-gradient-to-br from-purple-400 to-purple-600 text-white"
                : "bg-amber-100 text-amber-400"
            )}>
              20
            </div>
            <span className={cn("text-xs", totalReviews >= 20 ? "font-semibold text-purple-600" : "text-amber-600")}>
              {totalReviews >= 20 ? "🏆 도서 상품권 획득!" : "도서 상품권"}
            </span>
          </div>
        </div>
      </div>

      <div
        className="h-0.5 w-full"
        style={{
          background: "linear-gradient(90deg, transparent, hsl(var(--gold)), hsl(var(--gold-dark)), hsl(var(--gold)), transparent)",
        }}
      />
    </section>
  )
}
