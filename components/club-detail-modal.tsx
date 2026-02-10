"use client"

import {
  X,
  Users,
  Calendar,
  BookOpen,
  GraduationCap,
  ClipboardCheck,
  MapPin,
  MessageCircle,
  Clock,
} from "lucide-react"
import { cn } from "@/lib/utils"

export interface ClubDetailData {
  id: number
  title: string
  leader: string
  leaderType: "student" | "professor" | "author"
  leaderDept?: string
  leaderSchool?: string
  leaderYear?: string
  leaderMessage?: string
  topic: string
  book: string
  bookCover: string
  minMembers: number
  maxMembers: number
  currentMembers: number
  schedule: string[]
  assignments: { week: string; task: string }[]
}

export function ClubDetailModal({
  club,
  isOpen,
  onClose,
  onApply,
  applied,
}: {
  club?: ClubDetailData | null
  isOpen: boolean
  onClose: () => void
  onApply?: () => void
  applied?: boolean
}) {
  if (!isOpen || !club) return null
  const data = club

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-foreground/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />

      {/* Modal */}
      <div className="relative z-10 flex max-h-[85vh] w-full max-w-lg flex-col overflow-hidden rounded-3xl bg-card shadow-2xl">
        {/* Header bar */}
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="font-serif text-lg font-bold text-foreground">
            독서토론회 상세정보
          </h2>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-muted transition-colors hover:bg-border"
            aria-label="닫기"
          >
            <X size={16} className="text-foreground" />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto">
          {/* Book + Title section */}
          <div className="flex gap-4 px-5 pt-5">
            <div className="h-28 w-20 flex-shrink-0 overflow-hidden rounded-2xl shadow-lg">
              <img
                src={data.bookCover || "/placeholder.svg"}
                alt={data.book}
                className="h-full w-full object-cover"
                crossOrigin="anonymous"
              />
            </div>
            <div className="flex flex-1 flex-col gap-1.5">
              <h3 className="font-serif text-base font-bold leading-snug text-foreground text-balance">
                {data.title}
              </h3>
              <div className="flex items-center gap-1.5">
                <BookOpen size={12} className="text-emerald" />
                <span className="text-xs text-muted-foreground">
                  {data.book}
                </span>
              </div>
              <div className="mt-1 inline-flex w-fit items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-semibold text-primary">
                <Users size={10} />
                {data.currentMembers}/{data.maxMembers}명 (최소 {data.minMembers}명)
              </div>
            </div>
          </div>

          {/* Leader Section */}
          <div className="mx-5 mt-5 rounded-2xl border border-border bg-muted/40 p-4">
            <div className="mb-2.5 flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <GraduationCap size={18} />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-bold text-foreground">
                    회장: {data.leader}
                  </span>
                  {data.leaderDept && (
                    <span className="rounded-full bg-emerald/15 px-2 py-0.5 text-[10px] font-medium text-emerald">
                      {data.leaderDept}
                    </span>
                  )}
                </div>
                {data.leaderSchool && (
                  <p className="flex items-center gap-1 text-[11px] text-muted-foreground">
                    <MapPin size={10} />
                    {data.leaderSchool} {data.leaderYear}
                  </p>
                )}
              </div>
            </div>
            {data.leaderMessage && (
              <div className="rounded-xl bg-card p-3">
                <div className="mb-1 flex items-center gap-1">
                  <MessageCircle size={10} className="text-emerald" />
                  <span className="text-[10px] font-semibold text-muted-foreground">
                    회장 한마디
                  </span>
                </div>
                <p className="text-xs leading-relaxed text-foreground">
                  {data.leaderMessage}
                </p>
              </div>
            )}
          </div>

          {/* Schedule Section */}
          <div className="mx-5 mt-4">
            <h4 className="mb-2.5 flex items-center gap-2 text-sm font-bold text-foreground">
              <Calendar size={14} className="text-emerald" />
              일정
            </h4>
            <div className="flex flex-col gap-2">
              {data.schedule.map((s, i) => (
                <div
                  key={`schedule-${data.id}-${i}`}
                  className="flex items-center gap-3 rounded-xl border border-border bg-card p-3"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                    {i + 1}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock size={12} className="text-muted-foreground" />
                    <span className="text-xs font-medium text-foreground">
                      {s}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Assignments Section */}
          <div className="mx-5 mt-4 pb-5">
            <h4 className="mb-2.5 flex items-center gap-2 text-sm font-bold text-foreground">
              <ClipboardCheck size={14} className="text-emerald" />
              과제
            </h4>
            <div className="flex flex-col gap-2">
              {data.assignments.map((a, i) => (
                <div
                  key={`assignment-${data.id}-${i}`}
                  className="rounded-xl border border-border bg-card p-3"
                >
                  <span className="mb-1 inline-flex rounded-full bg-emerald/10 px-2 py-0.5 text-[10px] font-bold text-emerald">
                    {a.week}
                  </span>
                  <p className="mt-1 text-xs leading-relaxed text-foreground">
                    {a.task}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer CTA */}
        <div className="border-t border-border bg-card px-5 py-4">
          {applied ? (
            <div className="w-full rounded-2xl bg-muted py-3.5 text-center text-sm font-bold text-muted-foreground">
              신청 완료
            </div>
          ) : (
            <button
              onClick={onApply}
              className={cn(
                "w-full rounded-2xl py-3.5 text-sm font-bold text-primary-foreground shadow-lg transition-all hover:opacity-90",
                "bg-primary"
              )}
            >
              신청하기
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
