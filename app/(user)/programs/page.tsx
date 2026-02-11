"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Plus,
  Calendar,
  Users,
  ChevronRight,
  X,
  Pencil,
  Trash2,
  CalendarPlus,
  Sun,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/auth-context"
import { usePrograms, type CustomProgram } from "@/lib/program-context"

const gradientOptions = [
  { id: "from-amber-400 to-orange-500", label: "주황", preview: "bg-gradient-to-br from-amber-400 to-orange-500" },
  { id: "from-emerald-400 to-teal-500", label: "초록", preview: "bg-gradient-to-br from-emerald-400 to-teal-500" },
  { id: "from-sky-400 to-blue-500", label: "파랑", preview: "bg-gradient-to-br from-sky-400 to-blue-500" },
  { id: "from-purple-400 to-indigo-500", label: "보라", preview: "bg-gradient-to-br from-purple-400 to-indigo-500" },
  { id: "from-pink-400 to-rose-500", label: "분홍", preview: "bg-gradient-to-br from-pink-400 to-rose-500" },
  { id: "from-primary to-emerald-600", label: "기본", preview: "bg-gradient-to-br from-primary to-emerald-600" },
]

interface ProgramForm {
  id?: string
  name: string
  description: string
  notice: string
  gradient: string
  accentText: string
  hasCalendar: boolean
  startDate: string
  endDate: string
  customFields: { label: string; value: string }[]
  isActive: boolean
}

const emptyForm: ProgramForm = {
  name: "",
  description: "",
  notice: "",
  gradient: "from-emerald-400 to-teal-500",
  accentText: "",
  hasCalendar: false,
  startDate: "",
  endDate: "",
  customFields: [],
  isActive: true,
}

// 기본 프로그램 카드 (독모, 독토)
const defaultPrograms = [
  {
    id: "dokmo",
    name: "독모 (독서모임)",
    description: "시간대별로 진행되는 독서모임입니다. 아침, 점심, 저녁 중 원하는 시간에 참여하세요.",
    gradient: "from-amber-400 via-sky-400 to-indigo-500",
    accentText: "독서",
    href: "/programs/dokmo",
    icon: Sun,
    stats: { groups: 3, times: "6:00-22:00" },
  },
  {
    id: "dokto",
    name: "독토 (독서토론회)",
    description: "학생, 교수, 작가와 함께하는 깊이 있는 독서 토론 프로그램입니다.",
    gradient: "from-emerald to-teal-500",
    accentText: "토론",
    href: "/programs/dokto",
    icon: Users,
    stats: { groups: 6, active: "진행 중" },
  },
]

