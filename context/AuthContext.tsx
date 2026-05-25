'use client'

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import type { AuthUser } from '@/lib/auth'

const SESSION_TIMEOUT_MS = 30 * 60 * 1000
const CHECK_INTERVAL_MS = 30 * 1000

interface AuthContextValue {
  user: AuthUser | null
  isAuthenticated: boolean
  login: (user: AuthUser) => void
  logout: () => void
  updateActivity: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

function readAuthUser(): AuthUser | null {
  if (typeof window === 'undefined') return null
  try {
    const stored = localStorage.getItem('auth_user')
    return stored ? JSON.parse(stored) : null
  } catch {
    localStorage.removeItem('auth_user')
    return null
  }
}

function readLastActivity(): number {
  if (typeof window === 'undefined') return Date.now()
  const stored = localStorage.getItem('auth_last_activity')
  return stored ? Number(stored) : Date.now()
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(readAuthUser)
  const [lastActivity, setLastActivity] = useState<number>(readLastActivity)
  const router = useRouter()

  useEffect(() => {
    function handleActivity() {
      const now = Date.now()
      setLastActivity(now)
      localStorage.setItem('auth_last_activity', String(now))
    }

    window.addEventListener('mousedown', handleActivity)
    window.addEventListener('keydown', handleActivity)
    window.addEventListener('touchstart', handleActivity)

    return () => {
      window.removeEventListener('mousedown', handleActivity)
      window.removeEventListener('keydown', handleActivity)
      window.removeEventListener('touchstart', handleActivity)
    }
  }, [])

  useEffect(() => {
    if (!user) return

    const interval = setInterval(() => {
      const now = Date.now()
      if (now - lastActivity > SESSION_TIMEOUT_MS) {
        logout()
        router.push('/login')
      }
    }, CHECK_INTERVAL_MS)

    return () => clearInterval(interval)
  }, [user, lastActivity, router])

  const login = useCallback((authUser: AuthUser) => {
    setUser(authUser)
    const now = Date.now()
    setLastActivity(now)
    localStorage.setItem('auth_user', JSON.stringify(authUser))
    localStorage.setItem('auth_last_activity', String(now))
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    localStorage.removeItem('auth_user')
    localStorage.removeItem('auth_last_activity')
  }, [])

  const updateActivity = useCallback(() => {
    const now = Date.now()
    setLastActivity(now)
    localStorage.setItem('auth_last_activity', String(now))
  }, [])

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, updateActivity }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return ctx
}
