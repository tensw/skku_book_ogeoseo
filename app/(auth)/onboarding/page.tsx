"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  BookOpen,
  Users,
  User,
  ChevronRight,
  ChevronLeft,
  Check,
  Sparkles,
  BookMarked,
  Brain,
  Landmark,
  Briefcase,
  Cpu,
  Palette,
  Heart,
  GraduationCap,
} from "lucide-react"
import { cn } from "@/lib/utils"

// 관심 분야 카테고리 데이터
const categories = [
  {
    id: "literature",
    name: "문학/창작",
    icon: BookMarked,
    subcategories: ["소설", "시/에세이", "고전문학", "SF/판타지", "미스터리/스릴러", "외국문학"],
  },
  {
    id: "humanities",
    name: "인문/교양",
    icon: Brain,
    subcategories: ["철학", "역사", "심리학", "언어학", "문화비평", "신화/종교"],
  },
  {
    id: "society",
    name: "사회/시사",
    icon: Landmark,
    subcategories: ["사회학", "정치", "법", "젠더/페미니즘", "미디어", "국제관계"],
  },
  {
    id: "business",
    name: "경영/경제",
    icon: Briefcase,
    subcategories: ["경영전략", "마케팅", "창업", "재테크/투자", "경제학", "리더십"],
  },
  {
    id: "science",
    name: "과학/기술",
    icon: Cpu,
    subcategories: ["자연과학", "수학", "IT/컴퓨터", "AI/데이터", "공학", "환경/생태"],
  },
  {
    id: "art",
    name: "예술/문화",
    icon: Palette,
    subcategories: ["미술", "음악", "영화/미디어", "건축", "디자인", "사진"],
  },
  {
    id: "selfdev",
    name: "자기계발",
    icon: Heart,
    subcategories: ["자기계발", "습관/생산성", "진로/커리어", "관계/소통", "글쓰기", "여행"],
  },
  {
    id: "academic",
    name: "학술/전공",
    icon: GraduationCap,
    subcategories: ["논문/학술서", "교양필독서", "동서양 고전", "연구방법론"],
  },
]

// 추천 도서 데이터
const recommendedBooks = [
  { id: 1, title: "미움받을 용기", author: "기시미 이치로", cover: "https://picsum.photos/seed/book1/200/300", category: "selfdev" },
  { id: 2, title: "사피엔스", author: "유발 하라리", cover: "https://picsum.photos/seed/book2/200/300", category: "humanities" },
  { id: 3, title: "1984", author: "조지 오웰", cover: "https://picsum.photos/seed/book3/200/300", category: "literature" },
  { id: 4, title: "정의란 무엇인가", author: "마이클 샌델", cover: "https://picsum.photos/seed/book4/200/300", category: "society" },
  { id: 5, title: "코스모스", author: "칼 세이건", cover: "https://picsum.photos/seed/book5/200/300", category: "science" },
  { id: 6, title: "데미안", author: "헤르만 헤세", cover: "https://picsum.photos/seed/book6/200/300", category: "literature" },
  { id: 7, title: "부의 추월차선", author: "엠제이 드마코", cover: "https://picsum.photos/seed/book7/200/300", category: "business" },
  { id: 8, title: "클린 코드", author: "로버트 마틴", cover: "https://picsum.photos/seed/book8/200/300", category: "science" },
  { id: 9, title: "미드나이트 라이브러리", author: "매트 헤이그", cover: "https://picsum.photos/seed/book9/200/300", category: "literature" },
  { id: 10, title: "생각에 관한 생각", author: "대니얼 카너먼", cover: "https://picsum.photos/seed/book10/200/300", category: "humanities" },
  { id: 11, title: "아주 작은 습관의 힘", author: "제임스 클리어", cover: "https://picsum.photos/seed/book11/200/300", category: "selfdev" },
  { id: 12, title: "총, 균, 쇠", author: "재레드 다이아몬드", cover: "https://picsum.photos/seed/book12/200/300", category: "humanities" },
]

