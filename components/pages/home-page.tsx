"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Users,
  Clock,
  MapPin,
  Heart,
  MessageCircle,
  Star,
  Plus,
  Wifi,
  Monitor,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/auth-context"
import { usePrograms } from "@/lib/program-context"
import { useSharedData } from "@/lib/shared-data-context"
import { reviews } from "@/lib/mock-data"

const formatIcons: Record<string, typeof MapPin> = {
  offline: MapPin,
  online: Wifi,
  hybrid: Monitor,
}

const formatLabels: Record<string, string> = {
  offline: "오프라인",
  online: "온라인",
  hybrid: "하이브리드",
}

export function HomePage() {
  const router = useRouter()
  const { user } = useAuth()
  const { monthlyBooks } = usePrograms()
  const { bundoks, joinedBundoks, setJoinedBundoks } = useSharedData()

  const [nickname, setNickname] = useState("")

  useEffect(() => {
    const saved = localStorage.getItem("ogeoseo_nickname")
    if (saved) setNickname(saved)
  }, [])

  const displayName = user?.name || nickname || "독서인"

  // 모집 중인 번독
  const recruitingBundoks = bundoks.filter((b) => b.status === "recruiting")

  // 이달의 추천 도서
  const monthlyRecommended = monthlyBooks.map((book, i) => ({
    ...book,
    category: i % 3 === 0 ? "에세이" : i % 3 === 1 ? "인문" : "문학",
    color: i % 3 === 0 ? "bg-tangerine/10 text-tangerine" : i % 3 === 1 ? "bg-mint/10 text-mint" : "bg-primary/10 text-primary",
  }))

  // 최신 서평 미리보기
  const latestReviews = reviews.slice(0, 3)

  return (
    <div className="flex flex-col gap-0 pb-24">
      {/* Welcome Message */}
      <section className="px-5 pt-6 sm:px-8">
        <h1 className="text-xl font-bold text-foreground sm:text-2xl">
          <span className="text-primary">{displayName}</span>님,
          <br />
          오늘 어떤 책을 만나볼까요?
        </h1>
        <p className="mt-1 text-xs text-muted-foreground">
          번개독서모임으로 함께 읽어보세요
        </p>
      </section>

      {/* 이달의 추천 도서 */}
      <section className="mt-6 px-5 sm:px-8">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-sm font-bold text-foreground">
            <Star size={14} className="text-emerald" />
            이달의 추천 도서
          </h2>
          <Link
            href="/guide"
            className="rounded-full bg-emerald/10 px-3 py-1 text-[10px] font-semibold text-emerald transition-colors hover:bg-emerald/20"
          >
            더보기
          </Link>
        </div>

        <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
          {monthlyRecommended.map((book) => (
            <div
              key={book.id}
              className="group flex w-24 flex-shrink-0 flex-col items-center gap-2"
            >
              <div className="relative h-32 w-22 overflow-hidden rounded-2xl shadow-md ring-1 ring-border transition-transform group-hover:scale-105">
                <img
                  src={book.cover || "/placeholder.svg"}
                  alt={book.title}
                  className="h-full w-full object-cover"
                  crossOrigin="anonymous"
                />
              </div>
              <span className={cn("rounded-full px-2 py-0.5 text-[9px] font-bold", book.color)}>
                {book.category}
              </span>
              <p className="w-20 truncate text-center text-[10px] font-medium text-foreground">{book.title}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 지금 모집 중인 번독 */}
      <section className="mt-6 px-5 sm:px-8">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-sm font-bold text-foreground">
            <Users size={14} className="text-primary" />
            지금 모집 중인 번독
          </h2>
          <Link
            href="/programs"
            className="rounded-full bg-primary/10 px-3 py-1 text-[10px] font-semibold text-primary transition-colors hover:bg-primary/20"
          >
            전체 보기
          </Link>
        </div>

        <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
          {recruitingBundoks.map((bundok) => {
            const FormatIcon = formatIcons[bundok.format] || MapPin
            const isJoined = joinedBundoks.includes(bundok.id)

            return (
              <Link
                key={bundok.id}
                href={`/programs/${bundok.id}`}
                className="group relative w-56 flex-shrink-0 overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all hover:shadow-md hover:scale-[1.02]"
              >
                {/* 도서 커버 배경 */}
                <div className="relative h-28 overflow-hidden bg-gradient-to-br from-primary/20 to-emerald/10">
                  <img
                    src={bundok.bookCover || "/placeholder.svg"}
                    alt={bundok.book}
                    className="absolute right-3 top-2 h-24 w-16 rounded-lg object-cover shadow-md"
                    crossOrigin="anonymous"
                  />
                  <div className="absolute left-3 top-3">
                    <span className="inline-flex items-center gap-1 rounded-full bg-white/90 px-2 py-0.5 text-[9px] font-bold text-foreground shadow-sm backdrop-blur-sm">
                      <FormatIcon size={10} />
                      {formatLabels[bundok.format]}
                    </span>
                  </div>
                  {isJoined && (
                    <div className="absolute right-3 top-28 -translate-y-full rounded-full bg-emerald px-2 py-0.5 text-[9px] font-bold text-white shadow-sm">
                      참여 중
                    </div>
                  )}
                </div>

                {/* 컨텐츠 */}
                <div className="p-3">
                  <h3 className="text-sm font-bold text-foreground line-clamp-1">{bundok.title}</h3>
                  <p className="mt-0.5 text-[10px] text-muted-foreground">{bundok.book} · {bundok.bookAuthor}</p>
                  <div className="mt-2 flex items-center gap-3 text-[10px] text-muted-foreground">
                    <span className="flex items-center gap-0.5">
                      <Clock size={10} />
                      {bundok.date.slice(5)} {bundok.time}
                    </span>
                    <span className="flex items-center gap-0.5">
                      <Users size={10} />
                      {bundok.currentMembers}/{bundok.maxMembers}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center gap-1.5">
                    <img
                      src={bundok.hostAvatar || "/placeholder.svg"}
                      alt={bundok.host}
                      className="h-4 w-4 rounded-full object-cover"
                      crossOrigin="anonymous"
                    />
                    <span className="text-[10px] text-muted-foreground">{bundok.host}</span>
                  </div>
                </div>
              </Link>
            )
          })}

          {recruitingBundoks.length === 0 && (
            <div className="flex w-full items-center justify-center rounded-2xl border-2 border-dashed border-border py-10">
              <p className="text-sm text-muted-foreground">모집 중인 번독이 없습니다</p>
            </div>
          )}
        </div>
      </section>

      {/* 최신 서평 미리보기 */}
      <section className="mt-6 px-5 sm:px-8">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-sm font-bold text-foreground">
            <MessageCircle size={14} className="text-mint" />
            최신 서평
          </h2>
          <Link
            href="/reviews"
            className="rounded-full bg-mint/10 px-3 py-1 text-[10px] font-semibold text-mint transition-colors hover:bg-mint/20"
          >
            더보기
          </Link>
        </div>

        <div className="flex flex-col gap-3">
          {latestReviews.map((review) => (
            <Link
              key={review.id}
              href="/reviews"
              className="flex items-start gap-3 rounded-2xl border border-border bg-card p-3.5 shadow-sm transition-all hover:shadow-md"
            >
              <div className="h-14 w-10 flex-shrink-0 overflow-hidden rounded-lg shadow-sm">
                <img
                  src={review.book.cover || "/placeholder.svg"}
                  alt={review.book.title}
                  className="h-full w-full object-cover"
                  crossOrigin="anonymous"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-foreground">{review.user.name}</span>
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        size={9}
                        className={cn(s <= review.rating ? "fill-tangerine text-tangerine" : "text-border")}
                      />
                    ))}
                  </div>
                </div>
                <p className="mt-0.5 text-[10px] text-muted-foreground">{review.book.title} · {review.book.author}</p>
                <p className="mt-1 line-clamp-2 text-[11px] leading-relaxed text-foreground">
                  {review.text}
                </p>
                <div className="mt-1.5 flex items-center gap-3 text-[10px] text-muted-foreground">
                  <span className="flex items-center gap-0.5">
                    <Heart size={10} className="text-tangerine" />
                    {review.likes}
                  </span>
                  <span className="flex items-center gap-0.5">
                    <MessageCircle size={10} />
                    {review.comments}
                  </span>
                  <span>{review.timeAgo}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* FAB 번독 개설하기 */}
      <Link
        href="/programs/create"
        className="fixed bottom-20 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-lg transition-transform hover:scale-110 active:scale-95 sm:bottom-8 sm:right-8 sm:h-auto sm:w-auto sm:rounded-full sm:px-5 sm:py-3"
        aria-label="번독 개설하기"
      >
        <Plus size={24} className="sm:hidden" />
        <span className="hidden items-center gap-2 text-sm font-bold sm:flex">
          <Plus size={16} />
          번독 개설
        </span>
      </Link>
    </div>
  )
}
