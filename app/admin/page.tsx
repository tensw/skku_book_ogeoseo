"use client"

import {
  Megaphone,
  PenTool,
  BookOpen,
  Calendar,
  Users,
  MessageCircle,
  Award,
  TrendingUp,
  TrendingDown,
  BarChart3,
  ArrowUpRight,
  UserCheck,
} from "lucide-react"
import { format } from "date-fns"
import { ko } from "date-fns/locale"
import { notices, reviews, classics, bundoks } from "@/lib/mock-data"

const stats = [
  {
    label: "공지사항",
    count: notices.length,
    description: "등록된 공지사항",
    icon: Megaphone,
    bgColor: "bg-blue-50",
    textColor: "text-blue-600",
    href: "/admin/notices",
  },
  {
    label: "서평",
    count: reviews.length,
    description: "작성된 서평",
    icon: PenTool,
    bgColor: "bg-green-50",
    textColor: "text-green-600",
    href: "/admin/reviews",
  },
  {
    label: "추천도서",
    count: classics.length,
    description: "고전 100선 도서",
    icon: BookOpen,
    bgColor: "bg-amber-50",
    textColor: "text-amber-600",
    href: "/admin/classics",
  },
  {
    label: "프로그램",
    count: bundoks.length,
    description: "등록된 번독",
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
    change: 12,
    icon: Users,
    bgColor: "bg-emerald-50",
    textColor: "text-emerald-600",
  },
  {
    label: "톡톡 게시글",
    count: 342,
    change: 28,
    icon: MessageCircle,
    bgColor: "bg-sky-50",
    textColor: "text-sky-600",
  },
  {
    label: "발급 스탬프",
    count: 1247,
    change: 85,
    icon: Award,
    bgColor: "bg-tangerine/10",
    textColor: "text-tangerine",
  },
  {
    label: "이번 달 참여",
    count: 89,
    change: -3,
    icon: TrendingUp,
    bgColor: "bg-pink-50",
    textColor: "text-pink-600",
  },
]

const programStats = [
  { name: "번독 (오프라인)", participants: 24, capacity: 30 },
  { name: "번독 (온라인)", participants: 28, capacity: 30 },
  { name: "번독 (하이브리드)", participants: 18, capacity: 30 },
  { name: "고전 100선", participants: 45, capacity: 60 },
]

const quickActions = [
  {
    label: "공지사항 작성",
    icon: Megaphone,
    href: "/admin/notices",
    bgColor: "bg-blue-50",
    hoverBg: "hover:bg-blue-100",
    textColor: "text-blue-600",
  },
  {
    label: "도서 등록",
    icon: BookOpen,
    href: "/admin/classics",
    bgColor: "bg-amber-50",
    hoverBg: "hover:bg-amber-100",
    textColor: "text-amber-600",
  },
  {
    label: "프로그램 관리",
    icon: Calendar,
    href: "/admin/programs",
    bgColor: "bg-purple-50",
    hoverBg: "hover:bg-purple-100",
    textColor: "text-purple-600",
  },
  {
    label: "회원 관리",
    icon: Users,
    href: "/admin/users",
    bgColor: "bg-emerald-50",
    hoverBg: "hover:bg-emerald-100",
    textColor: "text-emerald-600",
  },
  {
    label: "톡톡 관리",
    icon: MessageCircle,
    href: "/admin/talk",
    bgColor: "bg-sky-50",
    hoverBg: "hover:bg-sky-100",
    textColor: "text-sky-600",
  },
  {
    label: "서평 관리",
    icon: PenTool,
    href: "/admin/reviews",
    bgColor: "bg-green-50",
    hoverBg: "hover:bg-green-100",
    textColor: "text-green-600",
  },
]

function formatNumber(n: number): string {
  return n.toLocaleString("ko-KR")
}

function getProgressColor(percentage: number): string {
  if (percentage >= 90) return "from-red-400 to-red-500"
  if (percentage >= 70) return "from-orange-400 to-amber-500"
  return "from-emerald-400 to-green-500"
}

function getProgressBgColor(percentage: number): string {
  if (percentage >= 90) return "text-red-600"
  if (percentage >= 70) return "text-amber-600"
  return "text-emerald-600"
}

