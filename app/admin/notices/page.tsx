"use client"

import { useState } from "react"
import { Plus, Pencil, Trash2, Eye, Pin } from "lucide-react"
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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"

export default function AdminNoticesPage() {
  const [noticeList, setNoticeList] = useState<Notice[]>(() => [...initialNotices])
  const [search, setSearch] = useState("")
  const [sheetOpen, setSheetOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [editingNotice, setEditingNotice] = useState<Notice | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)

  const [formTitle, setFormTitle] = useState("")
  const [formContent, setFormContent] = useState("")
  const [formImportant, setFormImportant] = useState(false)

  const filtered = noticeList
    .filter(
      (n) =>
        n.title.toLowerCase().includes(search.toLowerCase()) ||
        n.content.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (a.important !== b.important) return a.important ? -1 : 1
      return 0
    })

  function openCreate() {
    setEditingNotice(null)
    setFormTitle("")
    setFormContent("")
    setFormImportant(false)
    setSheetOpen(true)
  }

  function openEdit(notice: Notice) {
    setEditingNotice(notice)
    setFormTitle(notice.title)
    setFormContent(notice.content)
    setFormImportant(notice.important)
    setSheetOpen(true)
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
    setSheetOpen(false)
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
        <div className="flex items-center gap-2">
          {row.important && (
            <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-[11px] font-bold text-red-600">
              <Pin size={10} />
              중요
            </span>
          )}
          <span className="truncate">{row.title}</span>
        </div>
      ),
    },
    {
      key: "author",
      label: "작성자",
      className: "w-24 whitespace-nowrap",
      hideOnMobile: true,
    },
    { key: "date", label: "작성일", className: "w-28", hideOnMobile: true },
    {
      key: "views",
      label: "조회수",
      className: "w-20",
      hideOnMobile: true,
      render: (val: number) => (
        <span className="inline-flex items-center gap-1 text-muted-foreground">
          <Eye size={13} />
          {val.toLocaleString()}
        </span>
      ),
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
        description={`총 ${noticeList.length}건`}
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
        <DataTable columns={columns} data={filtered} className="[&_td]:py-1.5 [&_th]:h-9" />
      </div>

      {/* Create / Edit Sheet */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent
          side="right"
          className="flex w-full flex-col sm:max-w-xl"
        >
          <SheetHeader>
            <SheetTitle>
              {editingNotice ? "공지사항 수정" : "공지사항 등록"}
            </SheetTitle>
            <SheetDescription>
              {editingNotice
                ? "공지사항을 수정합니다."
                : "새 공지사항을 등록합니다."}
            </SheetDescription>
          </SheetHeader>

          <div className="flex flex-1 flex-col gap-5 overflow-y-auto py-4">
            <div className="space-y-2">
              <Label htmlFor="notice-title">제목</Label>
              <Input
                id="notice-title"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                placeholder="공지사항 제목을 입력하세요"
              />
            </div>

            <div className="flex flex-1 flex-col space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="notice-content">내용</Label>
                <span className="text-xs text-muted-foreground">
                  {formContent.length}자
                </span>
              </div>
              <Textarea
                id="notice-content"
                value={formContent}
                onChange={(e) => setFormContent(e.target.value)}
                placeholder="공지사항 내용을 입력하세요"
                className="min-h-[300px] flex-1 resize-none"
              />
            </div>

            <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/50 p-3">
              <Checkbox
                id="notice-important"
                checked={formImportant}
                onCheckedChange={(checked) => setFormImportant(checked === true)}
              />
              <Label htmlFor="notice-important" className="cursor-pointer text-sm">
                중요 공지로 설정
              </Label>
            </div>
          </div>

          <div className="flex gap-2 border-t border-border pt-4">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setSheetOpen(false)}
            >
              취소
            </Button>
            <Button className="flex-1" onClick={handleSubmit} disabled={!formTitle.trim()}>
              {editingNotice ? "수정" : "등록"}
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>공지사항 삭제</DialogTitle>
            <DialogDescription>
              정말로 이 공지사항을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
            </DialogDescription>
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
