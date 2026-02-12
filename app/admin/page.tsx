"use client"

import { Megaphone, PenTool, BookOpen, Calendar, FileText, UserPlus, Star, MessageSquare, Clock } from "lucide-react"
import { notices, reviews, classics, programs } from "@/lib/mock-data"

const stats = [
  {
    label: "공지사항",
    count: notices.length,
    icon: Megaphone,
    bgColor: "bg-blue-50",
    textColor: "text-blue-600",
  },
  {
    label: "서평",
    count: reviews.length,
    icon: PenTool,
    bgColor: "bg-green-50",
    textColor: "text-green-600",
  },
  {
    label: "고전100선",
    count: classics.length,
    icon: BookOpen,
    bgColor: "bg-amber-50",
    textColor: "text-amber-600",
  },
  {
    label: "프로그램",
    count: programs.length,
    icon: Calendar,
    bgColor: "bg-purple-50",
    textColor: "text-purple-600",
  },
]

const recentActivities = [
  { icon: FileText, text: "공지사항 '2026년 1학기 독서프로그램 신청 안내'가 등록되었습니다.", time: "2시간 전" },
  { icon: UserPlus, text: "독서 마라톤 프로그램에 신규 참가자 3명이 등록되었습니다.", time: "4시간 전" },
  { icon: Star, text: "김서윤님이 '데미안'에 대한 새 리뷰를 작성했습니다.", time: "5시간 전" },
  { icon: MessageSquare, text: "독서토론 리더 모집 공고에 댓글이 달렸습니다.", time: "1일 전" },
  { icon: BookOpen, text: "고전100선 목록이 업데이트되었습니다.", time: "2일 전" },
]

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-2xl font-bold text-foreground">대시보드</h1>
        <p className="mt-0.5 text-sm text-muted-foreground">오거서 관리자 대시보드입니다.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div
              key={stat.label}
              className="rounded-2xl border border-border bg-card p-6 shadow-sm"
            >
              <div className={`inline-flex rounded-full p-2.5 ${stat.bgColor}`}>
                <Icon size={20} className={stat.textColor} />
              </div>
              <p className="mt-3 text-3xl font-bold text-foreground">{stat.count}</p>
              <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
            </div>
          )
        })}
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <h2 className="font-serif text-lg font-bold text-foreground">최근 활동</h2>
        <div className="mt-4 divide-y divide-border">
          {recentActivities.map((activity, i) => {
            const Icon = activity.icon
            return (
              <div key={i} className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
                <div className="mt-0.5 rounded-full bg-muted p-1.5">
                  <Icon size={14} className="text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground">{activity.text}</p>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground whitespace-nowrap">
                  <Clock size={12} />
                  {activity.time}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
