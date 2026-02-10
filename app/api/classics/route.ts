import { NextRequest, NextResponse } from 'next/server'
import { classics as initialClassics } from '@/lib/mock-data'
import type { Classic100 } from '@/lib/types'

let classics = [...initialClassics]

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const page = parseInt(searchParams.get('page') || '1')
  const pageSize = parseInt(searchParams.get('pageSize') || '10')
  const search = searchParams.get('search') || ''
  const category = searchParams.get('category') || ''
  const year = searchParams.get('year') || ''

  let filtered = classics
  if (category) {
    filtered = filtered.filter(c => c.category === category)
  }
  if (year) {
    filtered = filtered.filter(c => c.year === parseInt(year))
  }
  if (search) {
    filtered = filtered.filter(c =>
      c.title.includes(search) ||
      c.author.includes(search) ||
      c.description.includes(search)
    )
  }

  const total = filtered.length
  const totalPages = Math.ceil(total / pageSize)
  const data = filtered.slice((page - 1) * pageSize, page * pageSize)

  return NextResponse.json({ data, total, page, pageSize, totalPages })
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const newClassic: Classic100 = {
    id: Math.max(...classics.map(c => c.id), 0) + 1,
    ...body,
  }
  classics.push(newClassic)
  return NextResponse.json({ success: true, data: newClassic }, { status: 201 })
}
