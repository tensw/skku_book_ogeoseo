import React from "react"
import type { Metadata, Viewport } from 'next'
import { Noto_Sans_KR } from 'next/font/google'
import { AuthProvider } from "@/lib/auth-context"
import { ProgramProvider } from "@/lib/program-context"
import { SharedDataProvider } from "@/lib/shared-data-context"

import './globals.css'

const notoSansKR = Noto_Sans_KR({ subsets: ['latin'], variable: '--font-noto-sans-kr', weight: ['300', '400', '500', '700'] })

export const metadata: Metadata = {
  title: '오거서 - 함께 읽고, 함께 나누는 | 독서 토론 플랫폼',
  description: '성균관대학교 독서 토론 플랫폼 - 공지사항, 독서리뷰, 독서토론, 독서가이드',
}

export const viewport: Viewport = {
  /* Brand primary (--brand-mid). Must be a static hex for the <meta> tag. */
  themeColor: '#2A7D6E',
  width: 'device-width',
  initialScale: 1,
  userScalable: true,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko">
      <body className={`${notoSansKR.variable} font-sans antialiased`}>
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
