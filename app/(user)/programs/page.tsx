"use client"

import { useState } from "react"
import Link from "next/link"
import { Users, Clock, MapPin, Plus, Wifi, Monitor } from "lucide-react"
import { cn } from "@/lib/utils"
import { useSharedData } from "@/lib/shared-data-context"

const formatIcons: Record<string, typeof MapPin> = {
  offline: MapPin,
  online: Wifi,
  hybrid: Monitor,
}

const formatLabels: Record<string, string> = {
  offline: "오프라인",
  online: "온라인",
  hybrid: "하이브리드",
}

const statusLabels: Record<string, string> = {
  recruiting: "모집 중",
  confirmed: "확정",
  completed: "완료",
}

const statusColors: Record<string, string> = {
  recruiting: "bg-primary text-primary-foreground",
  confirmed: "bg-emerald text-white",
  completed: "bg-muted text-muted-foreground",
}

type FilterType = "all" | "recruiting" | "offline" | "online"

export default function ProgramsPage() {
  const { bundoks, joinedBundoks } = useSharedData()
  const [filter, setFilter] = useState<FilterType>("all")

  const filters: { id: FilterType; label: string }[] = [
    { id: "all", label: "전체" },
    { id: "recruiting", label: "모집 중" },
    { id: "offline", label: "오프라인" },
    { id: "online", label: "온라인" },
  ]

  const filteredBundoks = bundoks.filter((b) => {
    if (filter === "all") return true
    if (filter === "recruiting") return b.status === "recruiting"
    if (filter === "offline") return b.format === "offline"
    if (filter === "online") return b.format === "online" || b.format === "hybrid"
    return true
  })

  return (
    <div className="flex flex-col gap-4 pb-24">
      {/* Header */}
      <header className="px-5 pt-5 sm:px-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-foreground">번독</h1>
            <p className="mt-0.5 text-[11px] text-muted-foreground">
              번개독서모임 · 2-5인 소규모 자율 모임
            </p>
          </div>
          <Link
            href="/programs/create"
            className="flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-md transition-all hover:shadow-lg hover:brightness-110"
          >
            <Plus size={14} />
            번독 개설
          </Link>
        </div>
      </header>

      {/* Filter Tabs */}
      <div role="tablist" aria-label="번독 필터" className="no-scrollbar flex gap-2 overflow-x-auto px-5 sm:px-8">
        {filters.map((f) => (
          <button
            key={f.id}
            role="tab"
            aria-selected={filter === f.id}
            onClick={() => setFilter(f.id)}
            className={cn(
              "flex-shrink-0 rounded-full px-3.5 py-1.5 text-xs font-medium transition-all",
              filter === f.id
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Bundok Card List */}
      <div className="flex flex-col gap-3 px-5 sm:px-8">
        {filteredBundoks.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border py-12">
            <Users size={32} className="text-muted-foreground" />
            <p className="mt-2 text-sm font-medium text-muted-foreground">해당 조건의 번독이 없습니다</p>
            <Link
              href="/programs/create"
              className="mt-3 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground"
            >
              번독 개설하기
            </Link>
          </div>
        )}

        {filteredBundoks.map((bundok) => {
          const FormatIcon = formatIcons[bundok.format] || MapPin
          const isJoined = joinedBundoks.includes(bundok.id)
          const isFull = bundok.currentMembers >= bundok.maxMembers

          return (
            <Link
              key={bundok.id}
              href={`/programs/${bundok.id}`}
              className="group flex items-start gap-3.5 rounded-2xl border border-border bg-card p-4 shadow-sm transition-all hover:shadow-md hover:border-primary/30"
            >
              {/* Book Cover */}
              <div className="relative h-20 w-14 flex-shrink-0 overflow-hidden rounded-xl shadow-sm">
                <img
                  src={bundok.bookCover || "/placeholder.svg"}
                  alt={bundok.book}
                  className="h-full w-full object-cover"
                  crossOrigin="anonymous"
                />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className="text-sm font-bold text-foreground line-clamp-1">{bundok.title}</h3>
                    <p className="mt-0.5 text-[11px] text-muted-foreground line-clamp-1">
                      {bundok.book} · {bundok.bookAuthor}
                    </p>
                  </div>
                  <span className={cn("flex-shrink-0 rounded-full px-2 py-0.5 text-[9px] font-bold", statusColors[bundok.status])}>
                    {statusLabels[bundok.status]}
                  </span>
                </div>

                {/* Meta */}
                <div className="mt-2 flex flex-wrap items-center gap-3 text-[10px] text-muted-foreground">
                  <span className="flex items-center gap-0.5">
                    <Clock size={10} />
                    {bundok.date.slice(5)} {bundok.time} ({bundok.duration}분)
                  </span>
                  <span className="flex items-center gap-0.5">
                    <FormatIcon size={10} />
                    {bundok.location}
                  </span>
                  <span className="flex items-center gap-0.5">
                    <Users size={10} />
                    {bundok.currentMembers}/{bundok.maxMembers}명
                  </span>
                </div>

                {/* Host & Tags */}
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <img
                      src={bundok.hostAvatar || "/placeholder.svg"}
                      alt={bundok.host}
                      className="h-4 w-4 rounded-full object-cover"
                      crossOrigin="anonymous"
                    />
                    <span className="text-[10px] text-muted-foreground">{bundok.host}</span>
                  </div>
                  <div className="flex gap-1">
                    {bundok.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="rounded-full bg-primary/10 px-1.5 py-0.5 text-[8px] font-medium text-primary">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Status badge */}
                {isJoined && (
                  <span className="mt-2 inline-flex rounded-full bg-emerald/10 px-2 py-0.5 text-[9px] font-bold text-emerald">
                    참여 중
                  </span>
                )}
                {isFull && !isJoined && bundok.status === "recruiting" && (
                  <span className="mt-2 inline-flex rounded-full bg-muted px-2 py-0.5 text-[9px] font-bold text-muted-foreground">
                    마감
                  </span>
                )}
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
