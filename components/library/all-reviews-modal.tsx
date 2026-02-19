"use client"

import { useState } from "react"
import { BookOpen, Heart, MessageCircle, Star, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { programLabels, programColors, type MyReview, type ProgramType } from "./library-types"

interface AllReviewsModalProps {
  reviews: MyReview[]
  likedReviews: number[]
  onToggleLike: (id: number) => void
  onClose: () => void
}

export function AllReviewsModal({
  reviews,
  likedReviews,
  onToggleLike,
  onClose,
}: AllReviewsModalProps) {
  const [filter, setFilter] = useState<ProgramType | null>(null)

  const reviewCountByProgram: Record<ProgramType, number> = {
    dokmo: reviews.filter((r) => r.program === "dokmo").length,
    dokto: reviews.filter((r) => r.program === "dokto").length,
    general: reviews.filter((r) => r.program === "general").length,
  }

  const filteredReviews = filter ? reviews.filter((r) => r.program === filter) : reviews

  const handleClose = () => {
    setFilter(null)
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 p-4 backdrop-blur-sm"
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="all-reviews-modal-title"
    >
      <div
        className="relative flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="border-b border-border px-5 py-4">
          <div className="flex items-center justify-between">
            <h3 id="all-reviews-modal-title" className="text-lg font-bold text-foreground">나의 서평</h3>
            <button
              onClick={handleClose}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-foreground transition-colors hover:bg-muted/70"
              aria-label="닫기"
            >
              <X size={16} />
            </button>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            총 {reviews.length}편의 서평을 작성했어요
          </p>

          {/* Program Filter Chips */}
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              onClick={() => setFilter(null)}
              className={cn(
                "rounded-full px-3 py-1.5 text-xs font-semibold transition-all",
                filter === null
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "bg-muted text-muted-foreground hover:bg-border"
              )}
            >
              전체 ({reviews.length})
            </button>
            {(["dokmo", "dokto", "general"] as ProgramType[]).map((program) => {
              const colors = programColors[program]
              const count = reviewCountByProgram[program]
              return (
                <button
                  key={program}
                  onClick={() => setFilter(program)}
                  className={cn(
                    "rounded-full px-3 py-1.5 text-xs font-semibold transition-all",
                    filter === program
                      ? `${colors.bg} ${colors.text} shadow-md`
                      : "bg-muted text-muted-foreground hover:bg-border"
                  )}
                >
                  {programLabels[program]} ({count})
                </button>
              )
            })}
          </div>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto">
          {filteredReviews.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-12 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                <BookOpen size={24} className="text-muted-foreground" />
              </div>
              <p className="text-sm font-medium text-muted-foreground">
                아직 작성한 서평이 없어요
              </p>
            </div>
          ) : (
            filteredReviews.map((review) => {
              const liked = likedReviews.includes(review.id)
              return (
                <article
                  key={review.id}
                  className="border-b border-border px-5 py-4 last:border-b-0"
                >
                  <div className="flex items-center gap-3 rounded-2xl bg-muted/50 p-3">
                    <div className="h-14 w-10 flex-shrink-0 overflow-hidden rounded-lg shadow-sm">
                      <img
                        src={review.book.cover || "/placeholder.svg"}
                        alt={review.book.title}
                        className="h-full w-full object-cover"
                        crossOrigin="anonymous"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-bold text-foreground">{review.book.title}</p>
                        <span className={cn("rounded-full px-1.5 py-0.5 text-[9px] font-semibold", programColors[review.program].bg, programColors[review.program].text)}>
                          {programLabels[review.program]}
                        </span>
                      </div>
                      <p className="text-[11px] text-muted-foreground">{review.book.author}</p>
                      <div className="mt-1 flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            size={11}
                            className={cn(s <= review.rating ? "fill-tangerine text-tangerine" : "text-border")}
                          />
                        ))}
                      </div>
                    </div>
                    <span className="text-[10px] text-muted-foreground">{review.timeAgo}</span>
                  </div>

                  <p className="mt-3 text-[13px] leading-relaxed text-foreground">
                    {review.text}
                  </p>

                  <div className="mt-3 flex items-center gap-5">
                    <button
                      onClick={() => onToggleLike(review.id)}
                      className="flex items-center gap-1.5 text-xs text-muted-foreground transition-colors"
                      aria-label={liked ? "좋아요 취소" : "좋아요"}
                      aria-pressed={liked}
                    >
                      <Heart
                        size={15}
                        className={cn(liked ? "fill-tangerine text-tangerine" : "text-muted-foreground")}
                      />
                      <span className={cn(liked ? "font-medium text-tangerine" : "")}>
                        {review.likes + (liked ? 1 : 0)}
                      </span>
                    </button>
                    <button className="flex items-center gap-1.5 text-xs text-muted-foreground" aria-label={`댓글 ${review.comments}개`}>
                      <MessageCircle size={15} />
                      {review.comments}
                    </button>
                  </div>
                </article>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