export default function ProgramsPage() {
  const { isAdmin } = useAuth()
  const { customPrograms, addProgram, updateProgram, deleteProgram } = usePrograms()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProgram, setEditingProgram] = useState<ProgramForm | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [newFieldLabel, setNewFieldLabel] = useState("")
  const [newFieldValue, setNewFieldValue] = useState("")

  const handleCreate = () => {
    setEditingProgram(emptyForm)
    setIsModalOpen(true)
  }

  const handleEdit = (program: CustomProgram) => {
    setEditingProgram({
      id: program.id,
      name: program.name,
      description: program.description,
      notice: program.notice,
      gradient: program.gradient,
      accentText: program.accentText,
      hasCalendar: program.hasCalendar,
      startDate: program.startDate || "",
      endDate: program.endDate || "",
      customFields: [...program.customFields],
      isActive: program.isActive,
    })
    setIsModalOpen(true)
  }

  const handleDelete = (id: string) => {
    setDeleteConfirm(id)
  }

  const confirmDelete = () => {
    if (deleteConfirm) {
      deleteProgram(deleteConfirm)
      setDeleteConfirm(null)
    }
  }

  const handleSave = () => {
    if (!editingProgram) return

    if (editingProgram.id) {
      updateProgram(editingProgram.id, editingProgram)
    } else {
      addProgram(editingProgram)
    }
    setIsModalOpen(false)
    setEditingProgram(null)
  }

  const addCustomField = () => {
    if (!editingProgram || !newFieldLabel.trim()) return
    setEditingProgram({
      ...editingProgram,
      customFields: [
        ...editingProgram.customFields,
        { label: newFieldLabel, value: newFieldValue },
      ],
    })
    setNewFieldLabel("")
    setNewFieldValue("")
  }

  const removeCustomField = (index: number) => {
    if (!editingProgram) return
    setEditingProgram({
      ...editingProgram,
      customFields: editingProgram.customFields.filter((_, i) => i !== index),
    })
  }

  return (
    <div className="flex flex-col gap-4 pb-6">
      {/* Header */}
      <header className="px-5 pt-5 sm:px-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-foreground">오거서 프로그램</h1>
            <p className="mt-0.5 text-[11px] text-muted-foreground">
              다양한 독서 프로그램에 참여해보세요
            </p>
          </div>
          {isAdmin && (
            <button
              onClick={handleCreate}
              className="flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-md transition-all hover:shadow-lg hover:brightness-110"
            >
              <Plus size={14} />
              프로그램 추가
            </button>
          )}
        </div>
      </header>

      {/* 기본 프로그램 (독모, 독토) */}
      <section className="px-5 sm:px-8">
        <h2 className="mb-3 text-sm font-bold text-foreground">상시 프로그램</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {defaultPrograms.map((program) => {
            const Icon = program.icon
            return (
              <Link
                key={program.id}
                href={program.href}
                className="group relative overflow-hidden rounded-2xl shadow-sm transition-all hover:shadow-lg"
              >
                <div
                  className={cn(
                    "relative h-36 bg-gradient-to-br p-4",
                    program.gradient
                  )}
                >
                  {/* 배경 큰 텍스트 */}
                  <div className="absolute -right-2 top-1/2 -translate-y-1/2 select-none">
                    <span className="text-[60px] font-black text-white/15 leading-none">
                      {program.accentText}
                    </span>
                  </div>

                  <div className="relative">
                    <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-2.5 py-1 text-[10px] font-bold text-white backdrop-blur-sm">
                      <Icon size={12} />
                      상시 운영
                    </span>
                    <h3 className="mt-2 text-base font-bold text-white">
                      {program.name}
                    </h3>
                    <p className="mt-1 text-xs text-white/80 line-clamp-2">
                      {program.description}
                    </p>
                  </div>

                  {/* 화살표 */}
                  <div className="absolute bottom-4 right-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white transition-transform group-hover:translate-x-1">
                      <ChevronRight size={16} />
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      {/* 커스텀 프로그램 */}
      {customPrograms.length > 0 && (
        <section className="px-5 sm:px-8">
          <h2 className="mb-3 text-sm font-bold text-foreground">특별 프로그램</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {customPrograms.map((program) => (
              <div
                key={program.id}
                className="group relative overflow-hidden rounded-2xl shadow-sm transition-all hover:shadow-lg"
              >
                <div
                  className={cn(
                    "relative h-44 bg-gradient-to-br p-4",
                    program.gradient
                  )}
                >
                  {/* 배경 큰 텍스트 */}
                  <div className="absolute -right-2 top-1/2 -translate-y-1/2 select-none">
                    <span className="text-[50px] font-black text-white/15 leading-none">
                      {program.accentText}
                    </span>
                  </div>

                  {/* 관리 버튼 */}
                  {isAdmin && (
                    <div className="absolute right-3 top-3 z-10 flex gap-1">
                      <button
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          handleEdit(program)
                        }}
                        className="flex h-7 w-7 items-center justify-center rounded-full bg-white/30 text-white backdrop-blur-sm transition-colors hover:bg-white/50"
                        title="수정"
                      >
                        <Pencil size={12} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          handleDelete(program.id)
                        }}
                        className="flex h-7 w-7 items-center justify-center rounded-full bg-white/30 text-white backdrop-blur-sm transition-colors hover:bg-red-500/80"
                        title="삭제"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  )}

                  <div className="relative">
                    <div className="flex items-center gap-2">
                      {program.hasCalendar && program.startDate && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-2 py-0.5 text-[9px] font-medium text-white backdrop-blur-sm">
                          <Calendar size={10} />
                          {program.startDate} ~ {program.endDate}
                        </span>
                      )}
                      {!program.isActive && (
                        <span className="rounded-full bg-red-500/80 px-2 py-0.5 text-[9px] font-bold text-white">
                          비활성
                        </span>
                      )}
                    </div>
                    <h3 className="mt-2 text-base font-bold text-white">
                      {program.name}
                    </h3>
                    <p className="mt-1 text-xs text-white/80 line-clamp-2">
                      {program.description}
                    </p>
                    {program.notice && (
                      <p className="mt-2 text-[10px] text-white/60 line-clamp-2">
                        {program.notice}
                      </p>
                    )}
                  </div>

                  {/* 커스텀 필드 */}
                  {program.customFields.length > 0 && (
                    <div className="absolute bottom-12 left-4 right-4">
                      <div className="flex flex-wrap gap-1.5">
                        {program.customFields.slice(0, 2).map((field, i) => (
                          <span
                            key={i}
                            className="rounded-full bg-white/20 px-2 py-0.5 text-[9px] font-medium text-white backdrop-blur-sm"
                          >
                            {field.label}: {field.value}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 바로 이동 버튼 */}
                  <Link
                    href={`/programs/${program.id}`}
                    className="absolute bottom-3 right-3"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white transition-all hover:bg-white/40 group-hover:translate-x-1">
                      <ChevronRight size={16} />
                    </div>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {customPrograms.length === 0 && isAdmin && (
        <div className="mx-5 rounded-2xl border-2 border-dashed border-border bg-muted/30 p-8 text-center sm:mx-8">
          <Calendar size={40} className="mx-auto text-muted-foreground" />
          <h3 className="mt-3 font-semibold text-foreground">프로그램을 추가해보세요</h3>
          <p className="mt-1 text-xs text-muted-foreground">
            새로운 독서 프로그램을 만들어 학생들에게 공개할 수 있습니다.
          </p>
          <button
            onClick={handleCreate}
            className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground"
          >
            <Plus size={14} />
            첫 프로그램 만들기
          </button>
        </div>
      )}

      {/* Create/Edit Modal */}
      {isModalOpen && editingProgram && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-foreground/50 p-4 backdrop-blur-sm"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl border border-border bg-card shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-border px-6 py-4">
              <h2 className="text-lg font-bold text-foreground">
                {editingProgram.id ? "프로그램 수정" : "새 프로그램 추가"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors hover:bg-border hover:text-foreground"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex flex-col gap-4 px-6 py-6">
              {/* 프로그램명 */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">
                  프로그램명 *
                </label>
                <input
                  type="text"
                  value={editingProgram.name}
                  onChange={(e) =>
                    setEditingProgram({ ...editingProgram, name: e.target.value })
                  }
                  placeholder="예: 2026 독서 장학금"
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              {/* 프로그램 설명 */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">
                  프로그램 설명 *
                </label>
                <textarea
                  value={editingProgram.description}
                  onChange={(e) =>
                    setEditingProgram({ ...editingProgram, description: e.target.value })
                  }
                  placeholder="프로그램에 대한 간단한 설명을 입력하세요"
                  rows={3}
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              {/* 주의사항 및 안내 */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">
                  주의사항 및 안내
                </label>
                <textarea
                  value={editingProgram.notice}
                  onChange={(e) =>
                    setEditingProgram({ ...editingProgram, notice: e.target.value })
                  }
                  placeholder="* 서평 최소 400자 이상&#10;* 마감일 엄수"
                  rows={3}
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              {/* 그라데이션 색상 */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">
                  카드 색상
                </label>
                <div className="flex flex-wrap gap-2">
                  {gradientOptions.map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() =>
                        setEditingProgram({ ...editingProgram, gradient: opt.id })
                      }
                      className={cn(
                        "h-10 w-10 rounded-full transition-all",
                        opt.preview,
                        editingProgram.gradient === opt.id
                          ? "ring-2 ring-foreground ring-offset-2"
                          : "opacity-60 hover:opacity-100"
                      )}
                      title={opt.label}
                    />
                  ))}
                </div>
              </div>

              {/* 배경 텍스트 */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">
                  배경 텍스트 (2글자 권장)
                </label>
                <input
                  type="text"
                  value={editingProgram.accentText}
                  onChange={(e) =>
                    setEditingProgram({ ...editingProgram, accentText: e.target.value })
                  }
                  placeholder="예: 장학, 멘토"
                  maxLength={4}
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              {/* 캘린더 옵션 */}
              <div className="rounded-xl border border-border bg-muted/30 p-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={editingProgram.hasCalendar}
                    onChange={(e) =>
                      setEditingProgram({ ...editingProgram, hasCalendar: e.target.checked })
                    }
                    className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                  />
                  <CalendarPlus size={16} className="text-primary" />
                  <span className="text-sm font-medium text-foreground">기간 표시</span>
                </label>
                {editingProgram.hasCalendar && (
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <div>
                      <label className="mb-1 block text-xs text-muted-foreground">시작일</label>
                      <input
                        type="date"
                        value={editingProgram.startDate}
                        onChange={(e) =>
                          setEditingProgram({ ...editingProgram, startDate: e.target.value })
                        }
                        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs text-muted-foreground">종료일</label>
                      <input
                        type="date"
                        value={editingProgram.endDate}
                        onChange={(e) =>
                          setEditingProgram({ ...editingProgram, endDate: e.target.value })
                        }
                        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* 커스텀 필드 */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">
                  추가 정보 필드
                </label>
                {editingProgram.customFields.length > 0 && (
                  <div className="mb-2 flex flex-col gap-1">
                    {editingProgram.customFields.map((field, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2"
                      >
                        <span className="text-sm text-foreground">
                          <span className="font-medium">{field.label}:</span> {field.value}
                        </span>
                        <button
                          onClick={() => removeCustomField(i)}
                          className="text-muted-foreground hover:text-red-500"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newFieldLabel}
                    onChange={(e) => setNewFieldLabel(e.target.value)}
                    placeholder="항목명"
                    className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                  />
                  <input
                    type="text"
                    value={newFieldValue}
                    onChange={(e) => setNewFieldValue(e.target.value)}
                    placeholder="값"
                    className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                  />
                  <button
                    onClick={addCustomField}
                    disabled={!newFieldLabel.trim()}
                    className="rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              {/* 활성화 상태 */}
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={editingProgram.isActive}
                  onChange={(e) =>
                    setEditingProgram({ ...editingProgram, isActive: e.target.checked })
                  }
                  className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                />
                <span className="text-sm text-foreground">프로그램 활성화 (LNB 및 서평에 표시)</span>
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
                disabled={!editingProgram.name.trim() || !editingProgram.description.trim()}
                className="flex-1 rounded-xl bg-primary py-3 text-sm font-bold text-primary-foreground transition-all hover:brightness-110 disabled:opacity-50"
              >
                {editingProgram.id ? "수정" : "추가"}
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
              <h3 className="text-lg font-bold text-foreground">프로그램 삭제</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                정말 이 프로그램을 삭제하시겠습니까?
                <br />
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
