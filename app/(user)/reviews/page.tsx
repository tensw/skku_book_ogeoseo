"use client"

import { useState, useMemo } from "react"
import { Plus, ChevronDown, FileDown, Trash2, EyeOff, Eye, X } from "lucide-react"
import { useRouter } from "next/navigation"
import { PageHeader } from "@/components/shared/page-header"
import { SearchBar } from "@/components/shared/search-bar"
import { ReviewCard } from "@/components/shared/review-card"
import { PaginationNav } from "@/components/shared/pagination-nav"
import { reviews as initialReviews } from "@/lib/mock-data"
import { useAuth } from "@/lib/auth-context"

const programOptions = [
  { id: "all", label: "전체" },
  { id: "free", label: "자유 서평" },
  { id: "dokto", label: "독토 프로그램" },
  { id: "classic100", label: "고전100선" },
]

const PAGE_SIZE = 6

export default function Reviews() {
  const router = useRouter()
  const { isAdmin } = useAuth()
  const [selectedProgram, setSelectedProgram] = useState("all")
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [reviewList, setReviewList] = useState(initialReviews)
  const [hiddenReviews, setHiddenReviews] = useState<number[]>([])
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null)
  const [showHidden, setShowHidden] = useState(false)

  const filtered = useMemo(() => {
    let result = [...reviewList]

    // Filter hidden reviews for non-admin or when not showing hidden
    if (!isAdmin || !showHidden) {
      result = result.filter((r) => !hiddenReviews.includes(r.id))
    }

    // Filter by program type
    if (selectedProgram === "free") {
      result = result.filter((r) => r.type === "ogeoseo")
    } else if (selectedProgram === "dokto") {
      result = result.filter((r) => r.type === "program" && r.program?.includes("독서 마라톤"))
    } else if (selectedProgram === "classic100") {
      result = result.filter((r) => r.type === "program" && r.program?.includes("멘토링"))
    }

    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(
        (r) =>
          r.book.title.toLowerCase().includes(q) ||
          r.user.name.toLowerCase().includes(q) ||
          r.text.toLowerCase().includes(q)
      )
    }
    return result
  }, [selectedProgram, search, reviewList, hiddenReviews, isAdmin, showHidden])

  const handleToggleHidden = (reviewId: number) => {
    setHiddenReviews((prev) =>
      prev.includes(reviewId) ? prev.filter((id) => id !== reviewId) : [...prev, reviewId]
    )
  }

  const handleDelete = (reviewId: number) => {
    setDeleteConfirm(reviewId)
  }

  const confirmDelete = () => {
    if (deleteConfirm) {
      setReviewList(reviewList.filter((r) => r.id !== deleteConfirm))
      setDeleteConfirm(null)
    }
  }

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const selectedLabel = programOptions.find(p => p.id === selectedProgram)?.label || "전체"

  return (
    <div className="flex flex-col gap-4 pb-6">
      <PageHeader
        title="독서리뷰(서평)"
        description={`총 ${filtered.length}개의 리뷰`}
        action={
          <div className="flex items-center gap-2">
            {isAdmin && (
              <button
                onClick={() => router.push("/reviews/export")}
                className="flex items-center gap-1.5 rounded-full bg-amber-500 px-4 py-2 text-xs font-semibold text-white shadow-md transition-all hover:shadow-lg hover:brightness-110"
              >
                <FileDown size={14} />
                데이터 추출
              </button>
            )}
            <button
              onClick={() => router.push("/reviews/write")}
              className="flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-md transition-all hover:shadow-lg hover:brightness-110"
            >
              <Plus size={14} />
              글쓰기
            </button>
          </div>
        }
      />

      <div className="flex flex-col gap-3 px-5 sm:px-8">
        {/* Program Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center justify-between w-full rounded-xl border border-border bg-card px-4 py-3 text-sm font-medium text-foreground shadow-sm transition-all hover:border-primary/50"
          >
            <span>프로그램: {selectedLabel}</span>
            <ChevronDown
              size={16}
              className={`text-muted-foreground transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
            />
          </button>

          {isDropdownOpen && (
            <div className="absolute top-full left-0 right-0 z-50 mt-1 overflow-hidden rounded-xl border border-border bg-card shadow-lg">
              {programOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => {
                    setSelectedProgram(option.id)
                    setIsDropdownOpen(false)
                    setPage(1)
                  }}
                  className={`w-full px-4 py-3 text-left text-sm transition-colors hover:bg-muted ${
                    selectedProgram === option.id
                      ? 'bg-primary/10 font-semibold text-primary'
                      : 'text-foreground'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <SearchBar
          value={search}
          onChange={(v) => {
            setSearch(v)
            setPage(1)
          }}
          placeholder="리뷰 검색..."
        />

        {isAdmin && (
          <button
            onClick={() => setShowHidden(!showHidden)}
            className={`flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-medium transition-colors ${
              showHidden
                ? "border-amber-300 bg-amber-50 text-amber-700"
                : "border-border bg-card text-muted-foreground hover:bg-muted"
            }`}
          >
            {showHidden ? <Eye size={14} /> : <EyeOff size={14} />}
            {showHidden ? "숨긴 리뷰 표시 중" : "숨긴 리뷰 보기"}
            {hiddenReviews.length > 0 && (
              <span className="rounded-full bg-amber-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
                {hiddenReviews.length}
              </span>
            )}
          </button>
        )}
      </div>

      {/* Review Cards */}
      <div className="grid grid-cols-1 gap-0 sm:grid-cols-2">
        {paged.map((review) => {
          const isHidden = hiddenReviews.includes(review.id)
          return (
            <div key={review.id} className={`relative ${isHidden ? "opacity-50" : ""}`}>
              <ReviewCard review={review} />
              {isAdmin && (
                <div className="absolute right-3 top-3 flex gap-1">
                  <button
                    onClick={() => handleToggleHidden(review.id)}
                    className={`flex h-7 w-7 items-center justify-center rounded-full shadow-md backdrop-blur-sm transition-colors ${
                      isHidden
                        ? "bg-amber-100 text-amber-600 hover:bg-amber-200"
                        : "bg-card/90 text-muted-foreground hover:bg-amber-100 hover:text-amber-600"
                    }`}
                    title={isHidden ? "숨김 해제" : "숨기기"}
                  >
                    {isHidden ? <Eye size={12} /> : <EyeOff size={12} />}
                  </button>
                  <button
                    onClick={() => handleDelete(review.id)}
                    className="flex h-7 w-7 items-center justify-center rounded-full bg-card/90 text-muted-foreground shadow-md backdrop-blur-sm transition-colors hover:bg-red-100 hover:text-red-500"
                    title="삭제"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {paged.length === 0 && (
        <p className="py-12 text-center text-sm text-muted-foreground">
          리뷰가 없습니다.
        </p>
      )}

      <PaginationNav
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
        className="mt-2"
      />

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-foreground/50 p-4 backdrop-blur-sm"
          onClick={() => setDeleteConfirm(null)}
        >
          <div
            className="w-full max-w-sm overflow-hidden rounded-2xl border border-border bg-card shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-6 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                <Trash2 size={24} className="text-red-500" />
              </div>
              <h3 className="text-lg font-bold text-foreground">리뷰 삭제</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                정말 이 리뷰를 삭제하시겠습니까?<br />
                이 작업은 되돌릴 수 없습니다.
              </p>
            </div>
            <div className="flex gap-3 border-t border-border bg-muted/30 px-6 py-4">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 rounded-xl border border-border bg-card py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
              >
                취소
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 rounded-xl bg-red-500 py-2.5 text-sm font-bold text-white transition-all hover:bg-red-600"
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
