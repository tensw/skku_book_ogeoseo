"use client"

import { useState, useMemo } from "react"
import { Trash2, FileSpreadsheet, FileText, Download, Star, Eye, ChevronLeft, List, FileOutput } from "lucide-react"
import { format, subHours, subDays } from "date-fns"
import { reviews as initialReviews, mockStudents } from "@/lib/mock-data"
import type { BookReview } from "@/lib/types"
import { usePrograms } from "@/lib/program-context"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

type ExportType = "excel" | "pdf"

const tabs = [
  { id: "student", label: "학생별 서평 조회" },
  { id: "all", label: "전체 서평 조회" },
  { id: "program", label: "프로그램별 충족도" },
]

function getProgramLabel(programId?: string, programOptions?: { id: string; label: string }[]) {
  if (!programId) return "-"
  const opt = programOptions?.find((o) => o.id === programId)
  return opt?.label ?? programId
}

function resolveDate(timeAgo: string): Date {
  const now = new Date()
  const hourMatch = timeAgo.match(/(\d+)시간/)
  const dayMatch = timeAgo.match(/(\d+)일/)
  if (hourMatch) return subHours(now, Number(hourMatch[1]))
  if (dayMatch) return subDays(now, Number(dayMatch[1]))
  return now
}

export default function AdminReviewsPage() {
  const [reviewList, setReviewList] = useState<BookReview[]>(() => [...initialReviews])
  const [activeTab, setActiveTab] = useState("student")
  const { getAllProgramOptions } = usePrograms()
  const programOptions = getAllProgramOptions()

  // 공통: 삭제
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deletingId, setDeletingId] = useState<number | null>(null)

  // 공통: export
  const [exportDialogOpen, setExportDialogOpen] = useState(false)
  const [exportType, setExportType] = useState<ExportType>("excel")
  const [dateRange, setDateRange] = useState({ start: "2026-01-01", end: "2026-12-31" })
  const [exportContext, setExportContext] = useState<string>("")

  // 탭1: 학생별
  const [studentSearch, setStudentSearch] = useState("")
  const [selectedStudent, setSelectedStudent] = useState<typeof mockStudents[number] | null>(null)
  const [viewingReview, setViewingReview] = useState<BookReview | null>(null)

  // 탭2: 전체
  const [allSearch, setAllSearch] = useState("")

  // 탭3: 프로그램별 충족도
  const [selectedProgramId, setSelectedProgramId] = useState("")
  const [minReviews, setMinReviews] = useState(1)
  const [detailStudent, setDetailStudent] = useState<{ name: string; studentId: string } | null>(null)

  /* ── 삭제 ── */
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

  /* ── Export ── */
  function openExportDialog(type: ExportType, context: string) {
    setExportType(type)
    setExportContext(context)
    setExportDialogOpen(true)
  }
  function handleExport() {
    alert(`${exportType === "excel" ? "엑셀" : "PDF"} 추출이 시작됩니다.\n기간: ${dateRange.start} ~ ${dateRange.end}\n범위: ${exportContext}`)
    setExportDialogOpen(false)
  }

  /* ── 탭1: 학생별 데이터 ── */
  const filteredStudents = useMemo(() => {
    if (!studentSearch.trim()) return mockStudents
    return mockStudents.filter(
      (s) =>
        s.name.includes(studentSearch) ||
        s.studentId.includes(studentSearch) ||
        s.department.includes(studentSearch)
    )
  }, [studentSearch])

  const studentReviews = useMemo(() => {
    if (!selectedStudent) return []
    return reviewList.filter((r) => r.user.studentId === selectedStudent.studentId)
  }, [selectedStudent, reviewList])

  const studentReviewColumns = [
    {
      key: "book",
      label: "도서명",
      render: (_: unknown, row: BookReview) => (
        <button
          onClick={() => setViewingReview(row)}
          className="text-left font-medium text-primary hover:underline"
        >
          {row.book.title}
        </button>
      ),
    },
    {
      key: "programId",
      label: "프로그램",
      className: "w-28",
      hideOnMobile: true,
      render: (_: unknown, row: BookReview) => (
        <span className="inline-flex rounded-full bg-blue-50 px-2 py-0.5 text-[11px] font-semibold text-blue-600">
          {getProgramLabel(row.programId, programOptions)}
        </span>
      ),
    },
    {
      key: "rating",
      label: "평점",
      className: "w-20",
      render: (val: number) => (
        <span className="flex items-center gap-1 text-amber-500">
          <Star size={12} fill="currentColor" /> {val}
        </span>
      ),
    },
    {
      key: "timeAgo",
      label: "작성일",
      className: "w-32 whitespace-nowrap",
      hideOnMobile: true,
      render: (val: string) => (
        <span className="text-muted-foreground">{format(resolveDate(val), "yyyy.MM.dd")}</span>
      ),
    },
    {
      key: "view",
      label: "보기",
      className: "w-16",
      render: (_: unknown, row: BookReview) => (
        <Button variant="ghost" size="sm" onClick={() => setViewingReview(row)}>
          <Eye size={14} />
        </Button>
      ),
    },
  ]

  /* ── 탭2: 전체 데이터 ── */
  const filteredAll = useMemo(() => {
    return reviewList.filter(
      (r) =>
        r.user.name.toLowerCase().includes(allSearch.toLowerCase()) ||
        r.book.title.toLowerCase().includes(allSearch.toLowerCase()) ||
        (r.user.studentId && r.user.studentId.includes(allSearch))
    )
  }, [allSearch, reviewList])

  const allColumns = [
    { key: "id", label: "번호", className: "w-14", hideOnMobile: true },
    {
      key: "user",
      label: "작성자",
      className: "w-36",
      render: (_: unknown, row: BookReview) => (
        <div>
          <span className="font-medium">{row.user.name}</span>
          {row.user.studentId && (
            <span className="ml-1 text-xs text-muted-foreground">({row.user.studentId})</span>
          )}
        </div>
      ),
    },
    {
      key: "book",
      label: "도서",
      render: (_: unknown, row: BookReview) => row.book.title,
    },
    {
      key: "programId",
      label: "프로그램",
      className: "w-28",
      hideOnMobile: true,
      render: (_: unknown, row: BookReview) => (
        <span className="inline-flex rounded-full bg-blue-50 px-2 py-0.5 text-[11px] font-semibold text-blue-600">
          {getProgramLabel(row.programId, programOptions)}
        </span>
      ),
    },
    {
      key: "type",
      label: "유형",
      className: "w-24",
      hideOnMobile: true,
      render: (val: string) => (
        <span
          className={cn(
            "inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold",
            val === "program"
              ? "bg-blue-50 text-blue-600"
              : "bg-emerald-50 text-emerald-600"
          )}
        >
          {val === "program" ? "프로그램" : "오거서"}
        </span>
      ),
    },
    {
      key: "timeAgo",
      label: "작성일",
      className: "w-32 whitespace-nowrap",
      hideOnMobile: true,
      render: (val: string) => (
        <span className="text-muted-foreground">{format(resolveDate(val), "yyyy.MM.dd HH:mm")}</span>
      ),
    },
    {
      key: "actions",
      label: "관리",
      className: "w-16",
      render: (_: unknown, row: BookReview) => (
        <Button variant="ghost" size="sm" onClick={() => confirmDelete(row.id)}>
          <Trash2 size={14} className="text-destructive" />
        </Button>
      ),
    },
  ]

  /* ── 탭3: 프로그램별 충족도 ── */
  const fulfillmentData = useMemo(() => {
    if (!selectedProgramId) return []
    const programReviews = reviewList.filter((r) => r.programId === selectedProgramId)
    const studentMap = new Map<string, { name: string; studentId: string; department: string; count: number }>()
    for (const r of programReviews) {
      const sid = r.user.studentId ?? "unknown"
      const existing = studentMap.get(sid)
      if (existing) {
        existing.count++
      } else {
        studentMap.set(sid, {
          name: r.user.name,
          studentId: sid,
          department: r.user.department ?? "-",
          count: 1,
        })
      }
    }
    return Array.from(studentMap.values()).filter((s) => s.count >= minReviews)
  }, [selectedProgramId, minReviews, reviewList])

  const fulfillmentColumns = [
    { key: "name", label: "이름", className: "w-24" },
    { key: "studentId", label: "학번", className: "w-32", hideOnMobile: true },
    { key: "department", label: "학과", hideOnMobile: true },
    { key: "count", label: "서평 수", className: "w-20" },
    {
      key: "detail",
      label: "상세보기",
      className: "w-24",
      render: (_: unknown, row: { name: string; studentId: string }) => (
        <Button variant="ghost" size="sm" onClick={() => setDetailStudent(row)}>
          <Eye size={14} className="mr-1" /> 보기
        </Button>
      ),
    },
  ]

  const detailReviews = useMemo(() => {
    if (!detailStudent || !selectedProgramId) return []
    return reviewList.filter(
      (r) => r.user.studentId === detailStudent.studentId && r.programId === selectedProgramId
    )
  }, [detailStudent, selectedProgramId, reviewList])

  /* ── Render ── */
  return (
    <div className="space-y-6">
      <PageHeader title="서평 관리" />

      <div className="px-5 sm:px-8">
        <FilterTabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      {/* ───────── 탭1: 학생별 서평 조회 ───────── */}
      {activeTab === "student" && (
        <div className="space-y-4">
          {!selectedStudent ? (
            <>
              <div className="px-5 sm:px-8">
                <SearchBar
                  value={studentSearch}
                  onChange={setStudentSearch}
                  placeholder="학생 이름, 학번으로 검색..."
                />
              </div>
              <div className="px-5 sm:px-8">
                <div className="space-y-2">
                  {filteredStudents.map((student) => {
                    const reviewCount = reviewList.filter((r) => r.user.studentId === student.studentId).length
                    return (
                      <button
                        key={student.id}
                        onClick={() => setSelectedStudent(student)}
                        className="flex w-full items-center justify-between rounded-xl border border-border bg-card p-4 text-left transition-colors hover:bg-muted/50"
                      >
                        <div>
                          <p className="font-semibold text-foreground">{student.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {student.studentId} · {student.department}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                            서평 {reviewCount}편
                          </span>
                          <ChevronLeft size={16} className="rotate-180 text-muted-foreground" />
                        </div>
                      </button>
                    )
                  })}
                  {filteredStudents.length === 0 && (
                    <p className="py-8 text-center text-sm text-muted-foreground">검색 결과가 없습니다.</p>
                  )}
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="px-5 sm:px-8">
                <button
                  onClick={() => setSelectedStudent(null)}
                  className="mb-3 flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
                >
                  <ChevronLeft size={16} /> 학생 목록으로
                </button>
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold">{selectedStudent.name}</h2>
                    <p className="text-xs text-muted-foreground">
                      {selectedStudent.studentId} · {selectedStudent.department} · 서평 {studentReviews.length}편
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openExportDialog("excel", `${selectedStudent.name} 학생 서평 리스트`)}
                      className="gap-1.5"
                    >
                      <List size={14} className="text-blue-600" />
                      리스트 출력
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openExportDialog("pdf", `${selectedStudent.name} 학생 서평 전체 (본문 포함)`)}
                      className="gap-1.5"
                    >
                      <FileOutput size={14} className="text-violet-600" />
                      전체 출력
                    </Button>
                  </div>
                </div>
              </div>
              <div className="px-5 sm:px-8">
                <DataTable
                  columns={studentReviewColumns}
                  data={studentReviews}
                  className="[&_td]:py-1.5 [&_th]:h-9"
                />
              </div>
            </>
          )}
        </div>
      )}

      {/* ───────── 탭2: 전체 서평 조회 ───────── */}
      {activeTab === "all" && (
        <div className="space-y-4">
          <div className="px-5 sm:px-8">
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex-1">
                <SearchBar value={allSearch} onChange={setAllSearch} placeholder="작성자, 학번, 도서명으로 검색..." />
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => openExportDialog("excel", "전체 서평")}
                className="gap-1.5"
              >
                <FileSpreadsheet size={14} className="text-emerald-600" />
                엑셀
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => openExportDialog("pdf", "전체 서평")}
                className="gap-1.5"
              >
                <FileText size={14} className="text-red-500" />
                PDF
              </Button>
            </div>
          </div>
          <div className="px-5 sm:px-8">
            <DataTable columns={allColumns} data={filteredAll} className="[&_td]:py-1.5 [&_th]:h-9" />
          </div>
        </div>
      )}

      {/* ───────── 탭3: 프로그램별 충족도 확인 ───────── */}
      {activeTab === "program" && (
        <div className="space-y-4">
          <div className="px-5 sm:px-8">
            <div className="flex flex-wrap items-end gap-3">
              <div className="flex-1 min-w-[180px]">
                <label className="mb-1.5 block text-xs font-medium text-muted-foreground">프로그램 선택</label>
                <Select value={selectedProgramId} onValueChange={setSelectedProgramId}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="프로그램을 선택하세요" />
                  </SelectTrigger>
                  <SelectContent>
                    {programOptions.map((opt) => (
                      <SelectItem key={opt.id} value={opt.id}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="w-36">
                <label className="mb-1.5 block text-xs font-medium text-muted-foreground">서평 N편 이상</label>
                <input
                  type="number"
                  min={1}
                  value={minReviews}
                  onChange={(e) => setMinReviews(Math.max(1, Number(e.target.value)))}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                />
              </div>
              {selectedProgramId && (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      openExportDialog(
                        "excel",
                        `${getProgramLabel(selectedProgramId, programOptions)} 충족 학생`
                      )
                    }
                    className="gap-1.5"
                  >
                    <FileSpreadsheet size={14} className="text-emerald-600" />
                    엑셀
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      openExportDialog(
                        "pdf",
                        `${getProgramLabel(selectedProgramId, programOptions)} 충족 학생`
                      )
                    }
                    className="gap-1.5"
                  >
                    <FileText size={14} className="text-red-500" />
                    PDF
                  </Button>
                </div>
              )}
            </div>
          </div>

          {selectedProgramId ? (
            <div className="px-5 sm:px-8">
              <p className="mb-3 text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">{getProgramLabel(selectedProgramId, programOptions)}</span> 프로그램에서
                서평 <span className="font-semibold text-foreground">{minReviews}편 이상</span> 작성한 학생:{" "}
                <span className="font-semibold text-primary">{fulfillmentData.length}명</span>
              </p>
              <DataTable
                columns={fulfillmentColumns}
                data={fulfillmentData}
                className="[&_td]:py-1.5 [&_th]:h-9"
              />
            </div>
          ) : (
            <div className="px-5 sm:px-8">
              <p className="py-12 text-center text-sm text-muted-foreground">
                프로그램을 선택하면 충족도를 확인할 수 있습니다.
              </p>
            </div>
          )}
        </div>
      )}

      {/* ───────── 삭제 다이얼로그 ───────── */}
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

      {/* ───────── Export 다이얼로그 ───────── */}
      <Dialog open={exportDialogOpen} onOpenChange={setExportDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {exportContext.includes("리스트") ? (
                <List size={20} className="text-blue-600" />
              ) : exportContext.includes("전체") ? (
                <FileOutput size={20} className="text-violet-600" />
              ) : exportType === "excel" ? (
                <FileSpreadsheet size={20} className="text-emerald-600" />
              ) : (
                <FileText size={20} className="text-red-500" />
              )}
              {exportContext.includes("리스트")
                ? "리스트 출력"
                : exportContext.includes("전체")
                  ? "전체 출력"
                  : exportType === "excel"
                    ? "엑셀 추출"
                    : "PDF 추출"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium">기간 설정</label>
              <div className="flex items-center gap-2">
                <input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => setDateRange((prev) => ({ ...prev, start: e.target.value }))}
                  className="flex-1 rounded-lg border border-input bg-background px-3 py-2 text-sm"
                />
                <span className="text-muted-foreground">~</span>
                <input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => setDateRange((prev) => ({ ...prev, end: e.target.value }))}
                  className="flex-1 rounded-lg border border-input bg-background px-3 py-2 text-sm"
                />
              </div>
            </div>
            <div className="rounded-lg bg-muted/50 p-3">
              <p className="text-xs font-medium text-foreground">추출 범위</p>
              <p className="mt-1 text-xs text-muted-foreground">{exportContext}</p>
            </div>
            {exportContext.includes("리스트") && (
              <div className="rounded-lg bg-muted/50 p-3">
                <p className="text-xs font-medium text-foreground">포함 항목</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  도서명, 저자, 프로그램, 평점, 작성일
                </p>
              </div>
            )}
            {exportContext.includes("전체") && (
              <div className="rounded-lg bg-muted/50 p-3">
                <p className="text-xs font-medium text-foreground">포함 항목</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  도서명, 저자, 프로그램, 평점, 작성일, 서평 본문 전체
                </p>
              </div>
            )}
            {!exportContext.includes("리스트") && !exportContext.includes("전체") && exportType === "excel" && (
              <div className="rounded-lg bg-muted/50 p-3">
                <p className="text-xs font-medium text-foreground">추출 항목</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  아이디(학번), 전공, 이름, 글제목, 서지사항, 글자수, 글쓴 날짜
                </p>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setExportDialogOpen(false)}>
                취소
              </Button>
              <Button onClick={handleExport} className="gap-2">
                <Download size={16} />
                다운로드
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      {/* ───────── 탭1 서평 내용 다이얼로그 ───────── */}
      <Dialog open={!!viewingReview} onOpenChange={(open) => !open && setViewingReview(null)}>
        <DialogContent className="max-w-lg">
          {viewingReview && (
            <>
              <DialogHeader>
                <DialogTitle>{viewingReview.book.title}</DialogTitle>
                <DialogDescription>
                  {viewingReview.book.author} · {getProgramLabel(viewingReview.programId, programOptions)} · {format(resolveDate(viewingReview.timeAgo), "yyyy.MM.dd")}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1 text-amber-500">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        fill={i < viewingReview.rating ? "currentColor" : "none"}
                        className={i < viewingReview.rating ? "text-amber-500" : "text-muted-foreground/30"}
                      />
                    ))}
                  </span>
                  <span className="text-sm font-semibold">{viewingReview.rating}/5</span>
                </div>
                <div className="rounded-lg bg-muted/50 p-4">
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{viewingReview.text}</p>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>글자수: {viewingReview.text.length}자</span>
                  <span>좋아요: {viewingReview.likes}</span>
                  <span>댓글: {viewingReview.comments}</span>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setViewingReview(null)}>
                  닫기
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* ───────── 탭3 상세보기 다이얼로그 ───────── */}
      <Dialog open={!!detailStudent} onOpenChange={(open) => !open && setDetailStudent(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {detailStudent?.name} 학생 서평 ({getProgramLabel(selectedProgramId, programOptions)})
            </DialogTitle>
            <DialogDescription>
              학번: {detailStudent?.studentId}
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-80 space-y-3 overflow-y-auto">
            {detailReviews.map((r) => (
              <div key={r.id} className="rounded-lg border border-border p-3">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-sm">{r.book.title}</p>
                  <span className="flex items-center gap-1 text-xs text-amber-500">
                    <Star size={10} fill="currentColor" /> {r.rating}
                  </span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{r.book.author}</p>
                <p className="mt-2 text-xs leading-relaxed text-foreground/80 line-clamp-3">{r.text}</p>
                <p className="mt-2 text-[11px] text-muted-foreground">
                  {format(resolveDate(r.timeAgo), "yyyy.MM.dd")}
                </p>
              </div>
            ))}
            {detailReviews.length === 0 && (
              <p className="py-6 text-center text-sm text-muted-foreground">서평이 없습니다.</p>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDetailStudent(null)}>
              닫기
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
