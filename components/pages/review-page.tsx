"use client"

import React, { useState, useCallback } from "react"
import {
  Check,
  ChevronRight,
  ChevronLeft,
  BookOpen,
  Tag,
  PenTool,
  Award,
  Search,
  Star,
  Heart,
  MessageCircle,
  MoreHorizontal,
  Plus,
  FileText,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { KDCBadge } from "@/components/kdc-badge"
import type { KDCBadgeData } from "@/components/kdc-badge"
import { KDC_BADGE_GRADIENTS } from "@/components/library/library-types"
import { usePrograms } from "@/lib/program-context"
import { useSharedData } from "@/lib/shared-data-context"
import {
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
} from "lucide-react"

/* ── mock data: existing reviews ── */
const existingReviews = [
  {
    id: 1,
    user: { name: "은하", avatar: "https://picsum.photos/seed/u10/80/80", badge: "문학" },
    book: { title: "미드나이트 라이브러리", author: "매트 헤이그", cover: "https://picsum.photos/seed/rev4/100/140" },
    rating: 5,
    text: "살아보지 못한 삶들을 돌아보며 지금 이 순간의 소중함을 다시 느끼게 해준 책. 매트 헤이그의 따뜻한 문장들이 마음속에 오래 남았습니다. 후회 없는 삶이란 결국 현재를 온전히 사는 것이라는 메시지가 깊이 와닿았어요.",
    likes: 42,
    comments: 7,
    timeAgo: "2시간 전",
    badgeId: "800",
  },
  {
    id: 2,
    user: { name: "재원", avatar: "https://picsum.photos/seed/u11/80/80", badge: "사회과학" },
    book: { title: "아주 작은 습관의 힘", author: "제임스 클리어", cover: "https://picsum.photos/seed/rev3/100/140" },
    rating: 4,
    text: "습관을 '정체성의 변화'로 바라보는 시선이 인상 깊었어요. 단순히 행동을 반복하는 게 아니라, 내가 어떤 사람이 되고 싶은지에서 출발하는 접근이 실천력을 높여주네요. 동아리 친구들에게도 추천했습니다.",
    likes: 38,
    comments: 12,
    timeAgo: "5시간 전",
    badgeId: "300",
  },
  {
    id: 3,
    user: { name: "수빈", avatar: "https://picsum.photos/seed/u12/80/80", badge: "역사" },
    book: { title: "사피엔스: 인류의 역사", author: "유발 하라리", cover: "https://picsum.photos/seed/rev2/100/140" },
    rating: 5,
    text: "인류 역사를 전혀 새로운 관점에서 풀어낸 책. 농업혁명이 오히려 인류를 불행하게 만들었다는 주장은 충격적이면서도 설득력 있었어요. 번독 모임에서 함께 읽으니 토론 거리가 끝도 없었습니다!",
    likes: 56,
    comments: 18,
    timeAgo: "8시간 전",
    badgeId: "900",
  },
  {
    id: 4,
    user: { name: "지훈", avatar: "https://picsum.photos/seed/u13/80/80", badge: "철학" },
    book: { title: "생각에 관한 생각", author: "대니얼 카너먼", cover: "https://picsum.photos/seed/rev5/100/140" },
    rating: 4,
    text: "우리의 판단이 얼마나 비합리적인지를 과학적으로 보여주는 책. 시스템1과 시스템2의 개념을 알고 나면 일상에서 내 생각의 오류가 보이기 시작합니다. 재독할 가치가 충분한 명저!",
    likes: 31,
    comments: 9,
    timeAgo: "1일 전",
    badgeId: "100",
  },
  {
    id: 5,
    user: { name: "하연", avatar: "https://picsum.photos/seed/u14/80/80", badge: "문학" },
    book: { title: "1984", author: "조지 오웰", cover: "https://picsum.photos/seed/rev6/100/140" },
    rating: 5,
    text: "디스토피아의 고전을 2020년대에 다시 읽으니 소름이 돋을 정도로 현실과 겹치는 부분이 많았어요. '빅 브라더'가 단순한 은유가 아닌 시대를 살고 있다는 걸 느꼈습니다. 필독서 중의 필독서.",
    likes: 67,
    comments: 23,
    timeAgo: "1일 전",
    badgeId: "800",
  },
]

/* ── stepper data ── */
const steps = [
  { id: 1, label: "프로그램", icon: FileText },
  { id: 2, label: "도서 선택", icon: BookOpen },
  { id: 3, label: "뱃지 선택", icon: Tag },
  { id: 4, label: "서평 작성", icon: PenTool },
  { id: 5, label: "스탬프 획득", icon: Award },
]

const availableBooks = [
  { id: 1, title: "아무튼, 메모", author: "김신회", cover: "https://picsum.photos/seed/rev1/100/140", source: "library" as const },
  { id: 2, title: "사피엔스: 인류의 역사", author: "유발 하라리", cover: "https://picsum.photos/seed/rev2/100/140", source: "library" as const },
  { id: 3, title: "아주 작은 습관의 힘", author: "제임스 클리어", cover: "https://picsum.photos/seed/rev3/100/140", source: "library" as const },
  { id: 4, title: "미드나이트 라이브러리", author: "매트 헤이그", cover: "https://picsum.photos/seed/rev4/100/140", source: "library" as const },
  { id: 5, title: "생각에 관한 생각", author: "대니얼 카너먼", cover: "https://picsum.photos/seed/rev5/100/140", source: "library" as const },
  { id: 6, title: "1984", author: "조지 오웰", cover: "https://picsum.photos/seed/rev6/100/140", source: "library" as const },
]

/* ── 알라딘 도서 검색 (Mock - 실제 API 연동 시 교체) ── */
const aladinBooks = [
  { id: 101, title: "채식주의자", author: "한강", cover: "https://picsum.photos/seed/aladin1/100/140", publisher: "창비", isbn: "9788936434120", source: "aladin" as const },
  { id: 102, title: "82년생 김지영", author: "조남주", cover: "https://picsum.photos/seed/aladin2/100/140", publisher: "민음사", isbn: "9788937473135", source: "aladin" as const },
  { id: 103, title: "불편한 편의점", author: "김호연", cover: "https://picsum.photos/seed/aladin3/100/140", publisher: "나무옆의자", isbn: "9791161571188", source: "aladin" as const },
  { id: 104, title: "달러구트 꿈 백화점", author: "이미예", cover: "https://picsum.photos/seed/aladin4/100/140", publisher: "팩토리나인", isbn: "9791165341909", source: "aladin" as const },
  { id: 105, title: "파친코", author: "이민진", cover: "https://picsum.photos/seed/aladin5/100/140", publisher: "인플루엔셜", isbn: "9791189092467", source: "aladin" as const },
  { id: 106, title: "총, 균, 쇠", author: "재레드 다이아몬드", cover: "https://picsum.photos/seed/aladin6/100/140", publisher: "문학사상", isbn: "9788970128986", source: "aladin" as const },
  { id: 107, title: "정의란 무엇인가", author: "마이클 샌델", cover: "https://picsum.photos/seed/aladin7/100/140", publisher: "김영사", isbn: "9788934939849", source: "aladin" as const },
  { id: 108, title: "코스모스", author: "칼 세이건", cover: "https://picsum.photos/seed/aladin8/100/140", publisher: "사이언스북스", isbn: "9788983711892", source: "aladin" as const },
]

type BookSource = "library" | "aladin"
type BookItem = {
  id: number
  title: string
  author: string
  cover: string
  source: BookSource
  publisher?: string
  isbn?: string
}

const badgeIcons: Record<string, React.ReactNode> = {
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

const badgeOptions: KDCBadgeData[] = KDC_BADGE_GRADIENTS.map((g) => ({
  ...g,
  icon: badgeIcons[g.id],
  earned: true,
  count: 0,
}))

const badgeColorMap: Record<string, string> = {
  "총류": "bg-primary/10 text-primary",
  "철학": "bg-mint/15 text-emerald-700",
  "종교": "bg-emerald/10 text-emerald-700",
  "사회과학": "bg-tangerine/15 text-tangerine",
  "자연과학": "bg-emerald/10 text-emerald-700",
  "기술과학": "bg-primary/10 text-primary",
  "예술": "bg-mint/15 text-mint",
  "언어": "bg-tangerine/15 text-tangerine",
  "문학": "bg-primary/10 text-primary",
  "역사": "bg-tangerine/15 text-tangerine",
}

/* ── Review List sub-component ── */
function ReviewList({ onWrite }: { onWrite: () => void }) {
  const [likedReviews, setLikedReviews] = useState<number[]>([])
  const [filterBadge, setFilterBadge] = useState<string | null>(null)

  const toggleLike = (id: number) => {
    setLikedReviews((prev) => prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id])
  }

  const badgeFilters = ["전체", "문학", "사회과학", "역사", "철학", "자연과학"]

  const filteredReviews = filterBadge && filterBadge !== "전체"
    ? existingReviews.filter((r) => r.user.badge === filterBadge)
    : existingReviews

  return (
    <div className="flex flex-col gap-0 pb-6">
      {/* Header */}
      <header className="flex items-center justify-between px-5 pt-5 sm:px-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">서평</h1>
          <p className="mt-0.5 text-xs text-muted-foreground sm:text-sm">
            {existingReviews.length}개의 서평이 등록되어 있습니다
          </p>
        </div>
        <button
          onClick={onWrite}
          className="flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-md transition-all hover:shadow-lg hover:brightness-110"
        >
          <Plus size={14} />
          글쓰기
        </button>
      </header>

      {/* Badge Filters */}
      <div role="tablist" aria-label="분류별 필터" className="no-scrollbar mt-4 flex gap-2 overflow-x-auto px-5 sm:px-8">
        {badgeFilters.map((badge) => (
          <button
            key={badge}
            role="tab"
            aria-selected={filterBadge === badge || (!filterBadge && badge === "전체")}
            onClick={() => setFilterBadge(badge === "전체" ? null : badge)}
            className={cn(
              "flex-shrink-0 rounded-full px-3.5 py-1.5 text-xs font-medium transition-all",
              (filterBadge === badge || (!filterBadge && badge === "전체"))
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            )}
          >
            {badge}
          </button>
        ))}
      </div>

      {/* Review Cards */}
      <div className="mt-4 flex flex-col">
        {filteredReviews.map((review) => {
          const liked = likedReviews.includes(review.id)
          return (
            <article
              key={review.id}
              className="border-b border-border px-5 py-5 sm:px-8"
            >
              {/* Top: user info */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={review.user.avatar || "/placeholder.svg"}
                    alt={review.user.name}
                    className="h-9 w-9 rounded-full object-cover ring-2 ring-border"
                    crossOrigin="anonymous"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-foreground">{review.user.name}</span>
                      <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-medium", badgeColorMap[review.user.badge] || "bg-muted text-muted-foreground")}>
                        {review.user.badge}
                      </span>
                    </div>
                    <span className="text-[11px] text-muted-foreground">{review.timeAgo}</span>
                  </div>
                </div>
                <button className="p-1 text-muted-foreground" aria-label="더보기">
                  <MoreHorizontal size={16} />
                </button>
              </div>

              {/* Book card */}
              <div className="mt-3 flex items-center gap-3 rounded-2xl bg-muted/50 p-3">
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
                        className={cn(s <= review.rating ? "fill-tangerine text-tangerine" : "text-border")}
                      />
                    ))}
                  </div>
                </div>
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
                  aria-label={liked ? "좋아요 취소" : "좋아요"}
                  aria-pressed={liked}
                >
                  <Heart
                    size={15}
                    className={cn(liked ? "fill-tangerine text-tangerine" : "text-muted-foreground")}
                  />
                  <span className={cn(liked ? "text-tangerine font-medium" : "")}>
                    {review.likes + (liked ? 1 : 0)}
                  </span>
                </button>
                <button className="flex items-center gap-1.5 text-xs text-muted-foreground" aria-label={`댓글 ${review.comments}개`}>
                  <MessageCircle size={15} />
                  {review.comments}
                </button>
              </div>
            </article>
          )
        })}
      </div>
    </div>
  )
}

