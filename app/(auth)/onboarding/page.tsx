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

const readingFrequencies = [
  { id: "heavy", label: "한 달에 3권 이상", emoji: "📚", description: "열정적인 독서가" },
  { id: "medium", label: "한 달에 1권 이상", emoji: "📖", description: "꾸준한 독서가" },
  { id: "light", label: "1년에 1~5권", emoji: "📕", description: "가끔 읽는 편" },
  { id: "unknown", label: "잘 모르겠어요", emoji: "🤔", description: "이제 시작해볼게요" },
]

// 완료 메시지 컴포넌트
function CompletionMessage({ onComplete }: { onComplete: () => void }) {
  const message = "이제 자유롭게 오거서를 탐험해보세요!"
  const [visibleChars, setVisibleChars] = useState(0)
  const [showMessage, setShowMessage] = useState(true)

  useEffect(() => {
    if (visibleChars < message.length) {
      const timer = setTimeout(() => {
        setVisibleChars(prev => prev + 1)
      }, 80)
      return () => clearTimeout(timer)
    } else {
      // 메시지 완료 후 2초 대기
      const timer = setTimeout(() => {
        setShowMessage(false)
        setTimeout(onComplete, 500)
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [visibleChars, message.length, onComplete])

  return (
    <div className={cn(
      "fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-[#064E3B] via-[#065F46] to-[#047857] transition-opacity duration-500",
      showMessage ? "opacity-100" : "opacity-0"
    )}>
      <div className="text-center px-8">
        <div className="mb-8">
          <Sparkles size={64} className="mx-auto text-emerald-300 animate-pulse" />
        </div>
        <h2 className="text-3xl font-bold text-white sm:text-4xl">
          {message.split("").map((char, index) => (
            <span
              key={index}
              className={cn(
                "inline-block transition-all duration-300",
                index < visibleChars
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              )}
              style={{ transitionDelay: `${index * 30}ms` }}
            >
              {char === " " ? "\u00A0" : char}
            </span>
          ))}
        </h2>
        <div className="mt-8 flex justify-center gap-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="h-2 w-2 rounded-full bg-emerald-400 animate-bounce"
              style={{ animationDelay: `${i * 150}ms` }}
            />
          ))}
        </div>
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
  const [readingFrequency, setReadingFrequency] = useState<string | null>(null)

  useEffect(() => {
    const savedNickname = localStorage.getItem("ogeoseo_nickname")
    if (savedNickname) {
      setNickname(savedNickname)
    }
  }, [])

  const totalSteps = 4
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
      readingFrequency,
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
      case 3: return readingFrequency !== null
      default: return true
    }
  }

  if (showCompletion) {
    return <CompletionMessage onComplete={() => router.push("/")} />
  }

  return (
    <div className="min-h-screen bg-[#FAFBFC]">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-b border-gray-100 shadow-sm">
        <div className="mx-auto max-w-5xl px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#064E3B] to-[#059669]">
                <BookOpen size={20} className="text-white" />
              </div>
              <div>
                <h1 className="font-serif text-lg font-bold text-gray-900">오거서</h1>
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
              className="h-full rounded-full bg-gradient-to-r from-[#064E3B] to-[#10B981] transition-all duration-500"
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
                <span className="text-[#064E3B]">{nickname}</span>님, 관심 분야를 선택해주세요
              </>
            )}
            {step === 1 && "읽고 싶은 책을 골라주세요"}
            {step === 2 && "선호하는 독서 스타일은?"}
            {step === 3 && "독서는 얼마나 자주 하시나요?"}
          </h2>
          <p className="mt-2 text-gray-500">
            {step === 0 && "대분류를 선택하면 세부 분야가 모두 선택돼요"}
            {step === 1 && "1권 이상 10권 이하로 선택해주세요"}
            {step === 2 && "맞춤 독서 모임을 추천해드릴게요"}
            {step === 3 && "부담 없이 선택해주세요"}
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
                      ? "border-[#064E3B] bg-[#064E3B]/5 shadow-lg shadow-[#064E3B]/10"
                      : isPartiallySelected
                      ? "border-[#10B981] bg-[#10B981]/5"
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
                        ? "bg-[#064E3B] text-white"
                        : isPartiallySelected
                        ? "bg-[#10B981] text-white"
                        : "bg-gray-100 text-gray-500"
                    )}>
                      <Icon size={24} />
                    </div>
                    <div className="flex-1 text-left">
                      <h3 className={cn(
                        "font-bold",
                        isFullySelected || isPartiallySelected ? "text-[#064E3B]" : "text-gray-900"
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
                        ? "bg-[#064E3B] text-white"
                        : isPartiallySelected
                        ? "bg-[#10B981] text-white"
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
                                ? "bg-[#064E3B] text-white shadow-md"
                                : "bg-white text-gray-600 border border-gray-200 hover:border-[#064E3B] hover:text-[#064E3B]"
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
              <div className="flex items-center gap-2 rounded-full bg-[#064E3B]/10 px-4 py-2">
                <span className="text-2xl font-bold text-[#064E3B]">{selectedBooks.length}</span>
                <span className="text-sm text-[#064E3B]">/ 10권 선택</span>
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
                        ? "ring-4 ring-[#064E3B] ring-offset-2 scale-105 shadow-xl"
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
                        ? "bg-[#064E3B]/60"
                        : "bg-black/0 group-hover:bg-black/30"
                    )}>
                      {isSelected && (
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-lg">
                          <Check size={24} className="text-[#064E3B]" />
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
                      ? "bg-[#064E3B] text-white shadow-xl shadow-[#064E3B]/30 scale-105"
                      : "bg-white text-gray-700 border-2 border-gray-200 hover:border-[#064E3B] hover:shadow-lg"
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
                      <Check size={14} className="text-[#064E3B]" />
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        )}

        {/* Step 3: Reading Frequency */}
        {step === 3 && (
          <div className="mx-auto max-w-xl grid gap-3 sm:grid-cols-2">
            {readingFrequencies.map((freq) => {
              const isSelected = readingFrequency === freq.id
              return (
                <button
                  key={freq.id}
                  onClick={() => setReadingFrequency(freq.id)}
                  className={cn(
                    "relative flex items-center gap-4 rounded-2xl p-5 transition-all duration-300",
                    isSelected
                      ? "bg-[#064E3B] text-white shadow-xl shadow-[#064E3B]/30 scale-105"
                      : "bg-white text-gray-700 border-2 border-gray-200 hover:border-[#064E3B] hover:shadow-lg"
                  )}
                >
                  <span className="text-3xl">{freq.emoji}</span>
                  <div className="flex-1 text-left">
                    <span className="font-bold">{freq.label}</span>
                    <p className={cn(
                      "text-sm",
                      isSelected ? "text-white/70" : "text-gray-500"
                    )}>{freq.description}</p>
                  </div>
                  {isSelected && (
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white">
                      <Check size={14} className="text-[#064E3B]" />
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
                    ? "w-8 bg-[#064E3B]"
                    : i < step
                    ? "w-2 bg-[#10B981]"
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
                  ? "bg-[#064E3B] text-white hover:bg-[#065F46] shadow-lg"
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
                  ? "bg-gradient-to-r from-[#064E3B] to-[#10B981] text-white shadow-lg shadow-[#064E3B]/30 hover:shadow-[#064E3B]/50"
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
