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
  X,
  Camera,
  Trash2,
  EyeOff,
  Eye,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/auth-context"
import { useSharedData, type TalkPost } from "@/lib/shared-data-context"

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
  const { isAdmin } = useAuth()
  const { talkPosts, addTalkPost, updateTalkPost, deleteTalkPost } = useSharedData()

  const [newPost, setNewPost] = useState("")
  const [expandedComments, setExpandedComments] = useState<number[]>([])
  const [attachedPhotos, setAttachedPhotos] = useState<string[]>([])
  const [hiddenPosts, setHiddenPosts] = useState<number[]>([])
  const [showHidden, setShowHidden] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null)

  const toggleLike = (postId: number) => {
    const post = talkPosts.find((p) => p.id === postId)
    if (post) {
      updateTalkPost(postId, {
        liked: !post.liked,
        likes: post.liked ? post.likes - 1 : post.likes + 1,
      })
    }
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
    const post: Omit<TalkPost, "id"> = {
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
    addTalkPost(post)
    setNewPost("")
    setAttachedPhotos([])
  }

  const handleToggleHidden = (postId: number) => {
    setHiddenPosts((prev) =>
      prev.includes(postId) ? prev.filter((id) => id !== postId) : [...prev, postId]
    )
  }

  const handleDelete = (postId: number) => {
    setDeleteConfirm(postId)
  }

  const confirmDelete = () => {
    if (deleteConfirm) {
      deleteTalkPost(deleteConfirm)
      setDeleteConfirm(null)
    }
  }

  const visiblePosts = showHidden ? talkPosts : talkPosts.filter((p) => !hiddenPosts.includes(p.id))

  return (
    <div className="flex flex-col pb-6">
      {/* Header */}
      <header className="px-5 pb-3 pt-5 sm:px-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-foreground">Talk Talk</h1>
            <p className="mt-0.5 text-[11px] text-muted-foreground">지금 이 순간의 독서를 공유하세요</p>
          </div>
          {isAdmin && (
            <button
              onClick={() => setShowHidden(!showHidden)}
              className={cn(
                "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
                showHidden
                  ? "bg-amber-100 text-amber-700"
                  : "bg-muted text-muted-foreground hover:bg-border"
              )}
            >
              {showHidden ? <Eye size={12} /> : <EyeOff size={12} />}
              {showHidden ? "숨긴 글 표시 중" : "숨긴 글 보기"}
              {hiddenPosts.length > 0 && (
                <span className="rounded-full bg-amber-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
                  {hiddenPosts.length}
                </span>
              )}
            </button>
          )}
        </div>
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
              aria-label="새 게시물 작성"
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
        {visiblePosts.map((post) => {
          const isHidden = hiddenPosts.includes(post.id)
          return (
          <article key={post.id} className={cn("border-b border-border", isHidden && "opacity-50 bg-amber-50/50")}>
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
                  {isAdmin ? (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleToggleHidden(post.id)}
                        className={cn(
                          "rounded-full p-1 transition-colors",
                          isHidden ? "text-amber-600 hover:text-amber-700" : "text-muted-foreground hover:text-amber-600"
                        )}
                        aria-label={isHidden ? "숨김 해제" : "숨기기"}
                      >
                        {isHidden ? <Eye size={14} /> : <EyeOff size={14} />}
                      </button>
                      <button
                        onClick={() => handleDelete(post.id)}
                        className="rounded-full p-1 text-muted-foreground transition-colors hover:text-red-500"
                        aria-label="게시물 삭제"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ) : (
                    <button className="text-muted-foreground hover:text-foreground" aria-label="더보기">
                      <MoreHorizontal size={14} />
                    </button>
                  )}
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
                      <button className="mt-1 flex items-center gap-1 text-[10px] text-muted-foreground hover:text-tangerine" aria-label={`좋아요 ${reply.likes}개`}>
                        <Heart size={10} />
                        {reply.likes}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </article>
        )})}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-foreground/50 p-4 backdrop-blur-sm"
          onClick={() => setDeleteConfirm(null)}
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="delete-post-title"
          aria-describedby="delete-post-desc"
        >
          <div
            className="w-full max-w-sm overflow-hidden rounded-2xl border border-border bg-card shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-6 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100" aria-hidden="true">
                <Trash2 size={24} className="text-red-500" />
              </div>
              <h3 id="delete-post-title" className="text-lg font-bold text-foreground">게시물 삭제</h3>
              <p id="delete-post-desc" className="mt-2 text-sm text-muted-foreground">
                정말 이 게시물을 삭제하시겠습니까?<br />
                이 작업은 되돌릴 수 없습니다.
              </p>
            </div>
            <div className="flex gap-3 border-t border-border bg-muted/30 px-6 py-4">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 rounded-xl border border-border bg-card py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
              >
                취소
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 rounded-xl bg-red-500 py-2.5 text-sm font-bold text-white transition-all hover:bg-red-600"
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
