"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { ChevronDown, ChevronLeft, ChevronRight, Clock, MapPin, Users, BookOpen, X, Calendar, Settings, Book } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/auth-context"
import { usePrograms, type MonthlyBook } from "@/lib/program-context"

type GroupType = "all" | "yeomyeong" | "yunseul" | "dalbit"

interface TimeSlot {
  time: string
  displayTime: string
  location: string
}

interface ReadingGroup {
  id: "yeomyeong" | "yunseul" | "dalbit"
  name: string
  description: string
  timeSlots: TimeSlot[]
}

const readingGroups: ReadingGroup[] = [
  {
    id: "yeomyeong",
    name: "여명독",
    description: "아침 독서모임 (6-9시)",
    timeSlots: [
      { time: "06:00", displayTime: "오전 6:00 - 7:00", location: "스터디룸 2-1" },
      { time: "07:00", displayTime: "오전 7:00 - 8:00", location: "스터디룸 2-1" },
      { time: "08:00", displayTime: "오전 8:00 - 9:00", location: "스터디룸 2-1" },
    ],
  },
  {
    id: "yunseul",
    name: "윤슬독",
    description: "점심 독서모임 (12-14시)",
    timeSlots: [
      { time: "12:00", displayTime: "오후 12:00 - 13:00", location: "스터디룸 3-1" },
      { time: "13:00", displayTime: "오후 1:00 - 2:00", location: "스터디룸 3-1" },
    ],
  },
  {
    id: "dalbit",
    name: "달빛독",
    description: "저녁 독서모임 (17-22시)",
    timeSlots: [
      { time: "17:00", displayTime: "오후 5:00 - 6:00", location: "스터디룸 4-1" },
      { time: "18:00", displayTime: "오후 6:00 - 7:00", location: "스터디룸 4-1" },
      { time: "19:00", displayTime: "오후 7:00 - 8:00", location: "스터디룸 4-1" },
      { time: "20:00", displayTime: "오후 8:00 - 9:00", location: "스터디룸 4-1" },
      { time: "21:00", displayTime: "오후 9:00 - 10:00", location: "스터디룸 4-1" },
    ],
  },
]

const groupOptions = [
  { id: "all" as GroupType, label: "전체" },
  { id: "yeomyeong" as GroupType, label: "여명독", description: "아침 독서모임 (6-9시)" },
  { id: "yunseul" as GroupType, label: "윤슬독", description: "점심 독서모임 (12-14시)" },
  { id: "dalbit" as GroupType, label: "달빛독", description: "저녁 독서모임 (17-22시)" },
]

const groupColors: Record<GroupType, { bg: string; text: string; badge: string; light: string; gradient: string; accent: string }> = {
  all: { bg: "bg-primary", text: "text-primary", badge: "bg-primary/10 text-primary", light: "bg-primary/5", gradient: "from-primary to-primary/80", accent: "독서" },
  yeomyeong: { bg: "bg-amber-500", text: "text-amber-600", badge: "bg-amber-100 text-amber-700", light: "bg-amber-50", gradient: "from-amber-400 to-amber-600", accent: "아침" },
  yunseul: { bg: "bg-sky-500", text: "text-sky-600", badge: "bg-sky-100 text-sky-700", light: "bg-sky-50", gradient: "from-sky-400 to-sky-600", accent: "점심" },
  dalbit: { bg: "bg-indigo-500", text: "text-indigo-600", badge: "bg-indigo-100 text-indigo-700", light: "bg-indigo-50", gradient: "from-indigo-400 to-indigo-600", accent: "저녁" },
}

// Get dates for current week (Monday to Sunday)
function getWeekDates(baseDate: Date): Date[] {
  const dates: Date[] = []
  const day = baseDate.getDay()
  const diff = baseDate.getDate() - day + (day === 0 ? -6 : 1) // Adjust for Monday start

  for (let i = 0; i < 7; i++) {
    const date = new Date(baseDate)
    date.setDate(diff + i)
    dates.push(date)
  }
  return dates
}

