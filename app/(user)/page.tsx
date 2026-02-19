"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { HomePage } from "@/components/pages/home-page"

export default function Home() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    // 로그인 상태 확인
    const user = localStorage.getItem("ogeoseo_user")
    const nickname = localStorage.getItem("ogeoseo_nickname")
    const onboardingComplete = localStorage.getItem("ogeoseo_onboarding_complete")

    if (!user) {
      // 로그인 안됨 -> 로그인 페이지로
      router.push("/login")
      return
    }

    if (!nickname) {
      // 닉네임 없음 -> 로그인 페이지로 (닉네임 설정)
      router.push("/login")
      return
    }

    if (!onboardingComplete) {
      // 온보딩 미완료 -> 온보딩 페이지로
      router.push("/onboarding")
      return
    }

    // 모두 완료됨 -> 홈페이지 표시
    setIsAuthenticated(true)
    setIsLoading(false)
  }, [router])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-brand via-brand-dark to-brand-light">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-white/20 border-t-white" />
          <p className="text-brand-accent/70">잠시만 기다려주세요...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return <HomePage />
}
