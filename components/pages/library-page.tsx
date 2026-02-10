"use client"

import { useState } from "react"
import {
  ShoppingCart,
  BookOpen,
  Award,
  FileText,
  Clock,
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
  X,
  Star,
  Heart,
  MessageCircle,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { KDCBadge } from "@/components/kdc-badge"
import type { KDCBadgeData } from "@/components/kdc-badge"
import { KDCRadarChart } from "@/components/radar-chart"

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

const kdcBadges: KDCBadgeData[] = [
  {
    id: "000",
    label: "총류",
    icon: <Key size={18} />,
    earned: true,
    count: 3,
    gradient: "linear-gradient(135deg, #064E3B 0%, #0D7349 50%, #042F24 100%)",
    borderGradient: "linear-gradient(135deg, #34D399, #6EE7B7, #10B981)",
  },
  {
    id: "100",
    label: "철학",
    icon: <Brain size={18} />,
    earned: true,
    count: 7,
    gradient: "linear-gradient(135deg, #042F24 0%, #064E3B 50%, #021A14 100%)",
    borderGradient: "linear-gradient(135deg, #6EE7B7, #A7F3D0, #34D399)",
  },
  {
    id: "200",
    label: "종교",
    icon: <Church size={18} />,
    earned: false,
    count: 0,
    gradient: "linear-gradient(135deg, #1A3C34 0%, #2D5A4E 50%, #0F2820 100%)",
    borderGradient: "linear-gradient(135deg, #86EFAC, #BBF7D0, #4ADE80)",
  },
  {
    id: "300",
    label: "사회과학",
    icon: <Scale size={18} />,
    earned: true,
    count: 5,
    gradient: "linear-gradient(135deg, #047857 0%, #059669 50%, #065F46 100%)",
    borderGradient: "linear-gradient(135deg, #A7F3D0, #D1FAE5, #6EE7B7)",
  },
  {
    id: "400",
    label: "자연과학",
    icon: <Leaf size={18} />,
    earned: true,
    count: 4,
    gradient: "linear-gradient(135deg, #022C1E 0%, #064E3B 50%, #011B12 100%)",
    borderGradient: "linear-gradient(135deg, #34D399, #6EE7B7, #10B981)",
  },
  {
    id: "500",
    label: "기술과학",
    icon: <Cpu size={18} />,
    earned: true,
    count: 5,
    gradient: "linear-gradient(135deg, #14532D 0%, #166534 50%, #0A3B1E 100%)",
    borderGradient: "linear-gradient(135deg, #4ADE80, #86EFAC, #22C55E)",
  },
  {
    id: "600",
    label: "예술",
    icon: <Palette size={18} />,
    earned: true,
    count: 3,
    gradient: "linear-gradient(135deg, #115E45 0%, #0D9065 50%, #0A4030 100%)",
    borderGradient: "linear-gradient(135deg, #5EEAD4, #99F6E4, #2DD4BF)",
  },
  {
    id: "700",
    label: "언어",
    icon: <Languages size={18} />,
    earned: false,
    count: 0,
    gradient: "linear-gradient(135deg, #1A3A30 0%, #2D6B55 50%, #102820 100%)",
    borderGradient: "linear-gradient(135deg, #6EE7B7, #A7F3D0, #34D399)",
  },
  {
    id: "800",
    label: "문학",
    icon: <BookMarked size={18} />,
    earned: true,
    count: 9,
    gradient: "linear-gradient(135deg, #064E3B 0%, #10B981 50%, #022C22 100%)",
    borderGradient: "linear-gradient(135deg, #6EE7B7, #D1FAE5, #34D399)",
  },
  {
    id: "900",
    label: "역사",
    icon: <Landmark size={18} />,
    earned: true,
    count: 6,
    gradient: "linear-gradient(135deg, #1B4D3E 0%, #2F7A5E 50%, #0E3328 100%)",
    borderGradient: "linear-gradient(135deg, #86EFAC, #D1FAE5, #4ADE80)",
  },
]

const wishlistItems = [
  {
    id: 1,
    title: "미움받을 용기",
    price: "13,500",
    cover: "https://picsum.photos/seed/wish1/100/140",
  },
  {
    id: 2,
    title: "생각에 관한 생각",
    price: "15,800",
    cover: "https://picsum.photos/seed/wish2/100/140",
  },
  {
    id: 3,
    title: "1984",
    price: "9,200",
    cover: "https://picsum.photos/seed/wish3/100/140",
  },
]

interface ActiveClub {
  id: number
  title: string
  nextMeeting: string
  cover: string
  members: number
  status: "active" | "completed"
}

const activeClubs: ActiveClub[] = [
  {
    id: 1,
    title: "숨겨둔 내 안의 이야기",
    nextMeeting: "3월 24일 (화) 오후 8시",
    cover: "https://picsum.photos/seed/active1/100/140",
    members: 5,
    status: "active",
  },
  {
    id: 2,
    title: "과학과 상상력",
    nextMeeting: "3월 26일 (목) 오후 7시",
    cover: "https://picsum.photos/seed/active2/100/140",
    members: 22,
    status: "active",
  },
  {
    id: 3,
    title: "고전 다시 읽기",
    nextMeeting: "완료됨",
    cover: "https://picsum.photos/seed/active3/100/140",
    members: 10,
    status: "completed",
  },
]

const statusConfig = {
  active: {
    label: "참여 중",
    bg: "bg-emerald",
    text: "text-white",
  },
  completed: {
    label: "참여 완료",
    bg: "bg-amber-500",
    text: "text-white",
  },
}

/* ── My Reviews (linked to KDC badge IDs) ── */
const myReviews = [
  {
    id: 1,
    badgeId: "800",
    book: { title: "미드나이트 라이브러리", author: "매트 헤이그", cover: "https://picsum.photos/seed/rev4/100/140" },
    rating: 5,
    text: "살아보지 못한 삶들을 돌아보며 지금 이 순간의 소중함을 다시 느끼게 해준 책. 매트 헤이그의 따뜻한 문장들이 마음속에 오래 남았습니다.",
    likes: 42,
    comments: 7,
    timeAgo: "2일 전",
  },
  {
    id: 2,
    badgeId: "800",
    book: { title: "1984", author: "조지 오웰", cover: "https://picsum.photos/seed/rev6/100/140" },
    rating: 5,
    text: "디스토피아의 고전을 다시 읽으니 소름이 돋을 정도로 현실과 겹치는 부분이 많았어요. 필독서 중의 필독서.",
    likes: 67,
    comments: 23,
    timeAgo: "5일 전",
  },
  {
    id: 3,
    badgeId: "300",
    book: { title: "아주 작은 습관의 힘", author: "제임스 클리어", cover: "https://picsum.photos/seed/rev3/100/140" },
    rating: 4,
    text: "습관을 '정체성의 변화'로 바라보는 시선이 인상 깊었어요. 내가 어떤 사람이 되고 싶은지에서 출발하는 접근이 실천력을 높여주네요.",
    likes: 38,
    comments: 12,
    timeAgo: "1주 전",
  },
  {
    id: 4,
    badgeId: "900",
    book: { title: "사피엔스", author: "유발 하라리", cover: "https://picsum.photos/seed/rev2/100/140" },
    rating: 5,
    text: "인류 역사를 전혀 새로운 관점에서 풀어낸 책. 농업혁명이 오히려 인류를 불행하게 만들었다는 주장은 충격적이면서도 설득력 있었어요.",
    likes: 56,
    comments: 18,
    timeAgo: "1주 전",
  },
  {
    id: 5,
    badgeId: "100",
    book: { title: "생각에 관한 생각", author: "대니얼 카너먼", cover: "https://picsum.photos/seed/rev5/100/140" },
    rating: 4,
    text: "시스템1과 시스템2의 개념을 알고 나면 일상에서 내 생각의 오류가 보이기 시작합니다. 재독할 가치가 충분한 명저!",
    likes: 31,
    comments: 9,
    timeAgo: "2주 전",
  },
  {
    id: 6,
    badgeId: "000",
    book: { title: "정보의 세계사", author: "제임스 글릭", cover: "https://picsum.photos/seed/rev7/100/140" },
    rating: 4,
    text: "정보라는 개념이 인류 문명에 미친 영향을 방대하게 조망한 책. 아날로그에서 디지털까지의 여정이 흥미롭습니다.",
    likes: 19,
    comments: 5,
    timeAgo: "3주 전",
  },
  {
    id: 7,
    badgeId: "400",
    book: { title: "코스모스", author: "칼 세이건", cover: "https://picsum.photos/seed/rev8/100/140" },
    rating: 5,
    text: "우주의 광활함 앞에서 인간의 존재를 다시 생각하게 만드는 명저. 칼 세이건의 시적인 문체가 과학에 아름다움을 더합니다.",
    likes: 44,
    comments: 14,
    timeAgo: "3주 전",
  },
  {
    id: 8,
    badgeId: "500",
    book: { title: "클린 코드", author: "로버트 C. 마틴", cover: "https://picsum.photos/seed/rev9/100/140" },
    rating: 4,
    text: "개발자라면 한 번쯤 읽어야 할 책. 깨끗한 코드 작성의 원칙과 실전 사례가 유익했어요.",
    likes: 27,
    comments: 8,
    timeAgo: "1달 전",
  },
  {
    id: 9,
    badgeId: "600",
    book: { title: "미술관에 간 화학자", author: "전창림", cover: "https://picsum.photos/seed/rev10/100/140" },
    rating: 4,
    text: "화학적 시선으로 명화를 분석하는 독특한 접근. 예술과 과학의 만남이 신선합니다.",
    likes: 22,
    comments: 6,
    timeAgo: "1달 전",
  },
  {
    id: 10,
    badgeId: "300",
    book: { title: "정의란 무엇인가", author: "마이클 샌델", cover: "https://picsum.photos/seed/rev11/100/140" },
    rating: 5,
    text: "정의에 대한 철학적 논쟁을 현실 사례와 엮어 풀어내는 샌델 교수의 필력이 돋보입니다.",
    likes: 53,
    comments: 20,
    timeAgo: "1달 전",
  },
]

const badgeIdToLabel: Record<string, string> = {
  "000": "총류", "100": "철학", "200": "종교", "300": "사회과학",
  "400": "자연과학", "500": "기술과학", "600": "예술", "700": "언어",
  "800": "문학", "900": "역사",
}

export function LibraryPage() {
  const totalBadges = kdcBadges.filter((b) => b.earned).length
  const totalReviews = kdcBadges.reduce((sum, b) => sum + b.count, 0)
  const [selectedBadgeId, setSelectedBadgeId] = useState<string | null>(null)
  const [likedReviews, setLikedReviews] = useState<number[]>([])

  const selectedBadge = kdcBadges.find((b) => b.id === selectedBadgeId)
  const filteredReviews = myReviews.filter((r) => r.badgeId === selectedBadgeId)

  const toggleLike = (id: number) => {
    setLikedReviews((prev) => prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id])
  }

  return (
    <div className="flex flex-col gap-6 pb-24">
      {/* Header */}
      <header className="px-5 pt-5 sm:px-8">
        <h1 className="font-serif text-2xl font-bold text-foreground">
          내 서재
        </h1>
        <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
          뱃지 {totalBadges}개 획득 / 서평 {totalReviews}편 작성
        </p>
      </header>

      {/* Radar Chart Section */}
      <section className="mx-5 overflow-hidden rounded-3xl border border-border bg-card shadow-lg sm:mx-8">
        <div className="flex items-center justify-between px-5 pt-4">
          <h2 className="flex items-center gap-2 text-sm font-bold text-foreground">
            <Sparkles size={16} className="text-emerald" />
            지식 레이더
          </h2>
          <span className="text-[10px] text-muted-foreground">
            KDC 10개 분류
          </span>
        </div>
        <div className="mx-auto flex h-56 w-56 items-center justify-center p-2">
          <KDCRadarChart data={radarData} />
        </div>
        {/* Preferred Category */}
        <div className="border-t border-border bg-gradient-to-r from-primary/5 to-emerald/5 px-5 py-3">
          <p className="text-center text-sm text-foreground">
            <span className="font-medium">당신은 </span>
            <span className="font-bold text-primary">&apos;800 문학&apos;</span>
            <span className="font-medium"> 도서를 선호합니다.</span>
          </p>
        </div>
      </section>

      {/* Stamp Board Section */}
      <section className="mx-5 overflow-hidden rounded-3xl border border-border bg-card shadow-lg sm:mx-8">
        <div className="flex items-center justify-between px-5 pt-4">
          <h2 className="flex items-center gap-2 text-sm font-bold text-foreground">
            <Award size={16} className="text-tangerine" />
            서평 스탬프
          </h2>
          <span className="text-[10px] text-muted-foreground">
            {totalReviews}/20개 수집
          </span>
        </div>

        {/* Stamp Grid */}
        <div className="grid grid-cols-5 gap-2 p-4">
          {Array.from({ length: 20 }).map((_, index) => {
            const isFilled = index < totalReviews
            const isReward10 = index === 9
            const isReward20 = index === 19
            return (
              <div
                key={index}
                className={cn(
                  "relative flex h-12 w-12 items-center justify-center rounded-full transition-all",
                  isFilled
                    ? "bg-gradient-to-br from-primary to-emerald-700 shadow-md"
                    : "border-2 border-dashed border-border bg-muted/30"
                )}
              >
                {isFilled ? (
                  <svg viewBox="0 0 24 24" className="h-6 w-6 text-white" fill="currentColor">
                    <path d="M12 2C12 2 8 6 8 12C8 16 10 20 12 22C14 20 16 16 16 12C16 6 12 2 12 2Z" />
                    <path d="M12 2C12 2 6 8 6 14C6 18 9 21 12 22" opacity="0.7" />
                    <path d="M12 2C12 2 18 8 18 14C18 18 15 21 12 22" opacity="0.7" />
                  </svg>
                ) : (
                  <span className="text-[10px] font-medium text-muted-foreground">{index + 1}</span>
                )}
                {/* Reward markers */}
                {isReward10 && (
                  <div className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-tangerine text-[8px] font-bold text-white">
                    !
                  </div>
                )}
                {isReward20 && (
                  <div className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#7C3AED] text-[8px] font-bold text-white">
                    !
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Reward Info */}
        <div className="border-t border-border bg-muted/30 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={cn(
                "flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold",
                totalReviews >= 10 ? "bg-tangerine text-white" : "bg-muted text-muted-foreground"
              )}>
                10
              </div>
              <span className={cn(
                "text-xs",
                totalReviews >= 10 ? "font-semibold text-tangerine" : "text-muted-foreground"
              )}>
                {totalReviews >= 10 ? "스타벅스 기프티콘 획득!" : "스타벅스 기프티콘"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className={cn(
                "flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold",
                totalReviews >= 20 ? "bg-[#7C3AED] text-white" : "bg-muted text-muted-foreground"
              )}>
                20
              </div>
              <span className={cn(
                "text-xs",
                totalReviews >= 20 ? "font-semibold text-[#7C3AED]" : "text-muted-foreground"
              )}>
                {totalReviews >= 20 ? "도서 상품권 획득!" : "도서 상품권"}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Wishlist / Cart Section */}
      <section className="px-5 sm:px-8">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-sm font-bold text-foreground">
            <ShoppingCart size={16} className="text-primary" />
            위시리스트
          </h2>
          <span className="rounded-full bg-[#7C3AED]/10 px-2.5 py-0.5 text-[10px] font-medium text-[#7C3AED]">
            공동구매 대기 중
          </span>
        </div>
        <div className="no-scrollbar flex gap-3 overflow-x-auto pb-1">
          {wishlistItems.map((item) => (
            <div
              key={item.id}
              className="flex min-w-[140px] flex-col rounded-3xl border border-border bg-card p-3 shadow-md"
            >
              <div className="mb-2 h-24 w-full overflow-hidden rounded-2xl ring-1 ring-border">
                <img
                  src={item.cover || "/placeholder.svg"}
                  alt={item.title}
                  className="h-full w-full object-cover"
                  crossOrigin="anonymous"
                />
              </div>
              <p className="truncate text-xs font-semibold text-foreground">
                {item.title}
              </p>
              <p className="mt-0.5 text-[10px] font-bold text-primary">
                공동구매: {item.price}원
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* My Clubs - Horizontal Scroll */}
      <section className="px-5 sm:px-8">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-sm font-bold text-foreground">
            <BookOpen size={16} className="text-emerald" />
            나의 클럽
          </h2>
          <button className="text-xs font-medium text-primary">
            전체 보기
          </button>
        </div>
        <div className="no-scrollbar flex gap-3 overflow-x-auto pb-1">
          {activeClubs.map((club) => {
            const sc = statusConfig[club.status]
            return (
              <div
                key={club.id}
                className="relative flex min-w-[230px] items-center gap-3 rounded-3xl border border-border bg-card p-3 shadow-md"
              >
                {/* Status Badge */}
                <div
                  className={cn(
                    "absolute right-3 top-3 rounded-full px-2 py-0.5 text-[9px] font-bold shadow-sm",
                    sc.bg,
                    sc.text
                  )}
                >
                  {sc.label}
                </div>
                <div className="h-16 w-12 flex-shrink-0 overflow-hidden rounded-xl ring-1 ring-border">
                  <img
                    src={club.cover || "/placeholder.svg"}
                    alt={club.title}
                    className="h-full w-full object-cover"
                    crossOrigin="anonymous"
                  />
                </div>
                <div className="flex-1 pr-12">
                  <h3 className="text-xs font-bold text-foreground">
                    {club.title}
                  </h3>
                  <p className="mt-0.5 flex items-center gap-1 text-[10px] text-muted-foreground">
                    <Clock size={10} />
                    {club.nextMeeting}
                  </p>
                  <p className="mt-0.5 text-[10px] text-muted-foreground">
                    {club.members}명 참여
                  </p>
                </div>
                <ChevronRight size={14} className="flex-shrink-0 text-muted-foreground" />
              </div>
            )
          })}
        </div>
      </section>

      {/* Badge Collection */}
      <section className="mx-5 overflow-hidden rounded-3xl border border-border bg-card shadow-lg sm:mx-8">
        {/* Premium top bar */}
        <div
          className="h-1.5 w-full"
          style={{
            background:
              "linear-gradient(90deg, #064E3B, #059669, #34D399, #059669, #064E3B)",
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
            {kdcBadges.map((badge) => (
              <KDCBadge
                key={badge.id}
                badge={badge}
                onClick={badge.earned ? () => setSelectedBadgeId(badge.id) : undefined}
              />
            ))}
          </div>
        </div>
        {/* Bottom metallic accent */}
        <div
          className="h-0.5 w-full"
          style={{
            background:
              "linear-gradient(90deg, transparent, #34D399, #6EE7B7, #34D399, transparent)",
          }}
        />
      </section>

      {/* Floating Certificate Button */}
      <div className="fixed bottom-20 left-1/2 z-40 -translate-x-1/2">
        <button
          className="flex items-center gap-2 rounded-full px-6 py-3 text-sm font-bold text-white shadow-lg transition-transform hover:scale-105"
          style={{
            background:
              "linear-gradient(135deg, #064E3B, #059669)",
          }}
        >
          <FileText size={16} />
          독서 인증서
        </button>
      </div>

      {/* Badge Review Modal */}
      {selectedBadgeId && selectedBadge && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 p-4 backdrop-blur-sm"
          onClick={() => setSelectedBadgeId(null)}
        >
          <div
            className="relative flex max-h-[85vh] w-full max-w-lg flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center gap-3 border-b border-border px-5 py-4">
              {/* Mini badge icon */}
              <div
                className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full"
                style={{
                  background: selectedBadge.gradient,
                  boxShadow: "0 2px 8px rgba(6, 78, 59, 0.25)",
                }}
              >
                <span className="text-sm text-white">{selectedBadge.icon}</span>
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-bold text-foreground">
                  {selectedBadge.label} ({selectedBadge.id})
                </h3>
                <p className="text-xs text-muted-foreground">
                  내가 작성한 서평 {filteredReviews.length}편
                </p>
              </div>
              <button
                onClick={() => setSelectedBadgeId(null)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-foreground transition-colors hover:bg-muted/70"
                aria-label="닫기"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Content - Review List */}
            <div className="flex-1 overflow-y-auto">
              {filteredReviews.length === 0 ? (
                <div className="flex flex-col items-center gap-3 py-12 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                    <BookOpen size={24} className="text-muted-foreground" />
                  </div>
                  <p className="text-sm font-medium text-muted-foreground">
                    아직 작성한 서평이 없어요
                  </p>
                  <p className="text-xs text-muted-foreground">
                    이 분류의 도서를 읽고 서평을 작성해보세요
                  </p>
                </div>
              ) : (
                filteredReviews.map((review) => {
                  const liked = likedReviews.includes(review.id)
                  return (
                    <article
                      key={review.id}
                      className="border-b border-border px-5 py-4 last:border-b-0"
                    >
                      {/* Book card */}
                      <div className="flex items-center gap-3 rounded-2xl bg-muted/50 p-3">
                        <div className="h-14 w-10 flex-shrink-0 overflow-hidden rounded-lg shadow-sm">
                          <img
                            src={review.book.cover || "/placeholder.svg"}
                            alt={review.book.title}
                            className="h-full w-full object-cover"
                            crossOrigin="anonymous"
                          />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-bold text-foreground">{review.book.title}</p>
                          <p className="text-[11px] text-muted-foreground">{review.book.author}</p>
                          <div className="mt-1 flex gap-0.5">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <Star
                                key={s}
                                size={11}
                                className={cn(
                                  s <= review.rating ? "fill-tangerine text-tangerine" : "text-border"
                                )}
                              />
                            ))}
                          </div>
                        </div>
                        <span className="text-[10px] text-muted-foreground">{review.timeAgo}</span>
                      </div>

                      {/* Review text */}
                      <p className="mt-3 text-[13px] leading-relaxed text-foreground">
                        {review.text}
                      </p>

                      {/* Actions */}
                      <div className="mt-3 flex items-center gap-5">
                        <button
                          onClick={() => toggleLike(review.id)}
                          className="flex items-center gap-1.5 text-xs text-muted-foreground transition-colors"
                        >
                          <Heart
                            size={15}
                            className={cn(liked ? "fill-tangerine text-tangerine" : "text-muted-foreground")}
                          />
                          <span className={cn(liked ? "font-medium text-tangerine" : "")}>
                            {review.likes + (liked ? 1 : 0)}
                          </span>
                        </button>
                        <button className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <MessageCircle size={15} />
                          {review.comments}
                        </button>
                      </div>
                    </article>
                  )
                })
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
