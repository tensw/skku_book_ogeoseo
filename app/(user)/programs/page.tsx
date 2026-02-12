"use client"

import Link from "next/link"
import {
  Calendar,
  Users,
  ChevronRight,
  Sun,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { usePrograms } from "@/lib/program-context"

// 기본 프로그램 카드 (독모, 독토)
const defaultPrograms = [
  {
    id: "dokmo",
    name: "독모 (독서모임)",
    description: "시간대별로 진행되는 독서모임입니다. 아침, 점심, 저녁 중 원하는 시간에 참여하세요.",
    gradient: "from-amber-400 via-sky-400 to-indigo-500",
    accentText: "독서",
    href: "/programs/dokmo",
    icon: Sun,
    stats: { groups: 3, times: "6:00-22:00" },
  },
  {
    id: "dokto",
    name: "독토 (독서토론회)",
    description: "학생, 교수, 작가와 함께하는 깊이 있는 독서 토론 프로그램입니다.",
    gradient: "from-emerald to-teal-500",
    accentText: "토론",
    href: "/programs/dokto",
    icon: Users,
    stats: { groups: 6, active: "진행 중" },
  },
]

export default function ProgramsPage() {
  const { customPrograms } = usePrograms()

  return (
    <div className="flex flex-col gap-4 pb-6">
      {/* Header */}
      <header className="px-5 pt-5 sm:px-8">
        <div>
          <h1 className="text-xl font-bold text-foreground">프로그램</h1>
          <p className="mt-0.5 text-[11px] text-muted-foreground">
            다양한 독서 프로그램에 참여해보세요
          </p>
        </div>
      </header>

      {/* 기본 프로그램 (독모, 독토) */}
      <section className="px-5 sm:px-8">
        <h2 className="mb-3 text-sm font-bold text-foreground">상시 프로그램</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {defaultPrograms.map((program) => {
            const Icon = program.icon
            return (
              <Link
                key={program.id}
                href={program.href}
                className="group relative overflow-hidden rounded-2xl shadow-sm transition-all hover:shadow-lg"
              >
                <div
                  className={cn(
                    "relative h-36 bg-gradient-to-br p-4",
                    program.gradient
                  )}
                >
                  {/* 배경 큰 텍스트 */}
                  <div className="absolute -right-2 top-1/2 -translate-y-1/2 select-none">
                    <span className="text-[60px] font-black text-white/15 leading-none">
                      {program.accentText}
                    </span>
                  </div>

                  <div className="relative">
                    <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-2.5 py-1 text-[10px] font-bold text-white backdrop-blur-sm">
                      <Icon size={12} />
                      상시 운영
                    </span>
                    <h3 className="mt-2 text-base font-bold text-white">
                      {program.name}
                    </h3>
                    <p className="mt-1 text-xs text-white/80 line-clamp-2">
                      {program.description}
                    </p>
                  </div>

                  {/* 화살표 */}
                  <div className="absolute bottom-4 right-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white transition-transform group-hover:translate-x-1">
                      <ChevronRight size={16} />
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      {/* 커스텀 프로그램 */}
      {customPrograms.filter(p => p.isActive).length > 0 && (
        <section className="px-5 sm:px-8">
          <h2 className="mb-3 text-sm font-bold text-foreground">특별 프로그램</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {customPrograms.filter(p => p.isActive).map((program) => (
              <Link
                key={program.id}
                href={`/programs/${program.id}`}
                className="group relative overflow-hidden rounded-2xl shadow-sm transition-all hover:shadow-lg"
              >
                <div
                  className={cn(
                    "relative h-44 bg-gradient-to-br p-4",
                    program.gradient
                  )}
                >
                  {/* 배경 큰 텍스트 */}
                  <div className="absolute -right-2 top-1/2 -translate-y-1/2 select-none">
                    <span className="text-[50px] font-black text-white/15 leading-none">
                      {program.accentText}
                    </span>
                  </div>

                  <div className="relative">
                    <div className="flex items-center gap-2">
                      {program.hasCalendar && program.startDate && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-2 py-0.5 text-[9px] font-medium text-white backdrop-blur-sm">
                          <Calendar size={10} />
                          {program.startDate} ~ {program.endDate}
                        </span>
                      )}
                    </div>
                    <h3 className="mt-2 text-base font-bold text-white">
                      {program.name}
                    </h3>
                    <p className="mt-1 text-xs text-white/80 line-clamp-2">
                      {program.description}
                    </p>
                    {program.notice && (
                      <p className="mt-2 text-[10px] text-white/60 line-clamp-2">
                        {program.notice}
                      </p>
                    )}
                  </div>

                  {/* 커스텀 필드 */}
                  {program.customFields.length > 0 && (
                    <div className="absolute bottom-12 left-4 right-4">
                      <div className="flex flex-wrap gap-1.5">
                        {program.customFields.slice(0, 2).map((field, i) => (
                          <span
                            key={i}
                            className="rounded-full bg-white/20 px-2 py-0.5 text-[9px] font-medium text-white backdrop-blur-sm"
                          >
                            {field.label}: {field.value}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 화살표 */}
                  <div className="absolute bottom-3 right-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white transition-all hover:bg-white/40 group-hover:translate-x-1">
                      <ChevronRight size={16} />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
