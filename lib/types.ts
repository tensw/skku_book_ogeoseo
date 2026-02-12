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
  user: { name: string; avatar: string; department?: string }
  book: { title: string; author: string; cover: string }
  rating: number
  text: string
  likes: number
  comments: number
  timeAgo: string
  category?: string
  program?: string
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

export interface Program {
  id: number
  title: string
  description: string
  date: string
  status: 'upcoming' | 'ongoing' | 'completed'
  participants: number
  maxParticipants: number
  category: string
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
