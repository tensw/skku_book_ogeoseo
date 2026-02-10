"use client"

import { useState } from "react"
import { Star, Heart, MessageCircle, MoreHorizontal } from "lucide-react"
import { cn } from "@/lib/utils"
import type { BookReview } from "@/lib/types"

interface ReviewCardProps {
  review: BookReview
  className?: string
}

export function ReviewCard({ review, className }: ReviewCardProps) {
  const [liked, setLiked] = useState(false)

  return (
    <article className={cn("border-b border-border px-5 py-5 sm:px-8", className)}>
      {/* Top: user info */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <img
            src={review.user.avatar || "/placeholder.svg"}
            alt={review.user.name}
            className="h-9 w-9 rounded-full object-cover ring-2 ring-border"
            crossOrigin="anonymous"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-foreground">{review.user.name}</span>
              {review.user.department && (
                <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                  {review.user.department}
                </span>
              )}
            </div>
            <span className="text-[11px] text-muted-foreground">{review.timeAgo}</span>
          </div>
        </div>
        <button className="p-1 text-muted-foreground" aria-label="더보기">
          <MoreHorizontal size={16} />
        </button>
      </div>

      {/* Book card */}
      <div className="mt-3 flex items-center gap-3 rounded-2xl bg-muted/50 p-3">
        <div className="h-14 w-10 flex-shrink-0 overflow-hidden rounded-lg shadow-sm">
          <img
            src={review.book.cover || "/placeholder.svg"}
            alt={review.book.title}
            className="h-full w-full object-cover"
            crossOrigin="anonymous"
          />
        </div>
        <div className="flex-1">
          <p className="text-xs font-bold text-foreground">{review.book.title}</p>
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
      </div>

      {/* Review text */}
      <p className="mt-3 text-[13px] leading-relaxed text-foreground">
        {review.text}
      </p>

      {/* Actions */}
      <div className="mt-3 flex items-center gap-5">
        <button
          onClick={() => setLiked((prev) => !prev)}
          className="flex items-center gap-1.5 text-xs text-muted-foreground transition-colors"
        >
          <Heart
            size={15}
            className={cn(liked ? "fill-tangerine text-tangerine" : "text-muted-foreground")}
          />
          <span className={cn(liked ? "font-medium text-tangerine" : "")}>
            {review.likes + (liked ? 1 : 0)}
          </span>
        </button>
        <button className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <MessageCircle size={15} />
          {review.comments}
        </button>
      </div>
    </article>
  )
}
