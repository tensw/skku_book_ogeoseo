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
  X,
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
    color: "from-rose-500 to-pink-600",
    subcategories: ["소설", "시/에세이", "고전문학", "SF/판타지", "미스터리/스릴러", "외국문학(원서)"],
  },
  {
    id: "humanities",
    name: "인문/교양",
    icon: Brain,
    color: "from-violet-500 to-purple-600",
    subcategories: ["철학", "역사", "심리학", "언어학", "문화비평", "신화/종교"],
  },
  {
    id: "society",
    name: "사회/시사",
    icon: Landmark,
    color: "from-blue-500 to-indigo-600",
    subcategories: ["사회학", "정치", "법", "젠더/페미니즘", "미디어/저널리즘", "국제관계"],
  },
  {
    id: "business",
    name: "경영/경제",
    icon: Briefcase,
    color: "from-amber-500 to-orange-600",
    subcategories: ["경영전략", "마케팅", "창업/스타트업", "재테크/투자", "경제학", "리더십"],
  },
  {
    id: "science",
    name: "과학/기술",
    icon: Cpu,
    color: "from-cyan-500 to-teal-600",
    subcategories: ["자연과학", "수학", "IT/컴퓨터", "인공지능/데이터", "공학", "환경/생태"],
  },
  {
    id: "art",
    name: "예술/문화",
    icon: Palette,
    color: "from-fuchsia-500 to-pink-600",
    subcategories: ["미술", "음악", "영화/미디어", "건축", "디자인", "사진"],
  },
  {
    id: "selfdev",
    name: "자기계발/라이프",
    icon: Heart,
    color: "from-emerald-500 to-green-600",
    subcategories: ["자기계발", "습관/생산성", "진로/커리어", "관계/소통", "글쓰기", "여행"],
  },
  {
    id: "academic",
    name: "학술/전공심화",
    icon: GraduationCap,
    color: "from-slate-500 to-gray-600",
    subcategories: ["논문/학술서", "교양필독서", "고전(그리스·동양)", "통계/연구방법론"],
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
  { id: 8, title: "클린 코드", author: "로버트 C. 마틴", cover: "https://picsum.photos/seed/book8/200/300", category: "science" },
  { id: 9, title: "미드나이트 라이브러리", author: "매트 헤이그", cover: "https://picsum.photos/seed/book9/200/300", category: "literature" },
  { id: 10, title: "생각에 관한 생각", author: "대니얼 카너먼", cover: "https://picsum.photos/seed/book10/200/300", category: "humanities" },
  { id: 11, title: "아주 작은 습관의 힘", author: "제임스 클리어", cover: "https://picsum.photos/seed/book11/200/300", category: "selfdev" },
  { id: 12, title: "총, 균, 쇠", author: "재레드 다이아몬드", cover: "https://picsum.photos/seed/book12/200/300", category: "humanities" },
]

const readingStyles = [
  { id: "alone", label: "혼자 읽고 기록하기", icon: User, description: "조용히 나만의 독서를 즐겨요" },
  { id: "together", label: "같이 이야기하기", icon: Users, description: "함께 토론하며 생각을 나눠요" },
  { id: "both", label: "상관없음", icon: BookOpen, description: "둘 다 좋아요!" },
]

