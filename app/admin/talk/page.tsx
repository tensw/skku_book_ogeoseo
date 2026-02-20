"use client"

import { useState, useMemo } from "react"
import {
  MessageCircle,
  Search,
  Eye,
  EyeOff,
  Trash2,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Filter,
  MoreHorizontal,
  Flag,
  MessageSquare,
  Heart,
  Clock,
} from "lucide-react"
import { cn } from "@/lib/utils"

// Mock data for talk posts
const mockTalkPosts = [
  {
    id: 1,
    author: "김민준",
    authorType: "student",
    department: "국어국문학과",
    avatar: "https://picsum.photos/seed/user1/80/80",
    content: "오늘 읽은 '미드나이트 라이브러리'가 정말 감동적이었어요. 살아보지 못한 삶들을 돌아보는 노라의 여정이 마음에 와닿았습니다.",
    time: "2시간 전",
    likes: 24,
    comments: 5,
    isHidden: false,
    reports: 0,
    createdAt: "2025-02-12",
  },
  {
    id: 2,
    author: "이서연",
    authorType: "student",
    department: "철학과",
    avatar: "https://picsum.photos/seed/user2/80/80",
    content: "정의란 무엇인가 독서토론 정말 유익했습니다! 샌델 교수님의 논증 방식을 따라가다 보니 생각이 깊어지네요.",
    time: "5시간 전",
    likes: 42,
    comments: 12,
    isHidden: false,
    reports: 0,
    createdAt: "2025-02-12",
  },
  {
    id: 3,
    author: "박지훈",
    authorType: "student",
    department: "컴퓨터공학과",
    avatar: "https://picsum.photos/seed/user3/80/80",
    content: "부적절한 내용의 게시글입니다. [신고됨]",
    time: "1일 전",
    likes: 3,
    comments: 1,
    isHidden: true,
    reports: 5,
    createdAt: "2025-02-11",
  },
  {
    id: 4,
    author: "최수아",
    authorType: "professor",
    department: "경영학과",
    avatar: "https://picsum.photos/seed/user4/80/80",
    content: "이번 주 번독 도서 '코스모스' 읽으신 분들, 3장에서 다루는 우주의 기원에 대해 어떻게 생각하시나요?",
    time: "1일 전",
    likes: 67,
    comments: 23,
    isHidden: false,
    reports: 0,
    createdAt: "2025-02-11",
  },
  {
    id: 5,
    author: "정도윤",
    authorType: "student",
    department: "역사학과",
    avatar: "https://picsum.photos/seed/user5/80/80",
    content: "광고성 스팸 게시글입니다. [신고됨]",
    time: "2일 전",
    likes: 0,
    comments: 0,
    isHidden: false,
    reports: 8,
    createdAt: "2025-02-10",
  },
]

// Mock data for reports
const mockReports = [
  {
    id: 1,
    postId: 3,
    postContent: "부적절한 내용의 게시글입니다.",
    postAuthor: "박지훈",
    reportedBy: "김민준",
    reason: "부적절한 내용",
    status: "pending",
    reportedAt: "2025-02-11 14:30",
  },
  {
    id: 2,
    postId: 5,
    postContent: "광고성 스팸 게시글입니다.",
    postAuthor: "정도윤",
    reportedBy: "이서연",
    reason: "스팸/광고",
    status: "pending",
    reportedAt: "2025-02-10 09:15",
  },
  {
    id: 3,
    postId: 5,
    postContent: "광고성 스팸 게시글입니다.",
    postAuthor: "정도윤",
    reportedBy: "최수아",
    reason: "스팸/광고",
    status: "pending",
    reportedAt: "2025-02-10 10:22",
  },
]

type TabType = "all" | "hidden" | "reported"
type ReportStatus = "pending" | "approved" | "rejected"

