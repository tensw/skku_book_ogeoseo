"use client"

import { useState } from "react"
import { Plus, Pencil, Trash2, CalendarIcon, Settings, Power, Clock, MapPin, Wifi, Monitor, Users, BookOpen, MessageSquare, Sparkles } from "lucide-react"
import { format } from "date-fns"
import { ko } from "date-fns/locale"
import { bundoks as initialBundoks } from "@/lib/mock-data"
import type { Bundok } from "@/lib/types"
import { PageHeader } from "@/components/shared/page-header"
import { DataTable } from "@/components/shared/data-table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Switch } from "@/components/ui/switch"
import { usePrograms, type CustomProgram } from "@/lib/program-context"
import { cn } from "@/lib/utils"
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

const detailStatusColors: Record<string, string> = {
  recruiting: "bg-primary text-primary-foreground",
  confirmed: "bg-emerald text-white",
  completed: "bg-muted text-muted-foreground",
}

const formatIcons: Record<string, typeof MapPin> = {
  offline: MapPin,
  online: Wifi,
  hybrid: Monitor,
}

const formatLabels: Record<string, string> = {
  offline: "오프라인",
  online: "온라인",
  hybrid: "하이브리드",
}


export default function AdminProgramsPage() {
  // 탭 상태
  const [activeTab, setActiveTab] = useState("bundok")

  // 번독 관련 상태
  const [bundokList, setBundokList] = useState<Bundok[]>(() => [...initialBundoks])
  const [statusFilter, setStatusFilter] = useState<Bundok["status"] | "all">("all")
  const [detailBundok, setDetailBundok] = useState<Bundok | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deletingId, setDeletingId] = useState<number | null>(null)

  const {
    customPrograms,
    addProgram,
    updateProgram,
    deleteProgram,
  } = usePrograms()

  // 커스텀 프로그램 등록/수정 다이얼로그 상태
  const [programDialogOpen, setProgramDialogOpen] = useState(false)
  const [editingProgram, setEditingProgram] = useState<CustomProgram | null>(null)
  const [deleteProgramDialogOpen, setDeleteProgramDialogOpen] = useState(false)
  const [deletingProgramId, setDeletingProgramId] = useState<string | null>(null)

  // 프로그램 폼 상태
  const [progName, setProgName] = useState("")
  const [progDescription, setProgDescription] = useState("")
  const [progNotice, setProgNotice] = useState("")
  const [progStartDate, setProgStartDate] = useState<Date | undefined>(undefined)
  const [progEndDate, setProgEndDate] = useState<Date | undefined>(undefined)
  const [progIsActive, setProgIsActive] = useState(true)

  // 탭 목록 구성
  const tabs = [
    { id: "bundok", label: "번독" },
    ...customPrograms.map((p) => ({ id: p.id, label: p.name })),
  ]

  const activeProgram = customPrograms.find((p) => p.id === activeTab)

  // === 번독 관련 함수 ===
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

  // === 커스텀 프로그램 관련 함수 ===
  function openProgramCreate() {
    setEditingProgram(null)
    setProgName("")
    setProgDescription("")
    setProgNotice("")
    setProgStartDate(undefined)
    setProgEndDate(undefined)
    setProgIsActive(true)
    setProgramDialogOpen(true)
  }

  function openProgramEdit(program: CustomProgram) {
    setEditingProgram(program)
    setProgName(program.name)
    setProgDescription(program.description)
    setProgNotice(program.notice)
    setProgStartDate(program.startDate ? new Date(program.startDate) : undefined)
    setProgEndDate(program.endDate ? new Date(program.endDate) : undefined)
    setProgIsActive(program.isActive)
    setProgramDialogOpen(true)
  }

  function handleProgramSubmit() {
    if (!progName.trim()) return

    const programData = {
      name: progName,
      description: progDescription,
      notice: progNotice,
      gradient: "from-blue-500 to-purple-500",
      accentText: "text-blue-600",
      hasCalendar: false,
      startDate: progStartDate ? format(progStartDate, "yyyy-MM-dd") : undefined,
      endDate: progEndDate ? format(progEndDate, "yyyy-MM-dd") : undefined,
      customFields: [],
      isActive: progIsActive,
    }

    if (editingProgram) {
      updateProgram(editingProgram.id, programData)
    } else {
      addProgram(programData)
    }
    setProgramDialogOpen(false)
  }

  function confirmProgramDelete(id: string) {
    setDeletingProgramId(id)
    setDeleteProgramDialogOpen(true)
  }

  function handleProgramDelete() {
    if (deletingProgramId) {
      deleteProgram(deletingProgramId)
      if (activeTab === deletingProgramId) {
        setActiveTab("bundok")
      }
    }
    setDeleteProgramDialogOpen(false)
    setDeletingProgramId(null)
  }

  function toggleProgramActive(program: CustomProgram) {
    updateProgram(program.id, { isActive: !program.isActive })
  }

  // === 번독 테이블 컬럼 ===
  const columns = [
    { key: "id", label: "번호", className: "w-16", hideOnMobile: true },
    {
      key: "title",
      label: "번독명",
      render: (val: string, row: Bundok) => (
        <button
          onClick={() => setDetailBundok(row)}
          className="text-left font-medium text-primary hover:underline"
        >
          {val}
        </button>
      ),
    },
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
      className: "w-20 whitespace-nowrap",
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
          <Button variant="ghost" size="sm" onClick={() => confirmDelete(row.id)}>
            <Trash2 size={14} className="text-destructive" />
          </Button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader title="프로그램 관리" />

      {/* 프로그램 탭 */}
      <div className="px-5 sm:px-8">
        <div className="no-scrollbar flex gap-2 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex-shrink-0 rounded-full px-4 py-2 text-xs font-semibold transition-all",
                activeTab === tab.id
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "bg-muted text-muted-foreground hover:bg-border"
              )}
            >
              {tab.label}
            </button>
          ))}
          <button
            onClick={openProgramCreate}
            className="flex-shrink-0 flex items-center gap-1 rounded-full border-2 border-dashed border-border px-4 py-2 text-xs font-semibold text-muted-foreground transition-all hover:border-primary hover:text-primary"
          >
            <Plus size={14} />
            프로그램 추가
          </button>
        </div>
      </div>

      {/* === 번독 탭 콘텐츠 === */}
      {activeTab === "bundok" && (
        <>
          <div className="px-5 sm:px-8">
            <div className="flex gap-2">
              {(["all", "recruiting", "confirmed", "completed"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={cn(
                    "rounded-full px-3 py-1.5 text-xs font-semibold transition-all",
                    statusFilter === s
                      ? s === "all"
                        ? "bg-foreground text-background shadow-sm"
                        : statusColors[s] + " shadow-sm ring-1 ring-current"
                      : "bg-muted text-muted-foreground hover:bg-border"
                  )}
                >
                  {s === "all" ? "전체" : statusLabels[s]}
                  <span className="ml-1 text-[10px] opacity-70">
                    {s === "all"
                      ? bundokList.length
                      : bundokList.filter((b) => b.status === s).length}
                  </span>
                </button>
              ))}
            </div>
          </div>
          <div className="px-5 sm:px-8">
            <DataTable
              columns={columns}
              data={statusFilter === "all" ? bundokList : bundokList.filter((b) => b.status === statusFilter)}
              className="[&_td]:py-1.5 [&_th]:h-9"
            />
          </div>
        </>
      )}

      {/* === 커스텀 프로그램 탭 콘텐츠 === */}
      {activeProgram && (
        <div className="px-5 sm:px-8">
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            {/* 프로그램 헤더 */}
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                    <Settings size={24} className="text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-bold text-foreground">{activeProgram.name}</h2>
                      <span
                        className={cn(
                          "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold",
                          activeProgram.isActive
                            ? "bg-green-50 text-green-600"
                            : "bg-gray-100 text-gray-500"
                        )}
                      >
                        <Power size={10} />
                        {activeProgram.isActive ? "활성" : "비활성"}
                      </span>
                    </div>
                    {activeProgram.description && (
                      <p className="mt-1 text-sm text-muted-foreground">{activeProgram.description}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => openProgramEdit(activeProgram)}>
                    <Pencil size={14} />
                    수정
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                    onClick={() => confirmProgramDelete(activeProgram.id)}
                  >
                    <Trash2 size={14} />
                    삭제
                  </Button>
                </div>
              </div>

              {/* 프로그램 상세 정보 */}
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {/* 공지사항 */}
                {activeProgram.notice && (
                  <div className="sm:col-span-2 rounded-lg border border-border bg-muted/30 p-4">
                    <p className="text-xs font-semibold text-muted-foreground mb-1">공지사항</p>
                    <p className="text-sm text-foreground whitespace-pre-wrap">{activeProgram.notice}</p>
                  </div>
                )}

                {/* 운영 기간 */}
                <div className="rounded-lg border border-border bg-muted/30 p-4">
                  <p className="text-xs font-semibold text-muted-foreground mb-1">운영 기간</p>
                  <p className="text-sm text-foreground">
                    {activeProgram.startDate && activeProgram.endDate
                      ? `${activeProgram.startDate} ~ ${activeProgram.endDate}`
                      : activeProgram.startDate
                        ? `${activeProgram.startDate} ~`
                        : activeProgram.endDate
                          ? `~ ${activeProgram.endDate}`
                          : "미정"}
                  </p>
                </div>

                {/* 활성 상태 토글 */}
                <div className="rounded-lg border border-border bg-muted/30 p-4">
                  <p className="text-xs font-semibold text-muted-foreground mb-2">활성 상태</p>
                  <div className="flex items-center gap-3">
                    <Switch
                      checked={activeProgram.isActive}
                      onCheckedChange={() => toggleProgramActive(activeProgram)}
                    />
                    <span className="text-sm text-foreground">
                      {activeProgram.isActive ? "프로그램이 활성화되어 있습니다" : "프로그램이 비활성화되어 있습니다"}
                    </span>
                  </div>
                </div>
              </div>

              {/* 생성일 */}
              <div className="mt-4 text-xs text-muted-foreground">
                생성일: {activeProgram.createdAt}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* === 다이얼로그 모음 === */}

      {/* 번독 상세 다이얼로그 */}
      <Dialog open={!!detailBundok} onOpenChange={(open) => !open && setDetailBundok(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-md p-0">
          {detailBundok && (() => {
            const FormatIcon = formatIcons[detailBundok.format] || MapPin
            const formatDate = (dateStr: string) => {
              const d = new Date(dateStr)
              const days = ["일", "월", "화", "수", "목", "금", "토"]
              return `${d.getMonth() + 1}월 ${d.getDate()}일 (${days[d.getDay()]})`
            }
            return (
              <div className="flex flex-col gap-0">
                {/* Hero */}
                <div className="relative overflow-hidden rounded-t-lg bg-gradient-to-br from-primary/20 via-emerald/10 to-mint/10 p-5">
                  <div className="flex gap-4">
                    <div className="relative h-36 w-24 flex-shrink-0 overflow-hidden rounded-xl shadow-lg">
                      <img
                        src={detailBundok.bookCover || "/placeholder.svg"}
                        alt={detailBundok.book}
                        className="h-full w-full object-cover"
                        crossOrigin="anonymous"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className={cn("inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold", detailStatusColors[detailBundok.status])}>
                        {statusLabels[detailBundok.status]}
                      </span>
                      <h2 className="mt-1.5 text-lg font-bold text-foreground leading-tight">{detailBundok.title}</h2>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {detailBundok.book} · {detailBundok.bookAuthor}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {detailBundok.tags.map((tag) => (
                          <span key={tag} className="rounded-full bg-primary/10 px-2 py-0.5 text-[9px] font-medium text-primary">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-3 p-5">
                  {/* 모임 정보 */}
                  <div className="rounded-2xl border border-border bg-card p-4">
                    <h3 className="text-sm font-bold text-foreground mb-3">모임 정보</h3>
                    <div className="flex flex-col gap-2.5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                          <Clock size={14} className="text-primary" />
                        </div>
                        <div>
                          <p className="text-xs font-medium text-foreground">{formatDate(detailBundok.date)} {detailBundok.time}</p>
                          <p className="text-[10px] text-muted-foreground">{detailBundok.duration}분 소요</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald/10">
                          <FormatIcon size={14} className="text-emerald" />
                        </div>
                        <div>
                          <p className="text-xs font-medium text-foreground">{formatLabels[detailBundok.format]}</p>
                          <p className="text-[10px] text-muted-foreground">{detailBundok.location}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-tangerine/10">
                          <Users size={14} className="text-tangerine" />
                        </div>
                        <div>
                          <p className="text-xs font-medium text-foreground">
                            {detailBundok.currentMembers}/{detailBundok.maxMembers}명
                            {detailBundok.currentMembers >= detailBundok.maxMembers && (
                              <span className="ml-1 text-[10px] text-muted-foreground">(마감)</span>
                            )}
                          </p>
                          <p className="text-[10px] text-muted-foreground">소규모 모임 (최대 {detailBundok.maxMembers}명)</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 참여 멤버 */}
                  {detailBundok.members && detailBundok.members.length > 0 && (
                    <div className="rounded-2xl border border-border bg-card p-4">
                      <h3 className="flex items-center gap-2 text-sm font-bold text-foreground mb-3">
                        <Users size={14} className="text-primary" />
                        참여 멤버 ({detailBundok.members.length}명)
                      </h3>
                      <div className="flex flex-col gap-1.5">
                        {detailBundok.members.map((m, i) => (
                          <div key={i} className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2">
                            <span className="text-xs font-medium text-foreground">{m.nickname}</span>
                            <span className="text-xs text-muted-foreground">{m.realName}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 개설자 */}
                  <div className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4">
                    <img
                      src={detailBundok.hostAvatar || "/placeholder.svg"}
                      alt={detailBundok.host}
                      className="h-10 w-10 rounded-full object-cover ring-2 ring-primary/20"
                      crossOrigin="anonymous"
                    />
                    <div>
                      <p className="text-xs font-bold text-foreground">{detailBundok.host}</p>
                      <p className="text-[10px] text-muted-foreground">모임 개설자</p>
                    </div>
                  </div>

                  {/* AI 추천 도서 */}
                  {detailBundok.aiBooks && detailBundok.aiBooks.length > 0 && (
                    <div className="rounded-2xl border border-border bg-card p-4">
                      <h3 className="flex items-center gap-2 text-sm font-bold text-foreground mb-3">
                        <Sparkles size={14} className="text-tangerine" />
                        AI 추천 관련 도서
                      </h3>
                      <div className="flex flex-col gap-2">
                        {detailBundok.aiBooks.map((book, i) => (
                          <div key={i} className="flex items-center gap-2.5 rounded-xl bg-muted/50 px-3 py-2.5">
                            <BookOpen size={14} className="text-primary flex-shrink-0" />
                            <span className="text-xs font-medium text-foreground">{book}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 토론 질문 */}
                  {detailBundok.discussionQuestions && detailBundok.discussionQuestions.length > 0 && (
                    <div className="rounded-2xl border border-border bg-card p-4">
                      <h3 className="flex items-center gap-2 text-sm font-bold text-foreground mb-3">
                        <MessageSquare size={14} className="text-mint" />
                        토론 질문
                      </h3>
                      <div className="flex flex-col gap-2">
                        {detailBundok.discussionQuestions.map((q, i) => (
                          <div key={i} className="flex gap-2.5 rounded-xl bg-muted/50 px-3 py-2.5">
                            <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-primary/20 text-[10px] font-bold text-primary">
                              {i + 1}
                            </span>
                            <span className="text-xs leading-relaxed text-foreground">{q}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )
          })()}
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

      {/* 프로그램 등록/수정 다이얼로그 */}
      <Dialog open={programDialogOpen} onOpenChange={setProgramDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingProgram ? "프로그램 수정" : "프로그램 등록"}</DialogTitle>
            <DialogDescription>
              {editingProgram ? "프로그램 정보를 수정합니다." : "새 프로그램을 등록합니다."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="prog-name">프로그램 이름 *</Label>
              <Input
                id="prog-name"
                value={progName}
                onChange={(e) => setProgName(e.target.value)}
                placeholder="독서 마라톤"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="prog-desc">설명</Label>
              <Textarea
                id="prog-desc"
                value={progDescription}
                onChange={(e) => setProgDescription(e.target.value)}
                placeholder="프로그램에 대한 간략한 설명"
                className="min-h-[60px]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="prog-notice">공지사항</Label>
              <Textarea
                id="prog-notice"
                value={progNotice}
                onChange={(e) => setProgNotice(e.target.value)}
                placeholder="참여자에게 전달할 공지사항"
                className="min-h-[60px]"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>시작일</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !progStartDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {progStartDate ? format(progStartDate, "yyyy-MM-dd", { locale: ko }) : "시작일"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={progStartDate}
                      onSelect={setProgStartDate}
                      locale={ko}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label>종료일</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !progEndDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {progEndDate ? format(progEndDate, "yyyy-MM-dd", { locale: ko }) : "종료일"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={progEndDate}
                      onSelect={setProgEndDate}
                      locale={ko}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-border p-3">
              <div>
                <Label className="text-sm font-medium">활성 상태</Label>
                <p className="text-xs text-muted-foreground">비활성 시 사용자에게 노출되지 않습니다</p>
              </div>
              <Switch
                checked={progIsActive}
                onCheckedChange={setProgIsActive}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setProgramDialogOpen(false)}>
              취소
            </Button>
            <Button onClick={handleProgramSubmit} disabled={!progName.trim()}>
              {editingProgram ? "수정" : "등록"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 프로그램 삭제 다이얼로그 */}
      <Dialog open={deleteProgramDialogOpen} onOpenChange={setDeleteProgramDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>프로그램 삭제</DialogTitle>
            <DialogDescription>
              정말로 이 프로그램을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteProgramDialogOpen(false)}>
              취소
            </Button>
            <Button variant="destructive" onClick={handleProgramDelete}>
              삭제
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
