import { NextRequest, NextResponse } from 'next/server'
import { bundoks as initialBundoks } from '@/lib/mock-data'
import type { Bundok } from '@/lib/types'

let bundoks = [...initialBundoks]

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const page = parseInt(searchParams.get('page') || '1')
  const pageSize = parseInt(searchParams.get('pageSize') || '10')

  const total = bundoks.length
  const totalPages = Math.ceil(total / pageSize)
  const data = bundoks.slice((page - 1) * pageSize, page * pageSize)

  return NextResponse.json({ data, total, page, pageSize, totalPages })
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const newBundok: Bundok = {
    id: Math.max(...bundoks.map(b => b.id), 0) + 1,
    ...body,
  }
  bundoks.push(newBundok)
  return NextResponse.json({ success: true, data: newBundok }, { status: 201 })
}
