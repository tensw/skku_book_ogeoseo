"use client"

import { useState, useEffect, useCallback } from "react"
import {
  ChevronLeft,
  ChevronRight,
  Users,
  GraduationCap,
  BookOpen,
  Clock,
  ArrowRight,
  Sparkles,
  Heart,
  MessageCircle,
  ImageIcon,
  Flame,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { ClubDetailModal } from "@/components/club-detail-modal"
import type { ClubDetailData } from "@/components/club-detail-modal"

const recommendedBooks = [
  { id: 1, title: "아무튼, 메모", author: "김신회", cover: "https://picsum.photos/seed/book-memo/200/280", category: "에세이", color: "bg-tangerine/10 text-tangerine" },
  { id: 2, title: "사피엔스", author: "유발 하라리", cover: "https://picsum.photos/seed/book-sapiens/200/280", category: "역사", color: "bg-mint/10 text-mint" },
  { id: 3, title: "아주 작은 습관의 힘", author: "제임스 클리어", cover: "https://picsum.photos/seed/book-atomic/200/280", category: "자기계발", color: "bg-emerald/10 text-emerald" },
  { id: 4, title: "미드나이트 라이브러리", author: "매트 헤이그", cover: "https://picsum.photos/seed/book-midnight/200/280", category: "문학", color: "bg-tangerine/10 text-tangerine" },
  { id: 5, title: "생각에 관한 생각", author: "대니얼 카너먼", cover: "https://picsum.photos/seed/book-thinking/200/280", category: "심리학", color: "bg-mint/10 text-mint" },
]

const liveTalkPosts = [
  {
    id: 1,
    author: "윤하나",
    avatar: "https://picsum.photos/seed/avatar3/80/80",
    content: "오늘 독서 모임에서 채식주의자 토론 완료! 한강 작가의 상징성에 대해 정말 깊은 이야기를 나눴어요.",
    photos: ["https://picsum.photos/seed/post-discussion/800/600"],
    likes: 56,
    comments: 12,
    time: "30분 전",
  },
  {
    id: 2,
    author: "김소은",
    avatar: "https://picsum.photos/seed/avatar5/80/80",
    content: "아침 독서 루틴 3주차! 습관의 힘을 읽으면서 진짜 나의 시스템이 바뀌고 있다는 걸 느껴요.",
    photos: ["https://picsum.photos/seed/post-reading/800/600", "https://picsum.photos/seed/post-bookclub/800/600"],
    likes: 89,
    comments: 23,
    time: "2시간 전",
  },
  {
    id: 3,
    author: "박민준",
    avatar: "https://picsum.photos/seed/avatar2/80/80",
    content: "카페에서 사피엔스 읽는 중. 커피 한 잔과 함께하는 일요일 오후가 최고네요.",
    photos: ["https://picsum.photos/seed/post-bookclub/800/600"],
    likes: 42,
    comments: 8,
    time: "4시간 전",
  },
]

interface ActiveClub {
  id: number
  title: string
  leader: string
  leaderType: "student" | "professor" | "author"
  members: number
  nextMeeting: string
  vibeImage: string
  tagColor: string
  detail: ClubDetailData
}

const activeClubs: ActiveClub[] = [
  {
    id: 1, title: "숨겨둔 내 안의 이야기", leader: "OOO 학생", leaderType: "student",
    members: 5, nextMeeting: "3/10 (화) 20:00", vibeImage: "https://picsum.photos/seed/vibe-essay/800/400", tagColor: "bg-tangerine text-white",
    detail: {
      id: 1, title: "숨겨둔 내 안의 이야기", leader: "OOO 학생", leaderType: "student",
      leaderDept: "중국어학과", leaderSchool: "성균관대학교", leaderYear: "2학년",
      leaderMessage: "감정을 메모하는 습관이 삶을 바꿉니다. 함께 내면의 목소리에 귀 기울여봐요!",
      topic: "숨겨둔 내 안의 이야기", book: "아무튼, 메모",
      bookCover: "https://picsum.photos/seed/club1/100/140", minMembers: 3, maxMembers: 8, currentMembers: 5,
      schedule: ["3/10 (화) 20:00 - 21:00", "3/24 (화) 20:00 - 21:00"],
      assignments: [
        { week: "1주차", task: "일상 속 감정에 이름 붙이기 - 하루에 3가지 감정을 메모하고 왜 그 감정을 느꼈는지 기록해주세요." },
        { week: "2주차", task: "감정에 이름붙이기 2회 인증 - 메모 습관이 나에게 어떤 변화를 주었는지 나눠주세요." },
      ],
    },
  },
  {
    id: 2, title: "철학 독서 모임", leader: "김지혜 교수", leaderType: "professor",
    members: 12, nextMeeting: "3/18 (금) 19:00", vibeImage: "https://picsum.photos/seed/vibe-history/800/400", tagColor: "bg-mint text-white",
    detail: {
      id: 2, title: "철학 독서 모임", leader: "김지혜 교수", leaderType: "professor",
      leaderDept: "철학과", leaderSchool: "서울대학교", leaderYear: "",
      leaderMessage: "고전 철학서를 함께 읽고 현대적 관점에서 토론합니다.",
      topic: "일상 속 철학 탐구", book: "생각의 오류를 넘어서",
      bookCover: "https://picsum.photos/seed/club2/100/140", minMembers: 5, maxMembers: 15, currentMembers: 12,
      schedule: ["3/18 (금) 19:00 - 20:30", "4/1 (금) 19:00 - 20:30"],
      assignments: [
        { week: "1주차", task: "인지 편향 3가지를 일상에서 찾아 기록하고 분석해주세요." },
        { week: "2주차", task: "매몰비용 오류에 대한 자신의 경험을 500자 내로 정리해주세요." },
      ],
    },
  },
  {
    id: 3, title: "현대 문학 클럽", leader: "박서연 작가", leaderType: "author",
    members: 32, nextMeeting: "3/20 (일) 21:00", vibeImage: "https://picsum.photos/seed/vibe-literature/800/400", tagColor: "bg-primary text-white",
    detail: {
      id: 3, title: "현대 문학 클럽", leader: "박서연 작가", leaderType: "author",
      leaderDept: "소설가", leaderSchool: "", leaderYear: "",
      leaderMessage: "문학은 타인의 삶을 경험하는 가장 아름다운 방법입니다.",
      topic: "한국 현대문학 깊이 읽기", book: "채식주의자",
      bookCover: "https://picsum.photos/seed/club3/100/140", minMembers: 10, maxMembers: 40, currentMembers: 32,
      schedule: ["3/20 (일) 21:00 - 22:30", "4/3 (일) 21:00 - 22:30"],
      assignments: [
        { week: "1주차", task: "소설 속 상징적 장면 하나를 골라 자신의 해석을 작성해주세요." },
        { week: "2주차", task: "작가의 문체와 서사 기법에 대한 느낀 점을 자유롭게 공유해주세요." },
      ],
    },
  },
  {
    id: 4, title: "과학과 사회", leader: "최동우 학생", leaderType: "student",
    members: 18, nextMeeting: "3/22 (화) 20:00", vibeImage: "https://picsum.photos/seed/vibe-habit/800/400", tagColor: "bg-emerald text-white",
    detail: {
      id: 4, title: "과학과 사회", leader: "최동우 학생", leaderType: "student",
      leaderDept: "물리학과", leaderSchool: "KAIST", leaderYear: "3학년",
      leaderMessage: "과학이 사회에 미치는 영향을 함께 고민해봐요!",
      topic: "AI와 미래 사회", book: "라이프 3.0",
      bookCover: "https://picsum.photos/seed/club4/100/140", minMembers: 5, maxMembers: 20, currentMembers: 18,
      schedule: ["3/22 (화) 20:00 - 21:00", "4/5 (화) 20:00 - 21:00"],
      assignments: [
        { week: "1주차", task: "AI가 자신의 전공 분야에 어떤 변화를 가져올지 예측해주세요." },
        { week: "2주차", task: "라이프 3.0의 5~7장 핵심 논점 토론 질문 2개를 준비해주세요." },
      ],
    },
  },
]

export function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [selectedClub, setSelectedClub] = useState<ClubDetailData | null>(null)
  const [joinedClubs, setJoinedClubs] = useState<number[]>([])

  const handleApply = () => {
    if (selectedClub) {
      setJoinedClubs((prev) =>
        prev.includes(selectedClub.id) ? prev : [...prev, selectedClub.id]
      )
    }
  }

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % recommendedBooks.length)
  }, [])

  const prevSlide = useCallback(() => {
    setCurrentSlide(
      (prev) => (prev - 1 + recommendedBooks.length) % recommendedBooks.length
    )
  }, [])

  useEffect(() => {
    const timer = setInterval(nextSlide, 4000)
    return () => clearInterval(timer)
  }, [nextSlide])

  const currentBook = recommendedBooks[currentSlide]

  return (
    <div className="flex flex-col gap-0 pb-6">
      {/* Top Bar */}
      <header className="flex items-center justify-between px-5 py-3 sm:px-8">
        <h1 className="font-serif text-xl font-bold tracking-tight text-primary">
          오거서
        </h1>
        <span className="text-[11px] text-muted-foreground">
          함께 읽고, 함께 나누는
        </span>
      </header>

      {/* Hero Banner */}
      <section className="relative h-56 overflow-hidden sm:h-72">
        <img
          src="https://picsum.photos/seed/hero-banner/1200/600"
          alt="독서 라이프스타일"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 px-5 pb-5 sm:px-8">
          <span className="mb-2 inline-flex items-center gap-1 rounded-full bg-emerald px-2.5 py-1 text-[10px] font-bold text-white">
            <Flame size={10} />
            HOT
          </span>
          <h1 className="font-serif text-2xl font-bold leading-tight text-white sm:text-3xl">
            함께 읽고,{" "}
            <span className="text-emerald">함께 나누는</span>
          </h1>
          <p className="mt-1 text-xs text-white/70 sm:text-sm">
            오거서에서 당신의 독서 라이프를 시작하세요
          </p>
        </div>
      </section>

      {/* Book Carousel - compact horizontal scroll */}
      <section className="px-5 pt-5 sm:px-8">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-sm font-bold text-foreground">
            <Sparkles size={14} className="text-tangerine" />
            이달의 추천
          </h2>
          <div className="flex items-center gap-1">
            <button onClick={prevSlide} className="rounded-full p-1 hover:bg-muted" aria-label="이전">
              <ChevronLeft size={14} className="text-muted-foreground" />
            </button>
            <span className="text-[10px] text-muted-foreground">{currentSlide + 1}/{recommendedBooks.length}</span>
            <button onClick={nextSlide} className="rounded-full p-1 hover:bg-muted" aria-label="다음">
              <ChevronRight size={14} className="text-muted-foreground" />
            </button>
          </div>
        </div>

        <div className="flex gap-3 overflow-x-auto no-scrollbar">
          {recommendedBooks.map((book, i) => (
            <div
              key={book.id}
              className={cn(
                "flex flex-shrink-0 flex-col items-center gap-2 transition-all",
                i === currentSlide ? "opacity-100" : "opacity-60"
              )}
            >
              <div className="relative h-32 w-22 overflow-hidden rounded-2xl shadow-md ring-1 ring-border sm:h-36 sm:w-24">
                <img src={book.cover || "/placeholder.svg"} alt={book.title} className="h-full w-full object-cover" crossOrigin="anonymous" />
              </div>
              <span className={cn("rounded-full px-2 py-0.5 text-[9px] font-bold", book.color)}>
                {book.category}
              </span>
              <p className="w-20 truncate text-center text-[10px] font-medium text-foreground sm:w-24">{book.title}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Live Talk Talk Feed */}
      <section className="mt-5 px-5 sm:px-8">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-sm font-bold text-foreground">
            <MessageCircle size={14} className="text-mint" />
            실시간 Talk Talk
          </h2>
          <button className="rounded-full bg-mint/10 px-3 py-1 text-[10px] font-semibold text-mint transition-colors hover:bg-mint/20">
            더보기
          </button>
        </div>

        <div className="flex flex-col gap-3">
          {liveTalkPosts.map((post) => (
            <div key={post.id} className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
              {/* Photo area */}
              {post.photos.length > 0 && (
                <div className="relative">
                  <div className="flex overflow-x-auto no-scrollbar">
                    {post.photos.map((photo, i) => (
                      <div key={`photo-${post.id}-${i}`} className="relative h-44 w-full flex-shrink-0 sm:h-52">
                        <img src={photo || "/placeholder.svg"} alt={`${post.author}의 사진`} className="h-full w-full object-cover" />
                      </div>
                    ))}
                  </div>
                  {post.photos.length > 1 && (
                    <div className="absolute right-2 top-2 flex items-center gap-1 rounded-full bg-foreground/50 px-2 py-0.5 backdrop-blur-sm">
                      <ImageIcon size={10} className="text-white" />
                      <span className="text-[9px] font-medium text-white">{post.photos.length}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Content */}
              <div className="p-3.5">
                <div className="flex items-center gap-2.5">
                  <div className="h-7 w-7 overflow-hidden rounded-full ring-2 ring-mint/30">
                    <img src={post.avatar || "/placeholder.svg"} alt={post.author} className="h-full w-full object-cover" crossOrigin="anonymous" />
                  </div>
                  <span className="text-xs font-bold text-foreground">{post.author}</span>
                  <span className="text-[10px] text-muted-foreground">{post.time}</span>
                </div>
                <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-foreground">
                  {post.content}
                </p>
                <div className="mt-2.5 flex items-center gap-4">
                  <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                    <Heart size={12} className="text-tangerine" />
                    {post.likes}
                  </span>
                  <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                    <MessageCircle size={12} className="text-mint" />
                    {post.comments}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Active Clubs */}
      <section className="mt-5 px-5 sm:px-8">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-sm font-bold text-foreground">
            <BookOpen size={14} className="text-emerald" />
            이달의 독토
          </h2>
          <button className="text-[10px] font-semibold text-primary">
            전체 보기 <ArrowRight size={10} className="inline" />
          </button>
        </div>

        <div className="flex flex-col gap-3 sm:grid sm:grid-cols-2 sm:gap-4">
          {activeClubs.map((club) => {
            const isJoined = joinedClubs.includes(club.id)
            return (
              <div
                key={club.id}
                className="group overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all hover:shadow-md"
              >
                {/* Vibe Image */}
                <div className="relative h-28 overflow-hidden sm:h-32">
                  <img src={club.vibeImage || "/placeholder.svg"} alt={club.title} className="h-full w-full object-cover transition-transform group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
                  <div className="absolute bottom-2 left-3 right-3 flex items-end justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-white">{club.title}</h3>
                      <span className="text-[10px] text-white/70">{club.leader}</span>
                    </div>
                    <span className={cn("rounded-full px-2 py-0.5 text-[9px] font-bold", club.tagColor)}>
                      {club.leaderType === "student" ? "학생" : club.leaderType === "professor" ? "교수" : "작가"}
                    </span>
                  </div>
                </div>

                {/* Info Footer */}
                <div className="flex items-center justify-between p-3">
                  <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Users size={10} />
                      {club.members}명
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={10} />
                      {club.nextMeeting}
                    </span>
                  </div>
                  {isJoined ? (
                    <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-bold text-primary">
                      신청 완료
                    </span>
                  ) : (
                    <button
                      onClick={() => setSelectedClub(club.detail)}
                      className="rounded-full bg-primary px-3 py-1 text-[10px] font-bold text-primary-foreground shadow-sm transition-all hover:shadow-md hover:brightness-110"
                    >
                      참여
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </section>

      <ClubDetailModal
        club={selectedClub}
        isOpen={!!selectedClub}
        onClose={() => setSelectedClub(null)}
        onApply={handleApply}
        applied={selectedClub ? joinedClubs.includes(selectedClub.id) : false}
      />
    </div>
  )
}
