"use client"

import { useParams, notFound } from "next/navigation"
import { Calendar, Info, FileText } from "lucide-react"
import { usePrograms } from "@/lib/program-context"
import { cn } from "@/lib/utils"

export default function CustomProgramPage() {
  const params = useParams()
  const { customPrograms } = usePrograms()

  const programId = params.id as string
  const program = customPrograms.find((p) => p.id === programId)

  if (!program) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-5">
        <div className="rounded-full bg-muted p-4 mb-4">
          <FileText size={32} className="text-muted-foreground" />
        </div>
        <h2 className="text-lg font-bold text-foreground">프로그램을 찾을 수 없습니다</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          해당 프로그램이 삭제되었거나 존재하지 않습니다.
        </p>
      </div>
    )
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`
  }

  return (
    <div className="flex flex-col gap-4 pb-6">
      {/* Header with Gradient */}
      <header className="px-5 pt-5 sm:px-8">
        <div className={cn("relative overflow-hidden rounded-2xl bg-gradient-to-br p-6", program.gradient)}>
          {/* 배경 큰 텍스트 */}
          <div className="absolute -right-4 top-1/2 -translate-y-1/2 select-none">
            <span className="text-[100px] font-black text-white/20 leading-none">
              {program.accentText}
            </span>
          </div>

          {/* 컨텐츠 */}
          <div className="relative">
            <h1 className="text-2xl font-bold text-white">{program.name}</h1>
            <p className="mt-2 text-sm text-white/90 leading-relaxed">
              {program.description}
            </p>

            {/* 주의사항 */}
            {program.notice && (
              <div className="mt-4 rounded-xl bg-white/20 p-3 backdrop-blur-sm">
                <p className="text-xs text-white/90 whitespace-pre-line">
                  {program.notice}
                </p>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Calendar Section */}
      {program.hasCalendar && program.startDate && program.endDate && (
        <div className="px-5 sm:px-8">
          <div className="rounded-2xl border border-border bg-card p-4">
            <div className="flex items-center gap-2 mb-3">
              <Calendar size={18} className="text-primary" />
              <span className="text-sm font-bold text-foreground">프로그램 일정</span>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between rounded-xl bg-muted/50 px-4 py-3">
                <span className="text-xs text-muted-foreground">시작일</span>
                <span className="text-sm font-medium text-foreground">
                  {formatDate(program.startDate)}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-muted/50 px-4 py-3">
                <span className="text-xs text-muted-foreground">종료일</span>
                <span className="text-sm font-medium text-foreground">
                  {formatDate(program.endDate)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Custom Fields */}
      {program.customFields.length > 0 && (
        <div className="px-5 sm:px-8">
          <div className="rounded-2xl border border-border bg-card p-4">
            <div className="flex items-center gap-2 mb-3">
              <Info size={18} className="text-primary" />
              <span className="text-sm font-bold text-foreground">프로그램 정보</span>
            </div>

            <div className="flex flex-col gap-2">
              {program.customFields.map((field, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-xl bg-muted/50 px-4 py-3"
                >
                  <span className="text-xs text-muted-foreground">{field.label}</span>
                  <span className="text-sm font-medium text-foreground">{field.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Program Status */}
      <div className="px-5 sm:px-8">
        <div className="rounded-2xl border border-border bg-card p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">프로그램 상태</span>
            <span className={cn(
              "rounded-full px-3 py-1 text-xs font-bold",
              program.isActive
                ? "bg-emerald-100 text-emerald-700"
                : "bg-gray-100 text-gray-600"
            )}>
              {program.isActive ? "진행중" : "종료됨"}
            </span>
          </div>
        </div>
      </div>

      {/* Guide Section */}
      <div className="px-5 sm:px-8">
        <div className="rounded-2xl bg-gradient-to-r from-primary/10 via-emerald/10 to-amber-500/10 p-4">
          <p className="text-sm leading-relaxed text-foreground">
            이 프로그램에 참여하여 서평을 작성하면 스탬프를 획득할 수 있습니다.
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            서평 작성 시 프로그램 선택에서 "{program.name}"을 선택해주세요.
          </p>
        </div>
      </div>
    </div>
  )
}
