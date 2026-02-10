import { NextRequest, NextResponse } from 'next/server'
import { programs as initialPrograms } from '@/lib/mock-data'
import type { Program } from '@/lib/types'

let programs = [...initialPrograms]

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const page = parseInt(searchParams.get('page') || '1')
  const pageSize = parseInt(searchParams.get('pageSize') || '10')

  const total = programs.length
  const totalPages = Math.ceil(total / pageSize)
  const data = programs.slice((page - 1) * pageSize, page * pageSize)

  return NextResponse.json({ data, total, page, pageSize, totalPages })
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const newProgram: Program = {
    id: Math.max(...programs.map(p => p.id), 0) + 1,
    ...body,
    participants: 0,
  }
  programs.push(newProgram)
  return NextResponse.json({ success: true, data: newProgram }, { status: 201 })
}
