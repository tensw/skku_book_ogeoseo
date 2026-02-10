"use client"

import { useState } from "react"
import { Plus, Pencil, Trash2 } from "lucide-react"
import { notices as initialNotices } from "@/lib/mock-data"
import type { Notice } from "@/lib/types"
import { PageHeader } from "@/components/shared/page-header"
import { DataTable } from "@/components/shared/data-table"
import { SearchBar } from "@/components/shared/search-bar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"

export default function AdminNoticesPage() {
  const [noticeList, setNoticeList] = useState<Notice[]>(() => [...initialNotices])
  const [search, setSearch] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [editingNotice, setEditingNotice] = useState<Notice | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)

  const [formTitle, setFormTitle] = useState("")
  const [formContent, setFormContent] = useState("")
  const [formImportant, setFormImportant] = useState(false)

  const filtered = noticeList.filter(
    (n) =>
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.content.toLowerCase().includes(search.toLowerCase())
  )

  function openCreate() {
    setEditingNotice(null)
    setFormTitle("")
    setFormContent("")
    setFormImportant(false)
    setDialogOpen(true)
  }

  function openEdit(notice: Notice) {
    setEditingNotice(notice)
    setFormTitle(notice.title)
    setFormContent(notice.content)
    setFormImportant(notice.important)
    setDialogOpen(true)
  }

  function handleSubmit() {
    if (!formTitle.trim()) return

    if (editingNotice) {
      setNoticeList((prev) =>
        prev.map((n) =>
          n.id === editingNotice.id
            ? { ...n, title: formTitle, content: formContent, important: formImportant }
            : n
        )
      )
    } else {
      const newNotice: Notice = {
        id: Math.max(0, ...noticeList.map((n) => n.id)) + 1,
        title: formTitle,
        content: formContent,
        date: new Date().toISOString().split("T")[0],
        views: 0,
        author: "관리자",
        attachments: [],
        important: formImportant,
      }
      setNoticeList((prev) => [newNotice, ...prev])
    }
    setDialogOpen(false)
  }

  function confirmDelete(id: number) {
    setDeletingId(id)
    setDeleteDialogOpen(true)
  }

  function handleDelete() {
    if (deletingId !== null) {
      setNoticeList((prev) => prev.filter((n) => n.id !== deletingId))
    }
    setDeleteDialogOpen(false)
    setDeletingId(null)
  }

  const columns = [
    { key: "id", label: "번호", className: "w-16", hideOnMobile: true },
    {
      key: "title",
      label: "제목",
      render: (_: string, row: Notice) => (
        <span className="flex items-center gap-2">
          {row.important && (
            <span className="inline-flex rounded bg-red-100 px-1.5 py-0.5 text-[10px] font-bold text-red-600">
              중요
            </span>
          )}
          {row.title}
        </span>
      ),
    },
    { key: "date", label: "작성일", className: "w-28", hideOnMobile: true },
    { key: "views", label: "조회수", className: "w-20", hideOnMobile: true },
    {
      key: "important",
      label: "중요",
      className: "w-16",
      hideOnMobile: true,
      render: (val: boolean) => (val ? "Y" : "N"),
    },
    {
      key: "actions",
      label: "관리",
      className: "w-28",
      render: (_: unknown, row: Notice) => (
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" onClick={() => openEdit(row)}>
            <Pencil size={14} />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => confirmDelete(row.id)}>
            <Trash2 size={14} className="text-destructive" />
          </Button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="공지사항 관리"
        action={
          <Button onClick={openCreate} size="sm">
            <Plus size={16} />
            등록
          </Button>
        }
      />

      <div className="px-5 sm:px-8">
        <SearchBar value={search} onChange={setSearch} placeholder="공지사항 검색..." />
      </div>

      <div className="px-5 sm:px-8">
        <DataTable columns={columns} data={filtered} />
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingNotice ? "공지사항 수정" : "공지사항 등록"}</DialogTitle>
            <DialogDescription>
              {editingNotice ? "공지사항을 수정합니다." : "새 공지사항을 등록합니다."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="notice-title">제목</Label>
              <Input
                id="notice-title"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                placeholder="공지사항 제목"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notice-content">내용</Label>
              <Textarea
                id="notice-content"
                value={formContent}
                onChange={(e) => setFormContent(e.target.value)}
                placeholder="공지사항 내용"
                rows={5}
              />
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="notice-important"
                checked={formImportant}
                onCheckedChange={(checked) => setFormImportant(checked === true)}
              />
              <Label htmlFor="notice-important">중요 공지</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              취소
            </Button>
            <Button onClick={handleSubmit}>
              {editingNotice ? "수정" : "등록"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>공지사항 삭제</DialogTitle>
            <DialogDescription>정말로 이 공지사항을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.</DialogDescription>
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
