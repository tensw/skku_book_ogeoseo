"use client"

import React, { createContext, useContext, useState, useCallback, useMemo, type ReactNode } from "react"

export interface CustomProgram {
  id: string
  name: string
  description: string
  notice: string // 주의사항 및 안내
  gradient: string // 그라데이션 색상
  accentText: string // 배경 큰 텍스트
  hasCalendar: boolean
  startDate?: string
  endDate?: string
  customFields: { label: string; value: string }[]
  createdAt: string
  isActive: boolean
}

// 이달의 책 타입
export interface MonthlyBook {
  id: string
  title: string
  author: string
  cover: string
  description: string
}

// 독서모임별 책 배정 결과 타입
export interface WeeklyBookAssignment {
  yeomyeong: MonthlyBook | null  // 여명독
  yunseul: MonthlyBook | null    // 윤슬독 (여명독과 동일)
  dalbit: MonthlyBook | null     // 달빛독 (다음 책)
  weekNumber: number
}

interface ProgramContextType {
  customPrograms: CustomProgram[]
  addProgram: (program: Omit<CustomProgram, "id" | "createdAt">) => void
  updateProgram: (id: string, program: Partial<CustomProgram>) => void
  deleteProgram: (id: string) => void
  getAllProgramOptions: () => { id: string; label: string }[]
  // 이달의 책 관련
  monthlyBooks: MonthlyBook[]
  setMonthlyBooks: (books: MonthlyBook[]) => void
  addMonthlyBook: (book: Omit<MonthlyBook, "id">) => void
  updateMonthlyBook: (id: string, book: Partial<MonthlyBook>) => void
  deleteMonthlyBook: (id: string) => void
  reorderMonthlyBooks: (books: MonthlyBook[]) => void
  getWeeklyBookAssignment: () => WeeklyBookAssignment
  currentMonth: string
  setCurrentMonth: (month: string) => void
}

const ProgramContext = createContext<ProgramContextType | null>(null)

// 커스텀 프로그램 (관리자가 추가한 프로그램들)
const defaultCustomPrograms: CustomProgram[] = []

// 기본 이달의 책 (예시 데이터)
const defaultMonthlyBooks: MonthlyBook[] = [
  {
    id: "book-1",
    title: "미움받을 용기",
    author: "기시미 이치로",
    cover: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=100&h=140&fit=crop",
    description: "아들러 심리학을 통해 자유로운 삶을 탐구합니다.",
  },
  {
    id: "book-2",
    title: "데미안",
    author: "헤르만 헤세",
    cover: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=100&h=140&fit=crop",
    description: "자아 탐색의 여정을 함께합니다.",
  },
  {
    id: "book-3",
    title: "아몬드",
    author: "손원평",
    cover: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=100&h=140&fit=crop",
    description: "감정을 느끼지 못하는 소년의 성장 이야기.",
  },
  {
    id: "book-4",
    title: "사피엔스",
    author: "유발 하라리",
    cover: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=100&h=140&fit=crop",
    description: "인류의 역사를 새로운 시각으로 바라봅니다.",
  },
]

// 현재 월의 몇 번째 주인지 계산
function getWeekOfMonth(date: Date): number {
  const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1)
  const firstMonday = new Date(firstDayOfMonth)

  // 첫 번째 월요일 찾기
  const dayOfWeek = firstDayOfMonth.getDay()
  const daysUntilMonday = dayOfWeek === 0 ? 1 : (dayOfWeek === 1 ? 0 : 8 - dayOfWeek)
  firstMonday.setDate(firstDayOfMonth.getDate() + daysUntilMonday)

  // 현재 날짜가 첫 월요일 이전이면 1주차
  if (date < firstMonday) return 1

  // 주차 계산
  const diffTime = date.getTime() - firstMonday.getTime()
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
  return Math.floor(diffDays / 7) + 2 // +2 because we start counting from 1 and first week before monday is 1
}

