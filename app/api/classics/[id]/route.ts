import { NextRequest, NextResponse } from 'next/server'
import { classics as initialClassics } from '@/lib/mock-data'

let classics = [...initialClassics]

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const classic = classics.find(c => c.id === parseInt(id))
  if (!classic) {
    return NextResponse.json({ success: false, error: 'Classic not found' }, { status: 404 })
  }
  return NextResponse.json({ success: true, data: classic })
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const index = classics.findIndex(c => c.id === parseInt(id))
  if (index === -1) {
    return NextResponse.json({ success: false, error: 'Classic not found' }, { status: 404 })
  }
  const body = await request.json()
  classics[index] = { ...classics[index], ...body, id: classics[index].id }
  return NextResponse.json({ success: true, data: classics[index] })
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const index = classics.findIndex(c => c.id === parseInt(id))
  if (index === -1) {
    return NextResponse.json({ success: false, error: 'Classic not found' }, { status: 404 })
  }
  classics.splice(index, 1)
  return NextResponse.json({ success: true })
}
