"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, User, LogOut, BookOpen, Settings } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/auth-context"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet"

const menuItems = [
  { href: "/programs", label: "프로그램" },
  { href: "/guide", label: "추천도서" },
  { href: "/reviews", label: "서평" },
  { href: "/talk", label: "톡톡" },
  { href: "/notices", label: "공지사항" },
  { href: "/library", label: "내 서재", requiresAuth: true },
]

export function MobileMenu() {
  const [open, setOpen] = useState(false)
  const { user, isLoggedIn, isAdmin, login, logout } = useAuth()
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
  const [loginId, setLoginId] = useState("")
  const [loginPassword, setLoginPassword] = useState("")
  const [loginError, setLoginError] = useState("")
  const pathname = usePathname()
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
    setIsProfileMenuOpen(false)
    logout()
  }

  // 로그인 여부에 따라 메뉴 필터링
  const filteredMenuItems = menuItems.filter(item => !item.requiresAuth || isLoggedIn)

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-card/95 pt-[env(safe-area-inset-top)] backdrop-blur-xl lg:hidden">
        <div className="flex h-14 items-center justify-between px-4">
          {/* Left: Hamburger + Logo */}
          <div className="flex items-center">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <button
                  className="mr-3 rounded-md p-2 text-muted-foreground hover:text-foreground"
                  aria-label="메뉴 열기"
                >
                  <Menu size={22} />
                </button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 p-0">
                <SheetTitle className="sr-only">메뉴</SheetTitle>
                <div className="border-b border-border px-6 py-5">
                  <Link
                    href="/"
                    onClick={() => setOpen(false)}
                    className="font-serif text-xl font-bold text-primary"
                  >
                    오거서
                  </Link>
                  <p className="mt-1 text-xs text-muted-foreground">독서 토론 플랫폼</p>
                </div>
                <nav className="flex flex-col gap-1 p-4">
                  {filteredMenuItems.map((item) => {
                    const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className={cn(
                          "rounded-lg px-4 py-2.5 text-sm font-medium transition-colors",
                          isActive
                            ? "bg-primary/10 text-primary"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        )}
                      >
                        {item.label}
                      </Link>
                    )
                  })}
                </nav>
              </SheetContent>
            </Sheet>
            <Link href="/" className="font-serif text-lg font-bold text-primary">
              오거서
            </Link>
          </div>

          {/* Right: Login/Profile Button */}
          {isLoggedIn ? (
            <div className="relative" ref={profileMenuRef}>
              <button
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-primary to-primary/70 text-xs font-bold text-primary-foreground ring-2 ring-transparent transition-all hover:ring-primary/30"
              >
                {user?.name?.charAt(0) || "U"}
              </button>

              {/* Profile Dropdown Menu */}
              {isProfileMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-44 overflow-hidden rounded-xl border border-border bg-card shadow-lg">
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
