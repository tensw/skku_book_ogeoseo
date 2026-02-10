"use client"

import React from "react"
import { useState } from "react"
import {
  GraduationCap,
  Users,
  Clock,
  ShoppingCart,
  Bookmark,
  Star,
  Flame,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { ClubDetailModal } from "@/components/club-detail-modal"
import type { ClubDetailData } from "@/components/club-detail-modal"

type LeaderType = "student" | "professor" | "author"

interface Discussion {
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

const discussions: Discussion[] = [
  {
    id: 1,
    title: "숨겨둔 내 안의 이야기",
    book: "아무튼, 메모",
    bookCover: "https://picsum.photos/seed/disc1/100/140",
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
      bookCover: "https://picsum.photos/seed/disc1/100/140", minMembers: 3, maxMembers: 8, currentMembers: 5,
      schedule: ["3/10 (화) 20:00 - 21:00", "3/24 (화) 20:00 - 21:00"],
      assignments: [
        { week: "1주차", task: "일상 속 감정에 이름 붙이기 - 하루에 3가지 감정을 메모하고 왜 그 감정을 느꼈는지 기록해주세요." },
        { week: "2주차", task: "감정에 이름붙이기 2회 인증 - 메모 습관이 나에게 어떤 변화를 주었는지 나눠주세요." },
      ],
    },
  },
  {
    id: 2,
    title: "인류 역사의 이해",
    book: "사피엔스: 인류의 역사",
    bookCover: "https://picsum.photos/seed/disc2/100/140",
    vibeImage: "https://picsum.photos/seed/vibe-history/800/400",
    leader: "박민준 학생",
    leaderType: "student",
    members: 12,
    maxMembers: 15,
    nextMeeting: "매주 목 19:00",
    price: "11,200",
    originalPrice: "15,000",
    groupBuy: true,
    rating: 4.6,
    tags: ["역사", "논픽션"],
    tagColors: ["bg-emerald/10 text-emerald", "bg-primary/10 text-primary"],
    detail: {
      id: 2, title: "인류 역사의 이해", leader: "박민준 학생", leaderType: "student",
      leaderDept: "사학과", leaderSchool: "고려대학교", leaderYear: "3학년",
      leaderMessage: "인류의 과거를 이해하면 미래가 보입니다. 함께 탐구해봐요!",
      topic: "인류 역사의 거시적 이해", book: "사피엔스: 인류의 역사",
      bookCover: "https://picsum.photos/seed/disc2/100/140", minMembers: 5, maxMembers: 15, currentMembers: 12,
      schedule: ["3/13 (목) 19:00 - 20:30", "3/27 (목) 19:00 - 20:30"],
      assignments: [
        { week: "1주차", task: "인지혁명에 대한 핵심 논점을 정리하고, 가장 인상 깊은 부분을 공유해주세요." },
        { week: "2주차", task: "농업혁명이 인류에게 진보인지 퇴보인지 자신의 입장을 논리적으로 정리해주세요." },
      ],
    },
  },
  {
    id: 3,
    title: "더 나은 습관 만들기",
    book: "아주 작은 습관의 힘",
    bookCover: "https://picsum.photos/seed/disc3/100/140",
    vibeImage: "https://picsum.photos/seed/vibe-habit/800/400",
    leader: "제임스 클리어 작가",
    leaderType: "author",
    members: 42,
    maxMembers: 50,
    nextMeeting: "매주 토 15:00",
    price: "12,000",
    originalPrice: "16,200",
    groupBuy: true,
    rating: 4.9,
    tags: ["자기계발", "인기"],
    tagColors: ["bg-mint/10 text-mint", "bg-tangerine/10 text-tangerine"],
    detail: {
      id: 3, title: "더 나은 습관 만들기", leader: "제임스 클리어 작가", leaderType: "author",
      leaderDept: "자기계발 베스트셀러 작가",
      topic: "습관 설계와 실천", book: "아주 작은 습관의 힘",
      bookCover: "https://picsum.photos/seed/disc3/100/140", minMembers: 20, maxMembers: 50, currentMembers: 42,
      schedule: ["3/15 (토) 15:00 - 16:30", "3/29 (토) 15:00 - 16:30"],
      assignments: [
        { week: "1주차", task: "자신의 현재 습관 루틴을 분석하고, 바꾸고 싶은 습관 1가지를 선정해주세요." },
        { week: "2주차", task: "2주간 습관 트래커를 기록하고, 변화를 팀원들과 공유해주세요." },
      ],
    },
  },
  {
    id: 4,
    title: "한국 현대문학 읽기",
    book: "채식주의자",
    bookCover: "https://picsum.photos/seed/disc4/100/140",
    vibeImage: "https://picsum.photos/seed/vibe-literature/800/400",
    leader: "이소연 학생",
    leaderType: "student",
    members: 8,
    maxMembers: 12,
    nextMeeting: "매주 수 21:00",
    price: "9,800",
    originalPrice: "13,500",
    groupBuy: true,
    rating: 4.4,
    tags: ["문학", "한국"],
    tagColors: ["bg-primary/10 text-primary", "bg-tangerine/10 text-tangerine"],
    detail: {
      id: 4, title: "한국 현대문학 읽기", leader: "이소연 학생", leaderType: "student",
      leaderDept: "국문학과", leaderSchool: "연세대학교", leaderYear: "4학년",
      leaderMessage: "한국 문학의 깊이를 함께 탐험해요. 다양한 해석을 환영합니다!",
      topic: "한국 현대문학의 상징과 서사", book: "채식주의자",
      bookCover: "https://picsum.photos/seed/disc4/100/140", minMembers: 4, maxMembers: 12, currentMembers: 8,
      schedule: ["3/19 (수) 21:00 - 22:00", "4/2 (수) 21:00 - 22:00"],
      assignments: [
        { week: "1주차", task: "소설 속 상징적 장면 하나를 골라 자신의 해석을 작성해주세요." },
        { week: "2주차", task: "한강 작가의 문체가 주는 정서적 효과에 대해 분석해주세요." },
      ],
    },
  },
  {
    id: 5,
    title: "AI와 미래 사회",
    book: "라이프 3.0",
    bookCover: "https://picsum.photos/seed/disc5/100/140",
    vibeImage: "https://picsum.photos/seed/post-discussion/800/600",
    leader: "최동우 교수",
    leaderType: "professor",
    members: 28,
    maxMembers: 30,
    nextMeeting: "매주 월 20:00",
    price: "14,200",
    originalPrice: "19,000",
    groupBuy: true,
    rating: 4.7,
    tags: ["기술", "과학"],
    tagColors: ["bg-emerald/10 text-emerald", "bg-mint/10 text-mint"],
    detail: {
      id: 5, title: "AI와 미래 사회", leader: "최동우 교수", leaderType: "professor",
      leaderDept: "컴퓨터공학과", leaderSchool: "KAIST",
      leaderMessage: "AI 시대를 살아가는 우리에게 필요한 사고력을 키워봅시다.",
      topic: "AI가 바꿀 미래 사회", book: "라이프 3.0",
      bookCover: "https://picsum.photos/seed/disc5/100/140", minMembers: 10, maxMembers: 30, currentMembers: 28,
      schedule: ["3/17 (월) 20:00 - 21:30", "3/31 (월) 20:00 - 21:30"],
      assignments: [
        { week: "1주차", task: "AI가 자신의 전공/관심 분야에 미칠 영향을 예측하여 정리해주세요." },
        { week: "2주차", task: "5~7장 핵심 논점에 대해 토론 질문을 최소 2개 준비해주세요." },
      ],
    },
  },
  {
    id: 6,
    title: "예술사 핵심 읽기",
    book: "서양미술사",
    bookCover: "https://picsum.photos/seed/disc6/100/140",
    vibeImage: "https://picsum.photos/seed/post-reading/800/600",
    leader: "윤하나 학생",
    leaderType: "student",
    members: 6,
    maxMembers: 10,
    nextMeeting: "매주 금 18:00",
    price: "10,500",
    originalPrice: "14,000",
    groupBuy: true,
    rating: 4.3,
    tags: ["예술", "문화"],
    tagColors: ["bg-tangerine/10 text-tangerine", "bg-primary/10 text-primary"],
    detail: {
      id: 6, title: "예술사 핵심 읽기", leader: "윤하나 학생", leaderType: "student",
      leaderDept: "미술학과", leaderSchool: "홍익대학교", leaderYear: "2학년",
      leaderMessage: "미술사를 통해 세상을 보는 새로운 눈을 함께 열어봐요!",
      topic: "서양미술사의 흐름과 맥락", book: "서양미술사",
      bookCover: "https://picsum.photos/seed/disc6/100/140", minMembers: 3, maxMembers: 10, currentMembers: 6,
      schedule: ["3/21 (금) 18:00 - 19:00", "4/4 (금) 18:00 - 19:00"],
      assignments: [
        { week: "1주차", task: "르네상스 작품 중 하나를 선정하여 감상문을 작성해주세요." },
        { week: "2주차", task: "인상주의가 현대 미술에 미친 영향에 대해 자유롭게 서술해주세요." },
      ],
    },
  },
]

const tabs = [
  { id: "all", label: "전체", color: "bg-primary text-primary-foreground" },
  { id: "student", label: "학생 주도", color: "bg-emerald text-white" },
  { id: "professor", label: "교수 / 작가", color: "bg-tangerine text-white" },
]

export function DiscussionsPage() {
  const [activeTab, setActiveTab] = useState("all")
  const [bookmarked, setBookmarked] = useState<number[]>([])
  const [selectedClub, setSelectedClub] = useState<ClubDetailData | null>(null)
  const [joinedClubs, setJoinedClubs] = useState<number[]>([])

  const filteredDiscussions = discussions.filter((d) => {
    if (activeTab === "all") return true
    if (activeTab === "student") return d.leaderType === "student"
    return d.leaderType === "professor" || d.leaderType === "author"
  })

  const toggleBookmark = (e: React.MouseEvent, id: number) => {
    e.stopPropagation()
    setBookmarked((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

  const handleApply = () => {
    if (selectedClub) {
      setJoinedClubs((prev) =>
        prev.includes(selectedClub.id) ? prev : [...prev, selectedClub.id]
      )
    }
  }

  return (
    <div className="flex flex-col gap-4 pb-6">
      {/* Header */}
      <header className="px-5 pt-5 sm:px-8">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold text-foreground">독토</h1>
          <span className="rounded-full bg-tangerine/10 px-2 py-0.5 text-[10px] font-bold text-tangerine">
            {discussions.length}개 진행 중
          </span>
        </div>
        <p className="mt-0.5 text-[11px] text-muted-foreground">나에게 맞는 독서토론회를 찾아보세요</p>
      </header>

      {/* Tabs - pill style with colors */}
      <div className="flex gap-2 px-5 sm:px-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "rounded-full px-4 py-2 text-xs font-semibold transition-all",
              activeTab === tab.id
                ? tab.color + " shadow-md"
                : "bg-muted text-muted-foreground hover:bg-border"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Cards - vibe image focused */}
      <div className="flex flex-col gap-4 px-5 sm:grid sm:grid-cols-2 sm:gap-4 sm:px-8">
        {filteredDiscussions.map((discussion) => {
          const isJoined = joinedClubs.includes(discussion.id)
          return (
            <div
              key={discussion.id}
              className="group overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all hover:shadow-lg"
            >
              {/* Vibe Image */}
              <div className="relative h-36 overflow-hidden sm:h-40">
                <img
                  src={discussion.vibeImage || "/placeholder.svg"}
                  alt={discussion.title}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/20 to-transparent" />

                {/* Top badges */}
                <div className="absolute left-3 top-3 flex gap-1.5">
                  {discussion.tags.map((tag, i) => (
                    <span
                      key={tag}
                      className={cn("rounded-full px-2 py-0.5 text-[9px] font-bold", discussion.tagColors[i])}
                    >
                      {tag}
                    </span>
                  ))}
                  {discussion.rating >= 4.7 && (
                    <span className="flex items-center gap-0.5 rounded-full bg-tangerine px-2 py-0.5 text-[9px] font-bold text-white">
                      <Flame size={9} />
                      HOT
                    </span>
                  )}
                </div>

                {/* Bookmark */}
                <button
                  onClick={(e) => toggleBookmark(e, discussion.id)}
                  className="absolute right-3 top-3"
                  aria-label={bookmarked.includes(discussion.id) ? "북마크 해제" : "북마크 추가"}
                >
                  <Bookmark
                    size={18}
                    className={cn(
                      "drop-shadow-sm transition-colors",
                      bookmarked.includes(discussion.id) ? "fill-tangerine text-tangerine" : "text-white/80"
                    )}
                  />
                </button>

                {/* Bottom overlay info */}
                <div className="absolute bottom-3 left-3 right-3">
                  <h3 className="text-sm font-bold text-white">{discussion.title}</h3>
                  <div className="mt-1 flex items-center gap-2">
                    <span className={cn(
                      "inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[9px] font-semibold",
                      discussion.leaderType === "student" ? "bg-emerald/90 text-white" :
                      discussion.leaderType === "professor" ? "bg-primary/90 text-white" : "bg-tangerine/90 text-white"
                    )}>
                      <GraduationCap size={9} />
                      {discussion.leader}
                    </span>
                  </div>
                </div>
              </div>

              {/* Info Section */}
              <div className="p-3.5">
                <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Users size={11} />
                    {discussion.members}/{discussion.maxMembers}명
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={11} />
                    {discussion.nextMeeting}
                  </span>
                  <span className="ml-auto flex items-center gap-0.5 font-semibold text-emerald">
                    <Star size={11} className="fill-emerald" />
                    {discussion.rating}
                  </span>
                </div>

                {/* Action Footer */}
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {isJoined ? (
                      <span className="rounded-full bg-primary/10 px-3 py-1.5 text-[10px] font-bold text-primary">
                        신청 완료
                      </span>
                    ) : (
                      <button
                        onClick={() => setSelectedClub(discussion.detail)}
                        className="rounded-full bg-primary px-3.5 py-1.5 text-[10px] font-bold text-primary-foreground shadow-sm transition-all hover:shadow-md hover:brightness-110"
                      >
                        참여
                      </button>
                    )}
                    {isJoined && discussion.groupBuy && (
                      <button className="inline-flex items-center gap-1 rounded-full bg-[#7C3AED] px-2.5 py-1.5 text-[10px] font-bold text-white shadow-sm transition-all hover:bg-[#6D28D9]">
                        <ShoppingCart size={10} />
                        공동구매
                      </button>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-muted-foreground line-through">{discussion.originalPrice}원</span>
                    <span className="text-sm font-bold text-primary">{discussion.price}원</span>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <ClubDetailModal
        club={selectedClub}
        isOpen={!!selectedClub}
        onClose={() => setSelectedClub(null)}
        onApply={handleApply}
        applied={selectedClub ? joinedClubs.includes(selectedClub.id) : false}
      />
    </div>
  )
}
