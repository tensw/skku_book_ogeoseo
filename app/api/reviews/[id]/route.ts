import { NextRequest, NextResponse } from 'next/server'
import { reviews as initialReviews } from '@/lib/mock-data'

let reviews = [...initialReviews]

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const review = reviews.find(r => r.id === parseInt(id))
  if (!review) {
    return NextResponse.json({ success: false, error: 'Review not found' }, { status: 404 })
  }
  return NextResponse.json({ success: true, data: review })
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const index = reviews.findIndex(r => r.id === parseInt(id))
  if (index === -1) {
    return NextResponse.json({ success: false, error: 'Review not found' }, { status: 404 })
  }
  const body = await request.json()
  reviews[index] = { ...reviews[index], ...body, id: reviews[index].id }
  return NextResponse.json({ success: true, data: reviews[index] })
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const index = reviews.findIndex(r => r.id === parseInt(id))
  if (index === -1) {
    return NextResponse.json({ success: false, error: 'Review not found' }, { status: 404 })
  }
  reviews.splice(index, 1)
  return NextResponse.json({ success: true })
}
