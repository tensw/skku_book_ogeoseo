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
  Plus,
  Pencil,
  Trash2,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { ClubDetailModal } from "@/components/club-detail-modal"
import type { ClubDetailData } from "@/components/club-detail-modal"
import { useAuth } from "@/lib/auth-context"

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
    title: "인류 역사의 이해",
    book: "사피엔스: 인류의 역사",
    bookCover: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=100&h=140&fit=crop",
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
      bookCover: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=100&h=140&fit=crop", minMembers: 5, maxMembers: 15, currentMembers: 12,
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
    bookCover: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=100&h=140&fit=crop",
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
      bookCover: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=100&h=140&fit=crop", minMembers: 20, maxMembers: 50, currentMembers: 42,
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
    bookCover: "https://images.unsplash.com/photo-1476275466078-4007374efbbe?w=100&h=140&fit=crop",
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
      bookCover: "https://images.unsplash.com/photo-1476275466078-4007374efbbe?w=100&h=140&fit=crop", minMembers: 4, maxMembers: 12, currentMembers: 8,
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
    bookCover: "https://images.unsplash.com/photo-1589998059171-988d887df646?w=100&h=140&fit=crop",
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
      bookCover: "https://images.unsplash.com/photo-1589998059171-988d887df646?w=100&h=140&fit=crop", minMembers: 10, maxMembers: 30, currentMembers: 28,
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
    bookCover: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=100&h=140&fit=crop",
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
      bookCover: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=100&h=140&fit=crop", minMembers: 3, maxMembers: 10, currentMembers: 6,
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

interface DiscussionForm {
  id?: number
  title: string
  book: string
  bookCover: string
  vibeImage: string
  leader: string
  leaderType: LeaderType
  maxMembers: number
  nextMeeting: string
  tags: string[]
}

const emptyDiscussionForm: DiscussionForm = {
  title: "",
  book: "",
  bookCover: "",
  vibeImage: "",
  leader: "",
  leaderType: "student",
  maxMembers: 10,
  nextMeeting: "",
  tags: [],
}