const readingStyles = [
  { id: "alone", label: "혼자 읽고 기록하기", icon: User, description: "조용히 나만의 독서를 즐겨요", emoji: "📖" },
  { id: "together", label: "같이 이야기하기", icon: Users, description: "함께 토론하며 생각을 나눠요", emoji: "💬" },
  { id: "both", label: "상관없음", icon: BookOpen, description: "둘 다 좋아요!", emoji: "✨" },
]

// 분석 결과 페이지 컴포넌트
function AnalysisResultPage({
  nickname,
  selectedSubcategories,
  selectedBooks,
  readingStyle,
  onComplete,
}: {
  nickname: string
  selectedSubcategories: string[]
  selectedBooks: number[]
  readingStyle: string | null
  onComplete: () => void
}) {
  const topInterests = selectedSubcategories.slice(0, 5)
  const styleLabel = readingStyle === "alone" ? "개인 독서" : readingStyle === "together" ? "함께 독서" : "유연한 독서"
  const similarCount = Math.floor(Math.random() * 50) + 30

  return (
    <div className="min-h-screen bg-brand-surface flex flex-col items-center justify-center px-6 py-12">
      <div className="mx-auto max-w-md w-full">
        <div className="text-center mb-8">
          <Sparkles size={48} className="mx-auto text-brand-accent mb-4" />
          <h1 className="text-2xl font-bold text-gray-900">
            <span className="text-brand">{nickname || "독서인"}</span>님의
            <br />독서 취향을 분석했어요!
          </h1>
        </div>

        {/* 취향 요약 카드 */}
        <div className="rounded-3xl border-2 border-brand/20 bg-white p-6 shadow-lg">
          <h3 className="text-sm font-bold text-gray-900 mb-4">나의 독서 프로필</h3>

          <div className="flex flex-col gap-3">
            {/* 관심 분야 */}
            <div className="rounded-2xl bg-brand/5 p-4">
              <p className="text-[10px] font-semibold text-brand mb-2">관심 분야</p>
              <div className="flex flex-wrap gap-1.5">
                {topInterests.map((interest) => (
                  <span key={interest} className="rounded-full bg-brand/10 px-2.5 py-1 text-xs font-medium text-brand">
                    {interest}
                  </span>
                ))}
                {selectedSubcategories.length > 5 && (
                  <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-500">
                    +{selectedSubcategories.length - 5}개
                  </span>
                )}
              </div>
            </div>

            {/* 선택 도서 수 */}
            <div className="flex items-center justify-between rounded-2xl bg-brand-accent/5 p-4">
              <p className="text-[10px] font-semibold text-brand-accent">관심 도서</p>
              <span className="text-sm font-bold text-brand-accent">{selectedBooks.length}권</span>
            </div>

            {/* 독서 스타일 */}
            <div className="flex items-center justify-between rounded-2xl bg-emerald/5 p-4">
              <p className="text-[10px] font-semibold text-emerald">독서 스타일</p>
              <span className="text-sm font-bold text-emerald">{styleLabel}</span>
            </div>
          </div>
        </div>

        {/* 비슷한 취향 */}
        <div className="mt-4 rounded-2xl bg-gradient-to-r from-brand/10 to-brand-accent/10 p-4 text-center">
          <p className="text-sm text-gray-700">
            비슷한 취향의 <span className="font-bold text-brand">{similarCount}명</span>이 활동 중이에요
          </p>
        </div>

        {/* 시작하기 버튼 */}
        <button
          onClick={onComplete}
          className="mt-6 w-full rounded-full bg-gradient-to-r from-brand to-brand-accent py-4 text-base font-bold text-white shadow-lg shadow-brand/30 transition-all hover:shadow-brand/50"
        >
          시작하기
        </button>
      </div>
    </div>
  )
}

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [nickname, setNickname] = useState("")
  const [showCompletion, setShowCompletion] = useState(false)

  // 온보딩 데이터
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>([])
  const [selectedBooks, setSelectedBooks] = useState<number[]>([])
  const [readingStyle, setReadingStyle] = useState<string | null>(null)

  useEffect(() => {
    const savedNickname = localStorage.getItem("ogeoseo_nickname")
    if (savedNickname) {
      setNickname(savedNickname)
    }
  }, [])

  const totalSteps = 3
  const progress = ((step + 1) / totalSteps) * 100

  // 대분류 선택 시 세부 분류 전체 선택/해제
  const toggleCategory = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId)
    if (!category) return

    const isSelected = selectedCategories.includes(categoryId)

    if (isSelected) {
      // 대분류 해제 시 해당 세부 분류도 모두 해제
      setSelectedCategories(prev => prev.filter(id => id !== categoryId))
      setSelectedSubcategories(prev =>
        prev.filter(sub => !category.subcategories.includes(sub))
      )
    } else {
      // 대분류 선택 시 해당 세부 분류 모두 선택
      setSelectedCategories(prev => [...prev, categoryId])
      setSelectedSubcategories(prev => [
        ...prev.filter(sub => !category.subcategories.includes(sub)),
        ...category.subcategories
      ])
    }
  }

  const toggleSubcategory = (categoryId: string, subcategory: string) => {
    const category = categories.find(c => c.id === categoryId)
    if (!category) return

    const isSelected = selectedSubcategories.includes(subcategory)

    if (isSelected) {
      // 세부 분류 해제
      const newSubs = selectedSubcategories.filter(s => s !== subcategory)
      setSelectedSubcategories(newSubs)
      // 해당 대분류의 세부 분류가 하나도 없으면 대분류도 해제
      const hasAnySub = category.subcategories.some(sub => newSubs.includes(sub))
      if (!hasAnySub) {
        setSelectedCategories(prev => prev.filter(id => id !== categoryId))
      }
    } else {
      // 세부 분류 선택
      setSelectedSubcategories(prev => [...prev, subcategory])
    }
  }

  // 해당 카테고리의 모든 세부분류가 선택되었는지 확인
  const isCategoryFullySelected = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId)
    if (!category) return false
    return category.subcategories.every(sub => selectedSubcategories.includes(sub))
  }

  // 해당 카테고리의 일부 세부분류가 선택되었는지 확인
  const isCategoryPartiallySelected = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId)
    if (!category) return false
    const selectedCount = category.subcategories.filter(sub => selectedSubcategories.includes(sub)).length
    return selectedCount > 0 && selectedCount < category.subcategories.length
  }

  const toggleBook = (bookId: number) => {
    setSelectedBooks(prev => {
      if (prev.includes(bookId)) {
        return prev.filter(id => id !== bookId)
      }
      if (prev.length >= 10) return prev
      return [...prev, bookId]
    })
  }

  const handleComplete = () => {
    localStorage.setItem("ogeoseo_onboarding_complete", "true")
    localStorage.setItem("ogeoseo_preferences", JSON.stringify({
      categories: selectedCategories,
      subcategories: selectedSubcategories,
      books: selectedBooks,
      readingStyle,
    }))
    setShowCompletion(true)
  }

  const handleSkip = () => {
    localStorage.setItem("ogeoseo_onboarding_complete", "true")
    router.push("/")
  }

  const canProceed = () => {
    switch (step) {
      case 0: return selectedSubcategories.length > 0
      case 1: return selectedBooks.length >= 1
      case 2: return readingStyle !== null
      default: return true
    }
  }

  if (showCompletion) {
    return (
      <AnalysisResultPage
        nickname={nickname}
        selectedSubcategories={selectedSubcategories}
        selectedBooks={selectedBooks}
        readingStyle={readingStyle}
        onComplete={() => router.push("/")}
      />
    )
  }

  return (
    <div className="min-h-screen bg-brand-surface">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-b border-gray-100 shadow-sm">
        <div className="mx-auto max-w-5xl px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand to-brand-light">
                <BookOpen size={20} className="text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">오거서</h1>
                <p className="text-[10px] text-gray-500">맞춤 설정 중...</p>
              </div>
            </div>
            <button
              onClick={handleSkip}
              className="rounded-full px-4 py-2 text-sm font-medium text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
            >
              건너뛰기
            </button>
          </div>

          {/* Progress bar */}
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-gray-100">
            <div
              className="h-full rounded-full bg-gradient-to-r from-brand to-brand-accent transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="mt-2 flex justify-between text-xs text-gray-400">
            <span>Step {step + 1} / {totalSteps}</span>
            <span>{Math.round(progress)}% 완료</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-5xl px-6 pb-32 pt-40">
        {/* Welcome Message */}
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            {step === 0 && (
              <>
                <span className="text-brand">{nickname}</span>님, 관심 분야를 선택해주세요
              </>
            )}
            {step === 1 && "읽고 싶은 책을 골라주세요"}
            {step === 2 && "선호하는 독서 스타일은?"}
          </h2>
          <p className="mt-2 text-gray-500">
            {step === 0 && "대분류를 선택하면 세부 분야가 모두 선택돼요"}
            {step === 1 && "1권 이상 10권 이하로 선택해주세요"}
            {step === 2 && "맞춤 독서 모임을 추천해드릴게요"}
          </p>
        </div>

        {/* Step 0: Category Selection */}
        {step === 0 && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {categories.map((category) => {
              const Icon = category.icon
              const isFullySelected = isCategoryFullySelected(category.id)
              const isPartiallySelected = isCategoryPartiallySelected(category.id)

              return (
                <div
                  key={category.id}
                  className={cn(
                    "overflow-hidden rounded-2xl border-2 transition-all",
                    isFullySelected
                      ? "border-brand bg-brand/5 shadow-lg shadow-brand/10"
                      : isPartiallySelected
                      ? "border-brand-accent bg-brand-accent/5"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  )}
                >
                  {/* Category Header */}
                  <button
                    onClick={() => toggleCategory(category.id)}
                    className="flex w-full items-center gap-4 p-4"
                  >
                    <div className={cn(
                      "flex h-12 w-12 items-center justify-center rounded-xl transition-all",
                      isFullySelected
                        ? "bg-brand text-white"
                        : isPartiallySelected
                        ? "bg-brand-accent text-white"
                        : "bg-gray-100 text-gray-500"
                    )}>
                      <Icon size={24} />
                    </div>
                    <div className="flex-1 text-left">
                      <h3 className={cn(
                        "font-bold",
                        isFullySelected || isPartiallySelected ? "text-brand" : "text-gray-900"
                      )}>
                        {category.name}
                      </h3>
                      <p className="text-xs text-gray-500">
                        {category.subcategories.filter(sub => selectedSubcategories.includes(sub)).length} / {category.subcategories.length} 선택
                      </p>
                    </div>
                    <div className={cn(
                      "flex h-6 w-6 items-center justify-center rounded-full transition-all",
                      isFullySelected
                        ? "bg-brand text-white"
                        : isPartiallySelected
                        ? "bg-brand-accent text-white"
                        : "bg-gray-200"
                    )}>
                      {(isFullySelected || isPartiallySelected) && <Check size={14} />}
                    </div>
                  </button>

                  {/* Subcategories - Always visible */}
                  <div className="border-t border-gray-100 bg-gray-50/50 p-3">
                    <div className="flex flex-wrap gap-2">
                      {category.subcategories.map((sub) => {
                        const isSelected = selectedSubcategories.includes(sub)
                        return (
                          <button
                            key={sub}
                            onClick={() => toggleSubcategory(category.id, sub)}
                            className={cn(
                              "rounded-full px-3 py-1.5 text-sm font-medium transition-all",
                              isSelected
                                ? "bg-brand text-white shadow-md"
                                : "bg-white text-gray-600 border border-gray-200 hover:border-brand hover:text-brand"
                            )}
                          >
                            {sub}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Step 1: Book Selection */}
        {step === 1 && (
          <div>
            <div className="mb-6 flex items-center justify-center gap-4">
              <div className="flex items-center gap-2 rounded-full bg-brand/10 px-4 py-2">
                <span className="text-2xl font-bold text-brand">{selectedBooks.length}</span>
                <span className="text-sm text-brand">/ 10권 선택</span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-6">
              {recommendedBooks.map((book) => {
                const isSelected = selectedBooks.includes(book.id)
                return (
                  <button
                    key={book.id}
                    onClick={() => toggleBook(book.id)}
                    className={cn(
                      "group relative overflow-hidden rounded-2xl transition-all duration-300",
                      isSelected
                        ? "ring-4 ring-brand ring-offset-2 scale-105 shadow-xl"
                        : "hover:scale-105 hover:shadow-lg"
                    )}
                  >
                    <div className="aspect-[2/3] w-full">
                      <img
                        src={book.cover}
                        alt={book.title}
                        className="h-full w-full object-cover"
                        crossOrigin="anonymous"
                      />
                    </div>
                    {/* Selection Overlay */}
                    <div className={cn(
                      "absolute inset-0 flex items-center justify-center transition-all duration-300",
                      isSelected
                        ? "bg-brand/60"
                        : "bg-black/0 group-hover:bg-black/30"
                    )}>
                      {isSelected && (
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-lg">
                          <Check size={24} className="text-brand" />
                        </div>
                      )}
                    </div>
                    {/* Book Info */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-3 pt-8">
                      <p className="line-clamp-1 text-xs font-bold text-white">{book.title}</p>
                      <p className="line-clamp-1 text-[10px] text-white/70">{book.author}</p>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Step 2: Reading Style */}
        {step === 2 && (
          <div className="mx-auto max-w-2xl grid gap-4 sm:grid-cols-3">
            {readingStyles.map((style) => {
              const Icon = style.icon
              const isSelected = readingStyle === style.id
              return (
                <button
                  key={style.id}
                  onClick={() => setReadingStyle(style.id)}
                  className={cn(
                    "relative flex flex-col items-center gap-4 rounded-3xl p-6 transition-all duration-300",
                    isSelected
                      ? "bg-brand text-white shadow-xl shadow-brand/30 scale-105"
                      : "bg-white text-gray-700 border-2 border-gray-200 hover:border-brand hover:shadow-lg"
                  )}
                >
                  <span className="text-4xl">{style.emoji}</span>
                  <div className={cn(
                    "flex h-14 w-14 items-center justify-center rounded-full transition-all",
                    isSelected ? "bg-white/20" : "bg-gray-100"
                  )}>
                    <Icon size={28} className={isSelected ? "text-white" : "text-gray-500"} />
                  </div>
                  <div className="text-center">
                    <h3 className="font-bold">{style.label}</h3>
                    <p className={cn(
                      "mt-1 text-sm",
                      isSelected ? "text-white/80" : "text-gray-500"
                    )}>{style.description}</p>
                  </div>
                  {isSelected && (
                    <div className="absolute top-4 right-4 flex h-6 w-6 items-center justify-center rounded-full bg-white">
                      <Check size={14} className="text-brand" />
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        )}

      </main>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 border-t border-gray-200 bg-white/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          {step > 0 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="flex items-center gap-2 rounded-full px-5 py-3 text-sm font-medium text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
            >
              <ChevronLeft size={18} />
              이전
            </button>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-2">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div
                key={i}
                className={cn(
                  "h-2 rounded-full transition-all",
                  i === step
                    ? "w-8 bg-brand"
                    : i < step
                    ? "w-2 bg-brand-accent"
                    : "w-2 bg-gray-300"
                )}
              />
            ))}
          </div>

          {step < totalSteps - 1 ? (
            <button
              onClick={() => setStep(step + 1)}
              disabled={!canProceed()}
              className={cn(
                "flex items-center gap-2 rounded-full px-6 py-3 text-sm font-bold transition-all",
                canProceed()
                  ? "bg-brand text-white hover:bg-brand-dark shadow-lg"
                  : "cursor-not-allowed bg-gray-200 text-gray-400"
              )}
            >
              다음
              <ChevronRight size={18} />
            </button>
          ) : (
            <button
              onClick={handleComplete}
              disabled={!canProceed()}
              className={cn(
                "flex items-center gap-2 rounded-full px-6 py-3 text-sm font-bold transition-all",
                canProceed()
                  ? "bg-gradient-to-r from-brand to-brand-accent text-white shadow-lg shadow-brand/30 hover:shadow-brand/50"
                  : "cursor-not-allowed bg-gray-200 text-gray-400"
              )}
            >
              <Sparkles size={18} />
              시작하기
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
