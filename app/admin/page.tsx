"use client"

import {
  Megaphone,
  PenTool,
  BookOpen,
  Calendar,
  FileText,
  UserPlus,
  Star,
  MessageSquare,
  Clock,
  Users,
  MessageCircle,
  Award,
  TrendingUp,
  BarChart3,
} from "lucide-react"
import { notices, reviews, classics, programs } from "@/lib/mock-data"

const stats = [
  {
    label: "공지사항",
    count: notices.length,
    icon: Megaphone,
    bgColor: "bg-blue-50",
    textColor: "text-blue-600",
    href: "/admin/notices",
  },
  {
    label: "서평",
    count: reviews.length,
    icon: PenTool,
    bgColor: "bg-green-50",
    textColor: "text-green-600",
    href: "/admin/reviews",
  },
  {
    label: "추천도서",
    count: classics.length,
    icon: BookOpen,
    bgColor: "bg-amber-50",
    textColor: "text-amber-600",
    href: "/admin/classics",
  },
  {
    label: "프로그램",
    count: programs.length,
    icon: Calendar,
    bgColor: "bg-purple-50",
    textColor: "text-purple-600",
    href: "/admin/programs",
  },
]

const additionalStats = [
  {
    label: "전체 회원",
    count: 156,
    change: "+12",
    icon: Users,
    bgColor: "bg-emerald-50",
    textColor: "text-emerald-600",
  },
  {
    label: "톡톡 게시글",
    count: 342,
    change: "+28",
    icon: MessageCircle,
    bgColor: "bg-sky-50",
    textColor: "text-sky-600",
  },
  {
    label: "발급 스탬프",
    count: 1247,
    change: "+85",
    icon: Award,
    bgColor: "bg-tangerine/10",
    textColor: "text-tangerine",
  },
  {
    label: "이번 달 참여",
    count: 89,
    change: "+15",
    icon: TrendingUp,
    bgColor: "bg-pink-50",
    textColor: "text-pink-600",
  },
]

const recentActivities = [
  { icon: FileText, text: "공지사항 '2026년 1학기 독서프로그램 신청 안내'가 등록되었습니다.", time: "2시간 전" },
  { icon: UserPlus, text: "독서 마라톤 프로그램에 신규 참가자 3명이 등록되었습니다.", time: "4시간 전" },
  { icon: Star, text: "김서윤님이 '데미안'에 대한 새 리뷰를 작성했습니다.", time: "5시간 전" },
  { icon: MessageSquare, text: "독서토론 리더 모집 공고에 댓글이 달렸습니다.", time: "1일 전" },
  { icon: BookOpen, text: "추천도서 목록이 업데이트되었습니다.", time: "2일 전" },
]

const programStats = [
  { name: "독모 (아침)", participants: 24, capacity: 30 },
  { name: "독모 (점심)", participants: 28, capacity: 30 },
  { name: "독모 (저녁)", participants: 18, capacity: 30 },
  { name: "독토", participants: 45, capacity: 60 },
]

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="font-serif text-2xl font-bold text-foreground">대시보드</h1>
        <p className="mt-0.5 text-sm text-muted-foreground">오거서 관리자 대시보드입니다.</p>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <a
              key={stat.label}
              href={stat.href}
              className="rounded-2xl border border-border bg-card p-5 shadow-sm transition-all hover:shadow-md hover:border-primary/30"
            >
              <div className={`inline-flex rounded-full p-2.5 ${stat.bgColor}`}>
                <Icon size={20} className={stat.textColor} />
              </div>
              <p className="mt-3 text-3xl font-bold text-foreground">{stat.count}</p>
              <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
            </a>
          )
        })}
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {additionalStats.map((stat) => {
          const Icon = stat.icon
          return (
            <div
              key={stat.label}
              className="rounded-xl border border-border bg-card p-4 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div className={`inline-flex rounded-lg p-2 ${stat.bgColor}`}>
                  <Icon size={16} className={stat.textColor} />
                </div>
                <span className="text-xs font-medium text-emerald-600">{stat.change}</span>
              </div>
              <p className="mt-2 text-2xl font-bold text-foreground">{stat.count}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          )
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Activities */}
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <h2 className="flex items-center gap-2 font-serif text-lg font-bold text-foreground">
            <Clock size={18} className="text-muted-foreground" />
            최근 활동
          </h2>
          <div className="mt-4 divide-y divide-border">
            {recentActivities.map((activity, i) => {
              const Icon = activity.icon
              return (
                <div key={i} className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
                  <div className="mt-0.5 rounded-full bg-muted p-1.5">
                    <Icon size={14} className="text-muted-foreground" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-foreground">{activity.text}</p>
                  </div>
                  <div className="flex items-center gap-1 whitespace-nowrap text-xs text-muted-foreground">
                    {activity.time}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Program Participation */}
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <h2 className="flex items-center gap-2 font-serif text-lg font-bold text-foreground">
            <BarChart3 size={18} className="text-muted-foreground" />
            프로그램 참여 현황
          </h2>
          <div className="mt-4 space-y-4">
            {programStats.map((program) => {
              const percentage = Math.round((program.participants / program.capacity) * 100)
              return (
                <div key={program.name}>
                  <div className="mb-1.5 flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">{program.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {program.participants}/{program.capacity}명 ({percentage}%)
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-primary to-emerald-500 transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <h2 className="font-serif text-lg font-bold text-foreground">빠른 작업</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          <a
            href="/admin/notices"
            className="inline-flex items-center gap-2 rounded-lg bg-blue-50 px-4 py-2 text-sm font-medium text-blue-600 transition-colors hover:bg-blue-100"
          >
            <Megaphone size={16} />
            공지사항 작성
          </a>
          <a
            href="/admin/classics"
            className="inline-flex items-center gap-2 rounded-lg bg-amber-50 px-4 py-2 text-sm font-medium text-amber-600 transition-colors hover:bg-amber-100"
          >
            <BookOpen size={16} />
            도서 등록
          </a>
          <a
            href="/admin/programs"
            className="inline-flex items-center gap-2 rounded-lg bg-purple-50 px-4 py-2 text-sm font-medium text-purple-600 transition-colors hover:bg-purple-100"
          >
            <Calendar size={16} />
            프로그램 관리
          </a>
          <a
            href="/admin/users"
            className="inline-flex items-center gap-2 rounded-lg bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-600 transition-colors hover:bg-emerald-100"
          >
            <Users size={16} />
            회원 관리
          </a>
          <a
            href="/admin/talk"
            className="inline-flex items-center gap-2 rounded-lg bg-sky-50 px-4 py-2 text-sm font-medium text-sky-600 transition-colors hover:bg-sky-100"
          >
            <MessageCircle size={16} />
            톡톡 관리
          </a>
        </div>
      </div>
    </div>
  )
}
