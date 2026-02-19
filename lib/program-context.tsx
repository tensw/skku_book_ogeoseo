"use client"

import React, { createContext, useContext, useState, useCallback, type ReactNode } from "react"

export interface CustomProgram {
  id: string
  name: string
  description: string
  notice: string
  gradient: string
  accentText: string
  hasCalendar: boolean
  startDate?: string
  endDate?: string
  customFields: { label: string; value: string }[]
  createdAt: string
  isActive: boolean
}

export interface MonthlyBook {
  id: string
  title: string
  author: string
  cover: string
  description: string
}

interface ProgramContextType {
  customPrograms: CustomProgram[]
  addProgram: (program: Omit<CustomProgram, "id" | "createdAt">) => void
  updateProgram: (id: string, program: Partial<CustomProgram>) => void
  deleteProgram: (id: string) => void
  getAllProgramOptions: () => { id: string; label: string }[]
  monthlyBooks: MonthlyBook[]
  setMonthlyBooks: (books: MonthlyBook[]) => void
  addMonthlyBook: (book: Omit<MonthlyBook, "id">) => void
  updateMonthlyBook: (id: string, book: Partial<MonthlyBook>) => void
  deleteMonthlyBook: (id: string) => void
  reorderMonthlyBooks: (books: MonthlyBook[]) => void
  currentMonth: string
  setCurrentMonth: (month: string) => void
}

const ProgramContext = createContext<ProgramContextType | null>(null)

const defaultCustomPrograms: CustomProgram[] = []

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
    const baseOptions = [
      { id: "free", label: "자유 서평" },
      { id: "bundok", label: "번독" },
      { id: "classic100", label: "고전 100선" },
    ]
    const customOptions = customPrograms
      .filter((p) => p.isActive)
      .map((p) => ({ id: p.id, label: p.name }))

    return [...baseOptions, ...customOptions]
  }, [customPrograms])

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

  return (
    <ProgramContext.Provider
      value={{
        customPrograms,
        addProgram,
        updateProgram,
        deleteProgram,
        getAllProgramOptions,
        monthlyBooks,
        setMonthlyBooks,
        addMonthlyBook,
        updateMonthlyBook,
        deleteMonthlyBook,
        reorderMonthlyBooks,
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
