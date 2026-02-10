"use client"

import { useState, useMemo } from "react"
import { Plus } from "lucide-react"
import { PageHeader } from "@/components/shared/page-header"
import { FilterTabs } from "@/components/shared/filter-tabs"
import { SearchBar } from "@/components/shared/search-bar"
import { ReviewCard } from "@/components/shared/review-card"
import { PaginationNav } from "@/components/shared/pagination-nav"
import { reviews } from "@/lib/mock-data"

const tabs = [
  { id: "program", label: "프로그램 후기" },
  { id: "ogeoseo", label: "오거서 후기" },
]

const PAGE_SIZE = 6

export default function Reviews() {
  const [activeTab, setActiveTab] = useState("program")
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    let result = reviews.filter((r) => r.type === activeTab)
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
  }, [activeTab, search])

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  return (
    <div className="flex flex-col gap-4 pb-6">
      <PageHeader
        title="독서리뷰"
        description={`총 ${filtered.length}개의 리뷰`}
        action={
          <button className="flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-md transition-all hover:shadow-lg hover:brightness-110">
            <Plus size={14} />
            글쓰기
          </button>
        }
      />

      <div className="flex flex-col gap-3 px-5 sm:px-8">
        <FilterTabs
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={(id) => {
            setActiveTab(id)
            setPage(1)
          }}
        />
        <SearchBar
          value={search}
          onChange={(v) => {
            setSearch(v)
            setPage(1)
          }}
          placeholder="리뷰 검색..."
        />
      </div>

      {/* Program tab: Card grid / Ogeoseo tab: List view */}
      {activeTab === "program" ? (
        <div className="grid grid-cols-1 gap-0 sm:grid-cols-2">
          {paged.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col">
          {paged.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      )}

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
