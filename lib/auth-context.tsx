"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"

export type UserRole = "student" | "admin" | null

interface User {
  id: string
  name: string
  role: UserRole
}

interface AuthContextType {
  user: User | null
  isLoggedIn: boolean
  isAdmin: boolean
  login: (id: string, password: string) => boolean
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// 테스트용 계정
const TEST_ACCOUNTS = {
  // 학생 계정: student / student123
  student: { id: "student", name: "홍길동", role: "student" as UserRole, password: "student123" },
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  // 페이지 로드 시 localStorage에서 로그인 상태 복원
  useEffect(() => {
    const savedUser = localStorage.getItem("ogeoseo_user")
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch {
        localStorage.removeItem("ogeoseo_user")
      }
    }
  }, [])

  const login = (id: string, password: string): boolean => {
    // 학생 계정 확인
    if (id === TEST_ACCOUNTS.student.id && password === TEST_ACCOUNTS.student.password) {
      const userData = { id: TEST_ACCOUNTS.student.id, name: TEST_ACCOUNTS.student.name, role: TEST_ACCOUNTS.student.role }
      setUser(userData)
      localStorage.setItem("ogeoseo_user", JSON.stringify(userData))
      return true
    }
    // 로그인 실패
    return false
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("ogeoseo_user")
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: user !== null,
        isAdmin: user?.role === "admin",
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
