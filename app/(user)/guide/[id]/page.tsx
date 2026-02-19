"use client"

import React, { use } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft, BookOpen } from "lucide-react"
import { classics, reviews } from "@/lib/mock-data"

export default function GuideDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const classic = classics.find((c) => c.id === Number(id))

  if (!classic) {
    return (
      <div className="flex flex-col items-center gap-4 py-20">
        <p className="text-sm text-muted-foreground">도서를 찾을 수 없습니다.</p>
        <button
          onClick={() => router.back()}
          className="rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground"
        >
          돌아가기
        </button>
      </div>
    )
  }

  const relatedReviews = reviews.filter(
    (r) =>
      r.book.title.includes(classic.title) ||
      classic.title.includes(r.book.title)
  )

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

      {/* Book detail */}
      <div className="flex flex-col items-center gap-6 px-5 sm:flex-row sm:items-start sm:px-8">
        {/* Cover */}
        <div className="h-64 w-44 flex-shrink-0 overflow-hidden rounded-2xl shadow-lg ring-1 ring-border">
          <img
            src={classic.cover || "/placeholder.svg"}
            alt={classic.title}
            className="h-full w-full object-cover"
            crossOrigin="anonymous"
          />
        </div>

        {/* Info */}
        <div className="flex flex-1 flex-col gap-3 text-center sm:text-left">
          <h1 className="text-2xl font-bold text-foreground">
            {classic.title}
          </h1>
          <p className="text-sm text-muted-foreground">{classic.author}</p>
          <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
            <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-bold text-primary">
              {classic.category}
            </span>
            {classic.isbn && (
              <span className="text-[10px] text-muted-foreground">
                ISBN: {classic.isbn}
              </span>
            )}
          </div>
          <div className="mt-1 flex flex-col gap-1 text-xs text-muted-foreground">
            <span>출판사: {classic.publisher}</span>
            <span>출판연도: {classic.year}년</span>
          </div>
        </div>
      </div>

      {/* Description */}
      <section className="px-5 sm:px-8">
        <h2 className="mb-2 text-sm font-bold text-foreground">도서 소개</h2>
        <p className="whitespace-pre-line text-sm leading-relaxed text-foreground">
          {classic.description}
        </p>
      </section>

      {/* Related reviews */}
      <section className="px-5 sm:px-8">
        <h2 className="mb-3 flex items-center gap-2 text-sm font-bold text-foreground">
          <BookOpen size={14} className="text-primary" />
          관련 리뷰
        </h2>
        {relatedReviews.length > 0 ? (
          <div className="flex flex-col gap-3">
            {relatedReviews.map((review) => (
              <div
                key={review.id}
                className="rounded-2xl border border-border bg-card p-4 shadow-sm"
              >
                <div className="flex items-center gap-2">
                  <img
                    src={review.user.avatar || "/placeholder.svg"}
                    alt={review.user.name}
                    className="h-7 w-7 rounded-full object-cover ring-1 ring-border"
                    crossOrigin="anonymous"
                  />
                  <span className="text-xs font-semibold text-foreground">
                    {review.user.name}
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    {review.timeAgo}
                  </span>
                </div>
                <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-foreground">
                  {review.text}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="rounded-2xl border border-border bg-muted/30 p-5 text-center text-xs text-muted-foreground">
            아직 등록된 관련 리뷰가 없습니다.
          </p>
        )}
      </section>
    </div>
  )
}
