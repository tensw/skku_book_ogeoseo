"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { AlertCircle, Plus, Pencil, Trash2, X, Pin } from "lucide-react"
import { PageHeader } from "@/components/shared/page-header"
import { SearchBar } from "@/components/shared/search-bar"
import { DataTable } from "@/components/shared/data-table"
import { PaginationNav } from "@/components/shared/pagination-nav"
import { notices as initialNotices } from "@/lib/mock-data"
import { useAuth } from "@/lib/auth-context"
import { cn } from "@/lib/utils"

const PAGE_SIZE = 5

interface NoticeForm {
  id?: number
  title: string
  content: string
  important: boolean
}

const emptyForm: NoticeForm = {
  title: "",
  content: "",
  important: false,
}

export default function Notices() {
  const router = useRouter()
  const { isAdmin } = useAuth()
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [notices, setNotices] = useState(initialNotices)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingNotice, setEditingNotice] = useState<NoticeForm | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null)

  const filtered = useMemo(() => {
    if (!search.trim()) return notices
    return notices.filter((n) =>
      n.title.toLowerCase().includes(search.toLowerCase())
    )
  }, [search, notices])

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const handleCreate = () => {
    setEditingNotice(emptyForm)
    setIsModalOpen(true)
  }

  const handleEdit = (e: React.MouseEvent, notice: typeof notices[0]) => {
    e.stopPropagation()
    setEditingNotice({
      id: notice.id,
      title: notice.title,
      content: notice.content,
      important: notice.important,
    })
    setIsModalOpen(true)
  }

  const handleDelete = (e: React.MouseEvent, id: number) => {
    e.stopPropagation()
    setDeleteConfirm(id)
  }

  const confirmDelete = () => {
    if (deleteConfirm) {
      setNotices(notices.filter((n) => n.id !== deleteConfirm))
      setDeleteConfirm(null)
    }
  }

  const handleSave = () => {
    if (!editingNotice) return

    if (editingNotice.id) {
      // Update existing
      setNotices(notices.map((n) =>
        n.id === editingNotice.id
          ? { ...n, title: editingNotice.title, content: editingNotice.content, important: editingNotice.important }
          : n
      ))
    } else {
      // Create new
      const newId = Math.max(...notices.map((n) => n.id)) + 1
      const today = new Date().toISOString().split("T")[0]
      setNotices([
        {
          id: newId,
          title: editingNotice.title,
          content: editingNotice.content,
          date: today,
          views: 0,
          author: "관리자",
          attachments: [],
          important: editingNotice.important,
        },
        ...notices,
      ])
    }
    setIsModalOpen(false)
    setEditingNotice(null)
  }

  const toggleImportant = (e: React.MouseEvent, id: number) => {
    e.stopPropagation()
    setNotices(notices.map((n) =>
      n.id === id ? { ...n, important: !n.important } : n
    ))
  }

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
    ...(isAdmin
      ? [
          {
            key: "actions",
            label: "관리",
            className: "w-28 text-center",
            render: (_: string, row: (typeof notices)[0]) => (
              <div className="flex items-center justify-center gap-1" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={(e) => toggleImportant(e, row.id)}
                  className={cn(
                    "rounded-lg p-1.5 transition-colors",
                    row.important ? "bg-red-100 text-red-500" : "bg-muted text-muted-foreground hover:text-foreground"
                  )}
                  title={row.important ? "중요 해제" : "중요 설정"}
                >
                  <Pin size={14} />
                </button>
                <button
                  onClick={(e) => handleEdit(e, row)}
                  className="rounded-lg bg-muted p-1.5 text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
                  title="수정"
                >
                  <Pencil size={14} />
                </button>
                <button
                  onClick={(e) => handleDelete(e, row.id)}
                  className="rounded-lg bg-muted p-1.5 text-muted-foreground transition-colors hover:bg-red-100 hover:text-red-500"
                  title="삭제"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ),
          },
        ]
      : []),
  ]

  return (
    <div className="flex flex-col gap-4 pb-6">
      <PageHeader
        title="공지사항"
        description="오거서 플랫폼의 공지사항입니다"
        action={
          isAdmin ? (
            <button
              onClick={handleCreate}
              className="flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-md transition-all hover:shadow-lg hover:brightness-110"
            >
              <Plus size={14} />
              공지 작성
            </button>
          ) : undefined
        }
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

      {/* Create/Edit Modal */}
      {isModalOpen && editingNotice && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-foreground/50 p-4 backdrop-blur-sm"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-border bg-card shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-border px-6 py-4">
              <h2 className="text-lg font-bold text-foreground">
                {editingNotice.id ? "공지사항 수정" : "새 공지사항 작성"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors hover:bg-border hover:text-foreground"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex flex-col gap-4 px-6 py-6">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">제목</label>
                <input
                  type="text"
                  value={editingNotice.title}
                  onChange={(e) => setEditingNotice({ ...editingNotice, title: e.target.value })}
                  placeholder="공지사항 제목을 입력하세요"
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">내용</label>
                <textarea
                  value={editingNotice.content}
                  onChange={(e) => setEditingNotice({ ...editingNotice, content: e.target.value })}
                  placeholder="공지사항 내용을 입력하세요"
                  rows={6}
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={editingNotice.important}
                  onChange={(e) => setEditingNotice({ ...editingNotice, important: e.target.checked })}
                  className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                />
                <span className="text-sm text-foreground">중요 공지로 설정</span>
              </label>
            </div>

            <div className="flex gap-3 border-t border-border bg-muted/30 px-6 py-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="flex-1 rounded-xl border border-border bg-card py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted"
              >
                취소
              </button>
              <button
                onClick={handleSave}
                disabled={!editingNotice.title.trim() || !editingNotice.content.trim()}
                className="flex-1 rounded-xl bg-primary py-3 text-sm font-bold text-primary-foreground transition-all hover:brightness-110 disabled:opacity-50"
              >
                {editingNotice.id ? "수정" : "작성"}
              </button>
            </div>
          </div>
        </div>
      )}

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
              <h3 className="text-lg font-bold text-foreground">공지사항 삭제</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                정말 이 공지사항을 삭제하시겠습니까?<br />
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
