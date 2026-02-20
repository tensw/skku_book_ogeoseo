"use client"

import React, { useState, useEffect } from "react"
import {
  BookOpen,
  FileText,
  ChevronRight,
  Sparkles,
  Key,
  Brain,
  Church,
  Scale,
  Leaf,
  Cpu,
  Palette,
  Languages,
  BookMarked,
  Landmark,
  Star,
  Award,
  Users,
  Clock,
  MapPin,
  Wifi,
  Monitor,
  User,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { KDCBadgeData } from "@/components/kdc-badge"
import { KDCRadarChart } from "@/components/radar-chart"
import { useSharedData } from "@/lib/shared-data-context"
import { StampBoard } from "@/components/library/stamp-board"
import { BadgeCollection } from "@/components/library/badge-collection"
import { BadgeReviewModal } from "@/components/library/badge-review-modal"
import { AllReviewsModal } from "@/components/library/all-reviews-modal"
import { myReviews, programColors, programLabels, KDC_BADGE_GRADIENTS } from "@/components/library/library-types"

const radarData = [
  { label: "총류", value: 30, shortLabel: "000" },
  { label: "철학", value: 75, shortLabel: "100" },
  { label: "종교", value: 20, shortLabel: "200" },
  { label: "사회과학", value: 60, shortLabel: "300" },
  { label: "자연과학", value: 45, shortLabel: "400" },
  { label: "기술과학", value: 55, shortLabel: "500" },
  { label: "예술", value: 40, shortLabel: "600" },
  { label: "언어", value: 35, shortLabel: "700" },
  { label: "문학", value: 85, shortLabel: "800" },
  { label: "역사", value: 70, shortLabel: "900" },
]

const kdcBadgeIcons: Record<string, React.ReactNode> = {
  "000": <Key size={18} />,
  "100": <Brain size={18} />,
  "200": <Church size={18} />,
  "300": <Scale size={18} />,
  "400": <Leaf size={18} />,
  "500": <Cpu size={18} />,
  "600": <Palette size={18} />,
  "700": <Languages size={18} />,
  "800": <BookMarked size={18} />,
  "900": <Landmark size={18} />,
}

const kdcBadgeMeta: Record<string, { earned: boolean; count: number }> = {
  "000": { earned: true, count: 1 },
  "100": { earned: true, count: 2 },
  "200": { earned: false, count: 0 },
  "300": { earned: true, count: 2 },
  "400": { earned: true, count: 1 },
  "500": { earned: true, count: 1 },
  "600": { earned: true, count: 1 },
  "700": { earned: false, count: 0 },
  "800": { earned: true, count: 2 },
  "900": { earned: true, count: 1 },
}

const kdcBadges: KDCBadgeData[] = KDC_BADGE_GRADIENTS.map((g) => ({
  ...g,
  icon: kdcBadgeIcons[g.id],
  earned: kdcBadgeMeta[g.id].earned,
  count: kdcBadgeMeta[g.id].count,
}))

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
  recruiting: "bg-primary/10 text-primary",
  confirmed: "bg-emerald/10 text-emerald",
  completed: "bg-muted text-muted-foreground",
}

type TabType = "history" | "reviews" | "certificate"

