import Link from "next/link"
import { cn } from "@/lib/utils"

interface BookCardProps {
  id: number
  title: string
  author: string
  cover: string
  category?: string
  publisher?: string
  onClick?: () => void
  className?: string
}

export function BookCard({ id, title, author, cover, category, publisher, onClick, className }: BookCardProps) {
  const inner = (
    <>
      <div className="aspect-[3/4] overflow-hidden">
        <img
          src={cover || "/placeholder.svg"}
          alt={`${title} 표지`}
          className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
          crossOrigin="anonymous"
        />
      </div>
      <div className="p-3">
        <h3 className="line-clamp-2 text-sm font-bold text-foreground">{title}</h3>
        <p className="mt-0.5 text-xs text-muted-foreground">{author}</p>
        {publisher && (
          <p className="mt-0.5 text-[11px] text-muted-foreground">{publisher}</p>
        )}
        {category && (
          <span className="mt-1.5 inline-block rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
            {category}
          </span>
        )}
      </div>
    </>
  )

  if (onClick) {
    return (
      <button
        type="button"
        className={cn(
          "overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5 text-left w-full",
          className
        )}
        onClick={onClick}
        aria-label={`${title} - ${author}`}
      >
        {inner}
      </button>
    )
  }

  return (
    <Link href={`/guide/${id}`} className="block" aria-label={`${title} - ${author} 상세보기`}>
      <div
        className={cn(
          "overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5",
          className
        )}
      >
        {inner}
      </div>
    </Link>
  )
}
