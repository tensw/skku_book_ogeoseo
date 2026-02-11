"use client"

import React, { createContext, useContext, useState, useCallback, type ReactNode } from "react"
import type { ClubDetailData } from "@/components/club-detail-modal"

// ===== 독모 (Reading Groups) 데이터 =====
export interface TimeSlot {
  time: string
  displayTime: string
  location: string
}

export interface ReadingGroup {
  id: "yeomyeong" | "yunseul" | "dalbit"
  name: string
  description: string
  timeSlots: TimeSlot[]
}

// 기본 독모 그룹 데이터
const defaultReadingGroups: ReadingGroup[] = [
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

// ===== 독토 (Discussion Clubs) 데이터 =====
export type LeaderType = "student" | "professor" | "author"

export interface Discussion {
  id: number
  title: string
  book: string
  bookCover: string
  vibeImage: string
  leader: string
  leaderType: LeaderType
  members: number
  maxMembers: number
  nextMeeting: string
  price: string
  originalPrice: string
  groupBuy: boolean
  rating: number
  tags: string[]
  tagColors: string[]
  detail: ClubDetailData
}

const defaultDiscussions: Discussion[] = [
  {
    id: 1,
    title: "숨겨둔 내 안의 이야기",
    book: "아무튼, 메모",
    bookCover: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=100&h=140&fit=crop",
    vibeImage: "https://picsum.photos/seed/vibe-essay/800/400",
    leader: "OOO 학생",
    leaderType: "student",
    members: 5,
    maxMembers: 8,
    nextMeeting: "매주 화 20:00",
    price: "10,800",
    originalPrice: "14,400",
    groupBuy: true,
    rating: 4.8,
    tags: ["에세이", "자기탐색"],
    tagColors: ["bg-tangerine/10 text-tangerine", "bg-mint/10 text-mint"],
    detail: {
      id: 1, title: "숨겨둔 내 안의 이야기", leader: "OOO 학생", leaderType: "student",
      leaderDept: "중국어학과", leaderSchool: "성균관대학교", leaderYear: "2학년",
      leaderMessage: "감정을 메모하는 습관이 삶을 바꿉니다. 함께 내면의 목소리에 귀 기울여봐요!",
      topic: "숨겨둔 내 안의 이야기", book: "아무튼, 메모",
      bookCover: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=100&h=140&fit=crop", minMembers: 3, maxMembers: 8, currentMembers: 5,
      schedule: ["3/10 (화) 20:00 - 21:00", "3/24 (화) 20:00 - 21:00"],
      assignments: [
        { week: "1주차", task: "일상 속 감정에 이름 붙이기 - 하루에 3가지 감정을 메모하고 왜 그 감정을 느꼈는지 기록해주세요." },
        { week: "2주차", task: "감정에 이름붙이기 2회 인증 - 메모 습관이 나에게 어떤 변화를 주었는지 나눠주세요." },
      ],
    },
  },
  {
    id: 2,
    title: "철학 독서 모임",
    book: "생각의 오류를 넘어서",
    bookCover: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=100&h=140&fit=crop",
    vibeImage: "https://picsum.photos/seed/vibe-history/800/400",
    leader: "김지혜 교수",
    leaderType: "professor",
    members: 12,
    maxMembers: 15,
    nextMeeting: "매주 금 19:00",
    price: "11,200",
    originalPrice: "15,000",
    groupBuy: true,
    rating: 4.6,
    tags: ["철학", "논픽션"],
    tagColors: ["bg-emerald/10 text-emerald", "bg-primary/10 text-primary"],
    detail: {
      id: 2, title: "철학 독서 모임", leader: "김지혜 교수", leaderType: "professor",
      leaderDept: "철학과", leaderSchool: "서울대학교", leaderYear: "",
      leaderMessage: "고전 철학서를 함께 읽고 현대적 관점에서 토론합니다.",
      topic: "일상 속 철학 탐구", book: "생각의 오류를 넘어서",
      bookCover: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=100&h=140&fit=crop", minMembers: 5, maxMembers: 15, currentMembers: 12,
      schedule: ["3/18 (금) 19:00 - 20:30", "4/1 (금) 19:00 - 20:30"],
      assignments: [
        { week: "1주차", task: "인지 편향 3가지를 일상에서 찾아 기록하고 분석해주세요." },
        { week: "2주차", task: "매몰비용 오류에 대한 자신의 경험을 500자 내로 정리해주세요." },
      ],
    },
  },
  {
    id: 3,
    title: "현대 문학 클럽",
    book: "채식주의자",
    bookCover: "https://images.unsplash.com/photo-1476275466078-4007374efbbe?w=100&h=140&fit=crop",
    vibeImage: "https://picsum.photos/seed/vibe-literature/800/400",
    leader: "박서연 작가",
    leaderType: "author",
    members: 32,
    maxMembers: 40,
    nextMeeting: "매주 일 21:00",
    price: "12,000",
    originalPrice: "16,200",
    groupBuy: true,
    rating: 4.9,
    tags: ["문학", "한국"],
    tagColors: ["bg-primary/10 text-primary", "bg-tangerine/10 text-tangerine"],
    detail: {
      id: 3, title: "현대 문학 클럽", leader: "박서연 작가", leaderType: "author",
      leaderDept: "소설가", leaderSchool: "", leaderYear: "",
      leaderMessage: "문학은 타인의 삶을 경험하는 가장 아름다운 방법입니다.",
      topic: "한국 현대문학 깊이 읽기", book: "채식주의자",
      bookCover: "https://images.unsplash.com/photo-1476275466078-4007374efbbe?w=100&h=140&fit=crop", minMembers: 10, maxMembers: 40, currentMembers: 32,
      schedule: ["3/20 (일) 21:00 - 22:30", "4/3 (일) 21:00 - 22:30"],
      assignments: [
        { week: "1주차", task: "소설 속 상징적 장면 하나를 골라 자신의 해석을 작성해주세요." },
        { week: "2주차", task: "작가의 문체와 서사 기법에 대한 느낀 점을 자유롭게 공유해주세요." },
      ],
    },
  },
  {
    id: 4,
    title: "과학과 사회",
    book: "라이프 3.0",
    bookCover: "https://images.unsplash.com/photo-1589998059171-988d887df646?w=100&h=140&fit=crop",
    vibeImage: "https://picsum.photos/seed/vibe-habit/800/400",
    leader: "최동우 교수",
    leaderType: "professor",
    members: 18,
    maxMembers: 20,
    nextMeeting: "매주 화 20:00",
    price: "14,200",
    originalPrice: "19,000",
    groupBuy: true,
    rating: 4.7,
    tags: ["기술", "과학"],
    tagColors: ["bg-emerald/10 text-emerald", "bg-mint/10 text-mint"],
    detail: {
      id: 4, title: "과학과 사회", leader: "최동우 교수", leaderType: "professor",
      leaderDept: "컴퓨터공학과", leaderSchool: "KAIST", leaderYear: "",
      leaderMessage: "과학이 사회에 미치는 영향을 함께 고민해봐요!",
      topic: "AI와 미래 사회", book: "라이프 3.0",
      bookCover: "https://images.unsplash.com/photo-1589998059171-988d887df646?w=100&h=140&fit=crop", minMembers: 5, maxMembers: 20, currentMembers: 18,
      schedule: ["3/22 (화) 20:00 - 21:00", "4/5 (화) 20:00 - 21:00"],
      assignments: [
        { week: "1주차", task: "AI가 자신의 전공 분야에 어떤 변화를 가져올지 예측해주세요." },
        { week: "2주차", task: "라이프 3.0의 5~7장 핵심 논점 토론 질문 2개를 준비해주세요." },
      ],
    },
  },
]

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
    content: "오늘 독서 모임에서 채식주의자 토론 완료! 한강 작가의 상징성에 대해 정말 깊은 이야기를 나눴어요. 다음 주제는 소년이 온다!",
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
  // 독모
  readingGroups: ReadingGroup[]
  updateReadingGroup: (id: string, group: Partial<ReadingGroup>) => void

  // 독토
  discussions: Discussion[]
  addDiscussion: (discussion: Omit<Discussion, "id">) => void
  updateDiscussion: (id: number, discussion: Partial<Discussion>) => void
  deleteDiscussion: (id: number) => void

  // Talk
  talkPosts: TalkPost[]
  addTalkPost: (post: Omit<TalkPost, "id">) => void
  updateTalkPost: (id: number, post: Partial<TalkPost>) => void
  deleteTalkPost: (id: number) => void

  // 신청 상태
  joinedDoktoClubs: number[]
  setJoinedDoktoClubs: React.Dispatch<React.SetStateAction<number[]>>
  appliedDokmoSessions: string[]
  setAppliedDokmoSessions: React.Dispatch<React.SetStateAction<string[]>>
}

