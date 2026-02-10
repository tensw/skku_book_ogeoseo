"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  BookOpen,
  FileText,
  Tag,
  PenTool,
  Award,
  ChevronLeft,
  ChevronRight,
  Check,
  Search,
  Star,
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
  ChevronDown,
} from "lucide-react"
import { cn } from "@/lib/utils"

// Sample books for selection
const sampleBooks = [
  { id: 1, title: "아무튼, 메모", author: "김신회", cover: "https://picsum.photos/seed/book-memo/100/140" },
  { id: 2, title: "사피엔스: 인류의 역사", author: "유발 하라리", cover: "https://picsum.photos/seed/book-sapiens/100/140" },
  { id: 3, title: "아주 작은 습관의 힘", author: "제임스 클리어", cover: "https://picsum.photos/seed/book-atomic/100/140" },
  { id: 4, title: "미드나이트 라이브러리", author: "매트 헤이그", cover: "https://picsum.photos/seed/book-midnight/100/140" },
  { id: 5, title: "생각에 관한 생각", author: "대니얼 카너먼", cover: "https://picsum.photos/seed/book-thinking/100/140" },
  { id: 6, title: "1984", author: "조지 오웰", cover: "https://picsum.photos/seed/book-1984/100/140" },
]

// Program options
const programOptions = [
  { id: "free", label: "자유 서평" },
  { id: "dokto", label: "독토 프로그램" },
  { id: "classic100", label: "고전 100선" },
]

// KDC Badge Categories
const kdcCategories = [
  { id: "000", label: "총류", icon: Key },
  { id: "100", label: "철학", icon: Brain },
  { id: "200", label: "종교", icon: Church },
  { id: "300", label: "사회과학", icon: Scale },
  { id: "400", label: "자연과학", icon: Leaf },
  { id: "500", label: "기술과학", icon: Cpu },
  { id: "600", label: "예술", icon: Palette },
  { id: "700", label: "언어", icon: Languages },
  { id: "800", label: "문학", icon: BookMarked },
  { id: "900", label: "역사", icon: Landmark },
]

const steps = [
  { id: 1, label: "도서 선택", icon: BookOpen },
  { id: 2, label: "프로그램 선택", icon: FileText },
  { id: 3, label: "뱃지 선택", icon: Tag },
  { id: 4, label: "서평 작성", icon: PenTool },
  { id: 5, label: "스탬프 획득", icon: Award },
]

// Ginkgo Leaf SVG Component
function GinkgoLeaf({ className, filled = false }: { className?: string; filled?: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M12 2C12 2 8 6 8 12C8 16 10 20 12 22C14 20 16 16 16 12C16 6 12 2 12 2Z" />
      <path d="M12 2C12 2 6 8 6 14C6 18 9 21 12 22" />
      <path d="M12 2C12 2 18 8 18 14C18 18 15 21 12 22" />
      <line x1="12" y1="22" x2="12" y2="24" strokeLinecap="round" />
    </svg>
  )
}

