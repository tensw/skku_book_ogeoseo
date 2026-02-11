"use client"

import React from "react"
import { useState } from "react"
import {
  GraduationCap,
  Users,
  Clock,
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
import { useSharedData, type Discussion, type LeaderType } from "@/lib/shared-data-context"

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
  const {
    discussions,
    addDiscussion,
    updateDiscussion,
    deleteDiscussion,
    joinedDoktoClubs,
    setJoinedDoktoClubs,
  } = useSharedData()

  const [activeTab, setActiveTab] = useState("all")
  const [bookmarked, setBookmarked] = useState<number[]>([])
  const [selectedClub, setSelectedClub] = useState<ClubDetailData | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingDiscussion, setEditingDiscussion] = useState<DiscussionForm | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null)

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
      setJoinedDoktoClubs((prev) =>
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
      deleteDiscussion(deleteConfirm)
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
      updateDiscussion(editingDiscussion.id, {
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
      })
    } else {
      const newId = Math.max(...discussions.map((d) => d.id), 0) + 1
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
      addDiscussion(newDiscussion)
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
              {discussions.length}개 진행 중
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
          const isJoined = joinedDoktoClubs.includes(discussion.id)
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
        applied={selectedClub ? joinedDoktoClubs.includes(selectedClub.id) : false}
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
