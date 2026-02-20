"use client"

import { useState } from "react"
import { Plus, Pencil, Trash2, Book, X, ChevronDown, ChevronUp, CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { ko } from "date-fns/locale"
import { bundoks as initialBundoks } from "@/lib/mock-data"
import type { Bundok } from "@/lib/types"
import { PageHeader } from "@/components/shared/page-header"
import { DataTable } from "@/components/shared/data-table"
import { SearchBar } from "@/components/shared/search-bar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
// Textarea removed - not needed for bundok form
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { usePrograms, type MonthlyBook } from "@/lib/program-context"
import { cn } from "@/lib/utils"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"

const statusLabels: Record<Bundok["status"], string> = {
  recruiting: "모집 중",
  confirmed: "확정",
  completed: "완료",
}

const statusColors: Record<Bundok["status"], string> = {
  recruiting: "bg-blue-50 text-blue-600",
  confirmed: "bg-green-50 text-green-600",
  completed: "bg-gray-100 text-gray-500",
}

const statusOptions: Bundok["status"][] = ["recruiting", "confirmed", "completed"]

export default function AdminProgramsPage() {
  const [bundokList, setBundokList] = useState<Bundok[]>(() => [...initialBundoks])
  const [search, setSearch] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [editingBundok, setEditingBundok] = useState<Bundok | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)

  const [formTitle, setFormTitle] = useState("")
  const [formBook, setFormBook] = useState("")
  const [formBookAuthor, setFormBookAuthor] = useState("")
  const [formDate, setFormDate] = useState<Date | undefined>(undefined)
  const [formMaxMembers, setFormMaxMembers] = useState("")
  const [formStatus, setFormStatus] = useState<Bundok["status"]>("recruiting")

  // 이달의 책 관련 상태
  const {
    monthlyBooks,
    addMonthlyBook,
    updateMonthlyBook,
    deleteMonthlyBook,
    reorderMonthlyBooks,
    setMonthlyBooks,
  } = usePrograms()
  const [isMonthlyBooksOpen, setIsMonthlyBooksOpen] = useState(true)
  const [bookDialogOpen, setBookDialogOpen] = useState(false)
  const [editingBook, setEditingBook] = useState<MonthlyBook | null>(null)
  // 여러 책 추가용 상태
  const [bookEntries, setBookEntries] = useState<Array<{
    title: string
    author: string
    cover: string
    description: string
  }>>([{ title: "", author: "", cover: "", description: "" }])
  const [deleteBookDialogOpen, setDeleteBookDialogOpen] = useState(false)
  const [deletingBookId, setDeletingBookId] = useState<string | null>(null)
  const [deleteAllDialogOpen, setDeleteAllDialogOpen] = useState(false)

  const filtered = bundokList.filter(
    (b) =>
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.book.toLowerCase().includes(search.toLowerCase())
  )

  function openCreate() {
    setEditingBundok(null)
    setFormTitle("")
    setFormBook("")
    setFormBookAuthor("")
    setFormDate(undefined)
    setFormMaxMembers("5")
    setFormStatus("recruiting")
    setDialogOpen(true)
  }

  function openEdit(bundok: Bundok) {
    setEditingBundok(bundok)
    setFormTitle(bundok.title)
    setFormBook(bundok.book)
    setFormBookAuthor(bundok.bookAuthor)
    setFormDate(new Date(bundok.date))
    setFormMaxMembers(String(bundok.maxMembers))
    setFormStatus(bundok.status)
    setDialogOpen(true)
  }

  function handleSubmit() {
    if (!formTitle.trim()) return

    const dateStr = formDate ? format(formDate, "yyyy-MM-dd") : ""

    if (editingBundok) {
      setBundokList((prev) =>
        prev.map((b) =>
          b.id === editingBundok.id
            ? {
                ...b,
                title: formTitle,
                book: formBook,
                bookAuthor: formBookAuthor,
                date: dateStr,
                maxMembers: Number(formMaxMembers) || b.maxMembers,
                status: formStatus,
              }
            : b
        )
      )
    } else {
      const newBundok: Bundok = {
        id: Math.max(0, ...bundokList.map((b) => b.id)) + 1,
        title: formTitle,
        book: formBook,
        bookAuthor: formBookAuthor,
        bookCover: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=200&h=280&fit=crop",
        host: "관리자",
        hostAvatar: "https://picsum.photos/seed/admin/80/80",
        format: "offline",
        location: "스터디룸",
        date: dateStr,
        time: "19:00",
        duration: 90,
        currentMembers: 0,
        maxMembers: Number(formMaxMembers) || 5,
        tags: [],
        status: formStatus,
      }
      setBundokList((prev) => [newBundok, ...prev])
    }
    setDialogOpen(false)
  }

  function confirmDelete(id: number) {
    setDeletingId(id)
    setDeleteDialogOpen(true)
  }

  function handleDelete() {
    if (deletingId !== null) {
      setBundokList((prev) => prev.filter((b) => b.id !== deletingId))
    }
    setDeleteDialogOpen(false)
    setDeletingId(null)
  }

  // 이달의 책 관련 함수들
  function openBookCreate() {
    setEditingBook(null)
    setBookEntries([{ title: "", author: "", cover: "", description: "" }])
    setBookDialogOpen(true)
  }

  function openBookEdit(book: MonthlyBook) {
    setEditingBook(book)
    setBookEntries([{
      title: book.title,
      author: book.author,
      cover: book.cover,
      description: book.description,
    }])
    setBookDialogOpen(true)
  }

  function addBookEntry() {
    setBookEntries([...bookEntries, { title: "", author: "", cover: "", description: "" }])
  }

  function removeBookEntry(index: number) {
    if (bookEntries.length <= 1) return
    setBookEntries(bookEntries.filter((_, i) => i !== index))
  }

  function updateBookEntry(index: number, field: string, value: string) {
    setBookEntries(bookEntries.map((entry, i) =>
      i === index ? { ...entry, [field]: value } : entry
    ))
  }

  function handleBookSubmit() {
    if (editingBook) {
      // 수정 모드
      const entry = bookEntries[0]
      if (!entry.title.trim() || !entry.author.trim()) return
      updateMonthlyBook(editingBook.id, {
        title: entry.title,
        author: entry.author,
        cover: entry.cover || "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=100&h=140&fit=crop",
        description: entry.description,
      })
    } else {
      // 여러 책 추가 모드
      const validEntries = bookEntries.filter(e => e.title.trim() && e.author.trim())
      validEntries.forEach(entry => {
        addMonthlyBook({
          title: entry.title,
          author: entry.author,
          cover: entry.cover || "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=100&h=140&fit=crop",
          description: entry.description,
        })
      })
    }
    setBookDialogOpen(false)
  }

  function confirmBookDelete(id: string) {
    setDeletingBookId(id)
    setDeleteBookDialogOpen(true)
  }

  function handleBookDelete() {
    if (deletingBookId) {
      deleteMonthlyBook(deletingBookId)
    }
    setDeleteBookDialogOpen(false)
    setDeletingBookId(null)
  }

  function handleDeleteAllBooks() {
    setMonthlyBooks([])
    setDeleteAllDialogOpen(false)
  }

  function moveBook(index: number, direction: "up" | "down") {
    const newIndex = direction === "up" ? index - 1 : index + 1
    if (newIndex < 0 || newIndex >= monthlyBooks.length) return

    const newBooks = [...monthlyBooks]
    const [removed] = newBooks.splice(index, 1)
    newBooks.splice(newIndex, 0, removed)
    reorderMonthlyBooks(newBooks)
  }

  const columns = [
    { key: "id", label: "번호", className: "w-16", hideOnMobile: true },
    { key: "title", label: "번독명" },
    { key: "book", label: "도서", hideOnMobile: true },
    { key: "date", label: "날짜", className: "w-28", hideOnMobile: true },
    {
      key: "currentMembers",
      label: "인원",
      className: "w-20",
      hideOnMobile: true,
      render: (_: number, row: Bundok) => `${row.currentMembers}/${row.maxMembers}`,
    },
    {
      key: "status",
      label: "상태",
      className: "w-20",
      render: (val: Bundok["status"]) => (
        <span
          className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold ${statusColors[val]}`}
        >
          {statusLabels[val]}
        </span>
      ),
    },
    {
      key: "actions",
      label: "관리",
      className: "w-28",
      render: (_: unknown, row: Bundok) => (
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
        title="프로그램 관리"
        action={
          <Button onClick={openCreate} size="sm">
            <Plus size={16} />
            등록
          </Button>
        }
      />

      {/* 이달의 책 섹션 */}
      <div className="px-5 sm:px-8">
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <button
            onClick={() => setIsMonthlyBooksOpen(!isMonthlyBooksOpen)}
            className="flex w-full items-center justify-between p-4 text-left hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <Book size={20} className="text-primary" />
              </div>
              <div>
                <h2 className="font-bold text-foreground">이달의 책</h2>
                <p className="text-xs text-muted-foreground">
                  추천 도서 목록 · 현재 {monthlyBooks.length}권
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-primary/10 px-2 py-1 text-xs font-semibold text-primary">
                {monthlyBooks.length}권
              </span>
              {isMonthlyBooksOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </div>
          </button>

          {isMonthlyBooksOpen && (
            <div className="border-t border-border p-4">
              {/* 책 목록 */}
              <div className="space-y-2">
                {monthlyBooks.map((book, index) => (
                  <div
                    key={book.id}
                    className="flex items-center gap-3 rounded-lg border border-border bg-background p-3"
                  >
                    <div className="flex flex-col gap-0.5">
                      <button
                        onClick={() => moveBook(index, "up")}
                        disabled={index === 0}
                        className="text-muted-foreground hover:text-foreground disabled:opacity-30"
                      >
                        <ChevronUp size={14} />
                      </button>
                      <button
                        onClick={() => moveBook(index, "down")}
                        disabled={index === monthlyBooks.length - 1}
                        className="text-muted-foreground hover:text-foreground disabled:opacity-30"
                      >
                        <ChevronDown size={14} />
                      </button>
                    </div>
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                      {index + 1}
                    </span>
                    <img
                      src={book.cover}
                      alt={book.title}
                      className="h-14 w-10 rounded object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-foreground truncate">{book.title}</p>
                      <p className="text-xs text-muted-foreground">{book.author}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="sm" onClick={() => openBookEdit(book)}>
                        <Pencil size={14} />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => confirmBookDelete(book.id)}>
                        <Trash2 size={14} className="text-destructive" />
                      </Button>
                    </div>
                  </div>
                ))}

                {monthlyBooks.length === 0 && (
                  <div className="rounded-lg border-2 border-dashed border-border p-6 text-center">
                    <Book size={32} className="mx-auto text-muted-foreground" />
                    <p className="mt-2 text-sm font-medium text-foreground">이달의 책을 추가해주세요</p>
                    <p className="text-xs text-muted-foreground">최소 4권 이상 추가하는 것을 권장합니다</p>
                  </div>
                )}
              </div>

              <div className="mt-3 flex gap-2">
                <Button onClick={openBookCreate} className="flex-1" variant="outline">
                  <Plus size={16} />
                  책 추가
                </Button>
                {monthlyBooks.length > 0 && (
                  <Button
                    onClick={() => setDeleteAllDialogOpen(true)}
                    variant="outline"
                    className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                  >
                    <Trash2 size={16} />
                    전체 삭제
                  </Button>
                )}
              </div>

              {monthlyBooks.length > 0 && monthlyBooks.length < 4 && (
                <p className="mt-2 text-center text-xs text-amber-600">
                  * 원활한 주간 배정을 위해 4권 이상 추가하는 것을 권장합니다
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="px-5 sm:px-8">
        <SearchBar value={search} onChange={setSearch} placeholder="프로그램 검색..." />
      </div>

      <div className="px-5 sm:px-8">
        <DataTable columns={columns} data={filtered} className="[&_td]:py-1.5 [&_th]:h-9" />
      </div>

      {/* 번독 등록/수정 다이얼로그 */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingBundok ? "번독 수정" : "번독 등록"}</DialogTitle>
            <DialogDescription>
              {editingBundok ? "번독 정보를 수정합니다." : "새 번독 모임을 등록합니다."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="bundok-title">모임 주제</Label>
              <Input
                id="bundok-title"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                placeholder="카페에서 읽는 데미안"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bundok-book">도서명</Label>
                <Input
                  id="bundok-book"
                  value={formBook}
                  onChange={(e) => setFormBook(e.target.value)}
                  placeholder="데미안"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bundok-author">저자</Label>
                <Input
                  id="bundok-author"
                  value={formBookAuthor}
                  onChange={(e) => setFormBookAuthor(e.target.value)}
                  placeholder="헤르만 헤세"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>날짜</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formDate ? format(formDate, "yyyy-MM-dd", { locale: ko }) : "날짜 선택"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formDate}
                      onSelect={setFormDate}
                      locale={ko}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label htmlFor="bundok-max">최대 인원 (2-5)</Label>
                <Input
                  id="bundok-max"
                  type="number"
                  min={2}
                  max={5}
                  value={formMaxMembers}
                  onChange={(e) => setFormMaxMembers(e.target.value)}
                  placeholder="5"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>상태</Label>
              <Select value={formStatus} onValueChange={(val) => setFormStatus(val as Bundok["status"])}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((s) => (
                    <SelectItem key={s} value={s}>
                      {statusLabels[s]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              취소
            </Button>
            <Button onClick={handleSubmit}>
              {editingBundok ? "수정" : "등록"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 번독 삭제 다이얼로그 */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>번독 삭제</DialogTitle>
            <DialogDescription>정말로 이 번독 모임을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.</DialogDescription>
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

      {/* 책 등록/수정 다이얼로그 */}
      <Dialog open={bookDialogOpen} onOpenChange={setBookDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingBook ? "책 수정" : "이달의 책 추가"}</DialogTitle>
            <DialogDescription>
              {editingBook
                ? "책 정보를 수정합니다."
                : "이달의 책 목록에 새 책을 추가합니다. 여러 권을 한번에 추가할 수 있습니다."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {bookEntries.map((entry, index) => (
              <div
                key={index}
                className="relative rounded-lg border border-border bg-muted/30 p-4"
              >
                {/* 책 번호 및 삭제 버튼 */}
                {!editingBook && bookEntries.length > 1 && (
                  <div className="mb-3 flex items-center justify-between">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                      {index + 1}
                    </span>
                    <button
                      onClick={() => removeBookEntry(index)}
                      className="flex h-6 w-6 items-center justify-center rounded-full text-muted-foreground hover:bg-destructive hover:text-white transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </div>
                )}

                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label className="text-xs">도서명 *</Label>
                      <Input
                        value={entry.title}
                        onChange={(e) => updateBookEntry(index, "title", e.target.value)}
                        placeholder="미움받을 용기"
                        className="h-9"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">저자 *</Label>
                      <Input
                        value={entry.author}
                        onChange={(e) => updateBookEntry(index, "author", e.target.value)}
                        placeholder="기시미 이치로"
                        className="h-9"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">표지 이미지 URL (선택)</Label>
                    <Input
                      value={entry.cover}
                      onChange={(e) => updateBookEntry(index, "cover", e.target.value)}
                      placeholder="https://..."
                      className="h-9"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">도서 소개 (선택)</Label>
                    <Input
                      value={entry.description}
                      onChange={(e) => updateBookEntry(index, "description", e.target.value)}
                      placeholder="간략한 설명"
                      className="h-9"
                    />
                  </div>
                </div>
              </div>
            ))}

            {/* 책 추가 버튼 (수정 모드가 아닐 때만) */}
            {!editingBook && (
              <Button
                type="button"
                variant="outline"
                onClick={addBookEntry}
                className="w-full border-dashed"
              >
                <Plus size={16} />
                책 추가 ({bookEntries.length}권)
              </Button>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setBookDialogOpen(false)}>
              취소
            </Button>
            <Button
              onClick={handleBookSubmit}
              disabled={!bookEntries.some(e => e.title.trim() && e.author.trim())}
            >
              {editingBook ? "수정" : `${bookEntries.filter(e => e.title.trim() && e.author.trim()).length}권 추가`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 책 삭제 다이얼로그 */}
      <Dialog open={deleteBookDialogOpen} onOpenChange={setDeleteBookDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>책 삭제</DialogTitle>
            <DialogDescription>이달의 책 목록에서 이 책을 삭제하시겠습니까?</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteBookDialogOpen(false)}>
              취소
            </Button>
            <Button variant="destructive" onClick={handleBookDelete}>
              삭제
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 전체 삭제 다이얼로그 */}
      <Dialog open={deleteAllDialogOpen} onOpenChange={setDeleteAllDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>이달의 책 전체 삭제</DialogTitle>
            <DialogDescription>
              현재 등록된 {monthlyBooks.length}권의 책을 모두 삭제하시겠습니까?
              <br />
              새로운 달에 책을 다시 등록하기 전에 사용하세요.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteAllDialogOpen(false)}>
              취소
            </Button>
            <Button variant="destructive" onClick={handleDeleteAllBooks}>
              전체 삭제
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
