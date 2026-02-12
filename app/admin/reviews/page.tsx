"use client"

import { useState } from "react"
import { Trash2, FileSpreadsheet, FileText, Users, Calendar, Download, X, ChevronRight } from "lucide-react"
import { reviews as initialReviews } from "@/lib/mock-data"
import type { BookReview } from "@/lib/types"
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
import { cn } from "@/lib/utils"

const filterTabs = [
  { id: "all", label: "전체" },
  { id: "program", label: "프로그램 후기" },
  { id: "ogeoseo", label: "오거서 후기" },
]

/* ── Mock 학생 데이터 ── */
const mockStudents = [
  { id: 1, name: "김민수", studentId: "2024123456", department: "컴퓨터공학과", booksRead: 12 },
  { id: 2, name: "이수진", studentId: "2024234567", department: "경영학과", booksRead: 8 },
  { id: 3, name: "박지훈", studentId: "2023345678", department: "국어국문학과", booksRead: 15 },
  { id: 4, name: "최하연", studentId: "2024456789", department: "심리학과", booksRead: 10 },
  { id: 5, name: "정서연", studentId: "2023567890", department: "철학과", booksRead: 20 },
]

const mockStudentBooks = [
  { id: 1, title: "사피엔스", author: "유발 하라리", readDate: "2026-01-15", program: "독모" },
  { id: 2, title: "채식주의자", author: "한강", readDate: "2026-01-22", program: "독토" },
  { id: 3, title: "1984", author: "조지 오웰", readDate: "2026-02-01", program: "일반" },
  { id: 4, title: "미드나이트 라이브러리", author: "매트 헤이그", readDate: "2026-02-08", program: "독모" },
]

type ExportType = "excel" | "pdf" | "student"
type OutputStyle = "certificate" | "list"

