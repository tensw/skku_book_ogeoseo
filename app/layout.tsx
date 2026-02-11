import React from "react"
import type { Metadata, Viewport } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import { AuthProvider } from "@/lib/auth-context"
import { ProgramProvider } from "@/lib/program-context"
import { SharedDataProvider } from "@/lib/shared-data-context"

import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' })

export const metadata: Metadata = {
  title: '오거서 - 함께 읽고, 함께 나누는 | 독서 토론 플랫폼',
  description: '성균관대학교 독서 토론 플랫폼 - 공지사항, 독서리뷰, 독서토론, 독서가이드',
}

export const viewport: Viewport = {
  themeColor: '#064E3B',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko">
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased`}>
        <AuthProvider>
          <ProgramProvider>
            <SharedDataProvider>
              {children}
            </SharedDataProvider>
          </ProgramProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
