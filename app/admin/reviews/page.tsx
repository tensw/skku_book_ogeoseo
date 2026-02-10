"use client"

import { useState } from "react"
import { Trash2 } from "lucide-react"
import { reviews as initialReviews } from "@/lib/mock-data"
import type { BookReview } from "@/lib/types"
import { PageHeader } from "@/components/shared/page-header"
import { DataTable } from "@/components/shared/data-table"
import { SearchBar } from "@/components/shared/search-bar"
import { FilterTabs } from "@/components/shared/filter-tabs"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"

const filterTabs = [
  { id: "all", label: "전체" },
  { id: "program", label: "프로그램 후기" },
  { id: "ogeoseo", label: "오거서 후기" },
]

export default function AdminReviewsPage() {
  const [reviewList, setReviewList] = useState<BookReview[]>(() => [...initialReviews])
  const [search, setSearch] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deletingId, setDeletingId] = useState<number | null>(null)

  const filtered = reviewList
    .filter((r) => activeTab === "all" || r.type === activeTab)
    .filter(
      (r) =>
        r.user.name.toLowerCase().includes(search.toLowerCase()) ||
        r.book.title.toLowerCase().includes(search.toLowerCase()) ||
        r.text.toLowerCase().includes(search.toLowerCase())
    )

  function confirmDelete(id: number) {
    setDeletingId(id)
    setDeleteDialogOpen(true)
  }

  function handleDelete() {
    if (deletingId !== null) {
      setReviewList((prev) => prev.filter((r) => r.id !== deletingId))
    }
    setDeleteDialogOpen(false)
    setDeletingId(null)
  }

  const columns = [
    { key: "id", label: "번호", className: "w-16", hideOnMobile: true },
    {
      key: "user",
      label: "작성자",
      className: "w-28",
      render: (_: unknown, row: BookReview) => row.user.name,
    },
    {
      key: "book",
      label: "도서",
      render: (_: unknown, row: BookReview) => row.book.title,
    },
    {
      key: "type",
      label: "유형",
      className: "w-28",
      hideOnMobile: true,
      render: (val: string) => (
        <span
          className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold ${
            val === "program"
              ? "bg-blue-50 text-blue-600"
              : "bg-emerald-50 text-emerald-600"
          }`}
        >
          {val === "program" ? "프로그램" : "오거서"}
        </span>
      ),
    },
    {
      key: "timeAgo",
      label: "작성일",
      className: "w-24",
      hideOnMobile: true,
    },
    {
      key: "actions",
      label: "관리",
      className: "w-20",
      render: (_: unknown, row: BookReview) => (
        <Button variant="ghost" size="sm" onClick={() => confirmDelete(row.id)}>
          <Trash2 size={14} className="text-destructive" />
        </Button>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader title="독서리뷰 관리" />

      <div className="space-y-4 px-5 sm:px-8">
        <FilterTabs tabs={filterTabs} activeTab={activeTab} onTabChange={setActiveTab} />
        <SearchBar value={search} onChange={setSearch} placeholder="리뷰 검색..." />
      </div>

      <div className="px-5 sm:px-8">
        <DataTable columns={columns} data={filtered} />
      </div>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>리뷰 삭제</DialogTitle>
            <DialogDescription>정말로 이 리뷰를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              취소
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              삭제
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
