"use client"

import { useState, useMemo } from "react"
import { Download } from "lucide-react"
import { PageHeader } from "@/components/shared/page-header"
import { FilterTabs } from "@/components/shared/filter-tabs"
import { SearchBar } from "@/components/shared/search-bar"
import { BookCard } from "@/components/shared/book-card"
import { PaginationNav } from "@/components/shared/pagination-nav"
import { classics as initialClassics } from "@/lib/mock-data"

const categoryTabs = [
  { id: "all", label: "전체" },
  { id: "총류", label: "총류" },
  { id: "철학", label: "철학" },
  { id: "종교", label: "종교" },
  { id: "사회과학", label: "사회과학" },
  { id: "기술과학", label: "기술과학" },
  { id: "예술", label: "예술" },
  { id: "언어", label: "언어" },
  { id: "문학", label: "문학" },
  { id: "역사", label: "역사" },
]

const PAGE_SIZE = 8

export default function Guide() {
  const [activeTab, setActiveTab] = useState("all")
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [books] = useState(initialClassics)

  const filtered = useMemo(() => {
    let result = books
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
    // 전체일 때 가나다순 정렬
    if (activeTab === "all") {
      result = [...result].sort((a, b) => a.title.localeCompare(b.title, 'ko'))
    }
    return result
  }, [activeTab, search, books])

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  return (
    <div className="flex flex-col gap-4 pb-6">
      <PageHeader
        title="오거서 추천도서"
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
      <div className="grid grid-cols-2 gap-3 px-5 sm:grid-cols-3 sm:px-8 lg:grid-cols-5">
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
