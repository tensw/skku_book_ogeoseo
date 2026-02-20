"use client"

import { useState, useMemo } from "react"
import {
  Users,
  Search,
  Award,
  BookOpen,
  ShieldCheck,
  GraduationCap,
  ChevronDown,
  Plus,
  Minus,
  X,
  Calendar,
  MessageCircle,
  Star,
  Zap,
  ChevronLeft,
} from "lucide-react"
import { format, subHours, subDays } from "date-fns"
import { reviews as allReviews } from "@/lib/mock-data"
import { usePrograms } from "@/lib/program-context"
import { cn } from "@/lib/utils"

// Mock user data
const mockUsers = [
  {
    id: 1,
    name: "김민준",
    nickname: "책벌레민준",
    email: "minjun.kim@skku.edu",
    studentId: "2021310001",
    department: "국어국문학과",
    avatar: "https://picsum.photos/seed/user1/80/80",
    role: "student" as const,
    stamps: 12,
    reviews: 8,
    badges: 6,
    programs: { dokmo: 5, dokto: 3 },
    joinedAt: "2024-03-15",
    lastActive: "2025-02-12",
  },
  {
    id: 2,
    name: "이서연",
    nickname: "철학하는곰",
    email: "seoyeon.lee@skku.edu",
    studentId: "2020310042",
    department: "철학과",
    avatar: "https://picsum.photos/seed/user2/80/80",
    role: "student" as const,
    stamps: 20,
    reviews: 15,
    badges: 9,
    programs: { dokmo: 12, dokto: 8 },
    joinedAt: "2024-01-10",
    lastActive: "2025-02-12",
  },
  {
    id: 3,
    name: "박지훈",
    nickname: "코딩독서가",
    email: "jihun.park@skku.edu",
    studentId: "2022310088",
    department: "컴퓨터공학과",
    avatar: "https://picsum.photos/seed/user3/80/80",
    role: "student" as const,
    stamps: 5,
    reviews: 3,
    badges: 2,
    programs: { dokmo: 2, dokto: 1 },
    joinedAt: "2024-09-01",
    lastActive: "2025-02-10",
  },
  {
    id: 4,
    name: "최수아",
    nickname: "경영학멘토",
    email: "sua.choi@skku.edu",
    studentId: "P2019001",
    department: "경영학과",
    avatar: "https://picsum.photos/seed/user4/80/80",
    role: "professor" as const,
    stamps: 0,
    reviews: 25,
    badges: 10,
    programs: { dokmo: 0, dokto: 15 },
    joinedAt: "2024-02-20",
    lastActive: "2025-02-12",
  },
  {
    id: 5,
    name: "정도윤",
    nickname: "역사탐험가",
    email: "doyun.jung@skku.edu",
    studentId: "2023310156",
    department: "역사학과",
    avatar: "https://picsum.photos/seed/user5/80/80",
    role: "student" as const,
    stamps: 2,
    reviews: 1,
    badges: 1,
    programs: { dokmo: 1, dokto: 0 },
    joinedAt: "2024-11-05",
    lastActive: "2025-02-08",
  },
  {
    id: 6,
    name: "한예진",
    nickname: "영문학소녀",
    email: "yejin.han@skku.edu",
    studentId: "2021310234",
    department: "영어영문학과",
    avatar: "https://picsum.photos/seed/user6/80/80",
    role: "student" as const,
    stamps: 18,
    reviews: 12,
    badges: 8,
    programs: { dokmo: 8, dokto: 6 },
    joinedAt: "2024-04-12",
    lastActive: "2025-02-11",
  },
  {
    id: 7,
    name: "오관리",
    nickname: "관리자",
    email: "admin@skku.edu",
    studentId: "A0001",
    department: "도서관",
    avatar: "https://picsum.photos/seed/admin/80/80",
    role: "admin" as const,
    stamps: 0,
    reviews: 0,
    badges: 0,
    programs: { dokmo: 0, dokto: 0 },
    joinedAt: "2024-01-01",
    lastActive: "2025-02-12",
  },
]

