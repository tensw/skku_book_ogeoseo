"use client"

import { useState, useMemo } from "react"
import { Download, Plus, Pencil, Trash2, X } from "lucide-react"
import { PageHeader } from "@/components/shared/page-header"
import { FilterTabs } from "@/components/shared/filter-tabs"
import { SearchBar } from "@/components/shared/search-bar"
import { BookCard } from "@/components/shared/book-card"
import { PaginationNav } from "@/components/shared/pagination-nav"
import { classics as initialClassics } from "@/lib/mock-data"
import { useAuth } from "@/lib/auth-context"

const categoryTabs = [
  { id: "all", label: "전체" },
  { id: "문학·예술", label: "문학·예술" },
  { id: "인문·사회", label: "인문·사회" },
  { id: "자연과학", label: "자연과학" },
]

const PAGE_SIZE = 8

interface BookForm {
  id?: number
  title: string
  author: string
  cover: string
  category: string
  publisher: string
}

const emptyBookForm: BookForm = {
  title: "",
  author: "",
  cover: "",
  category: "문학·예술",
  publisher: "",
}

export default function Guide() {
  const { isAdmin } = useAuth()
  const [year, setYear] = useState(2026)
  const [activeTab, setActiveTab] = useState("all")
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [books, setBooks] = useState(initialClassics)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingBook, setEditingBook] = useState<BookForm | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null)

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
    return result
  }, [activeTab, search, books])

  const handleCreate = () => {
    setEditingBook(emptyBookForm)
    setIsModalOpen(true)
  }

  const handleEdit = (book: typeof books[0]) => {
    setEditingBook({
      id: book.id,
      title: book.title,
      author: book.author,
      cover: book.cover,
      category: book.category,
      publisher: book.publisher,
    })
    setIsModalOpen(true)
  }

  const handleDelete = (id: number) => {
    setDeleteConfirm(id)
  }

  const confirmDelete = () => {
    if (deleteConfirm) {
      setBooks(books.filter((b) => b.id !== deleteConfirm))
      setDeleteConfirm(null)
    }
  }

  const handleSave = () => {
    if (!editingBook) return

    if (editingBook.id) {
      setBooks(books.map((b) =>
        b.id === editingBook.id
          ? { ...b, ...editingBook }
          : b
      ))
    } else {
      const newId = Math.max(...books.map((b) => b.id)) + 1
      setBooks([
        {
          id: newId,
          title: editingBook.title,
          author: editingBook.author,
          cover: editingBook.cover || "https://picsum.photos/seed/newbook/200/280",
          category: editingBook.category,
          publisher: editingBook.publisher,
        },
        ...books,
      ])
    }
    setIsModalOpen(false)
    setEditingBook(null)
  }

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const years = Array.from({ length: 12 }, (_, i) => 2026 - i)

  return (
    <div className="flex flex-col gap-4 pb-6">
      <PageHeader
        title="오거서 도서추천"
        description="성균 고전 100선"
        action={
          <div className="flex items-center gap-2">
            {isAdmin && (
              <button
                onClick={handleCreate}
                className="flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-md transition-all hover:shadow-lg hover:brightness-110"
              >
                <Plus size={14} />
                도서 추가
              </button>
            )}
            <button
              onClick={() => alert("준비 중입니다")}
              className="flex items-center gap-1.5 rounded-full bg-emerald/10 px-4 py-2 text-xs font-semibold text-emerald transition-colors hover:bg-emerald/20"
            >
              <Download size={14} />
              엑셀 다운로드
            </button>
          </div>
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
          <div key={book.id} className="relative group">
            <BookCard
              id={book.id}
              title={book.title}
              author={book.author}
              cover={book.cover}
              category={book.category}
              publisher={book.publisher}
            />
            {isAdmin && (
              <div className="absolute right-2 top-2 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                <button
                  onClick={() => handleEdit(book)}
                  className="flex h-7 w-7 items-center justify-center rounded-full bg-card/90 text-muted-foreground shadow-md backdrop-blur-sm transition-colors hover:bg-primary/10 hover:text-primary"
                  title="수정"
                >
                  <Pencil size={12} />
                </button>
                <button
                  onClick={() => handleDelete(book.id)}
                  className="flex h-7 w-7 items-center justify-center rounded-full bg-card/90 text-muted-foreground shadow-md backdrop-blur-sm transition-colors hover:bg-red-100 hover:text-red-500"
                  title="삭제"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            )}
          </div>
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

      {/* Create/Edit Modal */}
      {isModalOpen && editingBook && (
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
                {editingBook.id ? "도서 수정" : "새 도서 추가"}
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
                  value={editingBook.title}
                  onChange={(e) => setEditingBook({ ...editingBook, title: e.target.value })}
                  placeholder="도서 제목"
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">저자</label>
                <input
                  type="text"
                  value={editingBook.author}
                  onChange={(e) => setEditingBook({ ...editingBook, author: e.target.value })}
                  placeholder="저자명"
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">출판사</label>
                <input
                  type="text"
                  value={editingBook.publisher}
                  onChange={(e) => setEditingBook({ ...editingBook, publisher: e.target.value })}
                  placeholder="출판사명"
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">카테고리</label>
                <select
                  value={editingBook.category}
                  onChange={(e) => setEditingBook({ ...editingBook, category: e.target.value })}
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="문학·예술">문학·예술</option>
                  <option value="인문·사회">인문·사회</option>
                  <option value="자연과학">자연과학</option>
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">표지 이미지 URL</label>
                <input
                  type="text"
                  value={editingBook.cover}
                  onChange={(e) => setEditingBook({ ...editingBook, cover: e.target.value })}
                  placeholder="https://..."
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
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
                disabled={!editingBook.title.trim() || !editingBook.author.trim()}
                className="flex-1 rounded-xl bg-primary py-3 text-sm font-bold text-primary-foreground transition-all hover:brightness-110 disabled:opacity-50"
              >
                {editingBook.id ? "수정" : "추가"}
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
              <h3 className="text-lg font-bold text-foreground">도서 삭제</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                정말 이 도서를 삭제하시겠습니까?<br />
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
