"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface PaginationNavProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  className?: string
}

function getPageNumbers(current: number, total: number): (number | "ellipsis")[] {
  if (total <= 5) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }

  const pages: (number | "ellipsis")[] = []

  if (current <= 3) {
    pages.push(1, 2, 3, 4, "ellipsis", total)
  } else if (current >= total - 2) {
    pages.push(1, "ellipsis", total - 3, total - 2, total - 1, total)
  } else {
    pages.push(1, "ellipsis", current - 1, current, current + 1, "ellipsis", total)
  }

  return pages
}

export function PaginationNav({ currentPage, totalPages, onPageChange, className }: PaginationNavProps) {
  if (totalPages <= 1) return null

  const pages = getPageNumbers(currentPage, totalPages)

  return (
    <nav className={cn("flex items-center justify-center gap-1", className)} aria-label="페이지 탐색">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted disabled:opacity-40 disabled:hover:bg-transparent"
        aria-label="이전 페이지"
      >
        <ChevronLeft size={16} />
      </button>

      {pages.map((page, i) =>
        page === "ellipsis" ? (
          <span key={`ellipsis-${i}`} className="flex h-9 w-9 items-center justify-center text-xs text-muted-foreground">
            ...
          </span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium transition-colors",
              currentPage === page
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted"
            )}
            aria-label={`${page} 페이지`}
            aria-current={currentPage === page ? "page" : undefined}
          >
            {page}
          </button>
        )
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted disabled:opacity-40 disabled:hover:bg-transparent"
        aria-label="다음 페이지"
      >
        <ChevronRight size={16} />
      </button>
    </nav>
  )
}
