import { NextRequest, NextResponse } from 'next/server'
import { notices as initialNotices } from '@/lib/mock-data'
import type { Notice } from '@/lib/types'

let notices = [...initialNotices]

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const page = parseInt(searchParams.get('page') || '1')
  const pageSize = parseInt(searchParams.get('pageSize') || '10')
  const search = searchParams.get('search') || ''

  let filtered = notices
  if (search) {
    filtered = filtered.filter(n =>
      n.title.includes(search) || n.content.includes(search)
    )
  }

  // Sort: important first, then by date desc
  filtered.sort((a, b) => {
    if (a.important !== b.important) return b.important ? 1 : -1
    return new Date(b.date).getTime() - new Date(a.date).getTime()
  })

  const total = filtered.length
  const totalPages = Math.ceil(total / pageSize)
  const data = filtered.slice((page - 1) * pageSize, page * pageSize)

  return NextResponse.json({ data, total, page, pageSize, totalPages })
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const newNotice: Notice = {
    id: Math.max(...notices.map(n => n.id), 0) + 1,
    ...body,
    date: new Date().toISOString().split('T')[0],
    views: 0,
  }
  notices.unshift(newNotice)
  return NextResponse.json({ success: true, data: newNotice }, { status: 201 })
}
