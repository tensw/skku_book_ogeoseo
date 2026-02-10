"use client"

import { useState, useRef } from "react"
import {
  Heart,
  MessageCircle,
  Share2,
  MoreHorizontal,
  Send,
  BookOpen,
  GraduationCap,
  ImageIcon,
  ChevronLeft,
  ChevronRight,
  X,
  Camera,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface Post {
  id: number
  author: string
  authorType: "student" | "professor"
  avatar: string
  time: string
  content: string
  bookMention?: string
  photos?: string[]
  likes: number
  comments: number
  shares: number
  liked: boolean
  replies?: Reply[]
}

interface Reply {
  id: number
  author: string
  avatar: string
  content: string
  time: string
  likes: number
}

const initialPosts: Post[] = [
  {
    id: 1,
    author: "윤하나",
    authorType: "student",
    avatar: "https://picsum.photos/seed/avatar3/80/80",
    time: "30분 전",
    content: "오늘 독서 모임에서 채식주의자 토론 완료! 한강 작가의 상징성에 대해 정말 깊은 이야기를 나눴어요. 다음 주제는 소년이 온다!",
    bookMention: "채식주의자",
    photos: ["https://picsum.photos/seed/post-discussion/800/600", "https://picsum.photos/seed/post-bookclub/800/600"],
    likes: 56,
    comments: 12,
    shares: 7,
    liked: false,
    replies: [
      { id: 101, author: "이민준", avatar: "https://picsum.photos/seed/reply1/80/80", content: "정말 재미있었어요! 다음 모임도 기대됩니다.", time: "20분 전", likes: 5 },
    ],
  },
  {
    id: 2,
    author: "김소은",
    authorType: "student",
    avatar: "https://picsum.photos/seed/avatar5/80/80",
    time: "2시간 전",
    content: "아침 독서 루틴 3주차 인증! 습관의 힘 읽으면서 진짜 시스템이 바뀌고 있다는 걸 느껴요. 매일 30분씩 읽기 챌린지 같이 하실 분?",
    bookMention: "아주 작은 습관의 힘",
    photos: ["https://picsum.photos/seed/post-reading/800/600"],
    likes: 89,
    comments: 23,
    shares: 15,
    liked: true,
    replies: [
      { id: 201, author: "최동우", avatar: "https://picsum.photos/seed/reply2/80/80", content: "저도 참여하고 싶어요! 어떻게 시작하면 될까요?", time: "1시간 전", likes: 12 },
      { id: 202, author: "박서연", avatar: "https://picsum.photos/seed/reply3/80/80", content: "저도 2주째 하고 있는데 확실히 달라지더라고요!", time: "40분 전", likes: 8 },
    ],
  },
  {
    id: 3,
    author: "김지혜 교수",
    authorType: "professor",
    avatar: "https://picsum.photos/seed/avatar1/80/80",
    time: "4시간 전",
    content: "생각의 오류를 넘어서 다시 읽었습니다. 읽을 때마다 새로운 인지 편향을 발견하게 되네요. 매몰비용 오류를 다룬 12장은 학문적 의사결정에 특히 시사하는 바가 큽니다.",
    bookMention: "생각의 오류를 넘어서",
    likes: 42,
    comments: 8,
    shares: 3,
    liked: false,
  },
  {
    id: 4,
    author: "박민준",
    authorType: "student",
    avatar: "https://picsum.photos/seed/avatar2/80/80",
    time: "6시간 전",
    content: "카페에서 사피엔스 읽는 중. 비 오는 일요일 오후에 커피 한 잔과 함께하는 독서가 최고네요. 이 분위기 그대로 가져가고 싶다.",
    photos: ["https://picsum.photos/seed/post-bookclub/800/600", "https://picsum.photos/seed/post-reading/800/600", "https://picsum.photos/seed/post-discussion/800/600"],
    likes: 128,
    comments: 34,
    shares: 11,
    liked: false,
  },
  {
    id: 5,
    author: "최동우",
    authorType: "student",
    avatar: "https://picsum.photos/seed/avatar4/80/80",
    time: "8시간 전",
    content: "AI와 미래 사회 독토 공지! 이번 월요일 오후 8시, 라이프 3.0의 5~7장을 다룹니다. 토론 질문 최소 1개 준비해 주세요.",
    bookMention: "라이프 3.0",
    likes: 33,
    comments: 6,
    shares: 11,
    liked: true,
  },
]

function PhotoCarousel({ photos, postId }: { photos: string[]; postId: number }) {
  const [current, setCurrent] = useState(0)
  const scrollRef = useRef<HTMLDivElement>(null)

  const scrollTo = (index: number) => {
    setCurrent(index)
    scrollRef.current?.children[index]?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" })
  }

  const handleScroll = () => {
    if (!scrollRef.current) return
    const { scrollLeft, clientWidth } = scrollRef.current
    const newIndex = Math.round(scrollLeft / clientWidth)
    setCurrent(newIndex)
  }

  if (photos.length === 1) {
    return (
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        <img src={photos[0] || "/placeholder.svg"} alt="게시물 사진" className="h-full w-full object-cover" />
      </div>
    )
  }

  return (
    <div className="relative">
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex snap-x snap-mandatory overflow-x-auto no-scrollbar"
      >
        {photos.map((photo, i) => (
          <div key={`${postId}-photo-${i}`} className="aspect-[4/3] w-full flex-shrink-0 snap-center">
            <img src={photo || "/placeholder.svg"} alt={`사진 ${i + 1}`} className="h-full w-full object-cover" />
          </div>
        ))}
      </div>
      {/* Dots */}
      <div className="absolute bottom-2.5 left-1/2 flex -translate-x-1/2 gap-1">
        {photos.map((_, i) => (
          <button
            key={`dot-${postId}-${i}`}
            onClick={() => scrollTo(i)}
            className={cn(
              "h-1.5 rounded-full transition-all",
              i === current ? "w-4 bg-white" : "w-1.5 bg-white/50"
            )}
            aria-label={`${i + 1}번 사진으로 이동`}
          />
        ))}
      </div>
      {/* Counter */}
      <div className="absolute right-2.5 top-2.5 rounded-full bg-foreground/50 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm">
        {current + 1}/{photos.length}
      </div>
    </div>
  )
}

export function TalkPage() {
  const [posts, setPosts] = useState(initialPosts)
  const [newPost, setNewPost] = useState("")
  const [expandedComments, setExpandedComments] = useState<number[]>([])
  const [attachedPhotos, setAttachedPhotos] = useState<string[]>([])

  const toggleLike = (postId: number) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 }
          : p
      )
    )
  }

  const toggleComments = (postId: number) => {
    setExpandedComments((prev) =>
      prev.includes(postId) ? prev.filter((id) => id !== postId) : [...prev, postId]
    )
  }

  const addDemoPhoto = () => {
    const demoPhotos = ["https://picsum.photos/seed/post-bookclub/800/600", "https://picsum.photos/seed/post-reading/800/600", "https://picsum.photos/seed/post-discussion/800/600"]
    if (attachedPhotos.length < 5) {
      setAttachedPhotos((prev) => [...prev, demoPhotos[prev.length % demoPhotos.length]])
    }
  }

  const removePhoto = (index: number) => {
    setAttachedPhotos((prev) => prev.filter((_, i) => i !== index))
  }

  const handlePost = () => {
    if (!newPost.trim() && attachedPhotos.length === 0) return
    const post: Post = {
      id: Date.now(),
      author: "나",
      authorType: "student",
      avatar: "https://picsum.photos/seed/me/80/80",
      time: "방금 전",
      content: newPost,
      photos: attachedPhotos.length > 0 ? [...attachedPhotos] : undefined,
      likes: 0,
      comments: 0,
      shares: 0,
      liked: false,
    }
    setPosts([post, ...posts])
    setNewPost("")
    setAttachedPhotos([])
  }

  return (
    <div className="flex flex-col pb-6">
      {/* Header */}
      <header className="px-5 pb-3 pt-5 sm:px-8">
        <h1 className="text-xl font-bold text-foreground">Talk Talk</h1>
        <p className="mt-0.5 text-[11px] text-muted-foreground">지금 이 순간의 독서를 공유하세요</p>
      </header>

      {/* Compose - Threads style */}
      <div className="border-b border-border px-5 pb-4 sm:px-8">
        <div className="flex gap-3">
          <div className="flex flex-col items-center gap-2">
            <div className="h-9 w-9 overflow-hidden rounded-full ring-2 ring-mint/30">
              <img src="https://picsum.photos/seed/me/80/80" alt="내 프로필" className="h-full w-full object-cover" crossOrigin="anonymous" />
            </div>
            <div className="h-full w-px bg-border" />
          </div>
          <div className="flex flex-1 flex-col gap-2.5 pb-1">
            <textarea
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              placeholder="지금 무엇을 읽고 계신가요?"
              className="min-h-[48px] w-full resize-none bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
              rows={2}
            />

            {/* Attached photos preview */}
            {attachedPhotos.length > 0 && (
              <div className="flex gap-2 overflow-x-auto no-scrollbar">
                {attachedPhotos.map((photo, i) => (
                  <div key={`attach-${i}`} className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl">
                    <img src={photo || "/placeholder.svg"} alt={`첨부 ${i + 1}`} className="h-full w-full object-cover" />
                    <button
                      onClick={() => removePhoto(i)}
                      className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-foreground/60 text-white"
                      aria-label="사진 삭제"
                    >
                      <X size={10} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-center gap-3">
              <button
                onClick={addDemoPhoto}
                className="flex items-center gap-1 rounded-full bg-tangerine/10 px-2.5 py-1 text-[10px] font-medium text-tangerine transition-colors hover:bg-tangerine/20"
              >
                <Camera size={12} />
                사진
              </button>
              <button className="flex items-center gap-1 rounded-full bg-mint/10 px-2.5 py-1 text-[10px] font-medium text-mint transition-colors hover:bg-mint/20">
                <BookOpen size={12} />
                도서
              </button>
              <button
                onClick={handlePost}
                disabled={!newPost.trim() && attachedPhotos.length === 0}
                className={cn(
                  "ml-auto flex items-center gap-1 rounded-full px-4 py-1.5 text-xs font-semibold transition-all",
                  newPost.trim() || attachedPhotos.length > 0
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "cursor-not-allowed bg-muted text-muted-foreground"
                )}
              >
                <Send size={12} />
                게시
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Feed - Threads style */}
      <div className="flex flex-col">
        {posts.map((post) => (
          <article key={post.id} className="border-b border-border">
            <div className="flex gap-3 px-5 pt-4 sm:px-8">
              {/* Left thread line */}
              <div className="flex flex-col items-center">
                <div className="h-9 w-9 flex-shrink-0 overflow-hidden rounded-full ring-2 ring-border">
                  <img src={post.avatar || "/placeholder.svg"} alt={post.author} className="h-full w-full object-cover" crossOrigin="anonymous" />
                </div>
                {(post.replies && post.replies.length > 0 && expandedComments.includes(post.id)) && (
                  <div className="mt-2 h-full w-px bg-border" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 pb-1">
                <div className="flex items-center gap-2">
                  <span className="text-[13px] font-bold text-foreground">{post.author}</span>
                  {post.authorType === "professor" && (
                    <span className="inline-flex items-center gap-0.5 rounded-full bg-primary/10 px-1.5 py-0.5 text-[9px] font-semibold text-primary">
                      <GraduationCap size={8} />
                      교수
                    </span>
                  )}
                  <span className="ml-auto text-[10px] text-muted-foreground">{post.time}</span>
                  <button className="text-muted-foreground hover:text-foreground" aria-label="더보기">
                    <MoreHorizontal size={14} />
                  </button>
                </div>

                <p className="mt-1.5 text-[13px] leading-relaxed text-foreground">{post.content}</p>

                {post.bookMention && (
                  <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-emerald/8 px-2.5 py-1 ring-1 ring-emerald/15">
                    <BookOpen size={10} className="text-emerald" />
                    <span className="text-[10px] font-semibold text-emerald">{post.bookMention}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Photos - full width, outside the thread layout */}
            {post.photos && post.photos.length > 0 && (
              <div className="mt-2 ml-16 mr-5 overflow-hidden rounded-2xl ring-1 ring-border sm:mr-8 sm:ml-[4.5rem]">
                <PhotoCarousel photos={post.photos} postId={post.id} />
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-5 px-5 py-3 pl-16 sm:px-8 sm:pl-[4.5rem]">
              <button
                onClick={() => toggleLike(post.id)}
                className="flex items-center gap-1.5 transition-colors"
                aria-label={post.liked ? "좋아요 취소" : "좋아요"}
              >
                <Heart
                  size={18}
                  className={cn(
                    "transition-all",
                    post.liked ? "scale-110 fill-tangerine text-tangerine" : "text-muted-foreground hover:text-foreground"
                  )}
                />
                <span className={cn("text-xs", post.liked ? "font-semibold text-tangerine" : "text-muted-foreground")}>
                  {post.likes}
                </span>
              </button>

              <button
                onClick={() => toggleComments(post.id)}
                className="flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-foreground"
                aria-label="댓글"
              >
                <MessageCircle size={18} />
                <span className="text-xs">{post.comments}</span>
              </button>

              <button className="flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-foreground" aria-label="공유">
                <Share2 size={18} />
                <span className="text-xs">{post.shares}</span>
              </button>
            </div>

            {/* Replies - Threads style */}
            {expandedComments.includes(post.id) && post.replies && post.replies.length > 0 && (
              <div className="px-5 pb-3 sm:px-8">
                {post.replies.map((reply, ri) => (
                  <div key={reply.id} className="flex gap-3 pl-8">
                    <div className="flex flex-col items-center">
                      <div className="h-6 w-6 flex-shrink-0 overflow-hidden rounded-full ring-1 ring-border">
                        <img src={reply.avatar || "/placeholder.svg"} alt={reply.author} className="h-full w-full object-cover" crossOrigin="anonymous" />
                      </div>
                      {ri < (post.replies?.length ?? 0) - 1 && <div className="mt-1 h-full w-px bg-border" />}
                    </div>
                    <div className="flex-1 pb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-foreground">{reply.author}</span>
                        <span className="text-[10px] text-muted-foreground">{reply.time}</span>
                      </div>
                      <p className="mt-0.5 text-xs leading-relaxed text-foreground">{reply.content}</p>
                      <button className="mt-1 flex items-center gap-1 text-[10px] text-muted-foreground hover:text-tangerine">
                        <Heart size={10} />
                        {reply.likes}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </article>
        ))}
      </div>
    </div>
  )
}
