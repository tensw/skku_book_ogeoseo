"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
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
  Calendar,
  MapPin,
  Check,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { ClubDetailModal } from "@/components/club-detail-modal"
import type { ClubDetailData } from "@/components/club-detail-modal"
import { useAuth } from "@/lib/auth-context"
import { usePrograms } from "@/lib/program-context"
import { useSharedData, type ReadingGroup } from "@/lib/shared-data-context"

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

// 홈페이지용 독모 그룹 데이터 (공유 데이터에서 가져온 정보 + UI 정보)
interface HomeDokmoGroup {
  id: "yeomyeong" | "yunseul" | "dalbit"
  name: string
  description: string
  book: string
  bookAuthor: string
  bookCover: string
  times: string[]
  icon: typeof Sun
}

export function HomePage() {
  const router = useRouter()
  const { isAdmin } = useAuth()
  const { monthlyBooks, getWeeklyBookAssignment } = usePrograms()
  const {
    readingGroups,
    discussions,
    talkPosts,
    joinedDoktoClubs,
    setJoinedDoktoClubs,
    appliedDokmoSessions,
    setAppliedDokmoSessions,
  } = useSharedData()

  // 이달의 책 배정 정보
  const weeklyAssignment = getWeeklyBookAssignment()

  // 독모 그룹에 책 정보 결합
  const dokmoGroups: HomeDokmoGroup[] = readingGroups.map((group) => {
    const book = group.id === "dalbit" ? weeklyAssignment.dalbit : weeklyAssignment.yeomyeong
    return {
      id: group.id,
      name: group.name,
      description: group.id === "yeomyeong" ? "아침 6-9시" : group.id === "yunseul" ? "점심 12-14시" : "저녁 17-22시",
      book: book?.title || "도서 미정",
      bookAuthor: book?.author || "추후 공지",
      bookCover: book?.cover || "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=100&h=140&fit=crop",
      times: group.timeSlots.map((slot) => slot.time.replace(":00", ":00")),
      icon: group.id === "yeomyeong" ? Sun : group.id === "yunseul" ? Sunset : Moon,
    }
  })

  // 이달의 책 추천 (monthlyBooks에서 가져옴)
  const books = monthlyBooks.map((book, index) => ({
    id: index + 1,
    title: book.title,
    author: book.author,
    cover: book.cover,
    category: index % 4 === 0 ? "에세이" : index % 4 === 1 ? "역사" : index % 4 === 2 ? "자기계발" : "문학",
    color: index % 4 === 0 ? "bg-tangerine/10 text-tangerine" : index % 4 === 1 ? "bg-mint/10 text-mint" : index % 4 === 2 ? "bg-emerald/10 text-emerald" : "bg-primary/10 text-primary",
  }))

  const [currentSlide, setCurrentSlide] = useState(0)
  const [selectedClub, setSelectedClub] = useState<ClubDetailData | null>(null)
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false)
  const [editingBanner, setEditingBanner] = useState<BannerForm | null>(null)
  // 카드 클릭 네비게이션을 위한 상태
  const [selectedBook, setSelectedBook] = useState<BookRecommendation | null>(null)
  const [selectedDokmoGroup, setSelectedDokmoGroup] = useState<HomeDokmoGroup | null>(null)
  const [appliedDokmo, setAppliedDokmo] = useState<{ groupId: string; time: string; date: string }[]>([])
  const [bannerData, setBannerData] = useState({
    imageUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&h=600&fit=crop",
    title: "함께 읽고, 함께 나누는",
    subtitle: "오거서에서 당신의 독서 라이프를 시작하세요",
  })

  const handleApply = () => {
    if (selectedClub) {
      setJoinedDoktoClubs((prev) =>
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

  // 이달의 책은 관리자 페이지에서 관리됨 (usePrograms context)
  // 홈페이지에서는 표시만 하고 편집은 관리자 페이지로 이동 안내
  const handleEditBook = (book: BookRecommendation) => {
    // 관리자 페이지로 이동하라는 안내 표시 또는 관리자 페이지로 리다이렉트
    router.push("/admin/programs")
  }

  const handleDeleteBook = (id: number) => {
    // 관리자 페이지에서만 삭제 가능
    router.push("/admin/programs")
  }

  const handleMultiAddBook = () => {
    // 관리자 페이지로 이동
    router.push("/admin/programs")
  }

  const handleDeleteAllBooks = () => {
    // 관리자 페이지로 이동
    router.push("/admin/programs")
  }

  useEffect(() => {
    const timer = setInterval(nextSlide, 4000)
    return () => clearInterval(timer)
  }, [nextSlide])

  const currentBook = books[currentSlide]

  return (
    <div className="flex flex-col gap-2 bg-[#F5F6F8] pb-20">
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
      <section className="bg-white px-4 py-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-sm font-bold text-foreground">
            <Sparkles size={14} className="text-tangerine" />
            이달의 책 추천
          </h2>
          <div className="flex items-center gap-1">
            {isAdmin && (
              <button
                onClick={() => router.push("/admin/programs")}
                className="mr-2 flex items-center gap-1 rounded-full bg-primary/10 px-2 py-1 text-[10px] font-medium text-primary hover:bg-primary/20"
              >
                <Settings size={10} />
                관리
              </button>
            )}
            <button onClick={prevSlide} className="rounded-full p-1 hover:bg-muted" aria-label="이전">
              <ChevronLeft size={14} className="text-muted-foreground" />
            </button>
            <span className="text-[10px] text-muted-foreground">{currentSlide + 1}/{books.length || 1}</span>
            <button onClick={nextSlide} className="rounded-full p-1 hover:bg-muted" aria-label="다음">
              <ChevronRight size={14} className="text-muted-foreground" />
            </button>
          </div>
        </div>

        <div className="flex gap-3 overflow-x-auto no-scrollbar">
          {books.map((book, i) => (
            <div
              key={book.id}
              onClick={() => !isAdmin && setSelectedBook(book)}
              className={cn(
                "group relative flex flex-shrink-0 flex-col items-center gap-2 transition-all cursor-pointer",
                i === currentSlide ? "opacity-100" : "opacity-60"
              )}
            >
              <div className="relative h-32 w-22 overflow-hidden rounded-lg shadow-sm sm:h-36 sm:w-24 transition-transform group-hover:scale-105">
                <img src={book.cover || "/placeholder.svg"} alt={book.title} className="h-full w-full object-cover" crossOrigin="anonymous" />
                {isAdmin && (
                  <div className="absolute inset-0 flex items-center justify-center gap-1 bg-foreground/50 opacity-0 transition-opacity group-hover:opacity-100">
                    <button
                      onClick={(e) => { e.stopPropagation(); handleEditBook(book); }}
                      className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-primary"
                    >
                      <Pencil size={12} />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDeleteBook(book.id); }}
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
      <section className="bg-white px-4 py-4">
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
            const isApplied = appliedDokmo.some((a) => a.groupId === group.id)

            return (
              <div
                key={group.id}
                onClick={() => setSelectedDokmoGroup(group)}
                className={cn(
                  "relative w-44 flex-shrink-0 overflow-hidden rounded-xl transition-all hover:shadow-sm bg-gradient-to-br cursor-pointer hover:scale-[1.02]",
                  gradientClass
                )}
              >
                {/* 신청완료 배지 */}
                {isApplied && (
                  <div className="absolute left-2 top-2 z-10 flex items-center gap-1 rounded-full bg-white px-2 py-0.5 shadow-sm">
                    <Check size={10} className="text-emerald" />
                    <span className="text-[9px] font-bold text-emerald">신청완료</span>
                  </div>
                )}

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
      <section className="bg-white px-4 py-4">
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
          {discussions.slice(0, 4).map((club) => {
            const isJoined = joinedDoktoClubs.includes(club.id)
            const gradientClass = club.leaderType === "student"
              ? "from-emerald to-emerald/80"
              : club.leaderType === "professor"
                ? "from-sky-500 to-sky-600"
                : "from-tangerine to-orange-500"
            const accentText = club.leaderType === "student" ? "학생" : club.leaderType === "professor" ? "교수" : "작가"

            return (
              <div
                key={club.id}
                onClick={() => setSelectedClub(club.detail)}
                className={cn(
                  "group relative w-56 flex-shrink-0 overflow-hidden rounded-xl transition-all hover:shadow-sm bg-gradient-to-br cursor-pointer hover:scale-[1.02]",
                  gradientClass
                )}
              >
                {/* 신청완료 배지 */}
                {isJoined && (
                  <div className="absolute left-2 top-2 z-10 flex items-center gap-1 rounded-full bg-white px-2 py-0.5 shadow-sm">
                    <Check size={10} className="text-emerald" />
                    <span className="text-[9px] font-bold text-emerald">신청완료</span>
                  </div>
                )}

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
                  <p className="text-[10px] text-white/80">{club.book}</p>
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

                {/* 하단 상태 표시 */}
                <div className="relative border-t border-white/20 px-4 py-2.5">
                  {isJoined ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-white/30 px-2.5 py-1 text-[9px] font-bold text-white backdrop-blur-sm">
                      <Check size={10} />
                      신청완료
                    </span>
                  ) : (
                    <span className="rounded-full bg-white/20 px-2.5 py-1 text-[9px] font-bold text-white backdrop-blur-sm">
                      참여하기
                    </span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Live Talk Talk Feed */}
      <section className="bg-white px-4 py-4">
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
          {talkPosts.slice(0, 3).map((post) => (
            <Link
              key={post.id}
              href="/talk"
              className="block overflow-hidden rounded-xl border border-[#F0F0F0] bg-white transition-all hover:border-[#E8E8E8]"
            >
              {/* Photo area */}
              {post.photos && post.photos.length > 0 && (
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
            </Link>
          ))}
        </div>
      </section>

      <ClubDetailModal
        club={selectedClub}
        isOpen={!!selectedClub}
        onClose={() => setSelectedClub(null)}
        onApply={handleApply}
        applied={selectedClub ? joinedDoktoClubs.includes(selectedClub.id) : false}
      />

      {/* Banner Edit Modal */}
      {editingBanner && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4"
          onClick={() => setEditingBanner(null)}
        >
          <div
            className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-[0_4px_16px_rgba(0,0,0,0.12)]"
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
                  className="w-full h-[44px] px-3 bg-[#F5F6F8] rounded-lg text-sm text-[#1E1E1E] placeholder:text-[#A0A0A0] focus:ring-2 focus:ring-primary/30 focus:bg-white border border-transparent focus:border-primary transition-colors outline-none"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">제목 (쉼표로 색상 변경 부분 구분)</label>
                <input
                  type="text"
                  value={editingBanner.title}
                  onChange={(e) => setEditingBanner({ ...editingBanner, title: e.target.value })}
                  placeholder="예: 함께 읽고, 함께 나누는"
                  className="w-full h-[44px] px-3 bg-[#F5F6F8] rounded-lg text-sm text-[#1E1E1E] placeholder:text-[#A0A0A0] focus:ring-2 focus:ring-primary/30 focus:bg-white border border-transparent focus:border-primary transition-colors outline-none"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">부제목</label>
                <input
                  type="text"
                  value={editingBanner.subtitle}
                  onChange={(e) => setEditingBanner({ ...editingBanner, subtitle: e.target.value })}
                  placeholder="예: 오거서에서 당신의 독서 라이프를 시작하세요"
                  className="w-full h-[44px] px-3 bg-[#F5F6F8] rounded-lg text-sm text-[#1E1E1E] placeholder:text-[#A0A0A0] focus:ring-2 focus:ring-primary/30 focus:bg-white border border-transparent focus:border-primary transition-colors outline-none"
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

      {/* Book Detail Modal */}
      {selectedBook && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4"
          onClick={() => setSelectedBook(null)}
        >
          <div
            className="relative w-full max-w-sm overflow-hidden rounded-2xl bg-white shadow-[0_4px_16px_rgba(0,0,0,0.12)]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 책 표지 */}
            <div className="relative h-48 bg-gradient-to-br from-primary/20 via-emerald/10 to-tangerine/10">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-36 w-24 overflow-hidden rounded-xl shadow-xl ring-1 ring-border">
                  <img
                    src={selectedBook.cover || "/placeholder.svg"}
                    alt={selectedBook.title}
                    className="h-full w-full object-cover"
                    crossOrigin="anonymous"
                  />
                </div>
              </div>
              <button
                onClick={() => setSelectedBook(null)}
                className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-muted-foreground backdrop-blur-sm transition-colors hover:bg-white hover:text-foreground"
              >
                <X size={18} />
              </button>
            </div>

            {/* 책 정보 */}
            <div className="px-6 py-5 text-center">
              <span className={cn("inline-flex rounded-full px-3 py-1 text-[10px] font-bold", selectedBook.color)}>
                {selectedBook.category}
              </span>
              <h3 className="mt-3 text-xl font-bold text-foreground">{selectedBook.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{selectedBook.author}</p>

              <div className="mt-4 rounded-xl bg-muted/50 p-4">
                <p className="text-xs leading-relaxed text-foreground">
                  이 책은 이달의 추천 도서입니다. 독서모임(독모)이나 자유 서평을 통해 함께 읽어보세요!
                </p>
              </div>

              <div className="mt-4 flex gap-2">
                <Link
                  href="/programs/dokmo"
                  className="flex-1 rounded-xl bg-primary py-3 text-sm font-bold text-primary-foreground transition-all hover:brightness-110"
                >
                  독모 신청하기
                </Link>
                <Link
                  href="/reviews/write"
                  className="flex-1 rounded-xl border border-border bg-card py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                >
                  서평 작성
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Dokmo Time Selection Modal */}
      {selectedDokmoGroup && (
        <DokmoTimeSelectModal
          group={selectedDokmoGroup}
          isOpen={!!selectedDokmoGroup}
          onClose={() => setSelectedDokmoGroup(null)}
          onApply={(time, date) => {
            setAppliedDokmo((prev) => [...prev, { groupId: selectedDokmoGroup.id, time, date }])
            setSelectedDokmoGroup(null)
          }}
          appliedInfo={appliedDokmo.find((a) => a.groupId === selectedDokmoGroup.id)}
        />
      )}
    </div>
  )
}

// 독모 시간 선택 모달 컴포넌트
interface DokmoTimeSelectModalProps {
  group: HomeDokmoGroup
  isOpen: boolean
  onClose: () => void
  onApply: (time: string, date: string) => void
  appliedInfo?: { time: string; date: string }
}

function DokmoTimeSelectModal({ group, isOpen, onClose, onApply, appliedInfo }: DokmoTimeSelectModalProps) {
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    // 기본값: 오늘 날짜
    const today = new Date()
    return today.toISOString().split("T")[0]
  })

  // 모달이 열릴 때 초기화
  useEffect(() => {
    if (isOpen) {
      setSelectedTime(appliedInfo?.time || null)
      setSelectedDate(appliedInfo?.date || new Date().toISOString().split("T")[0])
    }
  }, [isOpen, appliedInfo])

  const IconComponent = group.icon
  const gradientClass = group.id === "yeomyeong"
    ? "from-amber-400 to-amber-600"
    : group.id === "yunseul"
      ? "from-sky-400 to-sky-600"
      : "from-indigo-400 to-indigo-600"

  // 이번 주 날짜들 생성
  const getWeekDates = () => {
    const dates = []
    const today = new Date()
    const dayOfWeek = today.getDay()
    const startOfWeek = new Date(today)
    startOfWeek.setDate(today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1)) // 월요일 시작

    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek)
      date.setDate(startOfWeek.getDate() + i)
      dates.push({
        value: date.toISOString().split("T")[0],
        day: ["일", "월", "화", "수", "목", "금", "토"][date.getDay()],
        date: date.getDate(),
        isPast: date < new Date(new Date().setHours(0, 0, 0, 0)),
      })
    }
    return dates
  }

  const weekDates = getWeekDates()

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-foreground/50 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-[0_4px_16px_rgba(0,0,0,0.12)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className={cn("relative overflow-hidden bg-gradient-to-br p-5", gradientClass)}>
          <div className="absolute -right-4 top-1/2 -translate-y-1/2 select-none">
            <span className="text-[60px] font-black text-white/15 leading-none">
              {group.id === "yeomyeong" ? "아침" : group.id === "yunseul" ? "점심" : "저녁"}
            </span>
          </div>
          <div className="relative flex items-center justify-between">
            <div>
              <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur-sm">
                <IconComponent size={12} />
                {group.name}
              </span>
              <h2 className="mt-2 text-lg font-bold text-white">{group.book}</h2>
              <p className="text-xs text-white/80">{group.bookAuthor}</p>
            </div>
            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition-colors hover:bg-white/30"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* 날짜 선택 */}
        <div className="px-5 pt-5">
          <label className="mb-2 flex items-center gap-2 text-sm font-bold text-foreground">
            <Calendar size={14} className="text-primary" />
            날짜 선택
          </label>
          <div className="flex gap-1.5 overflow-x-auto pb-2 no-scrollbar">
            {weekDates.map((d) => (
              <button
                key={d.value}
                onClick={() => !d.isPast && setSelectedDate(d.value)}
                disabled={d.isPast}
                className={cn(
                  "flex min-w-[44px] flex-col items-center rounded-xl py-2 px-1 transition-all",
                  selectedDate === d.value
                    ? "bg-primary text-primary-foreground"
                    : d.isPast
                      ? "bg-muted/50 text-muted-foreground opacity-50"
                      : "bg-muted hover:bg-muted/80"
                )}
              >
                <span className="text-[10px] font-medium">{d.day}</span>
                <span className="text-lg font-bold">{d.date}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 시간 선택 */}
        <div className="px-5 pt-4">
          <label className="mb-2 flex items-center gap-2 text-sm font-bold text-foreground">
            <Clock size={14} className="text-primary" />
            시간 선택
          </label>
          <div className="grid grid-cols-4 gap-2">
            {group.times.map((time) => (
              <button
                key={time}
                onClick={() => setSelectedTime(time)}
                className={cn(
                  "rounded-xl py-3 text-sm font-medium transition-all",
                  selectedTime === time
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted hover:bg-muted/80"
                )}
              >
                {time}
              </button>
            ))}
          </div>
        </div>

        {/* 안내 문구 */}
        <div className="mx-5 mt-4 rounded-xl bg-muted/50 p-3">
          <p className="text-xs leading-relaxed text-muted-foreground">
            {group.description} 시간대 독서모임입니다.
            <br />
            신청 후 해당 시간에 ZOOM 링크가 발송됩니다.
          </p>
        </div>

        {/* 버튼 */}
        <div className="flex gap-3 p-5">
          <button
            onClick={onClose}
            className="flex-1 rounded-xl border border-border bg-card py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted"
          >
            취소
          </button>
          {appliedInfo ? (
            <div className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald/10 py-3 text-sm font-bold text-emerald">
              <Check size={16} />
              신청완료 ({appliedInfo.time})
            </div>
          ) : (
            <button
              onClick={() => selectedTime && onApply(selectedTime, selectedDate)}
              disabled={!selectedTime}
              className="flex-1 rounded-xl bg-primary py-3 text-sm font-bold text-primary-foreground transition-all hover:brightness-110 disabled:opacity-50"
            >
              신청하기
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
