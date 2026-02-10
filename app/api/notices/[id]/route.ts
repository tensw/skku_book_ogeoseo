import { NextRequest, NextResponse } from 'next/server'
import { notices as initialNotices } from '@/lib/mock-data'

let notices = [...initialNotices]

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const notice = notices.find(n => n.id === parseInt(id))
  if (!notice) {
    return NextResponse.json({ success: false, error: 'Notice not found' }, { status: 404 })
  }
  notice.views += 1
  return NextResponse.json({ success: true, data: notice })
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const index = notices.findIndex(n => n.id === parseInt(id))
  if (index === -1) {
    return NextResponse.json({ success: false, error: 'Notice not found' }, { status: 404 })
  }
  const body = await request.json()
  notices[index] = { ...notices[index], ...body, id: notices[index].id }
  return NextResponse.json({ success: true, data: notices[index] })
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const index = notices.findIndex(n => n.id === parseInt(id))
  if (index === -1) {
    return NextResponse.json({ success: false, error: 'Notice not found' }, { status: 404 })
  }
  notices.splice(index, 1)
  return NextResponse.json({ success: true })
}