/* ── Review Writer (stepper form) sub-component ── */
function ReviewWriter({ onBack }: { onBack: () => void }) {
  const { getAllProgramOptions } = usePrograms()
  const { bundoks, joinedBundoks } = useSharedData()
  const programOptions = getAllProgramOptions()

  const [currentStep, setCurrentStep] = useState(1)
  const [selectedProgram, setSelectedProgram] = useState<string | null>(null)
  const [selectedBook, setSelectedBook] = useState<BookItem | null>(null)
  const [selectedBadge, setSelectedBadge] = useState<string | null>(null)
  const [reviewText, setReviewText] = useState("")
  const [showStamp, setShowStamp] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [rating, setRating] = useState(0)
  const [bookSearchTab, setBookSearchTab] = useState<"library" | "aladin">("library")
  const [isSearching, setIsSearching] = useState(false)

  // 참여한 번독 목록
  const myBundoks = bundoks.filter((b) => joinedBundoks.includes(b.id))

  const charCount = reviewText.length
  const isReviewValid = charCount >= 100

  // 도서관 소장 도서 검색
  const filteredLibraryBooks: BookItem[] = availableBooks.filter(
    (b) =>
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.author.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // 알라딘 도서 검색 (Mock - 실제로는 API 호출)
  const filteredAladinBooks: BookItem[] = searchQuery.length >= 2
    ? aladinBooks.filter(
        (b) =>
          b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          b.author.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : []

  const currentBooks = bookSearchTab === "library" ? filteredLibraryBooks : filteredAladinBooks

  const handleNext = useCallback(() => {
    if (currentStep === 4 && isReviewValid) {
      setCurrentStep(5)
      setShowStamp(true)
    } else if (currentStep < 4) {
      setCurrentStep((prev) => prev + 1)
    }
  }, [currentStep, isReviewValid])

  const selectedBadgeData = badgeOptions.find((b) => b.id === selectedBadge)

  return (
    <div className="flex flex-col gap-6 pb-6">
      {/* Header with back button */}
      <header className="flex items-center gap-3 px-5 pt-5 sm:px-8">
        {currentStep < 5 && (
          <button
            onClick={currentStep === 1 ? onBack : () => setCurrentStep((p) => p - 1)}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-foreground transition-colors hover:bg-muted/80"
            aria-label="뒤로가기"
          >
            <ChevronLeft size={18} />
          </button>
        )}
        <div>
          <h1 className="text-2xl font-bold text-foreground">서평 작성</h1>
          <p className="mt-0.5 text-xs text-muted-foreground sm:text-sm">
            독서 감상을 나누고 스탬프를 획득하세요
          </p>
        </div>
      </header>

      {/* Stepper */}
      <div className="flex items-center justify-between px-5 sm:px-8">
        {steps.map((step, i) => {
          const Icon = step.icon
          const isActive = currentStep === step.id
          const isDone = currentStep > step.id
          return (
            <div key={step.id} className="flex items-center">
              <div className="flex flex-col items-center gap-1">
                <div
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-full transition-all",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-md"
                      : isDone
                        ? "bg-emerald/20 text-emerald"
                        : "bg-muted text-muted-foreground"
                  )}
                >
                  {isDone ? <Check size={16} /> : <Icon size={16} />}
                </div>
                <span
                  className={cn(
                    "text-[9px] font-medium",
                    isActive || isDone ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  {step.label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div
                  className={cn(
                    "mx-1.5 h-px w-6 transition-colors",
                    currentStep > step.id ? "bg-primary" : "bg-border"
                  )}
                />
              )}
            </div>
          )
        })}
      </div>

      {/* Step Content */}
      <div className="px-5 sm:px-8">
        {/* Step 1: Program Selection */}
        {currentStep === 1 && (
          <div className="animate-fade-in-up">
            <p className="mb-4 text-sm text-muted-foreground">
              어떤 프로그램으로 서평을 작성하시나요?
            </p>
            <div className="flex flex-col gap-2">
              {programOptions.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setSelectedProgram(opt.id)}
                  className={cn(
                    "flex items-center gap-3 rounded-2xl border p-4 text-left transition-all",
                    selectedProgram === opt.id
                      ? "border-primary bg-primary/5 shadow-md"
                      : "border-border bg-card hover:bg-muted/50"
                  )}
                >
                  <FileText size={16} className={cn(
                    selectedProgram === opt.id ? "text-primary" : "text-muted-foreground"
                  )} />
                  <span className="text-sm font-medium text-foreground">{opt.label}</span>
                  {selectedProgram === opt.id && (
                    <Check size={14} className="ml-auto text-primary" />
                  )}
                </button>
              ))}

              {/* 참여한 번독 목록 */}
              {selectedProgram === "bundok" && myBundoks.length > 0 && (
                <div className="mt-2 rounded-2xl border border-border bg-muted/30 p-3">
                  <p className="mb-2 text-xs font-semibold text-foreground">참여한 번독 모임</p>
                  <div className="flex flex-col gap-1.5">
                    {myBundoks.map((b) => (
                      <div key={b.id} className="flex items-center gap-2 rounded-xl bg-card px-3 py-2">
                        <span className="text-xs font-medium text-foreground">{b.title}</span>
                        <span className="text-[10px] text-muted-foreground">({b.book})</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step 2: Select Book */}
        {currentStep === 2 && (
          <div className="animate-fade-in-up">
            {/* 도서 검색 탭 (도서관/알라딘) */}
            <div className="mb-4 flex gap-2">
              <button
                onClick={() => setBookSearchTab("library")}
                className={cn(
                  "flex-1 rounded-xl py-2 text-xs font-medium transition-all",
                  bookSearchTab === "library"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                )}
              >
                도서관 소장
              </button>
              <button
                onClick={() => setBookSearchTab("aladin")}
                className={cn(
                  "flex-1 rounded-xl py-2 text-xs font-medium transition-all",
                  bookSearchTab === "aladin"
                    ? "bg-aladin text-white shadow-sm"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                )}
              >
                알라딘 검색
              </button>
            </div>

            {/* 검색 입력 */}
            <div className="mb-4 flex items-center gap-2 rounded-2xl border border-border bg-card px-3 py-2.5 shadow-sm">
              <Search size={16} className="text-muted-foreground" />
              <input
                type="text"
                placeholder={bookSearchTab === "library" ? "도서관 소장 도서 검색..." : "알라딘에서 도서 검색 (2글자 이상)..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
              />
            </div>

            {/* 알라딘 탭 안내 */}
            {bookSearchTab === "aladin" && searchQuery.length < 2 && (
              <div className="mb-4 rounded-xl bg-aladin/10 p-3 text-center">
                <p className="text-xs text-aladin">
                  도서관에 없는 책도 검색할 수 있어요!<br />
                  2글자 이상 입력하면 알라딘에서 검색됩니다.
                </p>
              </div>
            )}

            {/* 도서 목록 */}
            <div className="flex flex-col gap-2">
              {currentBooks.length === 0 && searchQuery.length >= 2 && (
                <div className="rounded-xl bg-muted/50 py-8 text-center">
                  <p className="text-sm text-muted-foreground">검색 결과가 없습니다</p>
                </div>
              )}
              {currentBooks.map((book) => (
                <button
                  key={`${book.source}-${book.id}`}
                  onClick={() => setSelectedBook(book)}
                  className={cn(
                    "flex items-center gap-3 rounded-2xl border p-3 text-left transition-all",
                    selectedBook?.id === book.id && selectedBook?.source === book.source
                      ? "border-primary bg-primary/5 shadow-md"
                      : "border-border bg-card hover:bg-muted/50"
                  )}
                >
                  <div className="h-14 w-10 flex-shrink-0 overflow-hidden rounded-xl">
                    <img src={book.cover || "/placeholder.svg"} alt={book.title} className="h-full w-full object-cover" crossOrigin="anonymous" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-foreground">{book.title}</p>
                      <span className={cn(
                        "rounded-full px-1.5 py-0.5 text-[9px] font-medium",
                        book.source === "library"
                          ? "bg-emerald/20 text-emerald-700"
                          : "bg-aladin/15 text-aladin"
                      )}>
                        {book.source === "library" ? "소장" : "알라딘"}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">{book.author}</p>
                    {book.publisher && (
                      <p className="text-[10px] text-muted-foreground/70">{book.publisher}</p>
                    )}
                  </div>
                  {selectedBook?.id === book.id && selectedBook?.source === book.source && (
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary">
                      <Check size={12} className="text-primary-foreground" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Choose Badge */}
        {currentStep === 3 && (
          <div className="animate-fade-in-up">
            <p className="mb-4 text-sm text-muted-foreground">
              읽은 도서에 가장 알맞은 KDC 분류를 선택하세요:
            </p>
            <div className="grid grid-cols-5 gap-x-2 gap-y-4">
              {badgeOptions.map((badge) => (
                <button
                  key={badge.id}
                  onClick={() => setSelectedBadge(badge.id)}
                  className={cn(
                    "rounded-2xl p-1.5 transition-all",
                    selectedBadge === badge.id ? "bg-primary/10 ring-2 ring-primary" : "hover:bg-muted"
                  )}
                >
                  <KDCBadge badge={badge} />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 4: Write Review */}
        {currentStep === 4 && (
          <div className="animate-fade-in-up">
            {selectedBook && selectedBadgeData && (
              <div className="mb-4 flex items-center gap-3 rounded-2xl border border-border bg-muted/50 p-3">
                <div className="h-12 w-8 flex-shrink-0 overflow-hidden rounded-lg">
                  <img src={selectedBook.cover || "/placeholder.svg"} alt={selectedBook.title} className="h-full w-full object-cover" crossOrigin="anonymous" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-semibold text-foreground">{selectedBook.title}</p>
                    <span className={cn(
                      "rounded-full px-1.5 py-0.5 text-[9px] font-medium",
                      selectedBook.source === "library"
                        ? "bg-emerald/20 text-emerald-700"
                        : "bg-aladin/15 text-aladin"
                    )}>
                      {selectedBook.source === "library" ? "소장" : "알라딘"}
                    </span>
                  </div>
                  <p className="text-[10px] text-muted-foreground">뱃지: {selectedBadgeData.label} ({selectedBadgeData.id})</p>
                </div>
              </div>
            )}
            <div className="mb-4">
              <p className="mb-2 text-xs font-medium text-foreground">별점 평가</p>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button key={star} onClick={() => setRating(star)} aria-label={`${star}점 평가`}>
                    <Star size={24} className={cn("transition-colors", star <= rating ? "fill-tangerine text-tangerine" : "text-border")} />
                  </button>
                ))}
              </div>
            </div>
            <div className="relative">
              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="이 도서에 대한 감상을 나눠주세요 (최소 100자)..."
                aria-label="서평 내용 작성 (최소 100자)"
                className="min-h-[180px] w-full resize-none rounded-2xl border border-border bg-card p-4 text-sm text-foreground shadow-sm outline-none placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary"
              />
              <div className="mt-2 flex items-center justify-between">
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted" role="progressbar" aria-valuenow={Math.min(charCount, 100)} aria-valuemin={0} aria-valuemax={100} aria-label={`서평 작성 진행률 ${charCount}/100자`}>
                  <div
                    className={cn("h-full rounded-full transition-all", isReviewValid ? "bg-primary" : "bg-emerald")}
                    style={{ width: `${Math.min((charCount / 100) * 100, 100)}%` }}
                  />
                </div>
                <span className={cn("ml-3 text-xs font-medium", isReviewValid ? "text-primary" : "text-muted-foreground")}>
                  {charCount}/100
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Stamp Animation */}
        {currentStep === 5 && showStamp && selectedBadgeData && (
          <div className="animate-fade-in-up flex flex-col items-center gap-6 py-8">
            <div className="animate-stamp-drop">
              <div className="relative">
                <div
                  className="flex h-32 w-32 items-center justify-center rounded-full shadow-xl"
                  style={{
                    background: selectedBadgeData.gradient,
                    boxShadow: "0 0 40px rgba(6, 78, 59, 0.35), inset 0 2px 4px rgba(255,255,255,0.3)",
                  }}
                >
                  <div className="text-4xl text-white">{selectedBadgeData.icon}</div>
                </div>
                <div
                  className="pointer-events-none absolute inset-0 rounded-full opacity-40"
                  style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.6) 0%, transparent 50%, rgba(255,255,255,0.2) 100%)" }}
                />
              </div>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-bold text-foreground">스탬프를 획득했습니다!</h3>
              <p className="mt-1 text-sm text-muted-foreground">{selectedBadgeData.label} ({selectedBadgeData.id})</p>
              <p className="mt-3 text-xs text-muted-foreground">서평이 성공적으로 등록되었습니다.</p>
            </div>
            <button
              onClick={onBack}
              className="rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground shadow-md transition-all hover:shadow-lg hover:brightness-110"
            >
              서평 목록으로 돌아가기
            </button>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      {currentStep < 5 && (
        <div className="px-5 sm:px-8">
          <button
            onClick={handleNext}
            disabled={
              (currentStep === 1 && !selectedProgram) ||
              (currentStep === 2 && !selectedBook) ||
              (currentStep === 3 && !selectedBadge) ||
              (currentStep === 4 && !isReviewValid)
            }
            className={cn(
              "flex w-full items-center justify-center gap-2 rounded-2xl py-3 text-sm font-medium transition-all",
              (currentStep === 1 && selectedProgram !== null) ||
                (currentStep === 2 && selectedBook !== null) ||
                (currentStep === 3 && selectedBadge) ||
                (currentStep === 4 && isReviewValid)
                ? "bg-primary text-primary-foreground shadow-md hover:shadow-lg hover:brightness-110"
                : "cursor-not-allowed bg-muted text-muted-foreground"
            )}
          >
            {currentStep === 4 ? "제출 후 스탬프 받기" : "다음"}
            <ChevronRight size={14} />
          </button>
        </div>
      )}
    </div>
  )
}

/* ── Main Export ── */
export function ReviewPage() {
  const [mode, setMode] = useState<"list" | "write">("list")

  return mode === "list"
    ? <ReviewList onWrite={() => setMode("write")} />
    : <ReviewWriter onBack={() => setMode("list")} />
}
