"use client"

import { useState } from "react"
import { X } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
}

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const { login } = useAuth()
  const [loginId, setLoginId] = useState("")
  const [loginPassword, setLoginPassword] = useState("")
  const [loginError, setLoginError] = useState("")

  if (!isOpen) return null

  const handleLogin = () => {
    const success = login(loginId, loginPassword)
    if (success) {
      onClose()
      setLoginId("")
      setLoginPassword("")
      setLoginError("")
    } else {
      setLoginError("아이디 또는 비밀번호가 올바르지 않습니다.")
    }
  }

  const handleClose = () => {
    setLoginId("")
    setLoginPassword("")
    setLoginError("")
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-foreground/50 p-4 backdrop-blur-sm"
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="login-modal-title"
    >
      <div
        className="relative w-full max-w-md overflow-hidden rounded-3xl border border-border bg-card shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h2 id="login-modal-title" className="text-xl font-bold text-foreground">로그인</h2>
          <button
            onClick={handleClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors hover:bg-border hover:text-foreground"
            aria-label="닫기"
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
              <p><span className="font-medium">학생:</span> student / student123</p>
            </div>
          </div>

          {/* Error Message */}
          <div aria-live="polite" aria-atomic="true">
            {loginError && (
              <div className="mb-4 rounded-xl bg-red-50 p-3 text-center text-sm text-red-600" role="alert">
                {loginError}
              </div>
            )}
          </div>

          {/* Form */}
          <div className="flex flex-col gap-4">
            <div>
              <label htmlFor="login-id" className="mb-1.5 block text-sm font-medium text-foreground">
                아이디
              </label>
              <input
                id="login-id"
                type="text"
                value={loginId}
                onChange={(e) => {
                  setLoginId(e.target.value)
                  setLoginError("")
                }}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                placeholder="아이디 입력"
                autoComplete="username"
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div>
              <label htmlFor="login-password" className="mb-1.5 block text-sm font-medium text-foreground">
                비밀번호
              </label>
              <input
                id="login-password"
                type="password"
                value={loginPassword}
                onChange={(e) => {
                  setLoginPassword(e.target.value)
                  setLoginError("")
                }}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                placeholder="비밀번호 입력"
                autoComplete="current-password"
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
  )
}