function formatDate(date: Date): string {
  return date.toISOString().split("T")[0]
}

function formatDateDisplay(date: Date): string {
  const days = ["일", "월", "화", "수", "목", "금", "토"]
  return `${date.getMonth() + 1}/${date.getDate()} (${days[date.getDay()]})`
}

const MAX_BOOKINGS = 7

// 기본 책 정보 (이달의 책이 없을 때 사용)
const defaultBook: MonthlyBook = {
  id: "default",
  title: "도서 미정",
  author: "추후 공지",
  cover: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=100&h=140&fit=crop",
  description: "이달의 책이 아직 선정되지 않았습니다.",
}

export default function Dokmo() {
  const { isAdmin } = useAuth()
  const { getWeeklyBookAssignment, monthlyBooks } = usePrograms()
  const [selectedGroup, setSelectedGroup] = useState<GroupType>("all")
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [weekDates, setWeekDates] = useState<Date[]>(getWeekDates(new Date()))
  const [appliedSessions, setAppliedSessions] = useState<string[]>([])
  const [selectedSession, setSelectedSession] = useState<{
    group: ReadingGroup
    book: MonthlyBook
    timeSlot: TimeSlot
    date: Date
  } | null>(null)

  // 이달의 책에서 자동 배정된 주간 책 정보 가져오기
  const weeklyAssignment = getWeeklyBookAssignment()

  // 각 그룹별 책 가져오기
  const getBookForGroup = (groupId: "yeomyeong" | "yunseul" | "dalbit"): MonthlyBook => {
    if (groupId === "yeomyeong" || groupId === "yunseul") {
      return weeklyAssignment.yeomyeong || defaultBook
    }
    return weeklyAssignment.dalbit || defaultBook
  }

  const filteredGroups = useMemo(() => {
    if (selectedGroup === "all") return readingGroups
    return readingGroups.filter((g) => g.id === selectedGroup)
  }, [selectedGroup])

  const selectedLabel = groupOptions.find((g) => g.id === selectedGroup)?.label || "전체"

  const canApply = appliedSessions.length < MAX_BOOKINGS

  const getSessionKey = (date: Date, groupId: string, time: string) => {
    return `${formatDate(date)}_${groupId}_${time}`
  }

  const isSessionApplied = (date: Date, groupId: string, time: string) => {
    return appliedSessions.includes(getSessionKey(date, groupId, time))
  }

  const handleApply = () => {
    if (selectedSession && canApply) {
      const key = getSessionKey(selectedSession.date, selectedSession.group.id, selectedSession.timeSlot.time)
      setAppliedSessions((prev) => [...prev, key])
      setSelectedSession(null)
    }
  }

  const navigateWeek = (direction: number) => {
    const newBase = new Date(weekDates[0])
    newBase.setDate(newBase.getDate() + direction * 7)

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    if (newBase < today && direction < 0) return

    setWeekDates(getWeekDates(newBase))
    setSelectedDate(newBase)
  }

  const isToday = (date: Date) => {
    const today = new Date()
    return date.toDateString() === today.toDateString()
  }

  const isPast = (date: Date) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return date < today
  }

  return (
    <div className="flex flex-col gap-4 pb-6">
      {/* Header */}
      <header className="px-5 pt-5 sm:px-8">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold text-foreground">독모</h1>
          <span className="rounded-full bg-emerald/10 px-2 py-0.5 text-[10px] font-bold text-emerald">
            {appliedSessions.length}/{MAX_BOOKINGS} 신청
          </span>
          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
            {weeklyAssignment.weekNumber}주차
          </span>
        </div>
        <p className="mt-0.5 text-[11px] text-muted-foreground">
          시간대별 독서모임에 참여하세요
        </p>

        {/* Motivational Message */}
        <div className="mt-4 rounded-2xl bg-gradient-to-r from-emerald/10 via-primary/10 to-amber-500/10 p-4">
          <p className="text-sm leading-relaxed text-foreground">
            혼자라면 망설였을 길, 매주 함께 읽어볼까요?
          </p>
          <p className="mt-1 text-sm leading-relaxed text-foreground">
            한 달 뒤, 당신의 서재는 조금 더 풍성해질 거예요.
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            <span className="font-semibold text-primary">이달의 책</span>에서 자동 배정됩니다.
            매주 새로운 책을 만나보세요!
          </p>
        </div>

        {/* 관리자 안내 */}
        {isAdmin && (
          <Link
            href="/admin/programs"
            className="mt-3 flex items-center justify-between rounded-xl border border-amber-200 bg-amber-50 p-3 transition-colors hover:bg-amber-100"
          >
            <div className="flex items-center gap-2">
              <Settings size={14} className="text-amber-600" />
              <span className="text-xs font-medium text-amber-700">
                이달의 책은 관리자 페이지에서 수정할 수 있습니다
              </span>
            </div>
            <ChevronRight size={14} className="text-amber-600" />
          </Link>
        )}

        {/* 이달의 책 미리보기 */}
        {monthlyBooks.length > 0 && (
          <div className="mt-3 rounded-xl border border-border bg-card p-3">
            <div className="mb-2 flex items-center gap-2">
              <Book size={14} className="text-primary" />
              <span className="text-xs font-bold text-foreground">이달의 책 ({monthlyBooks.length}권)</span>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {monthlyBooks.map((book, index) => (
                <div
                  key={book.id}
                  className="flex-shrink-0 text-center"
                >
                  <div className="relative">
                    <img
                      src={book.cover}
                      alt={book.title}
                      className="h-16 w-12 rounded-md object-cover shadow-sm"
                    />
                    <span className="absolute -top-1 -left-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-white">
                      {index + 1}
                    </span>
                  </div>
                  <p className="mt-1 w-12 truncate text-[9px] text-muted-foreground">{book.title}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Calendar Week View */}
      <div className="px-5 sm:px-8">
        <div className="rounded-2xl border border-border bg-card p-4">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-primary" />
              <span className="text-sm font-medium text-foreground">날짜 선택</span>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => navigateWeek(-1)}
                className="flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={() => navigateWeek(1)}
                className="flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1">
            {weekDates.map((date) => {
              const isSelected = formatDate(date) === formatDate(selectedDate)
              const past = isPast(date)
              const today = isToday(date)

              return (
                <button
                  key={formatDate(date)}
                  onClick={() => !past && setSelectedDate(date)}
                  disabled={past}
                  className={cn(
                    "flex flex-col items-center rounded-xl py-2 transition-all",
                    past && "opacity-40 cursor-not-allowed",
                    isSelected && !past && "bg-primary text-primary-foreground",
                    !isSelected && !past && "hover:bg-muted",
                    today && !isSelected && "ring-2 ring-primary ring-offset-2"
                  )}
                >
                  <span className="text-[10px]">
                    {["일", "월", "화", "수", "목", "금", "토"][date.getDay()]}
                  </span>
                  <span className={cn("text-sm font-bold", today && !isSelected && "text-primary")}>
                    {date.getDate()}
                  </span>
                </button>
              )
            })}
          </div>

          <p className="mt-3 text-center text-xs text-muted-foreground">
            선택된 날짜: <span className="font-medium text-foreground">{formatDateDisplay(selectedDate)}</span>
          </p>
        </div>
      </div>

      {/* Dropdown Filter */}
      <div className="px-5 sm:px-8">
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex w-full items-center justify-between rounded-xl border border-border bg-card px-4 py-3 text-sm font-medium text-foreground shadow-sm transition-all hover:border-primary/50"
          >
            <span>모임 선택: {selectedLabel}</span>
            <ChevronDown
              size={16}
              className={`text-muted-foreground transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
            />
          </button>

          {isDropdownOpen && (
            <div className="absolute left-0 right-0 top-full z-50 mt-1 overflow-hidden rounded-xl border border-border bg-card shadow-lg">
              {groupOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => {
                    setSelectedGroup(option.id)
                    setIsDropdownOpen(false)
                  }}
                  className={cn(
                    "flex w-full flex-col px-4 py-3 text-left transition-colors hover:bg-muted",
                    selectedGroup === option.id && "bg-primary/10"
                  )}
                >
                  <span
                    className={cn(
                      "text-sm font-medium",
                      selectedGroup === option.id ? "text-primary" : "text-foreground"
                    )}
                  >
                    {option.label}
                  </span>
                  {option.description && (
                    <span className="text-xs text-muted-foreground">{option.description}</span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Reading Groups */}
      <div className="flex flex-col gap-6 px-5 sm:px-8">
        {filteredGroups.map((group) => {
          const colors = groupColors[group.id]
          const book = getBookForGroup(group.id)

          return (
            <div key={group.id} className="flex flex-col gap-3">
              {/* Group Header with Book - 카드 스타일 */}
              <div className={cn("relative overflow-hidden rounded-2xl bg-gradient-to-br", colors.gradient)}>
                {/* 배경 큰 텍스트 */}
                <div className="absolute -right-4 top-1/2 -translate-y-1/2 select-none">
                  <span className="text-[80px] font-black text-white/20 leading-none">
                    {colors.accent}
                  </span>
                </div>

                {/* 컨텐츠 */}
                <div className="relative flex gap-4 p-5">
                  {/* 책 이미지 */}
                  <div className="relative flex-shrink-0">
                    <div className="absolute -bottom-2 -right-2 h-full w-full rounded-lg bg-black/20" />
                    <img
                      src={book.cover}
                      alt={book.title}
                      className="relative h-28 w-20 rounded-lg object-cover shadow-xl ring-2 ring-white/30"
                    />
                  </div>

                  {/* 텍스트 정보 */}
                  <div className="flex flex-1 flex-col justify-center">
                    <div className="flex items-center gap-2">
                      <span className="w-fit rounded-full bg-white/20 px-2.5 py-1 text-[10px] font-bold text-white backdrop-blur-sm">
                        {group.name}
                      </span>
                      <span className="rounded-full bg-white/10 px-2 py-0.5 text-[9px] text-white/80">
                        {weeklyAssignment.weekNumber}주차
                      </span>
                    </div>
                    <h3 className="mt-2 text-lg font-bold text-white">{book.title}</h3>
                    <p className="text-sm text-white/80">{book.author}</p>
                    <p className="mt-1.5 text-xs text-white/70 line-clamp-2">
                      {book.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Time Slots */}
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {group.timeSlots.map((slot) => {
                  const isApplied = isSessionApplied(selectedDate, group.id, slot.time)

                  return (
                    <button
                      key={slot.time}
                      onClick={() => !isApplied && setSelectedSession({ group, book, timeSlot: slot, date: selectedDate })}
                      disabled={isApplied}
                      className={cn(
                        "flex flex-col items-center rounded-xl border p-3 transition-all",
                        isApplied
                          ? "border-primary/30 bg-primary/5"
                          : "border-border bg-card hover:border-primary/50 hover:shadow-md"
                      )}
                    >
                      <span className="text-xs font-bold text-foreground">{slot.displayTime}</span>
                      <span className="mt-1 text-[10px] text-muted-foreground">{slot.location}</span>
                      {isApplied ? (
                        <span className="mt-2 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
                          신청완료
                        </span>
                      ) : (
                        <span className={cn("mt-2 rounded-full px-2 py-0.5 text-[10px] font-bold text-white", colors.bg)}>
                          신청가능
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      {/* Booking Limit Warning */}
      {!canApply && (
        <div className="mx-5 rounded-xl bg-amber-50 p-4 text-center sm:mx-8">
          <p className="text-sm font-medium text-amber-700">
            최대 신청 가능 횟수({MAX_BOOKINGS}회)에 도달했습니다.
          </p>
          <p className="mt-1 text-xs text-amber-600">
            기존 신청을 취소하면 새로운 모임에 참여할 수 있습니다.
          </p>
        </div>
      )}

      {/* Detail Modal */}
      {selectedSession && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-foreground/50 p-4 backdrop-blur-sm"
          onClick={() => setSelectedSession(null)}
        >
          <div
            className="relative w-full max-w-md overflow-hidden rounded-3xl border border-border bg-card shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-border px-6 py-4">
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 text-xs font-bold",
                    groupColors[selectedSession.group.id].badge
                  )}
                >
                  {selectedSession.group.name}
                </span>
                <h2 className="text-lg font-bold text-foreground">모임 상세</h2>
              </div>
              <button
                onClick={() => setSelectedSession(null)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors hover:bg-border hover:text-foreground"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="px-6 py-6">
              {/* Book Info */}
              <div className="flex gap-4">
                <img
                  src={selectedSession.book.cover}
                  alt={selectedSession.book.title}
                  className="h-32 w-24 rounded-xl object-cover shadow-md"
                />
                <div className="flex flex-col">
                  <span className="text-xs font-medium text-muted-foreground">
                    {weeklyAssignment.weekNumber}주차 도서
                  </span>
                  <h3 className="mt-1 text-lg font-bold text-foreground">{selectedSession.book.title}</h3>
                  <p className="text-sm text-muted-foreground">{selectedSession.book.author}</p>
                  <p className="mt-2 text-xs text-muted-foreground">{selectedSession.book.description}</p>
                </div>
              </div>

              {/* Session Details */}
              <div className="mt-6 flex flex-col gap-3">
                <div className="flex items-center gap-3 rounded-xl bg-muted/50 px-4 py-3">
                  <Calendar size={18} className="text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">날짜</p>
                    <p className="text-sm font-medium text-foreground">
                      {formatDateDisplay(selectedSession.date)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-xl bg-muted/50 px-4 py-3">
                  <Clock size={18} className="text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">진행 시간</p>
                    <p className="text-sm font-medium text-foreground">
                      {selectedSession.timeSlot.displayTime} (1시간)
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-xl bg-muted/50 px-4 py-3">
                  <MapPin size={18} className="text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">장소</p>
                    <p className="text-sm font-medium text-foreground">{selectedSession.timeSlot.location}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-xl bg-muted/50 px-4 py-3">
                  <Users size={18} className="text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">인원</p>
                    <p className="text-sm font-medium text-foreground">최대 8명</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-xl bg-muted/50 px-4 py-3">
                  <BookOpen size={18} className="text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">활동 내용</p>
                    <p className="text-sm font-medium text-foreground">함께 읽기 시간</p>
                  </div>
                </div>
              </div>

              {/* Booking Count */}
              <div className="mt-4 rounded-xl bg-amber-50 p-3 text-center">
                <p className="text-xs text-amber-700">
                  현재 신청: <span className="font-bold">{appliedSessions.length}/{MAX_BOOKINGS}</span>회
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="border-t border-border bg-muted/30 px-6 py-4">
              {!canApply ? (
                <div className="rounded-xl bg-muted py-3 text-center text-sm font-bold text-muted-foreground">
                  신청 가능 횟수를 초과했습니다
                </div>
              ) : (
                <button
                  onClick={handleApply}
                  className={cn(
                    "w-full rounded-xl py-3 text-sm font-bold text-white shadow-md transition-all hover:brightness-110",
                    groupColors[selectedSession.group.id].bg
                  )}
                >
                  신청하기
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