export function LibraryPage() {
  const { bundoks, joinedBundoks } = useSharedData()

  const totalBadges = kdcBadges.filter((b) => b.earned).length
  const totalReviews = kdcBadges.reduce((sum, b) => sum + b.count, 0)

  const [activeTab, setActiveTab] = useState<TabType>("history")
  const [selectedBadgeId, setSelectedBadgeId] = useState<string | null>(null)
  const [likedReviews, setLikedReviews] = useState<number[]>([])
  const [showAllReviews, setShowAllReviews] = useState(false)
  const [nickname, setNickname] = useState("")

  useEffect(() => {
    const saved = localStorage.getItem("ogeoseo_nickname")
    if (saved) setNickname(saved)
  }, [])

  const selectedBadge = kdcBadges.find((b) => b.id === selectedBadgeId) ?? null
  const badgeReviews = myReviews.filter((r) => r.badgeId === selectedBadgeId)

  // 참여한 번독 목록
  const myBundoks = bundoks.filter((b) => joinedBundoks.includes(b.id))

  const toggleLike = (id: number) => {
    setLikedReviews((prev) => prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id])
  }

  const tabs: { id: TabType; label: string }[] = [
    { id: "history", label: "모임 이력" },
    { id: "reviews", label: "내 서평" },
    { id: "certificate", label: "독서인증서" },
  ]

  return (
    <div className="flex flex-col gap-0 pb-24">
      {/* Profile Card */}
      <section className="px-5 pt-5 sm:px-8">
        <div className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4 shadow-sm">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
            <User size={24} className="text-primary" />
          </div>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-foreground">{nickname || "독서인"}</h1>
            <p className="text-xs text-muted-foreground">
              뱃지 {totalBadges}개 · 서평 {totalReviews}편
            </p>
          </div>
          <button
            onClick={() => {
              setActiveTab("certificate")
              alert("독서인증서 발급이 준비 중입니다.")
            }}
            className="flex flex-col items-center gap-1 rounded-xl bg-gradient-to-br from-primary to-emerald px-3 py-2.5 shadow-md transition-all hover:shadow-lg hover:scale-105 active:scale-95"
          >
            <Award size={18} className="text-white" />
            <span className="text-[9px] font-bold text-white whitespace-nowrap">인증서 발급</span>
          </button>
        </div>
      </section>

      {/* Radar Chart */}
      <section className="mt-4 mx-5 overflow-hidden rounded-3xl border border-border bg-card shadow-lg sm:mx-8">
        <div className="flex items-center justify-between px-5 pt-4">
          <h2 className="flex items-center gap-2 text-sm font-bold text-foreground">
            <Sparkles size={16} className="text-emerald" />
            지식 레이더
          </h2>
          <span className="text-[10px] text-muted-foreground">KDC 10개 분류</span>
        </div>
        <div className="mx-auto flex h-56 w-56 items-center justify-center p-2">
          <KDCRadarChart data={radarData} />
        </div>
        <div className="border-t border-border bg-gradient-to-r from-primary/5 to-emerald/5 px-5 py-3">
          <p className="text-center text-sm text-foreground">
            <span className="font-medium">당신은 </span>
            <span className="font-bold text-primary">&apos;800 문학&apos;</span>
            <span className="font-medium"> 도서를 선호합니다.</span>
          </p>
        </div>
      </section>

      {/* Tab Navigation */}
      <div className="mt-5 flex gap-0 border-b border-border px-5 sm:px-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex-1 py-3 text-center text-xs font-semibold transition-all",
              activeTab === tab.id
                ? "border-b-2 border-primary text-primary"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="mt-4">
        {/* 모임 이력 탭 */}
        {activeTab === "history" && (
          <div className="px-5 sm:px-8">
            {myBundoks.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border py-12">
                <Users size={32} className="text-muted-foreground" />
                <p className="mt-2 text-sm font-medium text-muted-foreground">참여한 번독이 없습니다</p>
                <p className="mt-1 text-[10px] text-muted-foreground">번독에 참여하면 여기에 표시됩니다</p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {myBundoks.map((bundok) => {
                  const FormatIcon = formatIcons[bundok.format] || MapPin
                  return (
                    <div
                      key={bundok.id}
                      className="flex items-start gap-3.5 rounded-2xl border border-border bg-card p-4 shadow-sm"
                    >
                      <div className="relative h-16 w-11 flex-shrink-0 overflow-hidden rounded-xl shadow-sm">
                        <img
                          src={bundok.bookCover || "/placeholder.svg"}
                          alt={bundok.book}
                          className="h-full w-full object-cover"
                          crossOrigin="anonymous"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="text-sm font-bold text-foreground line-clamp-1">{bundok.title}</h3>
                          <span className={cn("flex-shrink-0 rounded-full px-2 py-0.5 text-[9px] font-bold", statusColors[bundok.status])}>
                            {statusLabels[bundok.status]}
                          </span>
                        </div>
                        <p className="mt-0.5 text-[11px] text-muted-foreground">{bundok.book} · {bundok.bookAuthor}</p>
                        <div className="mt-1.5 flex flex-wrap items-center gap-3 text-[10px] text-muted-foreground">
                          <span className="flex items-center gap-0.5">
                            <Clock size={10} />
                            {bundok.date.slice(5)} {bundok.time}
                          </span>
                          <span className="flex items-center gap-0.5">
                            <FormatIcon size={10} />
                            {bundok.location}
                          </span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* 내 서평 탭 */}
        {activeTab === "reviews" && (
          <div className="px-5 sm:px-8">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs text-muted-foreground">{myReviews.length}편의 서평</span>
              <button
                onClick={() => setShowAllReviews(true)}
                className="text-xs font-medium text-primary"
              >
                전체 보기
              </button>
            </div>
            <div className="flex flex-col gap-3">
              {myReviews.slice(0, 5).map((review) => {
                const programColor = programColors[review.program]
                return (
                  <div
                    key={review.id}
                    className="flex items-start gap-3 rounded-2xl border border-border bg-card p-3.5 shadow-sm"
                  >
                    <div className="h-14 w-10 flex-shrink-0 overflow-hidden rounded-lg shadow-sm">
                      <img
                        src={review.book.cover || "/placeholder.svg"}
                        alt={review.book.title}
                        className="h-full w-full object-cover"
                        crossOrigin="anonymous"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="text-xs font-bold text-foreground line-clamp-1">{review.book.title}</h3>
                        <span className={cn("flex-shrink-0 rounded-full px-1.5 py-0.5 text-[8px] font-bold", programColor.bg, programColor.text)}>
                          {programLabels[review.program]}
                        </span>
                      </div>
                      <p className="mt-0.5 text-[10px] text-muted-foreground">{review.book.author}</p>
                      <div className="mt-1 flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            size={9}
                            className={cn(s <= review.rating ? "fill-tangerine text-tangerine" : "text-border")}
                          />
                        ))}
                      </div>
                      <p className="mt-1 line-clamp-2 text-[11px] leading-relaxed text-foreground">{review.text}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* 독서인증서 탭 */}
        {activeTab === "certificate" && (
          <div>
            <StampBoard totalReviews={totalReviews} />

            <div className="mt-4">
              <BadgeCollection
                badges={kdcBadges}
                totalBadges={totalBadges}
                onBadgeClick={setSelectedBadgeId}
              />
            </div>
          </div>
        )}
      </div>

      {/* Badge Review Modal */}
      {selectedBadgeId && (
        <BadgeReviewModal
          badge={selectedBadge}
          reviews={badgeReviews}
          likedReviews={likedReviews}
          onToggleLike={toggleLike}
          onClose={() => setSelectedBadgeId(null)}
        />
      )}

      {/* All Reviews Modal */}
      {showAllReviews && (
        <AllReviewsModal
          reviews={myReviews}
          likedReviews={likedReviews}
          onToggleLike={toggleLike}
          onClose={() => setShowAllReviews(false)}
        />
      )}
    </div>
  )
}
