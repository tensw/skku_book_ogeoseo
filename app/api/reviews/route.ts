import { NextRequest, NextResponse } from 'next/server'
import { reviews as initialReviews } from '@/lib/mock-data'
import type { BookReview } from '@/lib/types'

let reviews = [...initialReviews]

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const page = parseInt(searchParams.get('page') || '1')
  const pageSize = parseInt(searchParams.get('pageSize') || '10')
  const search = searchParams.get('search') || ''
  const type = searchParams.get('type') || ''

  let filtered = reviews
  if (type) {
    filtered = filtered.filter(r => r.type === type)
  }
  if (search) {
    filtered = filtered.filter(r =>
      r.book.title.includes(search) ||
      r.book.author.includes(search) ||
      r.text.includes(search) ||
      r.user.name.includes(search)
    )
  }

  const total = filtered.length
  const totalPages = Math.ceil(total / pageSize)
  const data = filtered.slice((page - 1) * pageSize, page * pageSize)

  return NextResponse.json({ data, total, page, pageSize, totalPages })
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const newReview: BookReview = {
    id: Math.max(...reviews.map(r => r.id), 0) + 1,
    ...body,
    likes: 0,
    comments: 0,
    timeAgo: '방금 전',
  }
  reviews.unshift(newReview)
  return NextResponse.json({ success: true, data: newReview }, { status: 201 })
}