export default function AdminDashboardPage() {
  const today = new Date()
  const formattedDate = format(today, "yyyy년 M월 d일 (EEEE)", { locale: ko })
  const hour = today.getHours()
  const greeting =
    hour < 12 ? "좋은 아침이에요" : hour < 18 ? "좋은 오후예요" : "좋은 저녁이에요"

  return (
    <div className="space-y-6 p-6">
      {/* Header with date and greeting */}
      <div>
        <p className="text-sm text-muted-foreground">{formattedDate}</p>
        <h1 className="mt-1 text-2xl font-bold text-foreground">
          {greeting}, 관리자님 👋
        </h1>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <a
              key={stat.label}
              href={stat.href}
              className="group rounded-2xl border border-border bg-card p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:border-primary/30"
            >
              <div className="flex items-start justify-between">
                <div className={`inline-flex rounded-full p-2.5 ${stat.bgColor}`}>
                  <Icon size={20} className={stat.textColor} />
                </div>
                <ArrowUpRight
                  size={16}
                  className="text-muted-foreground/0 transition-all group-hover:text-muted-foreground"
                />
              </div>
              <p className="mt-3 text-3xl font-bold text-foreground">
                {formatNumber(stat.count)}
              </p>
              <p className="mt-0.5 text-sm font-medium text-foreground">{stat.label}</p>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </a>
          )
        })}
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {additionalStats.map((stat) => {
          const Icon = stat.icon
          const isPositive = stat.change >= 0
          const TrendIcon = isPositive ? TrendingUp : TrendingDown
          const badgeBg = isPositive ? "bg-emerald-100" : "bg-red-100"
          const badgeText = isPositive ? "text-emerald-700" : "text-red-700"
          return (
            <div
              key={stat.label}
              className="rounded-xl border border-border bg-card p-4 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div className={`inline-flex rounded-lg p-2 ${stat.bgColor}`}>
                  <Icon size={16} className={stat.textColor} />
                </div>
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${badgeBg} ${badgeText}`}
                >
                  <TrendIcon size={12} />
                  {isPositive ? "+" : ""}
                  {stat.change}
                </span>
              </div>
              <p className="mt-2 text-2xl font-bold text-foreground">
                {formatNumber(stat.count)}
              </p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          )
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Program Participation */}
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <h2 className="flex items-center gap-2 text-lg font-bold text-foreground">
            <BarChart3 size={18} className="text-muted-foreground" />
            프로그램 참여 현황
          </h2>
          <div className="mt-4 space-y-4">
            {programStats.map((program) => {
              const percentage = Math.round(
                (program.participants / program.capacity) * 100
              )
              const progressColor = getProgressColor(percentage)
              const textColor = getProgressBgColor(percentage)
              return (
                <div key={program.name}>
                  <div className="mb-1.5 flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">
                      {program.name}
                    </span>
                    <span className={`text-xs font-semibold ${textColor}`}>
                      {program.participants}/{program.capacity}명 ({percentage}%)
                    </span>
                  </div>
                  <div className="h-2.5 overflow-hidden rounded-full bg-muted">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${progressColor} transition-all`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
          <div className="mt-4 flex items-center gap-4 border-t border-border pt-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
              여유 (&lt;70%)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-2 w-2 rounded-full bg-amber-500" />
              임박 (70-89%)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-2 w-2 rounded-full bg-red-500" />
              마감 (90%+)
            </span>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <h2 className="flex items-center gap-2 text-lg font-bold text-foreground">
            <UserCheck size={18} className="text-muted-foreground" />
            빠른 작업
          </h2>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {quickActions.map((action) => {
              const Icon = action.icon
              return (
                <a
                  key={action.label}
                  href={action.href}
                  className={`flex flex-col items-center gap-2 rounded-xl border border-transparent p-4 text-center transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm hover:border-border ${action.bgColor} ${action.hoverBg}`}
                >
                  <div className="rounded-full bg-white/80 p-2.5 shadow-sm">
                    <Icon size={20} className={action.textColor} />
                  </div>
                  <span className={`text-xs font-semibold ${action.textColor}`}>
                    {action.label}
                  </span>
                </a>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