export default function AdminTalkPage() {
  const [activeTab, setActiveTab] = useState<TabType>("all")
  const [search, setSearch] = useState("")
  const [posts, setPosts] = useState(mockTalkPosts)
  const [reports, setReports] = useState(mockReports)
  const [selectedPost, setSelectedPost] = useState<number | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null)

  const filteredPosts = useMemo(() => {
    let result = posts

    if (activeTab === "hidden") {
      result = result.filter((p) => p.isHidden)
    } else if (activeTab === "reported") {
      result = result.filter((p) => p.reports > 0)
    }

    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(
        (p) =>
          p.content.toLowerCase().includes(q) ||
          p.author.toLowerCase().includes(q)
      )
    }

    return result
  }, [posts, activeTab, search])

  const pendingReports = reports.filter((r) => r.status === "pending")

  const toggleHidden = (postId: number) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId ? { ...p, isHidden: !p.isHidden } : p
      )
    )
  }

  const deletePost = (postId: number) => {
    setPosts((prev) => prev.filter((p) => p.id !== postId))
    setDeleteConfirm(null)
  }

  const handleReport = (reportId: number, status: ReportStatus) => {
    setReports((prev) =>
      prev.map((r) =>
        r.id === reportId ? { ...r, status } : r
      )
    )

    if (status === "approved") {
      const report = reports.find((r) => r.id === reportId)
      if (report) {
        toggleHidden(report.postId)
      }
    }
  }

  const stats = {
    total: posts.length,
    hidden: posts.filter((p) => p.isHidden).length,
    reported: posts.filter((p) => p.reports > 0).length,
    pendingReports: pendingReports.length,
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-foreground">톡톡 관리</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          게시글 모니터링 및 신고 처리
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <MessageCircle size={16} />
            <span className="text-xs">전체 게시글</span>
          </div>
          <p className="mt-2 text-2xl font-bold text-foreground">{stats.total}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <EyeOff size={16} />
            <span className="text-xs">숨김 처리</span>
          </div>
          <p className="mt-2 text-2xl font-bold text-foreground">{stats.hidden}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-2 text-amber-500">
            <Flag size={16} />
            <span className="text-xs">신고된 글</span>
          </div>
          <p className="mt-2 text-2xl font-bold text-amber-500">{stats.reported}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-2 text-red-500">
            <AlertTriangle size={16} />
            <span className="text-xs">처리 대기</span>
          </div>
          <p className="mt-2 text-2xl font-bold text-red-500">{stats.pendingReports}</p>
        </div>
      </div>

      {/* Tabs & Search */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-2">
          {[
            { id: "all", label: "전체", count: stats.total },
            { id: "hidden", label: "숨김", count: stats.hidden },
            { id: "reported", label: "신고", count: stats.reported },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={cn(
                "rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                activeTab === tab.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-border"
              )}
            >
              {tab.label} ({tab.count})
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
            placeholder="게시글 검색..."
            className="w-full rounded-lg border border-border bg-card py-2 pl-9 pr-4 text-sm outline-none focus:border-primary sm:w-64"
          />
        </div>
      </div>

      {/* Pending Reports Section */}
      {pendingReports.length > 0 && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
          <h2 className="mb-3 flex items-center gap-2 text-sm font-bold text-amber-800">
            <AlertTriangle size={16} />
            처리 대기 중인 신고 ({pendingReports.length})
          </h2>
          <div className="space-y-2">
            {pendingReports.slice(0, 3).map((report) => (
              <div
                key={report.id}
                className="flex items-center justify-between rounded-lg bg-white p-3 shadow-sm"
              >
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">
                    <span className="font-medium text-foreground">{report.postAuthor}</span>의 게시글
                  </p>
                  <p className="mt-0.5 line-clamp-1 text-sm text-foreground">
                    {report.postContent}
                  </p>
                  <p className="mt-1 text-[10px] text-muted-foreground">
                    신고 사유: {report.reason} · {report.reportedAt}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleReport(report.id, "approved")}
                    className="flex items-center gap-1 rounded-lg bg-red-100 px-3 py-1.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-200"
                  >
                    <CheckCircle size={12} />
                    숨김 처리
                  </button>
                  <button
                    onClick={() => handleReport(report.id, "rejected")}
                    className="flex items-center gap-1 rounded-lg bg-muted px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-border"
                  >
                    <XCircle size={12} />
                    반려
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Posts Table */}
      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <table className="w-full">
          <thead className="border-b border-border bg-muted/50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                작성자
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                내용
              </th>
              <th className="hidden px-4 py-3 text-center text-xs font-medium text-muted-foreground sm:table-cell">
                반응
              </th>
              <th className="hidden px-4 py-3 text-center text-xs font-medium text-muted-foreground sm:table-cell">
                신고
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-muted-foreground">
                상태
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-muted-foreground">
                관리
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filteredPosts.map((post) => (
              <tr
                key={post.id}
                className={cn(
                  "transition-colors hover:bg-muted/30",
                  post.isHidden && "bg-red-50/50"
                )}
              >
                <td className="whitespace-nowrap px-4 py-3">
                  <div className="flex items-center gap-2">
                    <img
                      src={post.avatar}
                      alt={post.author}
                      className="h-7 w-7 shrink-0 rounded-full object-cover"
                      crossOrigin="anonymous"
                    />
                    <span className="text-sm font-medium text-foreground">{post.author}</span>
                    <span className="text-[11px] text-muted-foreground">{post.department}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <p className="line-clamp-2 text-sm text-foreground">
                    {post.content}
                  </p>
                  <p className="mt-1 flex items-center gap-1 text-[10px] text-muted-foreground">
                    <Clock size={10} />
                    {post.time}
                  </p>
                </td>
                <td className="hidden px-4 py-3 text-center sm:table-cell">
                  <div className="flex items-center justify-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Heart size={12} />
                      {post.likes}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageSquare size={12} />
                      {post.comments}
                    </span>
                  </div>
                </td>
                <td className="hidden px-4 py-3 text-center sm:table-cell">
                  {post.reports > 0 ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-600">
                      <Flag size={10} />
                      {post.reports}
                    </span>
                  ) : (
                    <span className="text-xs text-muted-foreground">-</span>
                  )}
                </td>
                <td className="px-4 py-3 text-center">
                  {post.isHidden ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-600">
                      <EyeOff size={10} />
                      숨김
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-600">
                      <Eye size={10} />
                      공개
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-center">
                  <div className="flex items-center justify-center gap-1">
                    <button
                      onClick={() => toggleHidden(post.id)}
                      className={cn(
                        "rounded-lg p-2 transition-colors",
                        post.isHidden
                          ? "text-emerald-600 hover:bg-emerald-100"
                          : "text-amber-600 hover:bg-amber-100"
                      )}
                      title={post.isHidden ? "공개" : "숨김"}
                    >
                      {post.isHidden ? <Eye size={16} /> : <EyeOff size={16} />}
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(post.id)}
                      className="rounded-lg p-2 text-red-500 transition-colors hover:bg-red-100"
                      title="삭제"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredPosts.length === 0 && (
          <div className="py-12 text-center">
            <MessageCircle size={32} className="mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">게시글이 없습니다.</p>
          </div>
        )}
      </div>

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
              <h3 className="text-lg font-bold text-foreground">게시글 삭제</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                정말 이 게시글을 삭제하시겠습니까?
                <br />
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
                onClick={() => deletePost(deleteConfirm)}
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
