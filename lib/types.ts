export interface Notice {
  id: number
  title: string
  content: string
  date: string
  views: number
  author: string
  attachments: string[]
  important: boolean
}

export interface BookReview {
  id: number
  type: 'program' | 'ogeoseo'
  user: { name: string; avatar: string; department?: string; studentId?: string }
  book: { title: string; author: string; cover: string }
  rating: number
  text: string
  likes: number
  comments: number
  timeAgo: string
  category?: string
  program?: string
  programId?: string
}

export type BookCategory = '총류' | '철학' | '종교' | '사회과학' | '기술과학' | '예술' | '언어' | '문학' | '역사'

export interface Classic100 {
  id: number
  title: string
  author: string
  publisher: string
  year: number
  category: BookCategory | string
  description: string
  cover: string
  isbn?: string
}

export interface Bundok {
  id: number
  title: string
  book: string
  bookAuthor: string
  bookCover: string
  host: string
  hostNickname: string
  hostAvatar: string
  format: "offline" | "online" | "hybrid"
  location: string
  date: string
  time: string
  duration: number
  currentMembers: number
  maxMembers: number
  tags: string[]
  status: "recruiting" | "confirmed" | "completed"
  members?: { nickname: string; realName: string }[]
  aiBooks?: string[]
  discussionQuestions?: string[]
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}
