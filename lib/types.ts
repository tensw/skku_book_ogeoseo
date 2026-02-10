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

export interface Classic100 {
  id: number
  title: string
  author: string
  publisher: string
  year: number
  category: '문학·예술' | '인문·사회' | '자연과학'
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
