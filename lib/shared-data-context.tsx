"use client"

import React, { createContext, useContext, useState, useCallback, type ReactNode } from "react"
import { bundoks as defaultBundoks } from "@/lib/mock-data"
import type { Bundok } from "@/lib/types"

// ===== Talk Posts 데이터 =====
export interface Reply {
  id: number
  author: string
  avatar: string
  content: string
  time: string
  likes: number
}

export interface TalkPost {
  id: number
  author: string
  authorType: "student" | "professor"
  avatar: string
  time: string
  content: string
  bookMention?: string
  photos?: string[]
  likes: number
  comments: number
  shares: number
  liked: boolean
  replies?: Reply[]
}

const defaultTalkPosts: TalkPost[] = [
  {
    id: 1,
    author: "윤하나",
    authorType: "student",
    avatar: "https://picsum.photos/seed/avatar3/80/80",
    time: "30분 전",
    content: "오늘 번독 모임에서 채식주의자 토론 완료! 한강 작가의 상징성에 대해 정말 깊은 이야기를 나눴어요. 다음 주제는 소년이 온다!",
    bookMention: "채식주의자",
    photos: ["https://picsum.photos/seed/post-discussion/800/600", "https://picsum.photos/seed/post-bookclub/800/600"],
    likes: 56,
    comments: 12,
    shares: 7,
    liked: false,
    replies: [
      { id: 101, author: "이민준", avatar: "https://picsum.photos/seed/reply1/80/80", content: "정말 재미있었어요! 다음 모임도 기대됩니다.", time: "20분 전", likes: 5 },
    ],
  },
  {
    id: 2,
    author: "김소은",
    authorType: "student",
    avatar: "https://picsum.photos/seed/avatar5/80/80",
    time: "2시간 전",
    content: "아침 독서 루틴 3주차 인증! 습관의 힘 읽으면서 진짜 시스템이 바뀌고 있다는 걸 느껴요. 매일 30분씩 읽기 챌린지 같이 하실 분?",
    bookMention: "아주 작은 습관의 힘",
    photos: ["https://picsum.photos/seed/post-reading/800/600"],
    likes: 89,
    comments: 23,
    shares: 15,
    liked: true,
    replies: [
      { id: 201, author: "최동우", avatar: "https://picsum.photos/seed/reply2/80/80", content: "저도 참여하고 싶어요! 어떻게 시작하면 될까요?", time: "1시간 전", likes: 12 },
      { id: 202, author: "박서연", avatar: "https://picsum.photos/seed/reply3/80/80", content: "저도 2주째 하고 있는데 확실히 달라지더라고요!", time: "40분 전", likes: 8 },
    ],
  },
  {
    id: 3,
    author: "박민준",
    authorType: "student",
    avatar: "https://picsum.photos/seed/avatar2/80/80",
    time: "4시간 전",
    content: "카페에서 사피엔스 읽는 중. 커피 한 잔과 함께하는 일요일 오후가 최고네요.",
    photos: ["https://picsum.photos/seed/post-bookclub/800/600"],
    likes: 42,
    comments: 8,
    shares: 3,
    liked: false,
  },
]

// ===== Context 타입 =====
interface SharedDataContextType {
  // 번독
  bundoks: Bundok[]
  addBundok: (bundok: Omit<Bundok, "id">) => void
  updateBundok: (id: number, bundok: Partial<Bundok>) => void
  deleteBundok: (id: number) => void

  // Talk
  talkPosts: TalkPost[]
  addTalkPost: (post: Omit<TalkPost, "id">) => void
  updateTalkPost: (id: number, post: Partial<TalkPost>) => void
  deleteTalkPost: (id: number) => void

  // 참여 상태
  joinedBundoks: number[]
  setJoinedBundoks: React.Dispatch<React.SetStateAction<number[]>>
}

const SharedDataContext = createContext<SharedDataContextType | null>(null)

export function SharedDataProvider({ children }: { children: ReactNode }) {
  // 번독
  const [bundoks, setBundoks] = useState<Bundok[]>(defaultBundoks)

  // Talk
  const [talkPosts, setTalkPosts] = useState<TalkPost[]>(defaultTalkPosts)

  // 참여 상태
  const [joinedBundoks, setJoinedBundoks] = useState<number[]>([])

  // 번독 관련
  const addBundok = useCallback((bundok: Omit<Bundok, "id">) => {
    setBundoks((prev) => {
      const newId = Math.max(...prev.map((b) => b.id), 0) + 1
      return [{ ...bundok, id: newId } as Bundok, ...prev]
    })
  }, [])

  const updateBundok = useCallback((id: number, updates: Partial<Bundok>) => {
    setBundoks((prev) =>
      prev.map((b) => (b.id === id ? { ...b, ...updates } : b))
    )
  }, [])

  const deleteBundok = useCallback((id: number) => {
    setBundoks((prev) => prev.filter((b) => b.id !== id))
  }, [])

  // Talk 관련
  const addTalkPost = useCallback((post: Omit<TalkPost, "id">) => {
    const newId = Date.now()
    setTalkPosts((prev) => [{ ...post, id: newId } as TalkPost, ...prev])
  }, [])

  const updateTalkPost = useCallback((id: number, updates: Partial<TalkPost>) => {
    setTalkPosts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    )
  }, [])

  const deleteTalkPost = useCallback((id: number) => {
    setTalkPosts((prev) => prev.filter((p) => p.id !== id))
  }, [])

  return (
    <SharedDataContext.Provider
      value={{
        // 번독
        bundoks,
        addBundok,
        updateBundok,
        deleteBundok,
        // Talk
        talkPosts,
        addTalkPost,
        updateTalkPost,
        deleteTalkPost,
        // 참여 상태
        joinedBundoks,
        setJoinedBundoks,
      }}
    >
      {children}
    </SharedDataContext.Provider>
  )
}

export function useSharedData() {
  const context = useContext(SharedDataContext)
  if (!context) {
    throw new Error("useSharedData must be used within a SharedDataProvider")
  }
  return context
}
