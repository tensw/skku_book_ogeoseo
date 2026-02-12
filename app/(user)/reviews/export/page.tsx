"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, FileText, FileSpreadsheet, Calendar, Check, Trash2, Download, Users, Award, List } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { reviews } from "@/lib/mock-data"

const programOptions = [
  { id: "all", label: "전체" },
  { id: "free", label: "자유 서평" },
  { id: "dokto", label: "독토 프로그램" },
  { id: "classic100", label: "고전100선" },
]

// 학생 데이터 출력 스타일 옵션
type OutputStyle = "certificate" | "list"

// Mock data for export - simulating users with multiple reviews
const mockExportData = [
  { id: "2024310001", name: "김서윤", department: "국어국문학과", reviewCount: 15, reviews: [
    { id: 1, title: "데미안을 읽고", book: "데미안", author: "헤르만 헤세", charCount: 1250, date: "2026-01-15" },
    { id: 2, title: "정의에 대하여", book: "정의란 무엇인가", author: "마이클 샌델", charCount: 980, date: "2026-01-20" },
    { id: 3, title: "유전자의 비밀", book: "이기적 유전자", author: "리처드 도킨스", charCount: 1100, date: "2026-01-25" },
  ]},
  { id: "2024310002", name: "이준혁", department: "경영학과", reviewCount: 14, reviews: [
    { id: 4, title: "경제학의 시작", book: "국부론", author: "애덤 스미스", charCount: 1350, date: "2026-01-18" },
    { id: 5, title: "자본주의를 생각하다", book: "자본론", author: "카를 마르크스", charCount: 1200, date: "2026-01-22" },
  ]},
  { id: "2024310003", name: "박지민", department: "생명과학과", reviewCount: 13, reviews: [
    { id: 6, title: "진화의 이해", book: "종의 기원", author: "찰스 다윈", charCount: 1450, date: "2026-01-10" },
    { id: 7, title: "우주를 담다", book: "코스모스", author: "칼 세이건", charCount: 1300, date: "2026-01-28" },
  ]},
  { id: "2024310004", name: "최예린", department: "철학과", reviewCount: 12, reviews: [
    { id: 8, title: "존재의 의미", book: "존재와 시간", author: "마르틴 하이데거", charCount: 1550, date: "2026-01-12" },
    { id: 9, title: "정치와 도덕", book: "군주론", author: "니콜로 마키아벨리", charCount: 1150, date: "2026-01-30" },
  ]},
  { id: "2024310005", name: "정민수", department: "컴퓨터공학과", reviewCount: 12, reviews: [
    { id: 10, title: "시간을 생각하다", book: "시간의 역사", author: "스티븐 호킹", charCount: 1080, date: "2026-01-14" },
  ]},
]

type ExportType = "pdf" | "excel" | "student" | null

interface ExportFilters {
  startDate: string
  endDate: string
  minReviewCount: number
  program: string
}

