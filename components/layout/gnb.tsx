"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { X, User, LogOut, Shield } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/auth-context"

const menuItems = [
  { href: "/notices", label: "공지사항" },
  { href: "/reviews", label: "독서리뷰" },
  { href: "/discussions", label: "독토" },
  { href: "/guide", label: "오거서 도서추천" },
  { href: "/talk", label: "톡톡" },
  { href: "/library", label: "내 서재" },
]

export function GNB() {
  const pathname = usePathname()
  const { user, isLoggedIn, isAdmin, login, logout } = useAuth()
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [loginId, setLoginId] = useState("")
  const [loginPassword, setLoginPassword] = useState("")
  const [loginError, setLoginError] = useState("")

  const handleLogin = () => {
    const success = login(loginId, loginPassword)
    if (success) {
      setIsLoginModalOpen(false)
      setLoginId("")
      setLoginPassword("")
      setLoginError("")
    } else {
      setLoginError("아이디 또는 비밀번호가 올바르지 않습니다.")
    }
  }

  const handleLogout = () => {
    logout()
  }

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 hidden border-b border-border bg-card/95 backdrop-blur-xl lg:block">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-8">
          <Link href="/" className="font-serif text-xl font-bold text-primary">
            오거서
          </Link>
          <nav className="flex items-center gap-1">
            {menuItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative px-3 py-2 text-sm font-medium transition-colors",
                    isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full bg-primary" />
                  )}
                </Link>
              )
            })}
          </nav>
          {/* Login/Logout Button */}
          {isLoggedIn ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-sm">
                {isAdmin && <Shield size={14} className="text-amber-500" />}
                <span className="font-medium text-foreground">{user?.name}</span>
                {isAdmin && <span className="text-xs text-amber-500">(관리자)</span>}
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 rounded-full bg-muted px-3 py-1.5 text-sm font-medium text-muted-foreground transition-all hover:bg-border hover:text-foreground"
              >
                <LogOut size={14} />
                로그아웃
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsLoginModalOpen(true)}
              className="flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-all hover:brightness-110"
            >
              <User size={16} />
              로그인
            </button>
          )}
        </div>
      </header>

      {/* Login Modal */}
      {isLoginModalOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-foreground/50 p-4 backdrop-blur-sm"
          onClick={() => setIsLoginModalOpen(false)}
        >
          <div
            className="relative w-full max-w-md overflow-hidden rounded-3xl border border-border bg-card shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-border px-6 py-4">
              <h2 className="text-xl font-bold text-foreground">로그인</h2>
              <button
                onClick={() => setIsLoginModalOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors hover:bg-border hover:text-foreground"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="px-6 py-6">
              {/* Test Account Info */}
              <div className="mb-4 rounded-xl bg-amber-50 p-4 text-xs">
                <p className="mb-2 font-semibold text-amber-800">테스트 계정</p>
                <div className="space-y-1 text-amber-700">
                  <p><span className="font-medium">관리자:</span> admin / admin123</p>
                  <p><span className="font-medium">학생:</span> student / student123</p>
                </div>
              </div>

              {/* Error Message */}
              {loginError && (
                <div className="mb-4 rounded-xl bg-red-50 p-3 text-center text-sm text-red-600">
                  {loginError}
                </div>
              )}

              {/* Form */}
              <div className="flex flex-col gap-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">
                    아이디
                  </label>
                  <input
                    type="text"
                    value={loginId}
                    onChange={(e) => {
                      setLoginId(e.target.value)
                      setLoginError("")
                    }}
                    placeholder="아이디 입력"
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">
                    비밀번호
                  </label>
                  <input
                    type="password"
                    value={loginPassword}
                    onChange={(e) => {
                      setLoginPassword(e.target.value)
                      setLoginError("")
                    }}
                    placeholder="비밀번호 입력"
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="border-t border-border bg-muted/30 px-6 py-4">
              <button
                onClick={handleLogin}
                className="w-full rounded-xl bg-primary py-3 text-sm font-bold text-primary-foreground shadow-md transition-all hover:brightness-110"
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