export function DiscussionsPage() {
  const { isAdmin } = useAuth()
  const [activeTab, setActiveTab] = useState("all")
  const [bookmarked, setBookmarked] = useState<number[]>([])
  const [selectedClub, setSelectedClub] = useState<ClubDetailData | null>(null)
  const [joinedClubs, setJoinedClubs] = useState<number[]>([])
  const [discussionList, setDiscussionList] = useState<Discussion[]>(discussions)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingDiscussion, setEditingDiscussion] = useState<DiscussionForm | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null)

  const filteredDiscussions = discussionList.filter((d) => {
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

  const handleCreate = () => {
    setEditingDiscussion(emptyDiscussionForm)
    setIsModalOpen(true)
  }

  const handleEdit = (e: React.MouseEvent, discussion: Discussion) => {
    e.stopPropagation()
    setEditingDiscussion({
      id: discussion.id,
      title: discussion.title,
      book: discussion.book,
      bookCover: discussion.bookCover,
      vibeImage: discussion.vibeImage,
      leader: discussion.leader,
      leaderType: discussion.leaderType,
      maxMembers: discussion.maxMembers,
      nextMeeting: discussion.nextMeeting,
      tags: discussion.tags,
    })
    setIsModalOpen(true)
  }

  const handleDelete = (e: React.MouseEvent, id: number) => {
    e.stopPropagation()
    setDeleteConfirm(id)
  }

  const confirmDelete = () => {
    if (deleteConfirm) {
      setDiscussionList(discussionList.filter((d) => d.id !== deleteConfirm))
      setDeleteConfirm(null)
    }
  }

  const handleSave = () => {
    if (!editingDiscussion) return

    const tagColors = [
      "bg-tangerine/10 text-tangerine",
      "bg-mint/10 text-mint",
      "bg-emerald/10 text-emerald",
      "bg-primary/10 text-primary",
    ]

    if (editingDiscussion.id) {
      setDiscussionList(discussionList.map((d) =>
        d.id === editingDiscussion.id
          ? {
              ...d,
              title: editingDiscussion.title,
              book: editingDiscussion.book,
              bookCover: editingDiscussion.bookCover || "https://picsum.photos/seed/newbook/100/140",
              vibeImage: editingDiscussion.vibeImage || "https://picsum.photos/seed/newvibe/800/400",
              leader: editingDiscussion.leader,
              leaderType: editingDiscussion.leaderType,
              maxMembers: editingDiscussion.maxMembers,
              nextMeeting: editingDiscussion.nextMeeting,
              tags: editingDiscussion.tags,
              tagColors: editingDiscussion.tags.map((_, i) => tagColors[i % tagColors.length]),
            }
          : d
      ))
    } else {
      const newId = Math.max(...discussionList.map((d) => d.id)) + 1
      const newDiscussion: Discussion = {
        id: newId,
        title: editingDiscussion.title,
        book: editingDiscussion.book,
        bookCover: editingDiscussion.bookCover || "https://picsum.photos/seed/newbook/100/140",
        vibeImage: editingDiscussion.vibeImage || "https://picsum.photos/seed/newvibe/800/400",
        leader: editingDiscussion.leader,
        leaderType: editingDiscussion.leaderType,
        members: 0,
        maxMembers: editingDiscussion.maxMembers,
        nextMeeting: editingDiscussion.nextMeeting,
        price: "10,000",
        originalPrice: "15,000",
        groupBuy: true,
        rating: 0,
        tags: editingDiscussion.tags,
        tagColors: editingDiscussion.tags.map((_, i) => tagColors[i % tagColors.length]),
        detail: {
          id: newId,
          title: editingDiscussion.title,
          leader: editingDiscussion.leader,
          leaderType: editingDiscussion.leaderType,
          leaderDept: "",
          topic: editingDiscussion.title,
          book: editingDiscussion.book,
          bookCover: editingDiscussion.bookCover || "https://picsum.photos/seed/newbook/100/140",
          minMembers: 3,
          maxMembers: editingDiscussion.maxMembers,
          currentMembers: 0,
          schedule: [editingDiscussion.nextMeeting],
          assignments: [],
        },
      }
      setDiscussionList([newDiscussion, ...discussionList])
    }
    setIsModalOpen(false)
    setEditingDiscussion(null)
  }

  return (
    <div className="flex flex-col gap-4 pb-6">
      {/* Header */}
      <header className="px-5 pt-5 sm:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-foreground">독토</h1>
            <span className="rounded-full bg-tangerine/10 px-2 py-0.5 text-[10px] font-bold text-tangerine">
              {discussionList.length}개 진행 중
            </span>
          </div>
          {isAdmin && (
            <button
              onClick={handleCreate}
              className="flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-md transition-all hover:shadow-lg hover:brightness-110"
            >
              <Plus size={14} />
              독토 생성
            </button>
          )}
        </div>
        <p className="mt-0.5 text-[11px] text-muted-foreground">나에게 맞는 독서토론회를 찾아보세요</p>

        {/* Motivational Message */}
        <div className="mt-4 rounded-2xl bg-gradient-to-r from-tangerine/10 via-primary/10 to-emerald/10 p-4">
          <p className="text-sm leading-relaxed text-foreground">
            읽은 책을 다양한 학생들과, 교수님과, 작가님과 깊게 생각해보고 자유롭게 소통해봐요!
          </p>
        </div>
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
              {/* Card Image with Book + Background Text */}
              <div className={cn(
                "relative h-44 overflow-hidden sm:h-48",
                discussion.leaderType === "student" ? "bg-gradient-to-br from-emerald to-emerald/80" :
                discussion.leaderType === "professor" ? "bg-gradient-to-br from-sky-500 to-sky-600" :
                "bg-gradient-to-br from-tangerine to-orange-500"
              )}>
                {/* 배경 큰 텍스트 */}
                <div className="absolute -right-2 top-1/2 -translate-y-1/2 select-none">
                  <span className="text-[70px] font-black text-white/15 leading-none">
                    {discussion.tags[0] || "독서"}
                  </span>
                </div>

                {/* 책 이미지 */}
                <div className="absolute bottom-4 left-4">
                  <div className="relative">
                    <div className="absolute -bottom-1 -right-1 h-full w-full rounded-lg bg-black/20" />
                    <img
                      src={discussion.bookCover || "/placeholder.svg"}
                      alt={discussion.book}
                      className="relative h-28 w-20 rounded-lg object-cover shadow-xl ring-2 ring-white/30"
                    />
                  </div>
                </div>

                {/* 우측 텍스트 정보 */}
                <div className="absolute bottom-4 left-28 right-3">
                  <div className="flex flex-wrap gap-1 mb-2">
                    {discussion.tags.map((tag, i) => (
                      <span
                        key={tag}
                        className="rounded-full bg-white/20 px-2 py-0.5 text-[9px] font-bold text-white backdrop-blur-sm"
                      >
                        {tag}
                      </span>
                    ))}
                    {discussion.rating >= 4.7 && (
                      <span className="flex items-center gap-0.5 rounded-full bg-white/30 px-2 py-0.5 text-[9px] font-bold text-white backdrop-blur-sm">
                        <Flame size={9} />
                        HOT
                      </span>
                    )}
                  </div>
                  <h3 className="text-base font-bold text-white leading-tight">{discussion.title}</h3>
                  <p className="text-xs text-white/80 mt-0.5">{discussion.book}</p>
                  <div className="mt-2">
                    <span className={cn(
                      "inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[9px] font-semibold bg-white/20 text-white backdrop-blur-sm"
                    )}>
                      <GraduationCap size={9} />
                      {discussion.leader}
                    </span>
                  </div>
                </div>

                {/* Bookmark & Admin Actions */}
                <div className="absolute right-3 top-3 flex items-center gap-1">
                  {isAdmin && (
                    <>
                      <button
                        onClick={(e) => handleEdit(e, discussion)}
                        className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition-colors hover:bg-white/30"
                        title="수정"
                      >
                        <Pencil size={12} />
                      </button>
                      <button
                        onClick={(e) => handleDelete(e, discussion.id)}
                        className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition-colors hover:bg-white/30"
                        title="삭제"
                      >
                        <Trash2 size={12} />
                      </button>
                    </>
                  )}
                  <button
                    onClick={(e) => toggleBookmark(e, discussion.id)}
                    aria-label={bookmarked.includes(discussion.id) ? "북마크 해제" : "북마크 추가"}
                  >
                    <Bookmark
                      size={18}
                      className={cn(
                        "drop-shadow-sm transition-colors",
                        bookmarked.includes(discussion.id) ? "fill-white text-white" : "text-white/60"
                      )}
                    />
                  </button>
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

      {/* Create/Edit Modal */}
      {isModalOpen && editingDiscussion && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-foreground/50 p-4 backdrop-blur-sm"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl border border-border bg-card shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-border px-6 py-4">
              <h2 className="text-lg font-bold text-foreground">
                {editingDiscussion.id ? "독토 수정" : "새 독토 생성"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors hover:bg-border hover:text-foreground"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex flex-col gap-4 px-6 py-6">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">독토 제목</label>
                <input
                  type="text"
                  value={editingDiscussion.title}
                  onChange={(e) => setEditingDiscussion({ ...editingDiscussion, title: e.target.value })}
                  placeholder="예: 숨겨둔 내 안의 이야기"
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">도서명</label>
                <input
                  type="text"
                  value={editingDiscussion.book}
                  onChange={(e) => setEditingDiscussion({ ...editingDiscussion, book: e.target.value })}
                  placeholder="예: 아무튼, 메모"
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">리더</label>
                <input
                  type="text"
                  value={editingDiscussion.leader}
                  onChange={(e) => setEditingDiscussion({ ...editingDiscussion, leader: e.target.value })}
                  placeholder="예: OOO 학생"
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">리더 유형</label>
                <select
                  value={editingDiscussion.leaderType}
                  onChange={(e) => setEditingDiscussion({ ...editingDiscussion, leaderType: e.target.value as LeaderType })}
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="student">학생</option>
                  <option value="professor">교수</option>
                  <option value="author">작가</option>
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">최대 인원</label>
                <input
                  type="number"
                  value={editingDiscussion.maxMembers}
                  onChange={(e) => setEditingDiscussion({ ...editingDiscussion, maxMembers: Number(e.target.value) })}
                  min={1}
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">일정</label>
                <input
                  type="text"
                  value={editingDiscussion.nextMeeting}
                  onChange={(e) => setEditingDiscussion({ ...editingDiscussion, nextMeeting: e.target.value })}
                  placeholder="예: 매주 화 20:00"
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">태그 (쉼표로 구분)</label>
                <input
                  type="text"
                  value={editingDiscussion.tags.join(", ")}
                  onChange={(e) => setEditingDiscussion({ ...editingDiscussion, tags: e.target.value.split(",").map(t => t.trim()).filter(t => t) })}
                  placeholder="예: 에세이, 자기탐색"
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">도서 표지 URL (선택)</label>
                <input
                  type="text"
                  value={editingDiscussion.bookCover}
                  onChange={(e) => setEditingDiscussion({ ...editingDiscussion, bookCover: e.target.value })}
                  placeholder="https://..."
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">배경 이미지 URL (선택)</label>
                <input
                  type="text"
                  value={editingDiscussion.vibeImage}
                  onChange={(e) => setEditingDiscussion({ ...editingDiscussion, vibeImage: e.target.value })}
                  placeholder="https://..."
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            <div className="flex gap-3 border-t border-border bg-muted/30 px-6 py-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="flex-1 rounded-xl border border-border bg-card py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted"
              >
                취소
              </button>
              <button
                onClick={handleSave}
                disabled={!editingDiscussion.title.trim() || !editingDiscussion.book.trim() || !editingDiscussion.leader.trim()}
                className="flex-1 rounded-xl bg-primary py-3 text-sm font-bold text-primary-foreground transition-all hover:brightness-110 disabled:opacity-50"
              >
                {editingDiscussion.id ? "수정" : "생성"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-foreground/50 p-4 backdrop-blur-sm"
          onClick={() => setDeleteConfirm(null)}
        >
          <div
            className="w-full max-w-sm overflow-hidden rounded-2xl border border-border bg-card shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-6 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                <Trash2 size={24} className="text-red-500" />
              </div>
              <h3 className="text-lg font-bold text-foreground">독토 삭제</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                정말 이 독토를 삭제하시겠습니까?<br />
                이 작업은 되돌릴 수 없습니다.
              </p>
            </div>
            <div className="flex gap-3 border-t border-border bg-muted/30 px-6 py-4">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 rounded-xl border border-border bg-card py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
              >
                취소
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 rounded-xl bg-red-500 py-2.5 text-sm font-bold text-white transition-all hover:bg-red-600"
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
