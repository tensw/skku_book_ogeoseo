"use client"

import { useState } from "react"
import Link from "next/link"
import { Users, Clock, MapPin, Plus, Wifi, Monitor, Zap } from "lucide-react"
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
  recruiting: "bg-amber-500 text-white",
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
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-md shadow-amber-200/50">
              <Zap size={18} className="text-white" fill="white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">
                <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">번</span>독
              </h1>
              <p className="text-[11px] text-muted-foreground">
                번개독서모임 · 2-5인 소규모 자율 모임
              </p>
            </div>
          </div>
          <Link
            href="/programs/create"
            className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-amber-200/40 transition-all hover:shadow-lg hover:brightness-110"
          >
            <Zap size={13} fill="currentColor" />
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
                ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-sm shadow-amber-200/40"
                : "bg-muted text-muted-foreground hover:bg-amber-50 hover:text-amber-700"
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Bundok Card Grid */}
      <div className="grid grid-cols-1 gap-3 px-5 sm:grid-cols-2 sm:px-8 lg:grid-cols-3">
        {filteredBundoks.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-amber-200 bg-amber-50/30 py-12">
            <Zap size={32} className="text-amber-400" />
            <p className="mt-2 text-sm font-medium text-muted-foreground">해당 조건의 번독이 없습니다</p>
            <Link
              href="/programs/create"
              className="mt-3 flex items-center gap-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-2 text-xs font-semibold text-white"
            >
              <Zap size={12} fill="currentColor" />
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
              className={cn(
                "group relative flex flex-col rounded-2xl border bg-card shadow-sm transition-all hover:shadow-md",
                bundok.status === "recruiting"
                  ? "border-amber-200/80 hover:border-amber-400 hover:shadow-amber-100/50"
                  : "border-border hover:border-border"
              )}
            >
              {/* 번개 accent top bar */}
              {bundok.status === "recruiting" && (
                <div className="absolute left-4 right-4 top-0 h-[3px] rounded-b-full bg-gradient-to-r from-amber-400 to-orange-500" />
              )}

              {/* Card body */}
              <div className="flex items-start gap-3.5 p-4">
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
                    <span className={cn(
                      "flex-shrink-0 flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[9px] font-bold",
                      statusColors[bundok.status]
                    )}>
                      {bundok.status === "recruiting" && <Zap size={8} fill="currentColor" />}
                      {statusLabels[bundok.status]}
                    </span>
                  </div>

                  {/* 날짜/시간 하이라이트 */}
                  <div className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-amber-50 px-2 py-1">
                    <Clock size={11} className="text-amber-600" />
                    <span className="text-[11px] font-semibold text-amber-700">
                      {bundok.date.slice(5)} {bundok.time}
                    </span>
                    <span className="text-[9px] text-amber-500">({bundok.duration}분)</span>
                  </div>
                  {/* Meta */}
                  <div className="mt-1.5 flex flex-wrap items-center gap-3 text-[10px] text-muted-foreground">
                    <span className="flex items-center gap-0.5">
                      <FormatIcon size={10} />
                      {bundok.location}
                    </span>
                    <span className="flex items-center gap-0.5">
                      <Users size={10} />
                      {bundok.currentMembers}/{bundok.maxMembers}명
                    </span>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between border-t border-border/50 px-4 py-2.5">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <img
                      src={bundok.hostAvatar || "/placeholder.svg"}
                      alt={bundok.hostNickname}
                      className="h-4 w-4 rounded-full object-cover"
                      crossOrigin="anonymous"
                    />
                    <span className="text-[10px] font-medium text-foreground">{bundok.hostNickname}</span>
                    <span className="text-[9px] text-muted-foreground">{bundok.host}</span>
                  </div>
                  <div className="flex gap-1">
                    {bundok.tags.slice(0, 2).map((tag) => (
                      <span key={tag} className="rounded-full bg-amber-50 px-1.5 py-0.5 text-[8px] font-medium text-amber-700">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {isJoined && (
                  <span className="inline-flex rounded-full bg-emerald/10 px-2 py-0.5 text-[9px] font-bold text-emerald">
                    참여 중
                  </span>
                )}
                {isFull && !isJoined && bundok.status === "recruiting" && (
                  <span className="inline-flex rounded-full bg-muted px-2 py-0.5 text-[9px] font-bold text-muted-foreground">
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
