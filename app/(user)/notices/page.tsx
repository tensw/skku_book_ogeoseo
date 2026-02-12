"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { AlertCircle } from "lucide-react"
import { PageHeader } from "@/components/shared/page-header"
import { SearchBar } from "@/components/shared/search-bar"
import { DataTable } from "@/components/shared/data-table"
import { PaginationNav } from "@/components/shared/pagination-nav"
import { notices as initialNotices } from "@/lib/mock-data"

const PAGE_SIZE = 5

export default function Notices() {
  const router = useRouter()
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [notices] = useState(initialNotices)

  const filtered = useMemo(() => {
    if (!search.trim()) return notices
    return notices.filter((n) =>
      n.title.toLowerCase().includes(search.toLowerCase())
    )
  }, [search, notices])

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const columns = [
    {
      key: "id",
      label: "번호",
      className: "w-16 text-center",
      hideOnMobile: true,
    },
    {
      key: "title",
      label: "제목",
      render: (_: string, row: (typeof notices)[0]) => (
        <span className="flex items-center gap-2">
          {row.important && (
            <AlertCircle size={14} className="flex-shrink-0 text-red-500" />
          )}
          <span className="line-clamp-1">{row.title}</span>
        </span>
      ),
    },
    {
      key: "date",
      label: "작성일",
      className: "w-28 text-center",
    },
    {
      key: "views",
      label: "조회수",
      className: "w-20 text-center",
      hideOnMobile: true,
    },
  ]

  return (
    <div className="flex flex-col gap-4 pb-6">
      <PageHeader
        title="공지사항"
        description="오거서 플랫폼의 공지사항입니다"
      />

      <div className="px-5 sm:px-8">
        <SearchBar
          value={search}
          onChange={(v) => {
            setSearch(v)
            setPage(1)
          }}
          placeholder="공지사항 검색..."
        />
      </div>

      <div className="px-5 sm:px-8">
        <DataTable
          columns={columns}
          data={paged}
          onRowClick={(row) => router.push(`/notices/${row.id}`)}
        />
      </div>

      <PaginationNav
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
        className="mt-2"
      />
    </div>
  )
}
