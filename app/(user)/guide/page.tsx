"use client"

import { useState, useMemo } from "react"
import { Download } from "lucide-react"
import { PageHeader } from "@/components/shared/page-header"
import { FilterTabs } from "@/components/shared/filter-tabs"
import { SearchBar } from "@/components/shared/search-bar"
import { BookCard } from "@/components/shared/book-card"
import { PaginationNav } from "@/components/shared/pagination-nav"
import { classics } from "@/lib/mock-data"

const categoryTabs = [
  { id: "all", label: "전체" },
  { id: "문학·예술", label: "문학·예술" },
  { id: "인문·사회", label: "인문·사회" },
  { id: "자연과학", label: "자연과학" },
]

const PAGE_SIZE = 8

export default function Guide() {
  const [year, setYear] = useState(2026)
  const [activeTab, setActiveTab] = useState("all")
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    let result = classics
    if (activeTab !== "all") {
      result = result.filter((c) => c.category === activeTab)
    }
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.author.toLowerCase().includes(q)
      )
    }
    return result
  }, [activeTab, search])

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const years = Array.from({ length: 12 }, (_, i) => 2026 - i)

  return (
    <div className="flex flex-col gap-4 pb-6">
      <PageHeader
        title="오거서 도서추천"
        description="성균 고전 100선"
        action={
          <button
            onClick={() => alert("준비 중입니다")}
            className="flex items-center gap-1.5 rounded-full bg-emerald/10 px-4 py-2 text-xs font-semibold text-emerald transition-colors hover:bg-emerald/20"
          >
            <Download size={14} />
            엑셀 다운로드
          </button>
        }
      />

      <div className="flex flex-col gap-3 px-5 sm:px-8">
        {/* Year selector */}
        <select
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          className="w-fit rounded-xl border border-border bg-card px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
        >
          {years.map((y) => (
            <option key={y} value={y}>
              {y}년
            </option>
          ))}
        </select>

        <FilterTabs
          tabs={categoryTabs}
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
          placeholder="도서 검색..."
        />
      </div>

      {/* Book grid */}
      <div className="grid grid-cols-2 gap-3 px-5 sm:grid-cols-3 sm:px-8 lg:grid-cols-4">
        {paged.map((book) => (
          <BookCard
            key={book.id}
            id={book.id}
            title={book.title}
            author={book.author}
            cover={book.cover}
            category={book.category}
            publisher={book.publisher}
          />
        ))}
      </div>

      {paged.length === 0 && (
        <p className="py-12 text-center text-sm text-muted-foreground">
          도서가 없습니다.
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
