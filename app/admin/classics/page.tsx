"use client"

import { useState } from "react"
import { Plus, Pencil, Trash2 } from "lucide-react"
import { classics as initialClassics } from "@/lib/mock-data"
import type { Classic100 } from "@/lib/types"
import { PageHeader } from "@/components/shared/page-header"
import { DataTable } from "@/components/shared/data-table"
import { SearchBar } from "@/components/shared/search-bar"
import { FilterTabs } from "@/components/shared/filter-tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
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

const categoryOptions = ["총류", "철학", "종교", "사회과학", "기술과학", "예술", "언어", "문학", "역사"]

const filterTabs = [
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

export default function AdminClassicsPage() {
  const [classicList, setClassicList] = useState<Classic100[]>(() => [...initialClassics])
  const [search, setSearch] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [editingClassic, setEditingClassic] = useState<Classic100 | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)

  const [formTitle, setFormTitle] = useState("")
  const [formAuthor, setFormAuthor] = useState("")
  const [formPublisher, setFormPublisher] = useState("")
  const [formCategory, setFormCategory] = useState("문학")
  const [formYear, setFormYear] = useState("")
  const [formDescription, setFormDescription] = useState("")

  const filtered = classicList
    .filter((c) => activeTab === "all" || c.category === activeTab)
    .filter(
      (c) =>
        c.title.toLowerCase().includes(search.toLowerCase()) ||
        c.author.toLowerCase().includes(search.toLowerCase())
    )

  function openCreate() {
    setEditingClassic(null)
    setFormTitle("")
    setFormAuthor("")
    setFormPublisher("")
    setFormCategory("문학")
    setFormYear("")
    setFormDescription("")
    setDialogOpen(true)
  }

  function openEdit(classic: Classic100) {
    setEditingClassic(classic)
    setFormTitle(classic.title)
    setFormAuthor(classic.author)
    setFormPublisher(classic.publisher)
    setFormCategory(classic.category)
    setFormYear(String(classic.year))
    setFormDescription(classic.description)
    setDialogOpen(true)
  }

  function handleSubmit() {
    if (!formTitle.trim() || !formAuthor.trim()) return

    if (editingClassic) {
      setClassicList((prev) =>
        prev.map((c) =>
          c.id === editingClassic.id
            ? {
                ...c,
                title: formTitle,
                author: formAuthor,
                publisher: formPublisher,
                category: formCategory,
                year: Number(formYear) || c.year,
                description: formDescription,
              }
            : c
        )
      )
    } else {
      const newClassic: Classic100 = {
        id: Math.max(0, ...classicList.map((c) => c.id)) + 1,
        title: formTitle,
        author: formAuthor,
        publisher: formPublisher,
        year: Number(formYear) || new Date().getFullYear(),
        category: formCategory,
        description: formDescription,
        cover: "https://picsum.photos/seed/classic-default/200/280",
      }
      setClassicList((prev) => [newClassic, ...prev])
    }
    setDialogOpen(false)
  }

  function confirmDelete(id: number) {
    setDeletingId(id)
    setDeleteDialogOpen(true)
  }

  function handleDelete() {
    if (deletingId !== null) {
      setClassicList((prev) => prev.filter((c) => c.id !== deletingId))
    }
    setDeleteDialogOpen(false)
    setDeletingId(null)
  }

  const columns = [
    { key: "id", label: "번호", className: "w-16", hideOnMobile: true },
    { key: "title", label: "도서명" },
    { key: "author", label: "저자", className: "w-32", hideOnMobile: true },
    { key: "publisher", label: "출판사", className: "w-28", hideOnMobile: true },
    {
      key: "category",
      label: "분류",
      className: "w-24",
      hideOnMobile: true,
      render: (val: string) => {
        const colorMap: Record<string, string> = {
          "총류": "bg-gray-100 text-gray-600",
          "철학": "bg-purple-50 text-purple-600",
          "종교": "bg-amber-50 text-amber-600",
          "사회과학": "bg-blue-50 text-blue-600",
          "기술과학": "bg-teal-50 text-teal-600",
          "예술": "bg-rose-50 text-rose-600",
          "언어": "bg-orange-50 text-orange-600",
          "문학": "bg-pink-50 text-pink-600",
          "역사": "bg-emerald-50 text-emerald-600",
        }
        return (
          <span className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold ${colorMap[val] || "bg-gray-100 text-gray-600"}`}>
            {val}
          </span>
        )
      },
    },
    { key: "year", label: "연도", className: "w-16", hideOnMobile: true },
    {
      key: "actions",
      label: "관리",
      className: "w-28",
      render: (_: unknown, row: Classic100) => (
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
        title="고전100선 관리"
        action={
          <Button onClick={openCreate} size="sm">
            <Plus size={16} />
            등록
          </Button>
        }
      />

      <div className="space-y-4 px-5 sm:px-8">
        <FilterTabs tabs={filterTabs} activeTab={activeTab} onTabChange={setActiveTab} />
        <SearchBar value={search} onChange={setSearch} placeholder="도서 검색..." />
      </div>

      <div className="px-5 sm:px-8">
        <DataTable columns={columns} data={filtered} />
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingClassic ? "도서 수정" : "도서 등록"}</DialogTitle>
            <DialogDescription>
              {editingClassic ? "고전100선 도서 정보를 수정합니다." : "고전100선에 새 도서를 등록합니다."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="classic-title">도서명</Label>
              <Input
                id="classic-title"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                placeholder="도서명"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="classic-author">저자</Label>
              <Input
                id="classic-author"
                value={formAuthor}
                onChange={(e) => setFormAuthor(e.target.value)}
                placeholder="저자"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="classic-publisher">출판사</Label>
              <Input
                id="classic-publisher"
                value={formPublisher}
                onChange={(e) => setFormPublisher(e.target.value)}
                placeholder="출판사"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>분류</Label>
                <Select value={formCategory} onValueChange={(val) => setFormCategory(val)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categoryOptions.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="classic-year">출판연도</Label>
                <Input
                  id="classic-year"
                  type="number"
                  value={formYear}
                  onChange={(e) => setFormYear(e.target.value)}
                  placeholder="2024"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="classic-desc">설명</Label>
              <Textarea
                id="classic-desc"
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                placeholder="도서 설명"
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              취소
            </Button>
            <Button onClick={handleSubmit}>
              {editingClassic ? "수정" : "등록"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>도서 삭제</DialogTitle>
            <DialogDescription>정말로 이 도서를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.</DialogDescription>
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