type UserRole = "student" | "professor" | "admin"
type FilterType = "all" | "student" | "professor" | "admin"

const roleLabels: Record<UserRole, string> = {
  student: "학생",
  professor: "교수",
  admin: "관리자",
}

const roleColors: Record<UserRole, { bg: string; text: string }> = {
  student: { bg: "bg-emerald-100", text: "text-emerald-700" },
  professor: { bg: "bg-sky-100", text: "text-sky-700" },
  admin: { bg: "bg-purple-100", text: "text-purple-700" },
}

function resolveDate(timeAgo: string): Date {
  const now = new Date()
  const hourMatch = timeAgo.match(/(\d+)시간/)
  const dayMatch = timeAgo.match(/(\d+)일/)
  if (hourMatch) return subHours(now, Number(hourMatch[1]))
  if (dayMatch) return subDays(now, Number(dayMatch[1]))
  return now
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState(mockUsers)
  const [search, setSearch] = useState("")
  const [roleFilter, setRoleFilter] = useState<FilterType>("all")
  const [selectedUser, setSelectedUser] = useState<typeof mockUsers[0] | null>(null)
  const [stampModal, setStampModal] = useState<{ userId: number; type: "add" | "remove" } | null>(null)
  const [stampAmount, setStampAmount] = useState(1)
  const [roleChangeModal, setRoleChangeModal] = useState<number | null>(null)
  const [showingReviews, setShowingReviews] = useState(false)
  const [viewingReview, setViewingReview] = useState<typeof allReviews[number] | null>(null)
  const { getAllProgramOptions } = usePrograms()
  const programOptions = getAllProgramOptions()

  const filteredUsers = useMemo(() => {
    let result = users

    if (roleFilter !== "all") {
      result = result.filter((u) => u.role === roleFilter)
    }

    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(
        (u) =>
          u.name.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q) ||
          u.studentId.toLowerCase().includes(q) ||
          u.department.toLowerCase().includes(q)
      )
    }

    return result
  }, [users, roleFilter, search])

  const stats = {
    total: users.length,
    students: users.filter((u) => u.role === "student").length,
    professors: users.filter((u) => u.role === "professor").length,
    admins: users.filter((u) => u.role === "admin").length,
    totalStamps: users.reduce((sum, u) => sum + u.stamps, 0),
  }

  const userReviews = useMemo(() => {
    if (!selectedUser) return []
    return allReviews.filter((r) => r.user.name === selectedUser.name)
  }, [selectedUser])

  const handleStampChange = () => {
    if (!stampModal) return
    const { userId, type } = stampModal
    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId
          ? { ...u, stamps: type === "add" ? u.stamps + stampAmount : Math.max(0, u.stamps - stampAmount) }
          : u
      )
    )
    setStampModal(null)
    setStampAmount(1)
  }

  const handleRoleChange = (userId: number, newRole: UserRole) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId ? { ...u, role: newRole } : u
      )
    )
    setRoleChangeModal(null)
  }

  function getProgramLabel(programId?: string) {
    if (!programId) return "-"
    const opt = programOptions.find((o) => o.id === programId)
    return opt?.label ?? programId
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-foreground">이용자 관리</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          회원 목록, 스탬프 관리, 권한 설정
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Users size={16} />
            <span className="text-xs">전체 회원</span>
          </div>
          <p className="mt-2 text-2xl font-bold text-foreground">{stats.total}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-2 text-emerald-600">
            <BookOpen size={16} />
            <span className="text-xs">학생</span>
          </div>
          <p className="mt-2 text-2xl font-bold text-emerald-600">{stats.students}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-2 text-sky-600">
            <GraduationCap size={16} />
            <span className="text-xs">교수</span>
          </div>
          <p className="mt-2 text-2xl font-bold text-sky-600">{stats.professors}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-2 text-purple-600">
            <ShieldCheck size={16} />
            <span className="text-xs">관리자</span>
          </div>
          <p className="mt-2 text-2xl font-bold text-purple-600">{stats.admins}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-2 text-amber-600">
            <Award size={16} />
            <span className="text-xs">총 스탬프</span>
          </div>
          <p className="mt-2 text-2xl font-bold text-amber-600">{stats.totalStamps}</p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-2">
          {[
            { id: "all", label: "전체" },
            { id: "student", label: "학생" },
            { id: "professor", label: "교수" },
            { id: "admin", label: "관리자" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setRoleFilter(tab.id as FilterType)}
              className={cn(
                "rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                roleFilter === tab.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-border"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="relative">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="이름, 이메일, 학번 검색..."
            className="w-full rounded-lg border border-border bg-card py-2 pl-9 pr-4 text-sm outline-none focus:border-primary sm:w-72"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead className="border-b border-border bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                  회원 정보
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-muted-foreground">
                  권한
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-muted-foreground">
                  스탬프
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-muted-foreground">
                  서평 / 뱃지
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-muted-foreground">
                  관리
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredUsers.map((user) => (
                <tr
                  key={user.id}
                  className="transition-colors hover:bg-muted/30"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="h-10 w-10 rounded-full object-cover"
                        crossOrigin="anonymous"
                      />
                      <div>
                        <p className="text-sm text-foreground">
                          <span className="font-medium">{user.name}</span>
                          <span className="ml-1.5 text-[11px] text-muted-foreground">@{user.nickname}</span>
                        </p>
                        <p className="text-[11px] text-muted-foreground">
                          {user.department} · {user.studentId}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => setRoleChangeModal(user.id)}
                      className={cn(
                        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium transition-colors hover:opacity-80",
                        roleColors[user.role].bg,
                        roleColors[user.role].text
                      )}
                    >
                      {user.role === "admin" && <ShieldCheck size={12} />}
                      {user.role === "professor" && <GraduationCap size={12} />}
                      {user.role === "student" && <BookOpen size={12} />}
                      {roleLabels[user.role]}
                      <ChevronDown size={10} />
                    </button>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => setStampModal({ userId: user.id, type: "remove" })}
                        className="rounded p-1 text-red-500 transition-colors hover:bg-red-100"
                        title="스탬프 차감"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="min-w-[2rem] text-sm font-bold text-amber-600">
                        {user.stamps}
                      </span>
                      <button
                        onClick={() => setStampModal({ userId: user.id, type: "add" })}
                        className="rounded p-1 text-emerald-500 transition-colors hover:bg-emerald-100"
                        title="스탬프 추가"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1" title="서평">
                        <MessageCircle size={12} />
                        {user.reviews}
                      </span>
                      <span className="flex items-center gap-1" title="뱃지">
                        <Star size={12} />
                        {user.badges}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => { setSelectedUser(user); setShowingReviews(false) }}
                      className="rounded-lg px-3 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary/10"
                    >
                      상세
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="py-12 text-center">
            <Users size={32} className="mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">회원이 없습니다.</p>
          </div>
        )}
      </div>

      {/* User Detail Modal */}
      {selectedUser && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-foreground/50 p-4 backdrop-blur-sm"
          onClick={() => { setSelectedUser(null); setShowingReviews(false); setViewingReview(null) }}
        >
          <div
            className="w-full max-w-lg overflow-hidden rounded-2xl border border-border bg-card shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-border px-6 py-4">
              <div className="flex items-center gap-2">
                {showingReviews && (
                  <button
                    onClick={() => { setShowingReviews(false); setViewingReview(null) }}
                    className="rounded-full p-1 text-muted-foreground transition-colors hover:bg-muted"
                  >
                    <ChevronLeft size={18} />
                  </button>
                )}
                <h3 className="text-lg font-bold text-foreground">
                  {showingReviews ? `${selectedUser.name}의 서평` : "회원 상세 정보"}
                </h3>
              </div>
              <button
                onClick={() => { setSelectedUser(null); setShowingReviews(false); setViewingReview(null) }}
                className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted"
              >
                <X size={18} />
              </button>
            </div>

            {!showingReviews ? (
              <div className="p-6">
                {/* Profile */}
                <div className="flex items-center gap-4">
                  <img
                    src={selectedUser.avatar}
                    alt={selectedUser.name}
                    className="h-16 w-16 rounded-full object-cover"
                    crossOrigin="anonymous"
                  />
                  <div>
                    <p className="text-lg font-bold text-foreground">
                      {selectedUser.name}
                      <span className="ml-2 text-sm font-normal text-muted-foreground">@{selectedUser.nickname}</span>
                    </p>
                    <p className="text-sm text-muted-foreground">{selectedUser.email}</p>
                    <p className="text-xs text-muted-foreground">
                      {selectedUser.department} · {selectedUser.studentId}
                    </p>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="mt-6 grid grid-cols-3 gap-3">
                  <div className="rounded-xl bg-amber-50 p-3 text-center">
                    <Award size={20} className="mx-auto text-amber-600" />
                    <p className="mt-1 text-lg font-bold text-amber-600">{selectedUser.stamps}</p>
                    <p className="text-[10px] text-amber-700">스탬프</p>
                  </div>
                  <button
                    onClick={() => setShowingReviews(true)}
                    className="rounded-xl bg-emerald-50 p-3 text-center transition-colors hover:bg-emerald-100"
                  >
                    <MessageCircle size={20} className="mx-auto text-emerald-600" />
                    <p className="mt-1 text-lg font-bold text-emerald-600">{selectedUser.reviews}</p>
                    <p className="text-[10px] text-emerald-700">서평 보기 &rarr;</p>
                  </button>
                  <div className="rounded-xl bg-purple-50 p-3 text-center">
                    <Star size={20} className="mx-auto text-purple-600" />
                    <p className="mt-1 text-lg font-bold text-purple-600">{selectedUser.badges}</p>
                    <p className="text-[10px] text-purple-700">뱃지</p>
                  </div>
                </div>

                {/* Program Participation */}
                <div className="mt-4 rounded-xl border border-border p-4">
                  <h5 className="mb-3 text-xs font-bold text-muted-foreground">프로그램 참여</h5>
                  <div className="flex gap-4">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100">
                        <Zap size={14} className="text-amber-600" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-foreground">{selectedUser.programs.dokmo}</p>
                        <p className="text-[10px] text-muted-foreground">번독 참여</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-tangerine/20">
                        <GraduationCap size={14} className="text-tangerine" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-foreground">{selectedUser.programs.dokto}</p>
                        <p className="text-[10px] text-muted-foreground">고전100선 참여</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Dates */}
                <div className="mt-4 flex gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar size={12} />
                    가입일: {selectedUser.joinedAt}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar size={12} />
                    최근 활동: {selectedUser.lastActive}
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-6">
                {!viewingReview ? (
                  <div className="max-h-80 space-y-2 overflow-y-auto">
                    {userReviews.length === 0 && (
                      <p className="py-8 text-center text-sm text-muted-foreground">작성한 서평이 없습니다.</p>
                    )}
                    {userReviews.map((r) => (
                      <button
                        key={r.id}
                        onClick={() => setViewingReview(r)}
                        className="flex w-full items-center justify-between rounded-lg border border-border p-3 text-left transition-colors hover:bg-muted/50"
                      >
                        <div className="flex-1">
                          <p className="text-sm font-medium text-foreground">{r.book.title}</p>
                          <p className="mt-0.5 text-xs text-muted-foreground">
                            {r.book.author} · {getProgramLabel(r.programId)} · {format(resolveDate(r.timeAgo), "yyyy.MM.dd")}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 text-amber-500">
                          <Star size={12} fill="currentColor" />
                          <span className="text-xs font-semibold">{r.rating}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <button
                      onClick={() => setViewingReview(null)}
                      className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
                    >
                      <ChevronLeft size={16} /> 서평 목록으로
                    </button>
                    <div>
                      <h4 className="text-base font-bold text-foreground">{viewingReview.book.title}</h4>
                      <p className="text-xs text-muted-foreground">
                        {viewingReview.book.author} · {getProgramLabel(viewingReview.programId)} · {format(resolveDate(viewingReview.timeAgo), "yyyy.MM.dd")}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          fill={i < viewingReview.rating ? "currentColor" : "none"}
                          className={i < viewingReview.rating ? "text-amber-500" : "text-muted-foreground/30"}
                        />
                      ))}
                      <span className="ml-1 text-sm font-semibold">{viewingReview.rating}/5</span>
                    </div>
                    <div className="max-h-48 overflow-y-auto rounded-lg bg-muted/50 p-4">
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{viewingReview.text}</p>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>글자수: {viewingReview.text.length}자</span>
                      <span>좋아요: {viewingReview.likes}</span>
                      <span>댓글: {viewingReview.comments}</span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Stamp Modal */}
      {stampModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-foreground/50 p-4 backdrop-blur-sm"
          onClick={() => {
            setStampModal(null)
            setStampAmount(1)
          }}
        >
          <div
            className="w-full max-w-sm overflow-hidden rounded-2xl border border-border bg-card shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-6 text-center">
              <div
                className={cn(
                  "mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full",
                  stampModal.type === "add" ? "bg-emerald-100" : "bg-red-100"
                )}
              >
                {stampModal.type === "add" ? (
                  <Plus size={24} className="text-emerald-500" />
                ) : (
                  <Minus size={24} className="text-red-500" />
                )}
              </div>
              <h3 className="text-lg font-bold text-foreground">
                스탬프 {stampModal.type === "add" ? "추가" : "차감"}
              </h3>
              <div className="mt-4">
                <label className="text-sm text-muted-foreground">수량</label>
                <input
                  type="number"
                  min={1}
                  max={20}
                  value={stampAmount}
                  onChange={(e) => setStampAmount(Math.max(1, parseInt(e.target.value) || 1))}
                  className="mt-2 w-full rounded-lg border border-border bg-muted px-4 py-2 text-center text-lg font-bold outline-none focus:border-primary"
                />
              </div>
            </div>
            <div className="flex gap-3 border-t border-border bg-muted/30 px-6 py-4">
              <button
                onClick={() => {
                  setStampModal(null)
                  setStampAmount(1)
                }}
                className="flex-1 rounded-xl border border-border bg-card py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
              >
                취소
              </button>
              <button
                onClick={handleStampChange}
                className={cn(
                  "flex-1 rounded-xl py-2.5 text-sm font-bold text-white transition-all",
                  stampModal.type === "add"
                    ? "bg-emerald-500 hover:bg-emerald-600"
                    : "bg-red-500 hover:bg-red-600"
                )}
              >
                {stampModal.type === "add" ? "추가" : "차감"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Role Change Modal */}
      {roleChangeModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-foreground/50 p-4 backdrop-blur-sm"
          onClick={() => setRoleChangeModal(null)}
        >
          <div
            className="w-full max-w-xs overflow-hidden rounded-2xl border border-border bg-card shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="border-b border-border px-6 py-4">
              <h3 className="text-center text-sm font-bold text-foreground">권한 변경</h3>
            </div>
            <div className="p-2">
              {(["student", "professor", "admin"] as UserRole[]).map((role) => (
                <button
                  key={role}
                  onClick={() => handleRoleChange(roleChangeModal, role)}
                  className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm transition-colors hover:bg-muted"
                >
                  <div
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-full",
                      roleColors[role].bg
                    )}
                  >
                    {role === "admin" && <ShieldCheck size={16} className={roleColors[role].text} />}
                    {role === "professor" && <GraduationCap size={16} className={roleColors[role].text} />}
                    {role === "student" && <BookOpen size={16} className={roleColors[role].text} />}
                  </div>
                  <span className="font-medium text-foreground">{roleLabels[role]}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
