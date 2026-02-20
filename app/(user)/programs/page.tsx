"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Users,
  Clock,
  MapPin,
  Wifi,
  Monitor,
  Zap,
  BookOpen,
  PenTool,
  ChevronRight,
  Library,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useSharedData } from "@/lib/shared-data-context"
import { usePrograms } from "@/lib/program-context"

const formatIcons: Record<string, typeof MapPin> = {
  offline: MapPin,
  online: Wifi,
  hybrid: Monitor,
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

type MainTab = "all" | "bundok"
type BundokFilter = "all" | "recruiting" | "offline" | "online"

// 기본 프로그램 카드 데이터
const defaultPrograms = [
  {
    id: "bundok",
    name: "번독",
    description: "2-5인 소규모 번개독서모임",
    icon: Zap,
    gradient: "from-amber-400 to-orange-500",
    bgLight: "bg-amber-50",
    textColor: "text-amber-600",
    tab: "bundok" as MainTab,
  },
  {
    id: "classic100",
    name: "고전 100선",
    description: "성균관대학교 권장도서 목록",
    icon: Library,
    gradient: "from-emerald-400 to-teal-500",
    bgLight: "bg-emerald-50",
    textColor: "text-emerald-600",
    href: "/guide",
  },
  {
    id: "free",
    name: "자유 서평",
    description: "자유롭게 서평을 작성해보세요",
    icon: PenTool,
    gradient: "from-primary to-blue-500",
    bgLight: "bg-blue-50",
    textColor: "text-blue-600",
    href: "/reviews/write",
  },
]

export default function ProgramsPage() {
  const { bundoks, joinedBundoks } = useSharedData()
  const { customPrograms } = usePrograms()
  const [mainTab, setMainTab] = useState<MainTab>("all")
  const [bundokFilter, setBundokFilter] = useState<BundokFilter>("all")

  const bundokFilters: { id: BundokFilter; label: string }[] = [
    { id: "all", label: "전체" },
    { id: "recruiting", label: "모집 중" },
    { id: "offline", label: "오프라인" },
    { id: "online", label: "온라인" },
  ]

  const filteredBundoks = bundoks.filter((b) => {
    if (bundokFilter === "all") return true
    if (bundokFilter === "recruiting") return b.status === "recruiting"
    if (bundokFilter === "offline") return b.format === "offline"
    if (bundokFilter === "online") return b.format === "online" || b.format === "hybrid"
    return true
  })

  const recruitingCount = bundoks.filter((b) => b.status === "recruiting").length

  return (
    <div className="flex flex-col gap-4 pb-24">
      {/* Header */}
      <header className="px-5 pt-5 sm:px-8">
        <div className="flex items-center gap-2">
          <BookOpen size={20} className="text-primary" />
          <div>
            <h1 className="text-xl font-bold text-foreground">프로그램</h1>
            <p className="text-[11px] text-muted-foreground">
              오거서 독서 프로그램
            </p>
          </div>
        </div>
      </header>

      {/* Main Tabs: 전체 / 번독 */}
      <div className="flex gap-0 border-b border-border px-5 sm:px-8">
        {([
          { id: "all" as MainTab, label: "전체" },
          { id: "bundok" as MainTab, label: "번독", count: recruitingCount },
        ]).map((tab) => (
          <button
            key={tab.id}
            onClick={() => setMainTab(tab.id)}
            className={cn(
              "flex items-center gap-1.5 px-4 py-3 text-sm font-semibold transition-all",
              mainTab === tab.id
                ? "border-b-2 border-primary text-primary"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {tab.id === "bundok" && <Zap size={13} className={mainTab === "bundok" ? "text-amber-500" : ""} />}
            {tab.label}
            {tab.count !== undefined && tab.count > 0 && (
              <span className="rounded-full bg-amber-500 px-1.5 py-0.5 text-[9px] font-bold text-white leading-none">
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* 전체 탭 */}
      {mainTab === "all" && (
        <div className="flex flex-col gap-4 px-5 sm:px-8">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {defaultPrograms.map((program) => {
              const Icon = program.icon
              const content = (
                <div
                  className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all hover:shadow-md hover:scale-[1.02]"
                >
                  {/* Gradient top bar */}
                  <div className={cn("h-1.5 w-full bg-gradient-to-r", program.gradient)} />

                  <div className="flex items-center gap-4 p-4">
                    <div className={cn(
                      "flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br shadow-sm",
                      program.gradient
                    )}>
                      <Icon size={20} className="text-white" fill={program.id === "bundok" ? "white" : "none"} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-bold text-foreground">{program.name}</h3>
                      <p className="mt-0.5 text-[11px] text-muted-foreground">{program.description}</p>
                    </div>
                    <ChevronRight size={16} className="flex-shrink-0 text-muted-foreground group-hover:text-foreground transition-colors" />
                  </div>

                  {/* 번독 카드에 모집 중 카운트 표시 */}
                  {program.id === "bundok" && recruitingCount > 0 && (
                    <div className="border-t border-border/50 px-4 py-2">
                      <span className="flex items-center gap-1 text-[10px] font-semibold text-amber-600">
                        <Zap size={10} fill="currentColor" />
                        모집 중인 번독 {recruitingCount}개
                      </span>
                    </div>
                  )}
                </div>
              )

              if (program.tab) {
                return (
                  <button key={program.id} onClick={() => setMainTab(program.tab!)} className="text-left">
                    {content}
                  </button>
                )
              }

              return (
                <Link key={program.id} href={program.href!}>
                  {content}
                </Link>
              )
            })}

            {/* 관리자가 추가한 커스텀 프로그램 */}
            {customPrograms.filter((p) => p.isActive).map((program) => (
              <div
                key={program.id}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all hover:shadow-md"
              >
                <div className={cn("h-1.5 w-full", program.gradient || "bg-gradient-to-r from-violet-400 to-purple-500")} />
                <div className="flex items-center gap-4 p-4">
                  <div className={cn(
                    "flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl shadow-sm",
                    program.gradient || "bg-gradient-to-br from-violet-400 to-purple-500"
                  )}>
                    <BookOpen size={20} className="text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold text-foreground">{program.name}</h3>
                    <p className="mt-0.5 text-[11px] text-muted-foreground line-clamp-1">{program.description}</p>
                  </div>
                  <ChevronRight size={16} className="flex-shrink-0 text-muted-foreground" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 번독 탭 */}
      {mainTab === "bundok" && (
        <>
          {/* 번독 헤더 + 개설 버튼 */}
          <div className="flex items-center justify-between px-5 sm:px-8">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-amber-400 to-orange-500">
                <Zap size={14} className="text-white" fill="white" />
              </div>
              <span className="text-sm font-bold text-foreground">
                <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">번</span>독 목록
              </span>
            </div>
            <Link
              href="/programs/create"
              className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-amber-200/40 transition-all hover:shadow-lg hover:brightness-110"
            >
              <Zap size={13} fill="currentColor" />
              번독 개설
            </Link>
          </div>

          {/* Bundok Filter Tabs */}
          <div role="tablist" aria-label="번독 필터" className="no-scrollbar flex gap-2 overflow-x-auto px-5 sm:px-8">
            {bundokFilters.map((f) => (
              <button
                key={f.id}
                role="tab"
                aria-selected={bundokFilter === f.id}
                onClick={() => setBundokFilter(f.id)}
                className={cn(
                  "flex-shrink-0 rounded-full px-3.5 py-1.5 text-xs font-medium transition-all",
                  bundokFilter === f.id
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
        </>
      )}
    </div>
  )
}
