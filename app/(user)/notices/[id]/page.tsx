"use client"

import React, { use } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft, Paperclip, Eye, Calendar, User } from "lucide-react"
import { notices } from "@/lib/mock-data"

export default function NoticeDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const notice = notices.find((n) => n.id === Number(id))

  if (!notice) {
    return (
      <div className="flex flex-col items-center gap-4 py-20">
        <p className="text-sm text-muted-foreground">공지사항을 찾을 수 없습니다.</p>
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

      {/* Title & meta */}
      <header className="border-b border-border px-5 pb-5 sm:px-8">
        {notice.important && (
          <span className="mb-2 inline-block rounded-full bg-red-500/10 px-2.5 py-0.5 text-[10px] font-bold text-red-500">
            중요
          </span>
        )}
        <h1 className="font-serif text-2xl font-bold leading-tight text-foreground">
          {notice.title}
        </h1>
        <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <User size={12} />
            {notice.author}
          </span>
          <span className="flex items-center gap-1">
            <Calendar size={12} />
            {notice.date}
          </span>
          <span className="flex items-center gap-1">
            <Eye size={12} />
            조회 {notice.views}
          </span>
        </div>
      </header>

      {/* Content */}
      <article className="px-5 sm:px-8">
        <div className="whitespace-pre-line text-sm leading-relaxed text-foreground">
          {notice.content}
        </div>
      </article>

      {/* Attachments */}
      {notice.attachments.length > 0 && (
        <section className="mx-5 rounded-2xl border border-border bg-muted/30 p-4 sm:mx-8">
          <h3 className="mb-2 flex items-center gap-1.5 text-xs font-bold text-foreground">
            <Paperclip size={12} />
            첨부파일 ({notice.attachments.length})
          </h3>
          <ul className="flex flex-col gap-1.5">
            {notice.attachments.map((file) => (
              <li key={file}>
                <button className="text-xs text-primary underline-offset-2 hover:underline">
                  {file}
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}
