"use client"

import { useState, useMemo } from "react"
import { Plus, ChevronDown } from "lucide-react"
import { useRouter } from "next/navigation"
import { PageHeader } from "@/components/shared/page-header"
import { SearchBar } from "@/components/shared/search-bar"
import { ReviewCard } from "@/components/shared/review-card"
import { PaginationNav } from "@/components/shared/pagination-nav"
import { reviews } from "@/lib/mock-data"

const programOptions = [
  { id: "all", label: "전체" },
  { id: "free", label: "자유 서평" },
  { id: "dokto", label: "독토 프로그램" },
  { id: "classic100", label: "고전100선" },
]

const PAGE_SIZE = 6

export default function Reviews() {
  const router = useRouter()
  const [selectedProgram, setSelectedProgram] = useState("all")
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    let result = [...reviews]

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
  }, [selectedProgram, search])

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const selectedLabel = programOptions.find(p => p.id === selectedProgram)?.label || "전체"

  return (
    <div className="flex flex-col gap-4 pb-6">
      <PageHeader
        title="독서리뷰(서평)"
        description={`총 ${filtered.length}개의 리뷰`}
        action={
          <button
            onClick={() => router.push("/reviews/write")}
            className="flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-md transition-all hover:shadow-lg hover:brightness-110"
          >
            <Plus size={14} />
            글쓰기
          </button>
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
      </div>

      {/* Review Cards */}
      <div className="grid grid-cols-1 gap-0 sm:grid-cols-2">
        {paged.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
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
    </div>
  )
}
