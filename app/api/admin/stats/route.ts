import { NextResponse } from 'next/server'
import { notices, reviews, classics, bundoks } from '@/lib/mock-data'

export async function GET() {
  return NextResponse.json({
    notices: notices.length,
    reviews: reviews.length,
    classics: classics.length,
    bundoks: bundoks.length,
  })
}
