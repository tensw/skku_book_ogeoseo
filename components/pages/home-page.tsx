"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
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
  Sun,
  Sunset,
  Moon,
  Settings,
  X,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { ClubDetailModal } from "@/components/club-detail-modal"
import type { ClubDetailData } from "@/components/club-detail-modal"
import { useAuth } from "@/lib/auth-context"

const recommendedBooks = [
  { id: 1, title: "아무튼, 메모", author: "김신회", cover: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=200&h=280&fit=crop", category: "에세이", color: "bg-tangerine/10 text-tangerine" },
  { id: 2, title: "사피엔스", author: "유발 하라리", cover: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=200&h=280&fit=crop", category: "역사", color: "bg-mint/10 text-mint" },
  { id: 3, title: "아주 작은 습관의 힘", author: "제임스 클리어", cover: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=200&h=280&fit=crop", category: "자기계발", color: "bg-emerald/10 text-emerald" },
  { id: 4, title: "미드나이트 라이브러리", author: "매트 헤이그", cover: "https://images.unsplash.com/photo-1476275466078-4007374efbbe?w=200&h=280&fit=crop", category: "문학", color: "bg-tangerine/10 text-tangerine" },
  { id: 5, title: "생각에 관한 생각", author: "대니얼 카너먼", cover: "https://images.unsplash.com/photo-1589998059171-988d887df646?w=200&h=280&fit=crop", category: "심리학", color: "bg-mint/10 text-mint" },
]

const dokmoGroups = [
  {
    id: "yeomyeong",
    name: "여명독",
    description: "아침 6-9시",
    book: "미움받을 용기",
    bookAuthor: "기시미 이치로",
    bookCover: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=100&h=140&fit=crop",
    times: ["6:00", "7:00", "8:00"],
    color: "bg-amber-500",
    lightColor: "bg-amber-100 text-amber-700",
    icon: Sun,
  },
  {
    id: "yunseul",
    name: "윤슬독",
    description: "점심 12-14시",
    book: "데미안",
    bookAuthor: "헤르만 헤세",
    bookCover: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=100&h=140&fit=crop",
    times: ["12:00", "13:00"],
    color: "bg-sky-500",
    lightColor: "bg-sky-100 text-sky-700",
    icon: Sunset,
  },
  {
    id: "dalbit",
    name: "달빛독",
    description: "저녁 17-22시",
    book: "아몬드",
    bookAuthor: "손원평",
    bookCover: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=100&h=140&fit=crop",
    times: ["17:00", "18:00", "19:00", "20:00", "21:00"],
    color: "bg-indigo-500",
    lightColor: "bg-indigo-100 text-indigo-700",
    icon: Moon,
  },
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

interface BannerForm {
  imageUrl: string
  title: string
  subtitle: string
}

interface BookRecommendation {
  id: number
  title: string
  author: string
  cover: string
  category: string
  color: string
}

export function HomePage() {
  const { isAdmin } = useAuth()
  const [currentSlide, setCurrentSlide] = useState(0)
  const [selectedClub, setSelectedClub] = useState<ClubDetailData | null>(null)
  const [joinedClubs, setJoinedClubs] = useState<number[]>([])
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false)
  const [editingBanner, setEditingBanner] = useState<BannerForm | null>(null)
  const [books, setBooks] = useState<BookRecommendation[]>(recommendedBooks)
  const [editingBook, setEditingBook] = useState<BookRecommendation | null>(null)
  const [bannerData, setBannerData] = useState({
    imageUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&h=600&fit=crop",
    title: "함께 읽고, 함께 나누는",
    subtitle: "오거서에서 당신의 독서 라이프를 시작하세요",
  })

  const handleApply = () => {
    if (selectedClub) {
      setJoinedClubs((prev) =>
        prev.includes(selectedClub.id) ? prev : [...prev, selectedClub.id]
      )
    }
  }

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % books.length)
  }, [books.length])

  const prevSlide = useCallback(() => {
    setCurrentSlide(
      (prev) => (prev - 1 + books.length) % books.length
    )
  }, [books.length])

  const handleEditBanner = () => {
    setEditingBanner({
      imageUrl: bannerData.imageUrl,
      title: bannerData.title,
      subtitle: bannerData.subtitle,
    })
  }

  const handleSaveBanner = () => {
    if (editingBanner) {
      setBannerData({
        imageUrl: editingBanner.imageUrl,
        title: editingBanner.title,
        subtitle: editingBanner.subtitle,
      })
      setEditingBanner(null)
    }
  }

  const handleEditBook = (book: BookRecommendation) => {
    setEditingBook({ ...book })
  }

  const handleSaveBook = () => {
    if (editingBook) {
      if (editingBook.id) {
        setBooks(books.map((b) => (b.id === editingBook.id ? editingBook : b)))
      } else {
        const newId = Math.max(...books.map((b) => b.id)) + 1
        setBooks([...books, { ...editingBook, id: newId }])
      }
      setEditingBook(null)
    }
  }

  const handleDeleteBook = (id: number) => {
    setBooks(books.filter((b) => b.id !== id))
  }

  const handleAddBook = () => {
    setEditingBook({
      id: 0,
      title: "",
      author: "",
      cover: "",
      category: "",
      color: "bg-primary/10 text-primary",
    })
  }

  useEffect(() => {
    const timer = setInterval(nextSlide, 4000)
    return () => clearInterval(timer)
  }, [nextSlide])

  const currentBook = books[currentSlide]

  return (
    <div className="flex flex-col gap-0 pb-6">
      {/* Hero Banner */}
      <section className="relative h-56 overflow-hidden sm:h-72">
        <img
          src={bannerData.imageUrl}
          alt="함께 책 읽고 토론하는 사람들"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 px-5 pb-5 sm:px-8">
          <span className="mb-2 inline-flex items-center gap-1 rounded-full bg-emerald px-2.5 py-1 text-[10px] font-bold text-white">
            <Flame size={10} />
            HOT
          </span>
          <h1 className="font-serif text-2xl font-bold leading-tight text-white sm:text-3xl">
            {bannerData.title.split(",")[0]},{" "}
            <span className="text-emerald">{bannerData.title.split(",")[1] || "함께 나누는"}</span>
          </h1>
          <p className="mt-1 text-xs text-white/70 sm:text-sm">
            {bannerData.subtitle}
          </p>
        </div>
        {isAdmin && (
          <button
            onClick={handleEditBanner}
            className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-muted-foreground backdrop-blur-sm transition-colors hover:bg-white hover:text-primary"
            title="배너 수정"
          >
            <Pencil size={14} />
          </button>
        )}
      </section>

      {/* Book Carousel - compact horizontal scroll */}
      <section className="px-5 pt-5 sm:px-8">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-sm font-bold text-foreground">
            <Sparkles size={14} className="text-tangerine" />
            이달의 책 추천
          </h2>
          <div className="flex items-center gap-1">
            {isAdmin && (
              <button
                onClick={handleAddBook}
                className="mr-2 flex items-center gap-1 rounded-full bg-primary/10 px-2 py-1 text-[10px] font-medium text-primary hover:bg-primary/20"
              >
                <Plus size={10} />
                추가
              </button>
            )}
            <button onClick={prevSlide} className="rounded-full p-1 hover:bg-muted" aria-label="이전">
              <ChevronLeft size={14} className="text-muted-foreground" />
            </button>
            <span className="text-[10px] text-muted-foreground">{currentSlide + 1}/{books.length}</span>
            <button onClick={nextSlide} className="rounded-full p-1 hover:bg-muted" aria-label="다음">
              <ChevronRight size={14} className="text-muted-foreground" />
            </button>
          </div>
        </div>

        <div className="flex gap-3 overflow-x-auto no-scrollbar">
          {books.map((book, i) => (
            <div
              key={book.id}
              className={cn(
                "group relative flex flex-shrink-0 flex-col items-center gap-2 transition-all",
                i === currentSlide ? "opacity-100" : "opacity-60"
              )}
            >
              <div className="relative h-32 w-22 overflow-hidden rounded-2xl shadow-md ring-1 ring-border sm:h-36 sm:w-24">
                <img src={book.cover || "/placeholder.svg"} alt={book.title} className="h-full w-full object-cover" crossOrigin="anonymous" />
                {isAdmin && (
                  <div className="absolute inset-0 flex items-center justify-center gap-1 bg-foreground/50 opacity-0 transition-opacity group-hover:opacity-100">
                    <button
                      onClick={() => handleEditBook(book)}
                      className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-primary"
                    >
                      <Pencil size={12} />
                    </button>
                    <button
                      onClick={() => handleDeleteBook(book.id)}
                      className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-red-500"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                )}
              </div>
              <span className={cn("rounded-full px-2 py-0.5 text-[9px] font-bold", book.color)}>
                {book.category}
              </span>
              <p className="w-20 truncate text-center text-[10px] font-medium text-foreground sm:w-24">{book.title}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 이번주 독모 - Horizontal Slider */}
      <section className="mt-5 px-5 sm:px-8">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-sm font-bold text-foreground">
            <Sun size={14} className="text-amber-500" />
            이번주 독모
          </h2>
          <Link
            href="/programs/dokmo"
            className="flex items-center gap-1 rounded-full bg-amber-500/10 px-3 py-1 text-[10px] font-semibold text-amber-600 transition-colors hover:bg-amber-500/20"
          >
            신청하러가기
            <ArrowRight size={10} />
          </Link>
        </div>

        <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
          {dokmoGroups.map((group) => {
            const IconComponent = group.icon
            const gradientClass = group.id === "yeomyeong"
              ? "from-amber-400 to-amber-600"
              : group.id === "yunseul"
                ? "from-sky-400 to-sky-600"
                : "from-indigo-400 to-indigo-600"
            const accentText = group.id === "yeomyeong" ? "아침" : group.id === "yunseul" ? "점심" : "저녁"

            return (
              <div
                key={group.id}
                className={cn(
                  "relative w-44 flex-shrink-0 overflow-hidden rounded-2xl shadow-sm transition-all hover:shadow-md bg-gradient-to-br",
                  gradientClass
                )}
              >
                {/* 배경 큰 텍스트 */}
                <div className="absolute -right-2 top-1/2 -translate-y-1/2 select-none">
                  <span className="text-[50px] font-black text-white/15 leading-none">
                    {accentText}
                  </span>
                </div>

                {/* 컨텐츠 */}
                <div className="relative p-4">
                  <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-2 py-0.5 text-[9px] font-bold text-white backdrop-blur-sm">
                    <IconComponent size={10} />
                    {group.name}
                  </span>
                  <h3 className="mt-2 text-sm font-bold text-white line-clamp-1">{group.book}</h3>
                  <p className="text-[10px] text-white/80">{group.bookAuthor}</p>
                  <div className="mt-3 flex flex-wrap gap-1">
                    {group.times.slice(0, 3).map((time) => (
                      <span key={time} className="rounded-full bg-white/20 px-1.5 py-0.5 text-[8px] font-medium text-white backdrop-blur-sm">
                        {time}
                      </span>
                    ))}
                    {group.times.length > 3 && (
                      <span className="text-[8px] text-white/70">+{group.times.length - 3}</span>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* 이달의 독토 - Horizontal Slider */}
      <section className="mt-5 px-5 sm:px-8">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-sm font-bold text-foreground">
            <BookOpen size={14} className="text-emerald" />
            이달의 독토
          </h2>
          <Link
            href="/programs/dokto"
            className="flex items-center gap-1 rounded-full bg-emerald/10 px-3 py-1 text-[10px] font-semibold text-emerald transition-colors hover:bg-emerald/20"
          >
            신청하러가기
            <ArrowRight size={10} />
          </Link>
        </div>

        <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
          {activeClubs.map((club) => {
            const isJoined = joinedClubs.includes(club.id)
            const gradientClass = club.leaderType === "student"
              ? "from-emerald to-emerald/80"
              : club.leaderType === "professor"
                ? "from-sky-500 to-sky-600"
                : "from-tangerine to-orange-500"
            const accentText = club.leaderType === "student" ? "학생" : club.leaderType === "professor" ? "교수" : "작가"

            return (
              <div
                key={club.id}
                className={cn(
                  "group relative w-56 flex-shrink-0 overflow-hidden rounded-2xl shadow-sm transition-all hover:shadow-md bg-gradient-to-br",
                  gradientClass
                )}
              >
                {/* 배경 큰 텍스트 */}
                <div className="absolute -right-1 top-1/2 -translate-y-1/2 select-none">
                  <span className="text-[45px] font-black text-white/15 leading-none">
                    {accentText}
                  </span>
                </div>

                {/* 컨텐츠 */}
                <div className="relative p-4">
                  <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-2 py-0.5 text-[9px] font-bold text-white backdrop-blur-sm">
                    <GraduationCap size={10} />
                    {club.leader}
                  </span>
                  <h3 className="mt-2 text-sm font-bold text-white line-clamp-1">{club.title}</h3>
                  <p className="text-[10px] text-white/80">{club.detail.book}</p>
                  <div className="mt-3 flex items-center gap-2 text-[10px] text-white/80">
                    <span className="flex items-center gap-0.5">
                      <Users size={10} />
                      {club.members}명
                    </span>
                    <span className="flex items-center gap-0.5">
                      <Clock size={10} />
                      {club.nextMeeting.split(" ")[0]}
                    </span>
                  </div>
                </div>

                {/* 하단 버튼 */}
                <div className="relative border-t border-white/20 px-4 py-2.5">
                  {isJoined ? (
                    <span className="rounded-full bg-white/20 px-2.5 py-1 text-[9px] font-bold text-white backdrop-blur-sm">
                      신청 완료
                    </span>
                  ) : (
                    <button
                      onClick={() => setSelectedClub(club.detail)}
                      className="rounded-full bg-white/20 px-2.5 py-1 text-[9px] font-bold text-white backdrop-blur-sm transition-all hover:bg-white/30"
                    >
                      참여하기
                    </button>
                  )}
                </div>
              </div>
            )
          })}
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

      <ClubDetailModal
        club={selectedClub}
        isOpen={!!selectedClub}
        onClose={() => setSelectedClub(null)}
        onApply={handleApply}
        applied={selectedClub ? joinedClubs.includes(selectedClub.id) : false}
      />

      {/* Banner Edit Modal */}
      {editingBanner && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-foreground/50 p-4 backdrop-blur-sm"
          onClick={() => setEditingBanner(null)}
        >
          <div
            className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-border bg-card shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-border px-6 py-4">
              <h2 className="text-lg font-bold text-foreground">배너 수정</h2>
              <button
                onClick={() => setEditingBanner(null)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors hover:bg-border hover:text-foreground"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex flex-col gap-4 px-6 py-6">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">배너 이미지 URL</label>
                <input
                  type="text"
                  value={editingBanner.imageUrl}
                  onChange={(e) => setEditingBanner({ ...editingBanner, imageUrl: e.target.value })}
                  placeholder="https://..."
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">제목 (쉼표로 색상 변경 부분 구분)</label>
                <input
                  type="text"
                  value={editingBanner.title}
                  onChange={(e) => setEditingBanner({ ...editingBanner, title: e.target.value })}
                  placeholder="예: 함께 읽고, 함께 나누는"
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">부제목</label>
                <input
                  type="text"
                  value={editingBanner.subtitle}
                  onChange={(e) => setEditingBanner({ ...editingBanner, subtitle: e.target.value })}
                  placeholder="예: 오거서에서 당신의 독서 라이프를 시작하세요"
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            <div className="flex gap-3 border-t border-border bg-muted/30 px-6 py-4">
              <button
                onClick={() => setEditingBanner(null)}
                className="flex-1 rounded-xl border border-border bg-card py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted"
              >
                취소
              </button>
              <button
                onClick={handleSaveBanner}
                className="flex-1 rounded-xl bg-primary py-3 text-sm font-bold text-primary-foreground transition-all hover:brightness-110"
              >
                저장
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Book Edit Modal */}
      {editingBook && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-foreground/50 p-4 backdrop-blur-sm"
          onClick={() => setEditingBook(null)}
        >
          <div
            className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-border bg-card shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-border px-6 py-4">
              <h2 className="text-lg font-bold text-foreground">
                {editingBook.id ? "추천 도서 수정" : "새 추천 도서 추가"}
              </h2>
              <button
                onClick={() => setEditingBook(null)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors hover:bg-border hover:text-foreground"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex flex-col gap-4 px-6 py-6">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">도서명</label>
                <input
                  type="text"
                  value={editingBook.title}
                  onChange={(e) => setEditingBook({ ...editingBook, title: e.target.value })}
                  placeholder="도서 제목"
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">저자</label>
                <input
                  type="text"
                  value={editingBook.author}
                  onChange={(e) => setEditingBook({ ...editingBook, author: e.target.value })}
                  placeholder="저자명"
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">카테고리</label>
                <input
                  type="text"
                  value={editingBook.category}
                  onChange={(e) => setEditingBook({ ...editingBook, category: e.target.value })}
                  placeholder="예: 에세이, 역사, 자기계발"
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">표지 이미지 URL</label>
                <input
                  type="text"
                  value={editingBook.cover}
                  onChange={(e) => setEditingBook({ ...editingBook, cover: e.target.value })}
                  placeholder="https://..."
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">태그 색상</label>
                <select
                  value={editingBook.color}
                  onChange={(e) => setEditingBook({ ...editingBook, color: e.target.value })}
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="bg-tangerine/10 text-tangerine">주황색</option>
                  <option value="bg-mint/10 text-mint">민트</option>
                  <option value="bg-emerald/10 text-emerald">에메랄드</option>
                  <option value="bg-primary/10 text-primary">기본</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 border-t border-border bg-muted/30 px-6 py-4">
              <button
                onClick={() => setEditingBook(null)}
                className="flex-1 rounded-xl border border-border bg-card py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted"
              >
                취소
              </button>
              <button
                onClick={handleSaveBook}
                disabled={!editingBook.title.trim() || !editingBook.author.trim()}
                className="flex-1 rounded-xl bg-primary py-3 text-sm font-bold text-primary-foreground transition-all hover:brightness-110 disabled:opacity-50"
              >
                {editingBook.id ? "수정" : "추가"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Admin Button */}
      {isAdmin && (
        <div className="fixed bottom-24 right-5 z-50">
          <div className="rounded-full bg-primary p-3 text-white shadow-lg">
            <Settings size={20} />
          </div>
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[8px] font-bold text-white">
            관리
          </span>
        </div>
      )}
    </div>
  )
}