export default function WriteReview() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedBook, setSelectedBook] = useState<typeof sampleBooks[0] | null>(null)
  const [selectedProgram, setSelectedProgram] = useState<string | null>(null)
  const [isProgramDropdownOpen, setIsProgramDropdownOpen] = useState(false)
  const [selectedBadge, setSelectedBadge] = useState<string | null>(null)
  const [rating, setRating] = useState(0)
  const [reviewText, setReviewText] = useState("")

  const filteredBooks = sampleBooks.filter(
    (book) =>
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const canProceed = () => {
    if (currentStep === 1) return selectedBook !== null
    if (currentStep === 2) return selectedProgram !== null
    if (currentStep === 3) return selectedBadge !== null
    if (currentStep === 4) return rating > 0 && reviewText.length >= 400
    return true
  }

  const handleNext = () => {
    if (currentStep < 5 && canProceed()) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    } else {
      router.back()
    }
  }

  const selectedBadgeData = kdcCategories.find((c) => c.id === selectedBadge)
  const selectedProgramData = programOptions.find((p) => p.id === selectedProgram)

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur-sm">
        <div className="flex items-center gap-3 px-4 py-4">
          <button
            onClick={handleBack}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-muted transition-colors hover:bg-border"
          >
            <ChevronLeft size={20} />
          </button>
          <div>
            <h1 className="text-lg font-bold text-foreground">서평 작성</h1>
            <p className="text-xs text-muted-foreground">독서 감상을 나누고 스탬프를 획득하세요</p>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-between px-2 pb-4">
          {steps.map((step, index) => {
            const Icon = step.icon
            const isCompleted = currentStep > step.id
            const isCurrent = currentStep === step.id
            return (
              <div key={step.id} className="flex flex-1 items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={cn(
                      "flex h-9 w-9 items-center justify-center rounded-full transition-all",
                      isCompleted
                        ? "bg-primary/20 text-primary"
                        : isCurrent
                        ? "bg-primary text-primary-foreground shadow-lg"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    {isCompleted ? <Check size={16} /> : <Icon size={16} />}
                  </div>
                  <span
                    className={cn(
                      "mt-1 text-[9px] font-medium",
                      isCurrent ? "text-foreground" : "text-muted-foreground"
                    )}
                  >
                    {step.label}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={cn(
                      "mx-0.5 h-0.5 flex-1",
                      currentStep > step.id ? "bg-primary" : "bg-border"
                    )}
                  />
                )}
              </div>
            )
          })}
        </div>
      </header>

      {/* Step Content */}
      <div className="px-5 pt-5 sm:px-8">
        {/* Step 1: Book Selection */}
        {currentStep === 1 && (
          <div className="flex flex-col gap-4">
            <div className="relative">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="도서 검색..."
                className="w-full rounded-xl border border-border bg-card py-3 pl-11 pr-4 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div className="flex flex-col gap-2">
              {filteredBooks.map((book) => (
                <button
                  key={book.id}
                  onClick={() => setSelectedBook(book)}
                  className={cn(
                    "flex items-center gap-4 rounded-2xl border p-3 transition-all",
                    selectedBook?.id === book.id
                      ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                      : "border-border bg-card hover:border-primary/50"
                  )}
                >
                  <div className="h-16 w-12 flex-shrink-0 overflow-hidden rounded-lg">
                    <img
                      src={book.cover}
                      alt={book.title}
                      className="h-full w-full object-cover"
                      crossOrigin="anonymous"
                    />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-semibold text-foreground">{book.title}</p>
                    <p className="text-xs text-muted-foreground">{book.author}</p>
                  </div>
                  {selectedBook?.id === book.id && (
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      <Check size={14} />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Program Selection */}
        {currentStep === 2 && (
          <div className="flex flex-col gap-4">
            <p className="text-sm text-muted-foreground">
              서평을 등록할 프로그램을 선택하세요:
            </p>

            {/* Program Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsProgramDropdownOpen(!isProgramDropdownOpen)}
                className="flex w-full items-center justify-between rounded-xl border border-border bg-card px-4 py-4 text-sm font-medium text-foreground shadow-sm transition-all hover:border-primary/50"
              >
                <span>
                  {selectedProgram
                    ? `프로그램: ${selectedProgramData?.label}`
                    : "프로그램을 선택하세요"}
                </span>
                <ChevronDown
                  size={18}
                  className={cn(
                    "text-muted-foreground transition-transform",
                    isProgramDropdownOpen && "rotate-180"
                  )}
                />
              </button>

              {isProgramDropdownOpen && (
                <div className="absolute top-full left-0 right-0 z-50 mt-1 overflow-hidden rounded-xl border border-border bg-card shadow-lg">
                  {programOptions.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => {
                        setSelectedProgram(option.id)
                        setIsProgramDropdownOpen(false)
                      }}
                      className={cn(
                        "w-full px-4 py-4 text-left text-sm transition-colors hover:bg-muted",
                        selectedProgram === option.id
                          ? "bg-primary/10 font-semibold text-primary"
                          : "text-foreground"
                      )}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Selected Info */}
            {selectedBook && (
              <div className="mt-4 flex items-center gap-3 rounded-2xl bg-muted/50 p-3">
                <div className="h-14 w-10 flex-shrink-0 overflow-hidden rounded-lg">
                  <img
                    src={selectedBook.cover}
                    alt={selectedBook.title}
                    className="h-full w-full object-cover"
                    crossOrigin="anonymous"
                  />
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground">{selectedBook.title}</p>
                  <p className="text-xs text-muted-foreground">{selectedBook.author}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 3: Badge Selection */}
        {currentStep === 3 && (
          <div className="flex flex-col gap-4">
            <p className="text-sm text-muted-foreground">
              읽은 도서에 가장 알맞은 KDC 분류를 선택하세요:
            </p>
            <div className="grid grid-cols-5 gap-3">
              {kdcCategories.map((category) => {
                const Icon = category.icon
                const isSelected = selectedBadge === category.id
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedBadge(category.id)}
                    className="flex flex-col items-center gap-2"
                  >
                    <div
                      className={cn(
                        "flex h-14 w-14 items-center justify-center rounded-full transition-all",
                        isSelected
                          ? "bg-primary text-primary-foreground shadow-lg ring-4 ring-primary/30"
                          : "bg-gradient-to-br from-primary/80 to-primary text-primary-foreground/80 hover:shadow-md"
                      )}
                    >
                      <Icon size={22} />
                    </div>
                    <div className="text-center">
                      <p className="text-[10px] font-bold text-foreground">{category.id}</p>
                      <p className="text-[9px] text-muted-foreground">{category.label}</p>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Step 4: Write Review */}
        {currentStep === 4 && (
          <div className="flex flex-col gap-4">
            {/* Selected Book Card */}
            {selectedBook && (
              <div className="flex items-center gap-3 rounded-2xl bg-muted/50 p-3">
                <div className="h-14 w-10 flex-shrink-0 overflow-hidden rounded-lg">
                  <img
                    src={selectedBook.cover}
                    alt={selectedBook.title}
                    className="h-full w-full object-cover"
                    crossOrigin="anonymous"
                  />
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground">{selectedBook.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {selectedProgramData?.label} · {selectedBadgeData?.label} ({selectedBadge})
                  </p>
                </div>
              </div>
            )}

            {/* Star Rating */}
            <div>
              <p className="mb-2 text-sm font-semibold text-foreground">별점 평가</p>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className="transition-transform hover:scale-110"
                  >
                    <Star
                      size={32}
                      className={cn(
                        star <= rating
                          ? "fill-tangerine text-tangerine"
                          : "text-border"
                      )}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Review Text */}
            <div>
              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="이 도서에 대한 감상을 나눠주세요 (최소 400자)..."
                className="h-40 w-full resize-none rounded-xl border border-border bg-card p-4 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              <div className="mt-1 flex justify-end">
                <span
                  className={cn(
                    "text-xs",
                    reviewText.length >= 400 ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  {reviewText.length}/400
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Stamp Earned */}
        {currentStep === 5 && (
          <div className="flex flex-col items-center gap-6 py-8">
            {/* Ginkgo Leaf Stamp */}
            <div className="relative">
              <div className="flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-primary to-emerald-700 shadow-2xl">
                <GinkgoLeaf className="h-16 w-16 text-white" filled />
              </div>
              <div className="absolute -bottom-2 -right-2 flex h-10 w-10 items-center justify-center rounded-full bg-tangerine text-white shadow-lg">
                {selectedBadgeData && <selectedBadgeData.icon size={20} />}
              </div>
            </div>

            <div className="text-center">
              <h2 className="text-xl font-bold text-foreground">스탬프를 획득했습니다!</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {selectedBadgeData?.label} ({selectedBadge})
              </p>
              <p className="mt-1 text-xs text-primary font-medium">
                {selectedProgramData?.label}
              </p>
              <p className="mt-2 text-xs text-muted-foreground">
                서평이 성공적으로 등록되었습니다.
              </p>
            </div>

            <button
              onClick={() => router.push("/reviews")}
              className="mt-4 rounded-full bg-primary px-8 py-3 text-sm font-bold text-primary-foreground shadow-lg transition-all hover:shadow-xl hover:brightness-110"
            >
              서평 목록으로 돌아가기
            </button>
          </div>
        )}
      </div>

      {/* Bottom Action Button */}
      {currentStep < 5 && (
        <div className="fixed bottom-0 left-0 right-0 border-t border-border bg-card/95 p-4 backdrop-blur-sm">
          <button
            onClick={handleNext}
            disabled={!canProceed()}
            className={cn(
              "flex w-full items-center justify-center gap-2 rounded-full py-4 text-sm font-bold transition-all",
              canProceed()
                ? "bg-primary text-primary-foreground shadow-lg hover:brightness-110"
                : "bg-muted text-muted-foreground"
            )}
          >
            {currentStep === 4 ? "제출 후 스탬프 받기" : "다음"}
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  )
}