export function ProgramProvider({ children }: { children: ReactNode }) {
  const [customPrograms, setCustomPrograms] = useState<CustomProgram[]>(defaultCustomPrograms)
  const [monthlyBooks, setMonthlyBooksState] = useState<MonthlyBook[]>(defaultMonthlyBooks)
  const [currentMonth, setCurrentMonth] = useState<string>(() => {
    const now = new Date()
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`
  })

  const addProgram = useCallback((program: Omit<CustomProgram, "id" | "createdAt">) => {
    const newProgram: CustomProgram = {
      ...program,
      id: `program-${Date.now()}`,
      createdAt: new Date().toISOString().split("T")[0],
    }
    setCustomPrograms((prev) => [newProgram, ...prev])
  }, [])

  const updateProgram = useCallback((id: string, updates: Partial<CustomProgram>) => {
    setCustomPrograms((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    )
  }, [])

  const deleteProgram = useCallback((id: string) => {
    setCustomPrograms((prev) => prev.filter((p) => p.id !== id))
  }, [])

  const getAllProgramOptions = useCallback(() => {
    // 기본 옵션 + 커스텀 프로그램
    const baseOptions = [
      { id: "free", label: "자유 서평" },
      { id: "dokmo", label: "독모" },
      { id: "dokto", label: "독토" },
      { id: "classic100", label: "고전 100선" },
    ]
    const customOptions = customPrograms
      .filter((p) => p.isActive)
      .map((p) => ({ id: p.id, label: p.name }))

    return [...baseOptions, ...customOptions]
  }, [customPrograms])

  // 이달의 책 관련 함수들
  const setMonthlyBooks = useCallback((books: MonthlyBook[]) => {
    setMonthlyBooksState(books)
  }, [])

  const addMonthlyBook = useCallback((book: Omit<MonthlyBook, "id">) => {
    const newBook: MonthlyBook = {
      ...book,
      id: `book-${Date.now()}`,
    }
    setMonthlyBooksState((prev) => [...prev, newBook])
  }, [])

  const updateMonthlyBook = useCallback((id: string, updates: Partial<MonthlyBook>) => {
    setMonthlyBooksState((prev) =>
      prev.map((b) => (b.id === id ? { ...b, ...updates } : b))
    )
  }, [])

  const deleteMonthlyBook = useCallback((id: string) => {
    setMonthlyBooksState((prev) => prev.filter((b) => b.id !== id))
  }, [])

  const reorderMonthlyBooks = useCallback((books: MonthlyBook[]) => {
    setMonthlyBooksState(books)
  }, [])

  // 주차별 책 배정 계산
  // 여명독/윤슬독: 같은 책, 달빛독: 다음 책
  // 매주 2권씩 소비 (여명/윤슬 1권 + 달빛 1권)
  const getWeeklyBookAssignment = useCallback((): WeeklyBookAssignment => {
    const weekNumber = getWeekOfMonth(new Date())

    if (monthlyBooks.length < 2) {
      return {
        yeomyeong: monthlyBooks[0] || null,
        yunseul: monthlyBooks[0] || null,
        dalbit: monthlyBooks[1] || monthlyBooks[0] || null,
        weekNumber,
      }
    }

    // 주차에 따른 책 인덱스 계산
    // 1주차: 0, 1 / 2주차: 2, 3 / 3주차: 4, 5 ...
    const baseIndex = ((weekNumber - 1) * 2) % monthlyBooks.length
    const nextIndex = (baseIndex + 1) % monthlyBooks.length

    return {
      yeomyeong: monthlyBooks[baseIndex],
      yunseul: monthlyBooks[baseIndex],
      dalbit: monthlyBooks[nextIndex],
      weekNumber,
    }
  }, [monthlyBooks])

  return (
    <ProgramContext.Provider
      value={{
        customPrograms,
        addProgram,
        updateProgram,
        deleteProgram,
        getAllProgramOptions,
        // 이달의 책
        monthlyBooks,
        setMonthlyBooks,
        addMonthlyBook,
        updateMonthlyBook,
        deleteMonthlyBook,
        reorderMonthlyBooks,
        getWeeklyBookAssignment,
        currentMonth,
        setCurrentMonth,
      }}
    >
      {children}
    </ProgramContext.Provider>
  )
}

export function usePrograms() {
  const context = useContext(ProgramContext)
  if (!context) {
    throw new Error("usePrograms must be used within a ProgramProvider")
  }
  return context
}