const readingFrequencies = [
  { id: "heavy", label: "한 달에 3권 이상", emoji: "📚" },
  { id: "medium", label: "한 달에 1권 이상", emoji: "📖" },
  { id: "light", label: "1년에 1~5권", emoji: "📕" },
  { id: "unknown", label: "잘 모르겠어요", emoji: "🤔" },
]

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [nickname, setNickname] = useState("")

  // 온보딩 데이터
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>([])
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null)
  const [selectedBooks, setSelectedBooks] = useState<number[]>([])
  const [readingStyle, setReadingStyle] = useState<string | null>(null)
  const [readingFrequency, setReadingFrequency] = useState<string | null>(null)

  useEffect(() => {
    // localStorage에서 닉네임 가져오기
    const savedNickname = localStorage.getItem("ogeoseo_nickname")
    if (savedNickname) {
      setNickname(savedNickname)
    }
  }, [])

  const totalSteps = 4
  const progress = ((step + 1) / totalSteps) * 100

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    )
  }

  const toggleSubcategory = (subcategory: string) => {
    setSelectedSubcategories(prev =>
      prev.includes(subcategory)
        ? prev.filter(s => s !== subcategory)
        : [...prev, subcategory]
    )
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
    // 온보딩 데이터 저장
    localStorage.setItem("ogeoseo_onboarding_complete", "true")
    localStorage.setItem("ogeoseo_preferences", JSON.stringify({
      categories: selectedCategories,
      subcategories: selectedSubcategories,
      books: selectedBooks,
      readingStyle,
      readingFrequency,
    }))
    router.push("/")
  }

  const handleSkip = () => {
    localStorage.setItem("ogeoseo_onboarding_complete", "true")
    router.push("/")
  }

  const canProceed = () => {
    switch (step) {
      case 0: return selectedCategories.length > 0 || selectedSubcategories.length > 0
      case 1: return selectedBooks.length >= 1
      case 2: return readingStyle !== null
      case 3: return readingFrequency !== null
      default: return true
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#064E3B] via-[#065F46] to-[#047857]">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#064E3B]/80 backdrop-blur-xl border-b border-white/10">
        <div className="mx-auto max-w-4xl px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
                <Sparkles size={20} className="text-emerald-300" />
              </div>
              <div>
                <h1 className="font-serif text-lg font-bold text-white">오거서</h1>
                <p className="text-[10px] text-emerald-200/70">맞춤 설정</p>
              </div>
            </div>
            <button
              onClick={handleSkip}
              className="rounded-full px-4 py-2 text-sm font-medium text-white/70 transition-colors hover:bg-white/10 hover:text-white"
            >
              건너뛰기
            </button>
          </div>

          {/* Progress bar */}
          <div className="mt-4 h-1 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-teal-300 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="mt-2 flex justify-between text-xs text-emerald-200/60">
            <span>Step {step + 1} / {totalSteps}</span>
            <span>{Math.round(progress)}% 완료</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-4xl px-6 pb-32 pt-36">
        {/* Welcome Message */}
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            안녕하세요 <span className="text-emerald-300">{nickname}</span>님,
          </h2>
          <p className="mt-2 text-emerald-100/80">
            {step === 0 && "취향에 맞는 독서 모임과 책을 추천해드리기 위해, 관심 분야를 선택해주세요!"}
            {step === 1 && "읽고 싶은 책을 선택해주세요. (1권 이상 10권 이하)"}
            {step === 2 && "선호하는 독서 스타일을 알려주세요."}
            {step === 3 && "독서 횟수는 어느 정도인가요?"}
          </p>
        </div>

        {/* Step 0: Category Selection */}
        {step === 0 && (
          <div className="space-y-4">
            {categories.map((category) => {
              const Icon = category.icon
              const isSelected = selectedCategories.includes(category.id)
              const isExpanded = expandedCategory === category.id
              const hasSelectedSubs = category.subcategories.some(sub => selectedSubcategories.includes(sub))

              return (
                <div key={category.id} className="overflow-hidden rounded-2xl bg-white/5 backdrop-blur-sm">
                  {/* Category Header */}
                  <button
                    onClick={() => {
                      toggleCategory(category.id)
                      setExpandedCategory(isExpanded ? null : category.id)
                    }}
                    className={cn(
                      "flex w-full items-center gap-4 p-4 transition-all",
                      (isSelected || hasSelectedSubs) && "bg-white/10"
                    )}
                  >
                    <div className={cn(
                      "flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br",
                      category.color
                    )}>
                      <Icon size={24} className="text-white" />
                    </div>
                    <div className="flex-1 text-left">
                      <h3 className="font-bold text-white">{category.name}</h3>
                      <p className="text-xs text-white/50">{category.subcategories.length}개 세부 분야</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {(isSelected || hasSelectedSubs) && (
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500">
                          <Check size={14} className="text-white" />
                        </div>
                      )}
                      <ChevronRight
                        size={20}
                        className={cn(
                          "text-white/50 transition-transform",
                          isExpanded && "rotate-90"
                        )}
                      />
                    </div>
                  </button>

                  {/* Subcategories */}
                  {isExpanded && (
                    <div className="border-t border-white/10 bg-white/5 p-4">
                      <div className="flex flex-wrap gap-2">
                        {category.subcategories.map((sub) => (
                          <button
                            key={sub}
                            onClick={() => toggleSubcategory(sub)}
                            className={cn(
                              "rounded-full px-4 py-2 text-sm font-medium transition-all",
                              selectedSubcategories.includes(sub)
                                ? "bg-emerald-500 text-white"
                                : "bg-white/10 text-white/70 hover:bg-white/20 hover:text-white"
                            )}
                          >
                            {sub}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {/* Step 1: Book Selection */}
        {step === 1 && (
          <div>
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm text-emerald-200/70">
                {selectedBooks.length}권 선택됨
              </span>
              <span className="text-sm text-emerald-200/70">
                최대 10권
              </span>
            </div>
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
              {recommendedBooks.map((book) => {
                const isSelected = selectedBooks.includes(book.id)
                return (
                  <button
                    key={book.id}
                    onClick={() => toggleBook(book.id)}
                    className={cn(
                      "group relative overflow-hidden rounded-xl transition-all",
                      isSelected
                        ? "ring-2 ring-emerald-400 ring-offset-2 ring-offset-[#064E3B]"
                        : "hover:scale-105"
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
                    {/* Overlay */}
                    <div className={cn(
                      "absolute inset-0 flex items-center justify-center bg-black/50 transition-opacity",
                      isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                    )}>
                      {isSelected ? (
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500">
                          <Check size={20} className="text-white" />
                        </div>
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
                          <BookOpen size={20} className="text-white" />
                        </div>
                      )}
                    </div>
                    {/* Book Info */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                      <p className="line-clamp-1 text-[10px] font-bold text-white">{book.title}</p>
                      <p className="line-clamp-1 text-[9px] text-white/70">{book.author}</p>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Step 2: Reading Style */}
        {step === 2 && (
          <div className="grid gap-4 sm:grid-cols-3">
            {readingStyles.map((style) => {
              const Icon = style.icon
              const isSelected = readingStyle === style.id
              return (
                <button
                  key={style.id}
                  onClick={() => setReadingStyle(style.id)}
                  className={cn(
                    "flex flex-col items-center gap-4 rounded-2xl p-6 transition-all",
                    isSelected
                      ? "bg-emerald-500 text-white"
                      : "bg-white/5 text-white hover:bg-white/10"
                  )}
                >
                  <div className={cn(
                    "flex h-16 w-16 items-center justify-center rounded-full",
                    isSelected ? "bg-white/20" : "bg-white/10"
                  )}>
                    <Icon size={32} />
                  </div>
                  <div className="text-center">
                    <h3 className="font-bold">{style.label}</h3>
                    <p className={cn(
                      "mt-1 text-sm",
                      isSelected ? "text-white/80" : "text-white/50"
                    )}>{style.description}</p>
                  </div>
                  {isSelected && (
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white">
                      <Check size={14} className="text-emerald-500" />
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        )}

        {/* Step 3: Reading Frequency */}
        {step === 3 && (
          <div className="grid gap-3 sm:grid-cols-2">
            {readingFrequencies.map((freq) => {
              const isSelected = readingFrequency === freq.id
              return (
                <button
                  key={freq.id}
                  onClick={() => setReadingFrequency(freq.id)}
                  className={cn(
                    "flex items-center gap-4 rounded-2xl p-5 transition-all",
                    isSelected
                      ? "bg-emerald-500 text-white"
                      : "bg-white/5 text-white hover:bg-white/10"
                  )}
                >
                  <span className="text-3xl">{freq.emoji}</span>
                  <span className="flex-1 text-left font-bold">{freq.label}</span>
                  {isSelected && (
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white">
                      <Check size={14} className="text-emerald-500" />
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 border-t border-white/10 bg-[#064E3B]/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          {step > 0 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="flex items-center gap-2 rounded-full px-5 py-3 text-sm font-medium text-white/70 transition-colors hover:bg-white/10 hover:text-white"
            >
              <ChevronLeft size={18} />
              이전
            </button>
          ) : (
            <div />
          )}

          {step < totalSteps - 1 ? (
            <button
              onClick={() => setStep(step + 1)}
              disabled={!canProceed()}
              className={cn(
                "flex items-center gap-2 rounded-full px-6 py-3 text-sm font-bold transition-all",
                canProceed()
                  ? "bg-white text-[#064E3B] hover:bg-emerald-100"
                  : "cursor-not-allowed bg-white/20 text-white/50"
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
                  ? "bg-gradient-to-r from-emerald-400 to-teal-400 text-white shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50"
                  : "cursor-not-allowed bg-white/20 text-white/50"
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