export default function AdminReviewsPage() {
  const [reviewList, setReviewList] = useState<BookReview[]>(() => [...initialReviews])
  const [search, setSearch] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deletingId, setDeletingId] = useState<number | null>(null)

  // 데이터 추출 관련 상태
  const [exportDialogOpen, setExportDialogOpen] = useState(false)
  const [exportType, setExportType] = useState<ExportType | null>(null)
  const [dateRange, setDateRange] = useState({ start: "2026-01-01", end: "2026-12-31" })

  // 학생 데이터 추출 관련 상태
  const [studentDataStep, setStudentDataStep] = useState<"select" | "style">("select")
  const [selectedStudents, setSelectedStudents] = useState<number[]>([])
  const [outputStyle, setOutputStyle] = useState<OutputStyle>("certificate")
  const [studentSearch, setStudentSearch] = useState("")

  const filteredStudents = mockStudents.filter(
    (s) =>
      s.name.includes(studentSearch) ||
      s.studentId.includes(studentSearch) ||
      s.department.includes(studentSearch)
  )

  function openExportDialog(type: ExportType) {
    setExportType(type)
    setExportDialogOpen(true)
    if (type === "student") {
      setStudentDataStep("select")
      setSelectedStudents([])
    }
  }

  function handleExport() {
    // 실제로는 API 호출하여 파일 다운로드
    alert(`${exportType === "excel" ? "엑셀" : exportType === "pdf" ? "PDF" : "학생 데이터"} 추출이 시작됩니다.\n기간: ${dateRange.start} ~ ${dateRange.end}`)
    setExportDialogOpen(false)
    setExportType(null)
  }

  function handleStudentDataExport() {
    const styleLabel = outputStyle === "certificate" ? "독서인증서" : "독서목록"
    alert(`학생 데이터 PDF 추출 (${styleLabel})\n선택된 학생: ${selectedStudents.length}명\n기간: ${dateRange.start} ~ ${dateRange.end}`)
    setExportDialogOpen(false)
    setExportType(null)
    setStudentDataStep("select")
    setSelectedStudents([])
  }

  function toggleStudentSelection(id: number) {
    setSelectedStudents((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    )
  }

  function selectAllStudents() {
    if (selectedStudents.length === filteredStudents.length) {
      setSelectedStudents([])
    } else {
      setSelectedStudents(filteredStudents.map((s) => s.id))
    }
  }

  const filtered = reviewList
    .filter((r) => activeTab === "all" || r.type === activeTab)
    .filter(
      (r) =>
        r.user.name.toLowerCase().includes(search.toLowerCase()) ||
        r.book.title.toLowerCase().includes(search.toLowerCase()) ||
        r.text.toLowerCase().includes(search.toLowerCase())
    )

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

  const columns = [
    { key: "id", label: "번호", className: "w-16", hideOnMobile: true },
    {
      key: "user",
      label: "작성자",
      className: "w-28",
      render: (_: unknown, row: BookReview) => row.user.name,
    },
    {
      key: "book",
      label: "도서",
      render: (_: unknown, row: BookReview) => row.book.title,
    },
    {
      key: "type",
      label: "유형",
      className: "w-28",
      hideOnMobile: true,
      render: (val: string) => (
        <span
          className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold ${
            val === "program"
              ? "bg-blue-50 text-blue-600"
              : "bg-emerald-50 text-emerald-600"
          }`}
        >
          {val === "program" ? "프로그램" : "오거서"}
        </span>
      ),
    },
    {
      key: "timeAgo",
      label: "작성일",
      className: "w-24",
      hideOnMobile: true,
    },
    {
      key: "actions",
      label: "관리",
      className: "w-20",
      render: (_: unknown, row: BookReview) => (
        <Button variant="ghost" size="sm" onClick={() => confirmDelete(row.id)}>
          <Trash2 size={14} className="text-destructive" />
        </Button>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader title="독서리뷰 관리" />

      {/* 데이터 추출 버튼들 */}
      <div className="px-5 sm:px-8">
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => openExportDialog("excel")}
            className="gap-2"
          >
            <FileSpreadsheet size={16} className="text-emerald-600" />
            엑셀 추출
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => openExportDialog("pdf")}
            className="gap-2"
          >
            <FileText size={16} className="text-red-500" />
            PDF 추출
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => openExportDialog("student")}
            className="gap-2 border-primary/30 bg-primary/5 hover:bg-primary/10"
          >
            <Users size={16} className="text-primary" />
            학생 데이터
          </Button>
        </div>
      </div>

      <div className="space-y-4 px-5 sm:px-8">
        <FilterTabs tabs={filterTabs} activeTab={activeTab} onTabChange={setActiveTab} />
        <SearchBar value={search} onChange={setSearch} placeholder="리뷰 검색..." />
      </div>

      <div className="px-5 sm:px-8">
        <DataTable columns={columns} data={filtered} />
      </div>

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

      {/* 데이터 추출 다이얼로그 */}
      <Dialog open={exportDialogOpen} onOpenChange={setExportDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {exportType === "excel" && <FileSpreadsheet size={20} className="text-emerald-600" />}
              {exportType === "pdf" && <FileText size={20} className="text-red-500" />}
              {exportType === "student" && <Users size={20} className="text-primary" />}
              {exportType === "excel" ? "엑셀 추출" : exportType === "pdf" ? "PDF 추출" : "학생 데이터 추출"}
            </DialogTitle>
          </DialogHeader>

          {/* 엑셀/PDF 추출 */}
          {(exportType === "excel" || exportType === "pdf") && (
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

              {exportType === "excel" && (
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
          )}

          {/* 학생 데이터 추출 */}
          {exportType === "student" && (
            <div className="space-y-4">
              {/* Step 1: 학생 선택 */}
              {studentDataStep === "select" && (
                <>
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

                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <label className="text-sm font-medium">학생 선택</label>
                      <button
                        onClick={selectAllStudents}
                        className="text-xs text-primary hover:underline"
                      >
                        {selectedStudents.length === filteredStudents.length ? "전체 해제" : "전체 선택"}
                      </button>
                    </div>
                    <input
                      type="text"
                      placeholder="학생 검색 (이름, 학번, 학과)"
                      value={studentSearch}
                      onChange={(e) => setStudentSearch(e.target.value)}
                      className="mb-2 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                    />
                    <div className="max-h-48 space-y-1 overflow-y-auto rounded-lg border border-border p-2">
                      {filteredStudents.map((student) => (
                        <button
                          key={student.id}
                          onClick={() => toggleStudentSelection(student.id)}
                          className={cn(
                            "flex w-full items-center gap-3 rounded-lg p-2 text-left transition-colors",
                            selectedStudents.includes(student.id)
                              ? "bg-primary/10"
                              : "hover:bg-muted"
                          )}
                        >
                          <div
                            className={cn(
                              "flex h-5 w-5 items-center justify-center rounded border-2 transition-colors",
                              selectedStudents.includes(student.id)
                                ? "border-primary bg-primary"
                                : "border-muted-foreground/30"
                            )}
                          >
                            {selectedStudents.includes(student.id) && (
                              <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">{student.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {student.studentId} · {student.department} · {student.booksRead}권 읽음
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground">
                      {selectedStudents.length}명 선택됨
                    </p>
                  </div>

                  <DialogFooter>
                    <Button variant="outline" onClick={() => setExportDialogOpen(false)}>
                      취소
                    </Button>
                    <Button
                      onClick={() => setStudentDataStep("style")}
                      disabled={selectedStudents.length === 0}
                      className="gap-2"
                    >
                      다음
                      <ChevronRight size={16} />
                    </Button>
                  </DialogFooter>
                </>
              )}

              {/* Step 2: 출력 스타일 선택 */}
              {studentDataStep === "style" && (
                <>
                  <div>
                    <label className="mb-3 block text-sm font-medium">출력 스타일 선택</label>
                    <div className="space-y-2">
                      <button
                        onClick={() => setOutputStyle("certificate")}
                        className={cn(
                          "flex w-full items-start gap-3 rounded-xl border-2 p-4 text-left transition-all",
                          outputStyle === "certificate"
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        )}
                      >
                        <div
                          className={cn(
                            "mt-0.5 flex h-5 w-5 items-center justify-center rounded-full border-2",
                            outputStyle === "certificate"
                              ? "border-primary bg-primary"
                              : "border-muted-foreground/30"
                          )}
                        >
                          {outputStyle === "certificate" && (
                            <div className="h-2 w-2 rounded-full bg-white" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">독서인증서</p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            학생별 공식 독서 인증서 형식으로 출력됩니다.<br />
                            학교 로고, 학생 정보, 읽은 도서 목록이 포함됩니다.
                          </p>
                        </div>
                      </button>

                      <button
                        onClick={() => setOutputStyle("list")}
                        className={cn(
                          "flex w-full items-start gap-3 rounded-xl border-2 p-4 text-left transition-all",
                          outputStyle === "list"
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        )}
                      >
                        <div
                          className={cn(
                            "mt-0.5 flex h-5 w-5 items-center justify-center rounded-full border-2",
                            outputStyle === "list"
                              ? "border-primary bg-primary"
                              : "border-muted-foreground/30"
                          )}
                        >
                          {outputStyle === "list" && (
                            <div className="h-2 w-2 rounded-full bg-white" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">독서목록</p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            학생이 읽은 도서 목록을 표 형식으로 출력합니다.<br />
                            도서명, 저자, 읽은 날짜, 프로그램 정보가 포함됩니다.
                          </p>
                        </div>
                      </button>
                    </div>
                  </div>

                  <div className="rounded-lg bg-muted/50 p-3">
                    <p className="text-xs font-medium text-foreground">추출 정보</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      선택된 학생: {selectedStudents.length}명<br />
                      기간: {dateRange.start} ~ {dateRange.end}<br />
                      출력형식: PDF
                    </p>
                  </div>

                  <DialogFooter>
                    <Button variant="outline" onClick={() => setStudentDataStep("select")}>
                      이전
                    </Button>
                    <Button onClick={handleStudentDataExport} className="gap-2">
                      <Download size={16} />
                      PDF 다운로드
                    </Button>
                  </DialogFooter>
                </>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