export default function ReviewExport() {
  const router = useRouter()
  const { isAdmin } = useAuth()
  const [step, setStep] = useState(1)
  const [exportType, setExportType] = useState<ExportType>(null)
  const [outputStyle, setOutputStyle] = useState<OutputStyle>("certificate")
  const [filters, setFilters] = useState<ExportFilters>({
    startDate: "2026-01-01",
    endDate: "2026-02-10",
    minReviewCount: 12,
    program: "all",
  })
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set())
  const [selectAll, setSelectAll] = useState(true)

  // Redirect if not admin
  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-muted-foreground">관리자만 접근할 수 있는 페이지입니다.</p>
        <button
          onClick={() => router.push("/reviews")}
          className="mt-4 text-primary underline"
        >
          독서리뷰로 돌아가기
        </button>
      </div>
    )
  }

  // Filter data based on filters
  const filteredData = useMemo(() => {
    return mockExportData.filter(user => user.reviewCount >= filters.minReviewCount)
  }, [filters.minReviewCount])

  // Initialize selected items when entering preview step
  const initializeSelection = () => {
    const allIds = new Set(filteredData.map(user => user.id))
    setSelectedItems(allIds)
    setSelectAll(true)
  }

  // Get the final step number based on export type
  const getFinalStep = () => exportType === "student" ? 4 : 3
  const getFilterStep = () => exportType === "student" ? 3 : 2
  const getPreviewStep = () => exportType === "student" ? 4 : 3

  const handleNext = () => {
    const filterStep = getFilterStep()
    if (step === filterStep) {
      initializeSelection()
    }
    setStep(step + 1)
  }

  const handleBack = () => {
    if (step === 1) {
      router.push("/reviews")
    } else {
      setStep(step - 1)
    }
  }

  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedItems(new Set())
    } else {
      const allIds = new Set(filteredData.map(user => user.id))
      setSelectedItems(allIds)
    }
    setSelectAll(!selectAll)
  }

  const toggleItem = (id: string) => {
    const newSelected = new Set(selectedItems)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelectedItems(newSelected)
    setSelectAll(newSelected.size === filteredData.length)
  }

  const handleExport = () => {
    const selectedData = filteredData.filter(user => selectedItems.has(user.id))
    if (exportType === "pdf") {
      alert(`PDF 생성 완료!\n\n선택된 대상자: ${selectedData.length}명\n총 독후감: ${selectedData.reduce((acc, u) => acc + u.reviewCount, 0)}편`)
    } else if (exportType === "excel") {
      alert(`엑셀 다운로드 완료!\n\n선택된 대상자: ${selectedData.length}명\n총 독후감: ${selectedData.reduce((acc, u) => acc + u.reviewCount, 0)}편`)
    } else if (exportType === "student") {
      const styleLabel = outputStyle === "certificate" ? "독서인증서" : "독서목록"
      alert(`학생 데이터 PDF 다운로드 완료!\n\n출력 스타일: ${styleLabel}\n선택된 학생: ${selectedData.length}명\n기간: ${filters.startDate} ~ ${filters.endDate}`)
    }
    router.push("/reviews")
  }

  const totalReviews = filteredData
    .filter(user => selectedItems.has(user.id))
    .reduce((acc, user) => acc + user.reviewCount, 0)

  return (
    <div className="flex flex-col gap-4 pb-6">
      {/* Header */}
      <div className="border-b border-border bg-card px-5 py-4 sm:px-8">
        <div className="flex items-center gap-3">
          <button
            onClick={handleBack}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors hover:bg-border hover:text-foreground"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-lg font-bold text-foreground">데이터 추출</h1>
            <p className="text-xs text-muted-foreground">관리자 전용</p>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="px-5 sm:px-8">
        <div className="flex items-center justify-between">
          {(exportType === "student" ? [
            { num: 1, label: "추출 유형" },
            { num: 2, label: "출력 스타일" },
            { num: 3, label: "필터 설정" },
            { num: 4, label: "미리보기" },
          ] : [
            { num: 1, label: "추출 유형" },
            { num: 2, label: "필터 설정" },
            { num: 3, label: "미리보기" },
          ]).map((s, i, arr) => (
            <div key={s.num} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
                    step >= s.num
                      ? "bg-amber-500 text-white"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {step > s.num ? <Check size={16} /> : s.num}
                </div>
                <span className={`mt-1 text-xs ${step >= s.num ? "text-amber-600 font-medium" : "text-muted-foreground"}`}>
                  {s.label}
                </span>
              </div>
              {i < arr.length - 1 && (
                <div className={`mx-2 h-0.5 w-8 sm:w-16 ${step > s.num ? "bg-amber-500" : "bg-muted"}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="px-5 sm:px-8">
        {/* Step 1: Export Type Selection */}
        {step === 1 && (
          <div className="flex flex-col gap-4">
            <h2 className="text-base font-semibold text-foreground">추출 유형을 선택하세요</h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <button
                onClick={() => setExportType("pdf")}
                className={`flex flex-col items-center gap-3 rounded-2xl border-2 p-6 transition-all ${
                  exportType === "pdf"
                    ? "border-amber-500 bg-amber-50"
                    : "border-border bg-card hover:border-amber-300"
                }`}
              >
                <div className={`flex h-16 w-16 items-center justify-center rounded-full ${
                  exportType === "pdf" ? "bg-amber-500 text-white" : "bg-muted text-muted-foreground"
                }`}>
                  <FileText size={32} />
                </div>
                <div className="text-center">
                  <p className="font-semibold text-foreground">PDF 생성</p>
                  <p className="mt-1 text-xs text-muted-foreground">심사용 문집 생성</p>
                </div>
              </button>
              <button
                onClick={() => setExportType("excel")}
                className={`flex flex-col items-center gap-3 rounded-2xl border-2 p-6 transition-all ${
                  exportType === "excel"
                    ? "border-amber-500 bg-amber-50"
                    : "border-border bg-card hover:border-amber-300"
                }`}
              >
                <div className={`flex h-16 w-16 items-center justify-center rounded-full ${
                  exportType === "excel" ? "bg-amber-500 text-white" : "bg-muted text-muted-foreground"
                }`}>
                  <FileSpreadsheet size={32} />
                </div>
                <div className="text-center">
                  <p className="font-semibold text-foreground">엑셀 추출</p>
                  <p className="mt-1 text-xs text-muted-foreground">심사 대상 리스트</p>
                </div>
              </button>
              <button
                onClick={() => setExportType("student")}
                className={`flex flex-col items-center gap-3 rounded-2xl border-2 p-6 transition-all ${
                  exportType === "student"
                    ? "border-primary bg-primary/10"
                    : "border-border bg-card hover:border-primary/50"
                }`}
              >
                <div className={`flex h-16 w-16 items-center justify-center rounded-full ${
                  exportType === "student" ? "bg-primary text-white" : "bg-muted text-muted-foreground"
                }`}>
                  <Users size={32} />
                </div>
                <div className="text-center">
                  <p className="font-semibold text-foreground">학생 데이터</p>
                  <p className="mt-1 text-xs text-muted-foreground">독서목록/인증서</p>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Output Style Selection (학생 데이터 only) */}
        {step === 2 && exportType === "student" && (
          <div className="flex flex-col gap-4">
            <h2 className="text-base font-semibold text-foreground">출력 스타일을 선택하세요</h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <button
                onClick={() => setOutputStyle("certificate")}
                className={`flex flex-col items-start gap-3 rounded-2xl border-2 p-5 text-left transition-all ${
                  outputStyle === "certificate"
                    ? "border-primary bg-primary/10"
                    : "border-border bg-card hover:border-primary/50"
                }`}
              >
                <div className={`flex h-12 w-12 items-center justify-center rounded-full ${
                  outputStyle === "certificate" ? "bg-primary text-white" : "bg-muted text-muted-foreground"
                }`}>
                  <Award size={24} />
                </div>
                <div>
                  <p className="font-semibold text-foreground">독서인증서</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    공식 독서 인증서 형식으로 출력<br />
                    학교 로고, 학생 정보, 읽은 도서 목록 포함
                  </p>
                </div>
              </button>
              <button
                onClick={() => setOutputStyle("list")}
                className={`flex flex-col items-start gap-3 rounded-2xl border-2 p-5 text-left transition-all ${
                  outputStyle === "list"
                    ? "border-primary bg-primary/10"
                    : "border-border bg-card hover:border-primary/50"
                }`}
              >
                <div className={`flex h-12 w-12 items-center justify-center rounded-full ${
                  outputStyle === "list" ? "bg-primary text-white" : "bg-muted text-muted-foreground"
                }`}>
                  <List size={24} />
                </div>
                <div>
                  <p className="font-semibold text-foreground">독서목록</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    읽은 도서 목록을 표 형식으로 출력<br />
                    도서명, 저자, 읽은 날짜, 프로그램 정보 포함
                  </p>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* Step 2/3: Filter Settings */}
        {((step === 2 && exportType !== "student") || (step === 3 && exportType === "student")) && (
          <div className="flex flex-col gap-5">
            <h2 className="text-base font-semibold text-foreground">필터를 설정하세요</h2>

            {/* Date Range */}
            <div className="rounded-xl border border-border bg-card p-4">
              <div className="mb-3 flex items-center gap-2">
                <Calendar size={16} className="text-amber-500" />
                <span className="text-sm font-medium text-foreground">기간 설정</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs text-muted-foreground">시작일</label>
                  <input
                    type="date"
                    value={filters.startDate}
                    onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-muted-foreground">종료일</label>
                  <input
                    type="date"
                    value={filters.endDate}
                    onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Min Review Count */}
            <div className="rounded-xl border border-border bg-card p-4">
              <label className="mb-2 block text-sm font-medium text-foreground">
                최소 독후감 수
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="1"
                  value={filters.minReviewCount}
                  onChange={(e) => setFilters({ ...filters, minReviewCount: Number(e.target.value) || 1 })}
                  className="w-20 rounded-lg border border-border bg-background px-3 py-2 text-center text-sm font-bold focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                />
                <span className="text-sm text-muted-foreground">편 이상 작성한 사용자만 추출</span>
              </div>
            </div>

            {/* Program Selection */}
            <div className="rounded-xl border border-border bg-card p-4">
              <label className="mb-2 block text-sm font-medium text-foreground">
                프로그램 선택
              </label>
              <div className="grid grid-cols-2 gap-2">
                {programOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => setFilters({ ...filters, program: option.id })}
                    className={`rounded-lg px-3 py-2 text-sm transition-colors ${
                      filters.program === option.id
                        ? "bg-amber-500 font-medium text-white"
                        : "bg-muted text-muted-foreground hover:bg-border"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 3/4: Preview & Export */}
        {((step === 3 && exportType !== "student") || (step === 4 && exportType === "student")) && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-foreground">미리보기 & 추출</h2>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">대상자:</span>
                <span className="font-bold text-amber-600">{selectedItems.size}명</span>
                <span className="text-muted-foreground">/ 총 독후감:</span>
                <span className="font-bold text-amber-600">{totalReviews}편</span>
              </div>
            </div>

            {/* Select All */}
            <div className="flex items-center justify-between rounded-xl bg-amber-50 px-4 py-3">
              <button
                onClick={toggleSelectAll}
                className="flex items-center gap-2 text-sm font-medium text-amber-700"
              >
                <div className={`flex h-5 w-5 items-center justify-center rounded border-2 ${
                  selectAll ? "border-amber-500 bg-amber-500" : "border-amber-300 bg-white"
                }`}>
                  {selectAll && <Check size={14} className="text-white" />}
                </div>
                전체 선택
              </button>
              <span className="text-xs text-amber-600">
                체크 해제하면 추출에서 제외됩니다
              </span>
            </div>

            {/* User List */}
            <div className="flex flex-col gap-2">
              {filteredData.map((user) => (
                <div
                  key={user.id}
                  className={`rounded-xl border p-4 transition-all ${
                    selectedItems.has(user.id)
                      ? "border-amber-200 bg-white"
                      : "border-border bg-muted/50 opacity-60"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <button
                        onClick={() => toggleItem(user.id)}
                        className={`mt-0.5 flex h-5 w-5 items-center justify-center rounded border-2 transition-colors ${
                          selectedItems.has(user.id)
                            ? "border-amber-500 bg-amber-500"
                            : "border-border bg-white hover:border-amber-300"
                        }`}
                      >
                        {selectedItems.has(user.id) && <Check size={14} className="text-white" />}
                      </button>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-foreground">{user.name}</span>
                          <span className="text-xs text-muted-foreground">{user.id}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">{user.department}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-bold text-amber-600">{user.reviewCount}</span>
                      <span className="text-sm text-muted-foreground">편</span>
                    </div>
                  </div>

                  {/* Review samples */}
                  {exportType === "pdf" && selectedItems.has(user.id) && (
                    <div className="mt-3 border-t border-border pt-3">
                      <p className="mb-2 text-xs font-medium text-muted-foreground">포함될 독후감 (일부)</p>
                      <div className="flex flex-col gap-1">
                        {user.reviews.slice(0, 2).map((review) => (
                          <div key={review.id} className="flex items-center justify-between text-xs">
                            <span className="text-foreground">{review.title}</span>
                            <span className="text-muted-foreground">{review.charCount}자</span>
                          </div>
                        ))}
                        {user.reviews.length > 2 && (
                          <span className="text-xs text-muted-foreground">외 {user.reviewCount - 2}편...</span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {filteredData.length === 0 && (
              <div className="py-12 text-center">
                <p className="text-muted-foreground">조건에 맞는 대상자가 없습니다.</p>
                <p className="mt-1 text-sm text-muted-foreground">필터 조건을 조정해 주세요.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 border-t border-border bg-card p-4 lg:static lg:mt-4 lg:border-t-0 lg:bg-transparent lg:px-5 sm:lg:px-8">
        <div className="mx-auto flex max-w-2xl gap-3">
          {step > 1 && (
            <button
              onClick={handleBack}
              className="flex-1 rounded-xl border border-border bg-card py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted"
            >
              이전
            </button>
          )}
          {step < getPreviewStep() ? (
            <button
              onClick={handleNext}
              disabled={step === 1 && !exportType}
              className={`flex-1 rounded-xl py-3 text-sm font-bold transition-all ${
                (step === 1 && !exportType)
                  ? "bg-muted text-muted-foreground"
                  : exportType === "student"
                    ? "bg-primary text-white hover:brightness-110"
                    : "bg-amber-500 text-white hover:brightness-110"
              }`}
            >
              다음
            </button>
          ) : (
            <button
              onClick={handleExport}
              disabled={selectedItems.size === 0}
              className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold transition-all ${
                selectedItems.size === 0
                  ? "bg-muted text-muted-foreground"
                  : exportType === "student"
                    ? "bg-primary text-white hover:brightness-110"
                    : "bg-amber-500 text-white hover:brightness-110"
              }`}
            >
              <Download size={16} />
              {exportType === "pdf" ? "PDF 다운로드" : exportType === "excel" ? "엑셀 다운로드" : `PDF 다운로드 (${outputStyle === "certificate" ? "독서인증서" : "독서목록"})`}
            </button>
          )}
        </div>
      </div>

      {/* Bottom spacing for fixed button */}
      <div className="h-20 lg:hidden" />
    </div>
  )
}
