"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { User, LogOut, BookOpen, Settings } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { LoginModal } from "@/components/auth/login-modal"

export function MobileMenu() {
  const { user, isLoggedIn, isAdmin, logout } = useAuth()
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
  const profileMenuRef = useRef<HTMLDivElement>(null)

  // 프로필 메뉴 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleLogout = () => {
    setIsProfileMenuOpen(false)
    logout()
  }

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-card/95 pt-[env(safe-area-inset-top)] backdrop-blur-xl lg:hidden">
        <div className="flex h-14 items-center justify-between px-4">
          {/* Left: Logo */}
          <Link href="/" className="text-lg font-bold text-primary">
            오거서
          </Link>

          {/* Right: Login/Profile Button */}
          {isLoggedIn ? (
            <div className="relative" ref={profileMenuRef}>
              <button
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-primary to-primary/70 text-xs font-bold text-primary-foreground ring-2 ring-transparent transition-all hover:ring-primary/30"
                aria-label="프로필 메뉴"
                aria-expanded={isProfileMenuOpen}
                aria-haspopup="true"
              >
                {user?.name?.charAt(0) || "U"}
              </button>

              {/* Profile Dropdown Menu */}
              {isProfileMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-44 overflow-hidden rounded-xl border border-border bg-card shadow-lg" role="menu">
                  <div className="border-b border-border px-4 py-2.5">
                    <p className="text-sm font-medium text-foreground">{user?.name}</p>
                    <p className="text-xs text-muted-foreground">{isAdmin ? "관리자" : "학생"}</p>
                  </div>
                  <div className="p-1.5">
                    <Link
                      href="/profile"
                      onClick={() => setIsProfileMenuOpen(false)}
                      className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    >
                      <Settings size={15} />
                      프로필 수정
                    </Link>
                    <Link
                      href="/library"
                      onClick={() => setIsProfileMenuOpen(false)}
                      className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    >
                      <BookOpen size={15} />
                      내 서재
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-red-500 transition-colors hover:bg-red-50"
                    >
                      <LogOut size={15} />
                      로그아웃
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => setIsLoginModalOpen(true)}
              className="flex items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition-all hover:brightness-110"
            >
              <User size={14} />
              로그인
            </button>
          )}
        </div>
      </div>

      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
    </>
  )
}
