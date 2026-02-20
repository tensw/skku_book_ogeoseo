"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import {
  ArrowLeft,
  Users,
  Clock,
  MapPin,
  Wifi,
  Monitor,
  BookOpen,
  MessageSquare,
  Sparkles,
  CheckCircle2,
  Share2,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useSharedData } from "@/lib/shared-data-context"

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

const statusLabels: Record<string, string> = {
  recruiting: "모집 중",
  confirmed: "확정",
  completed: "완료",
}

const statusColors: Record<string, string> = {
  recruiting: "bg-primary text-primary-foreground",
  confirmed: "bg-emerald text-white",
  completed: "bg-muted text-muted-foreground",
}

export default function BundokDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { bundoks, joinedBundoks, setJoinedBundoks } = useSharedData()

  const bundokId = Number(params.id)
  const bundok = bundoks.find((b) => b.id === bundokId)

  const [joining, setJoining] = useState(false)

  if (!bundok) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-5">
        <div className="rounded-full bg-muted p-4 mb-4">
          <BookOpen size={32} className="text-muted-foreground" />
        </div>
        <h2 className="text-lg font-bold text-foreground">번독을 찾을 수 없습니다</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          해당 번독이 삭제되었거나 존재하지 않습니다.
        </p>
        <Link
          href="/programs"
          className="mt-4 rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground"
        >
          번독 목록으로
        </Link>
      </div>
    )
  }

  const FormatIcon = formatIcons[bundok.format] || MapPin
  const isJoined = joinedBundoks.includes(bundok.id)
  const isFull = bundok.currentMembers >= bundok.maxMembers

  const handleJoin = () => {
    if (isJoined) {
      setJoinedBundoks((prev) => prev.filter((id) => id !== bundok.id))
    } else {
      setJoining(true)
      setTimeout(() => {
        setJoinedBundoks((prev) => [...prev, bundok.id])
        setJoining(false)
      }, 500)
    }
  }

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr)
    const days = ["일", "월", "화", "수", "목", "금", "토"]
    return `${d.getMonth() + 1}월 ${d.getDate()}일 (${days[d.getDay()]})`
  }

  return (
    <div className="flex flex-col gap-0 pb-28">
      {/* Back Button */}
      <div className="px-5 pt-4 sm:px-8">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft size={16} />
          뒤로
        </button>
      </div>

      {/* Hero Section */}
      <section className="mt-3 px-5 sm:px-8">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/20 via-emerald/10 to-mint/10 p-5">
          <div className="flex gap-4">
            {/* Book Cover */}
            <div className="relative h-36 w-24 flex-shrink-0 overflow-hidden rounded-xl shadow-lg">
              <img
                src={bundok.bookCover || "/placeholder.svg"}
                alt={bundok.book}
                className="h-full w-full object-cover"
                crossOrigin="anonymous"
              />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <span className={cn("inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold", statusColors[bundok.status])}>
                {statusLabels[bundok.status]}
              </span>
              <h1 className="mt-1.5 text-lg font-bold text-foreground leading-tight">{bundok.title}</h1>
              <p className="mt-1 text-xs text-muted-foreground">
                {bundok.book} · {bundok.bookAuthor}
              </p>
              <div className="mt-2 flex flex-wrap gap-1">
                {bundok.tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-primary/10 px-2 py-0.5 text-[9px] font-medium text-primary">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 모임 정보 */}
      <section className="mt-4 px-5 sm:px-8">
        <div className="rounded-2xl border border-border bg-card p-4">
          <h2 className="text-sm font-bold text-foreground mb-3">모임 정보</h2>
          <div className="flex flex-col gap-2.5">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100">
                <Clock size={14} className="text-amber-600" />
              </div>
              <div>
                <p className="text-xs font-semibold text-amber-700">{formatDate(bundok.date)} {bundok.time}</p>
                <p className="text-[10px] text-amber-500">{bundok.duration}분 소요</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald/10">
                <FormatIcon size={14} className="text-emerald" />
              </div>
              <div>
                <p className="text-xs font-medium text-foreground">{formatLabels[bundok.format]}</p>
                <p className="text-[10px] text-muted-foreground">{bundok.location}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-tangerine/10">
                <Users size={14} className="text-tangerine" />
              </div>
              <div>
                <p className="text-xs font-medium text-foreground">
                  {bundok.currentMembers}/{bundok.maxMembers}명
                  {isFull && <span className="ml-1 text-[10px] text-muted-foreground">(마감)</span>}
                </p>
                <p className="text-[10px] text-muted-foreground">소규모 모임 (최대 {bundok.maxMembers}명)</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 개설자 */}
      <section className="mt-3 px-5 sm:px-8">
        <div className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4">
          <img
            src={bundok.hostAvatar || "/placeholder.svg"}
            alt={bundok.host}
            className="h-10 w-10 rounded-full object-cover ring-2 ring-primary/20"
            crossOrigin="anonymous"
          />
          <div>
            <p className="text-xs font-bold text-foreground">
              {bundok.hostNickname}
              <span className="ml-1 text-[10px] font-normal text-muted-foreground">{bundok.host}</span>
            </p>
            <p className="text-[10px] text-muted-foreground">모임 개설자</p>
          </div>
        </div>
      </section>

      {/* AI 추천 도서 */}
      {bundok.aiBooks && bundok.aiBooks.length > 0 && (
        <section className="mt-4 px-5 sm:px-8">
          <div className="rounded-2xl border border-border bg-card p-4">
            <h2 className="flex items-center gap-2 text-sm font-bold text-foreground mb-3">
              <Sparkles size={14} className="text-tangerine" />
              AI 추천 관련 도서
            </h2>
            <div className="flex flex-col gap-2">
              {bundok.aiBooks.map((book, i) => (
                <div key={i} className="flex items-center gap-2.5 rounded-xl bg-muted/50 px-3 py-2.5">
                  <BookOpen size={14} className="text-primary flex-shrink-0" />
                  <span className="text-xs font-medium text-foreground">{book}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 토론 질문 */}
      {bundok.discussionQuestions && bundok.discussionQuestions.length > 0 && (
        <section className="mt-3 px-5 sm:px-8">
          <div className="rounded-2xl border border-border bg-card p-4">
            <h2 className="flex items-center gap-2 text-sm font-bold text-foreground mb-3">
              <MessageSquare size={14} className="text-mint" />
              토론 질문
            </h2>
            <div className="flex flex-col gap-2">
              {bundok.discussionQuestions.map((q, i) => (
                <div key={i} className="flex gap-2.5 rounded-xl bg-muted/50 px-3 py-2.5">
                  <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-primary/20 text-[10px] font-bold text-primary">
                    {i + 1}
                  </span>
                  <span className="text-xs leading-relaxed text-foreground">{q}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 참여하기 Fixed Bottom CTA */}
      <div className="fixed bottom-16 left-0 right-0 z-30 border-t border-border bg-card/95 px-5 py-3 backdrop-blur-md sm:bottom-0">
        <div className="mx-auto flex max-w-lg items-center gap-3">
          <button
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-muted"
            aria-label="공유"
          >
            <Share2 size={16} className="text-muted-foreground" />
          </button>

          {bundok.status === "completed" ? (
            <div className="flex-1 rounded-full bg-muted px-5 py-2.5 text-center text-sm font-bold text-muted-foreground">
              완료된 모임
            </div>
          ) : isJoined ? (
            <button
              onClick={handleJoin}
              className="flex flex-1 items-center justify-center gap-2 rounded-full bg-emerald px-5 py-2.5 text-sm font-bold text-white transition-all hover:brightness-110"
            >
              <CheckCircle2 size={16} />
              참여 중 (취소하기)
            </button>
          ) : isFull ? (
            <div className="flex-1 rounded-full bg-muted px-5 py-2.5 text-center text-sm font-bold text-muted-foreground">
              인원 마감
            </div>
          ) : (
            <button
              onClick={handleJoin}
              disabled={joining}
              className="flex-1 rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground shadow-md transition-all hover:shadow-lg hover:brightness-110 disabled:opacity-50"
            >
              {joining ? "참여 처리 중..." : "참여하기"}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
