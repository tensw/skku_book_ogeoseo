"use client"

import { BookOpen, Heart, MessageCircle, Star, X } from "lucide-react"
import { cn } from "@/lib/utils"
import type { KDCBadgeData } from "@/components/kdc-badge"
import { programLabels, programColors, type MyReview } from "./library-types"

interface BadgeReviewModalProps {
  badge: KDCBadgeData | null
  reviews: MyReview[]
  likedReviews: number[]
  onToggleLike: (id: number) => void
  onClose: () => void
}

export function BadgeReviewModal({
  badge,
  reviews,
  likedReviews,
  onToggleLike,
  onClose,
}: BadgeReviewModalProps) {
  if (!badge) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 p-4 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="badge-review-modal-title"
    >
      <div
        className="relative flex max-h-[85vh] w-full max-w-lg flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center gap-3 border-b border-border px-5 py-4">
          <div
            className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full"
            style={{
              background: badge.gradient,
              boxShadow: "0 2px 8px rgba(6, 78, 59, 0.25)",
            }}
            aria-hidden="true"
          >
            <span className="text-sm text-white">{badge.icon}</span>
          </div>
          <div className="flex-1">
            <h3 id="badge-review-modal-title" className="text-sm font-bold text-foreground">
              {badge.label} ({badge.id})
            </h3>
            <p className="text-xs text-muted-foreground">
              내가 작성한 서평 {reviews.length}편
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-foreground transition-colors hover:bg-muted/70"
            aria-label="닫기"
          >
            <X size={16} />
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto">
          {reviews.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-12 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                <BookOpen size={24} className="text-muted-foreground" />
              </div>
              <p className="text-sm font-medium text-muted-foreground">
                아직 작성한 서평이 없어요
              </p>
              <p className="text-xs text-muted-foreground">
                이 분류의 도서를 읽고 서평을 작성해보세요
              </p>
            </div>
          ) : (
            reviews.map((review) => {
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