const SharedDataContext = createContext<SharedDataContextType | null>(null)

export function SharedDataProvider({ children }: { children: ReactNode }) {
  // 독모
  const [readingGroups, setReadingGroups] = useState<ReadingGroup[]>(defaultReadingGroups)

  // 독토
  const [discussions, setDiscussions] = useState<Discussion[]>(defaultDiscussions)

  // Talk
  const [talkPosts, setTalkPosts] = useState<TalkPost[]>(defaultTalkPosts)

  // 신청 상태 (전역 관리)
  const [joinedDoktoClubs, setJoinedDoktoClubs] = useState<number[]>([])
  const [appliedDokmoSessions, setAppliedDokmoSessions] = useState<string[]>([])

  // 독모 관련
  const updateReadingGroup = useCallback((id: string, updates: Partial<ReadingGroup>) => {
    setReadingGroups((prev) =>
      prev.map((g) => (g.id === id ? { ...g, ...updates } : g))
    )
  }, [])

  // 독토 관련
  const addDiscussion = useCallback((discussion: Omit<Discussion, "id">) => {
    const newId = Math.max(...discussions.map((d) => d.id), 0) + 1
    setDiscussions((prev) => [{ ...discussion, id: newId } as Discussion, ...prev])
  }, [discussions])

  const updateDiscussion = useCallback((id: number, updates: Partial<Discussion>) => {
    setDiscussions((prev) =>
      prev.map((d) => (d.id === id ? { ...d, ...updates } : d))
    )
  }, [])

  const deleteDiscussion = useCallback((id: number) => {
    setDiscussions((prev) => prev.filter((d) => d.id !== id))
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
        // 독모
        readingGroups,
        updateReadingGroup,
        // 독토
        discussions,
        addDiscussion,
        updateDiscussion,
        deleteDiscussion,
        // Talk
        talkPosts,
        addTalkPost,
        updateTalkPost,
        deleteTalkPost,
        // 신청 상태
        joinedDoktoClubs,
        setJoinedDoktoClubs,
        appliedDokmoSessions,
        setAppliedDokmoSessions,
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
