"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { BookOpen, Eye, EyeOff, Check, X, Loader2, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

type LoginStep = "login" | "nickname"

export default function LoginPage() {
  const router = useRouter()
  const [step, setStep] = useState<LoginStep>("login")

  // Login state
  const [loginId, setLoginId] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loginError, setLoginError] = useState("")
  const [isLoggingIn, setIsLoggingIn] = useState(false)

  // Nickname state
  const [nickname, setNickname] = useState("")
  const [nicknameError, setNicknameError] = useState("")
  const [isCheckingNickname, setIsCheckingNickname] = useState(false)
  const [isNicknameAvailable, setIsNicknameAvailable] = useState<boolean | null>(null)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError("")
    setIsLoggingIn(true)

    // 로그인 시뮬레이션
    await new Promise(resolve => setTimeout(resolve, 800))

    // 간단한 검증 (테스트용)
    if (loginId.trim() && password.trim()) {
      // 로그인 성공 - 닉네임 설정 단계로
      localStorage.setItem("ogeoseo_user", JSON.stringify({
        id: loginId,
        name: loginId,
        role: "student"
      }))
      setStep("nickname")
    } else {
      setLoginError("아이디와 비밀번호를 입력해주세요.")
    }
    setIsLoggingIn(false)
  }

  const checkNickname = async () => {
    if (!nickname.trim() || nickname.length < 2) {
      setNicknameError("닉네임은 2글자 이상이어야 해요.")
      return
    }

    setIsCheckingNickname(true)
    setNicknameError("")
    setIsNicknameAvailable(null)

    // 중복 확인 시뮬레이션
    await new Promise(resolve => setTimeout(resolve, 600))

    // 테스트: "독서냠냠"은 이미 사용중으로 처리
    if (nickname === "독서냠냠") {
      setIsNicknameAvailable(false)
      setNicknameError("이미 사용 중인 닉네임이에요.")
    } else {
      setIsNicknameAvailable(true)
    }
    setIsCheckingNickname(false)
  }

  const handleNicknameSubmit = () => {
    if (!isNicknameAvailable) {
      setNicknameError("닉네임 중복 확인을 해주세요.")
      return
    }

    // 닉네임 저장
    localStorage.setItem("ogeoseo_nickname", nickname)

    // 온보딩 페이지로 이동
    router.push("/onboarding")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#064E3B] via-[#065F46] to-[#047857]">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-emerald-400/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-teal-400/10 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-300/5 blur-3xl" />
      </div>

      <div className="relative flex min-h-screen flex-col items-center justify-center px-6 py-12">
        {/* Logo */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm">
            <BookOpen size={40} className="text-emerald-300" />
          </div>
          <h1 className="font-serif text-3xl font-bold text-white">오거서</h1>
          <p className="mt-2 text-emerald-200/70">성균관대학교 독서 플랫폼</p>
        </div>

        {/* Login Card */}
        <div className="w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl">
          {step === "login" ? (
            <>
              {/* Login Header */}
              <div className="border-b border-white/10 px-8 py-6 text-center">
                <h2 className="text-xl font-bold text-white">로그인</h2>
                <p className="mt-1 text-sm text-emerald-200/70">오거서에 오신 것을 환영합니다</p>
              </div>

              {/* Login Form */}
              <form onSubmit={handleLogin} className="px-8 py-6">
                {/* Error Message */}
                {loginError && (
                  <div className="mb-4 rounded-xl bg-red-500/20 p-3 text-center text-sm text-red-200">
                    {loginError}
                  </div>
                )}

                <div className="space-y-4">
                  {/* ID Input */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-white">
                      아이디
                    </label>
                    <input
                      type="text"
                      value={loginId}
                      onChange={(e) => setLoginId(e.target.value)}
                      placeholder="아이디를 입력하세요"
                      className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder:text-white/40 outline-none transition-all focus:border-emerald-400 focus:bg-white/15"
                    />
                  </div>

                  {/* Password Input */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-white">
                      비밀번호
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="비밀번호를 입력하세요"
                        className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 pr-12 text-white placeholder:text-white/40 outline-none transition-all focus:border-emerald-400 focus:bg-white/15"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white"
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Login Button */}
                <button
                  type="submit"
                  disabled={isLoggingIn}
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-white py-3.5 font-bold text-[#064E3B] transition-all hover:bg-emerald-100 disabled:opacity-50"
                >
                  {isLoggingIn ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      로그인 중...
                    </>
                  ) : (
                    "로그인"
                  )}
                </button>

                {/* Test Account Info */}
                <div className="mt-6 rounded-xl bg-amber-500/20 p-4 text-center">
                  <p className="text-xs font-semibold text-amber-200">테스트 안내</p>
                  <p className="mt-1 text-xs text-amber-100/70">
                    아무 아이디/비밀번호를 입력하세요
                  </p>
                </div>
              </form>
            </>
          ) : (
            <>
              {/* Nickname Header */}
              <div className="border-b border-white/10 px-8 py-6 text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20">
                  <Sparkles size={24} className="text-emerald-300" />
                </div>
                <h2 className="text-xl font-bold text-white">첫 로그인이시네요!</h2>
                <p className="mt-1 text-sm text-emerald-200/70">닉네임을 설정해보세요</p>
              </div>

              {/* Nickname Form */}
              <div className="px-8 py-6">
                <div className="space-y-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-white">
                      닉네임
                    </label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <input
                          type="text"
                          value={nickname}
                          onChange={(e) => {
                            setNickname(e.target.value)
                            setIsNicknameAvailable(null)
                            setNicknameError("")
                          }}
                          placeholder="예시: 독서냠냠"
                          className={cn(
                            "w-full rounded-xl border bg-white/10 px-4 py-3 text-white placeholder:text-white/40 outline-none transition-all focus:bg-white/15",
                            isNicknameAvailable === true
                              ? "border-emerald-400"
                              : isNicknameAvailable === false
                              ? "border-red-400"
                              : "border-white/20 focus:border-emerald-400"
                          )}
                        />
                        {isNicknameAvailable !== null && (
                          <div className="absolute right-3 top-1/2 -translate-y-1/2">
                            {isNicknameAvailable ? (
                              <Check size={20} className="text-emerald-400" />
                            ) : (
                              <X size={20} className="text-red-400" />
                            )}
                          </div>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={checkNickname}
                        disabled={isCheckingNickname || !nickname.trim()}
                        className="flex items-center gap-2 rounded-xl bg-white/20 px-4 py-3 text-sm font-medium text-white transition-all hover:bg-white/30 disabled:opacity-50"
                      >
                        {isCheckingNickname ? (
                          <Loader2 size={16} className="animate-spin" />
                        ) : (
                          "중복확인"
                        )}
                      </button>
                    </div>

                    {/* Error/Success Message */}
                    {nicknameError && (
                      <p className="mt-2 text-sm text-red-300">{nicknameError}</p>
                    )}
                    {isNicknameAvailable && (
                      <p className="mt-2 text-sm text-emerald-300">
                        사용 가능한 닉네임이에요! ✨
                      </p>
                    )}
                  </div>

                  {/* Nickname Guidelines */}
                  <div className="rounded-xl bg-white/5 p-4">
                    <p className="text-xs font-semibold text-white/70">닉네임 규칙</p>
                    <ul className="mt-2 space-y-1 text-xs text-white/50">
                      <li>• 2~10자 이내</li>
                      <li>• 한글, 영문, 숫자 사용 가능</li>
                      <li>• 특수문자 사용 불가</li>
                    </ul>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  onClick={handleNicknameSubmit}
                  disabled={!isNicknameAvailable}
                  className={cn(
                    "mt-6 flex w-full items-center justify-center gap-2 rounded-xl py-3.5 font-bold transition-all",
                    isNicknameAvailable
                      ? "bg-gradient-to-r from-emerald-400 to-teal-400 text-white shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50"
                      : "cursor-not-allowed bg-white/20 text-white/50"
                  )}
                >
                  <Sparkles size={18} />
                  시작하기
                </button>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <p className="mt-8 text-center text-xs text-emerald-200/50">
          © 2026 오거서. 성균관대학교 독서 플랫폼
        </p>
      </div>
    </div>
  )
}
