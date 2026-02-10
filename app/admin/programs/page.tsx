"use client"

import { useState } from "react"
import { Plus, Pencil, Trash2 } from "lucide-react"
import { programs as initialPrograms } from "@/lib/mock-data"
import type { Program } from "@/lib/types"
import { PageHeader } from "@/components/shared/page-header"
import { DataTable } from "@/components/shared/data-table"
import { SearchBar } from "@/components/shared/search-bar"
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

const statusLabels: Record<Program["status"], string> = {
  upcoming: "예정",
  ongoing: "진행중",
  completed: "종료",
}

const statusColors: Record<Program["status"], string> = {
  upcoming: "bg-blue-50 text-blue-600",
  ongoing: "bg-green-50 text-green-600",
  completed: "bg-gray-100 text-gray-500",
}

const statusOptions: Program["status"][] = ["upcoming", "ongoing", "completed"]

export default function AdminProgramsPage() {
  const [programList, setProgramList] = useState<Program[]>(() => [...initialPrograms])
  const [search, setSearch] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [editingProgram, setEditingProgram] = useState<Program | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)

  const [formTitle, setFormTitle] = useState("")
  const [formDescription, setFormDescription] = useState("")
  const [formDate, setFormDate] = useState("")
  const [formMaxParticipants, setFormMaxParticipants] = useState("")
  const [formStatus, setFormStatus] = useState<Program["status"]>("upcoming")
  const [formCategory, setFormCategory] = useState("")

  const filtered = programList.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase())
  )

  function openCreate() {
    setEditingProgram(null)
    setFormTitle("")
    setFormDescription("")
    setFormDate("")
    setFormMaxParticipants("")
    setFormStatus("upcoming")
    setFormCategory("")
    setDialogOpen(true)
  }

  function openEdit(program: Program) {
    setEditingProgram(program)
    setFormTitle(program.title)
    setFormDescription(program.description)
    setFormDate(program.date)
    setFormMaxParticipants(String(program.maxParticipants))
    setFormStatus(program.status)
    setFormCategory(program.category)
    setDialogOpen(true)
  }

  function handleSubmit() {
    if (!formTitle.trim()) return

    if (editingProgram) {
      setProgramList((prev) =>
        prev.map((p) =>
          p.id === editingProgram.id
            ? {
                ...p,
                title: formTitle,
                description: formDescription,
                date: formDate,
                maxParticipants: Number(formMaxParticipants) || p.maxParticipants,
                status: formStatus,
                category: formCategory,
              }
            : p
        )
      )
    } else {
      const newProgram: Program = {
        id: Math.max(0, ...programList.map((p) => p.id)) + 1,
        title: formTitle,
        description: formDescription,
        date: formDate,
        status: formStatus,
        participants: 0,
        maxParticipants: Number(formMaxParticipants) || 100,
        category: formCategory,
      }
      setProgramList((prev) => [newProgram, ...prev])
    }
    setDialogOpen(false)
  }

  function confirmDelete(id: number) {
    setDeletingId(id)
    setDeleteDialogOpen(true)
  }

  function handleDelete() {
    if (deletingId !== null) {
      setProgramList((prev) => prev.filter((p) => p.id !== deletingId))
    }
    setDeleteDialogOpen(false)
    setDeletingId(null)
  }

  const columns = [
    { key: "id", label: "번호", className: "w-16", hideOnMobile: true },
    { key: "title", label: "프로그램명" },
    { key: "date", label: "날짜", className: "w-44", hideOnMobile: true },
    {
      key: "participants",
      label: "참가자",
      className: "w-24",
      hideOnMobile: true,
      render: (_: number, row: Program) => `${row.participants}/${row.maxParticipants}`,
    },
    {
      key: "status",
      label: "상태",
      className: "w-20",
      render: (val: Program["status"]) => (
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
      render: (_: unknown, row: Program) => (
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

      <div className="px-5 sm:px-8">
        <SearchBar value={search} onChange={setSearch} placeholder="프로그램 검색..." />
      </div>

      <div className="px-5 sm:px-8">
        <DataTable columns={columns} data={filtered} />
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingProgram ? "프로그램 수정" : "프로그램 등록"}</DialogTitle>
            <DialogDescription>
              {editingProgram ? "프로그램 정보를 수정합니다." : "새 프로그램을 등록합니다."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="program-title">프로그램명</Label>
              <Input
                id="program-title"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                placeholder="프로그램명"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="program-desc">설명</Label>
              <Textarea
                id="program-desc"
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                placeholder="프로그램 설명"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="program-date">날짜</Label>
              <Input
                id="program-date"
                value={formDate}
                onChange={(e) => setFormDate(e.target.value)}
                placeholder="2026-03-02 ~ 2026-06-20"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="program-max">최대 참가자</Label>
                <Input
                  id="program-max"
                  type="number"
                  value={formMaxParticipants}
                  onChange={(e) => setFormMaxParticipants(e.target.value)}
                  placeholder="200"
                />
              </div>
              <div className="space-y-2">
                <Label>상태</Label>
                <Select value={formStatus} onValueChange={(val) => setFormStatus(val as Program["status"])}>
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
            <div className="space-y-2">
              <Label htmlFor="program-category">카테고리</Label>
              <Input
                id="program-category"
                value={formCategory}
                onChange={(e) => setFormCategory(e.target.value)}
                placeholder="자율독서, 멘토링, 공모전 등"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              취소
            </Button>
            <Button onClick={handleSubmit}>
              {editingProgram ? "수정" : "등록"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>프로그램 삭제</DialogTitle>
            <DialogDescription>정말로 이 프로그램을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.</DialogDescription>
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
