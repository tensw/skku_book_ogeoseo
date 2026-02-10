"use client"

import React, { use } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft, Star, Heart, MessageCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { reviews } from "@/lib/mock-data"

export default function ReviewDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const review = reviews.find((r) => r.id === Number(id))

  if (!review) {
    return (
      <div className="flex flex-col items-center gap-4 py-20">
        <p className="text-sm text-muted-foreground">리뷰를 찾을 수 없습니다.</p>
        <button
          onClick={() => router.back()}
          className="rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground"
        >
          돌아가기
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 pb-6">
      {/* Back button */}
      <div className="px-5 pt-5 sm:px-8">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ChevronLeft size={16} />
          뒤로가기
        </button>
      </div>

      {/* User info */}
      <div className="flex items-center gap-3 px-5 sm:px-8">
        <img
          src={review.user.avatar || "/placeholder.svg"}
          alt={review.user.name}
          className="h-11 w-11 rounded-full object-cover ring-2 ring-border"
          crossOrigin="anonymous"
        />
        <div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-foreground">{review.user.name}</span>
            {review.user.department && (
              <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                {review.user.department}
              </span>
            )}
          </div>
          <span className="text-xs text-muted-foreground">{review.timeAgo}</span>
        </div>
      </div>

      {/* Book info card */}
      <div className="mx-5 flex items-center gap-4 rounded-2xl border border-border bg-muted/50 p-4 sm:mx-8">
        <div className="h-20 w-14 flex-shrink-0 overflow-hidden rounded-xl shadow-sm">
          <img
            src={review.book.cover || "/placeholder.svg"}
            alt={review.book.title}
            className="h-full w-full object-cover"
            crossOrigin="anonymous"
          />
        </div>
        <div className="flex-1">
          <p className="text-sm font-bold text-foreground">{review.book.title}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">{review.book.author}</p>
          <div className="mt-2 flex gap-0.5">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                size={14}
                className={cn(
                  s <= review.rating
                    ? "fill-tangerine text-tangerine"
                    : "text-border"
                )}
              />
            ))}
          </div>
          {review.program && (
            <span className="mt-2 inline-block rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
              {review.program}
            </span>
          )}
        </div>
      </div>

      {/* Review text */}
      <article className="px-5 sm:px-8">
        <p className="whitespace-pre-line text-sm leading-relaxed text-foreground">
          {review.text}
        </p>
      </article>

      {/* Actions */}
      <div className="flex items-center gap-6 border-t border-border px-5 pt-4 sm:px-8">
        <button className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Heart size={18} />
          {review.likes}
        </button>
        <button className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <MessageCircle size={18} />
          {review.comments}
        </button>
      </div>

      {/* Comment section placeholder */}
      <section className="mx-5 rounded-2xl border border-border bg-muted/30 p-5 sm:mx-8">
        <h3 className="mb-3 text-sm font-bold text-foreground">댓글</h3>
        <p className="text-xs text-muted-foreground">
          댓글 기능은 준비 중입니다.
        </p>
      </section>
    </div>
  )
}
