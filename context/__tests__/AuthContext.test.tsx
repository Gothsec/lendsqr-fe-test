import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { AuthProvider, useAuth } from '@/context/AuthContext'
import { act } from 'react'
import type { ReactNode } from 'react'

const mockPush = vi.fn()
const mockReplace = vi.fn()

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: mockReplace,
  }),
}))

const mockUser = {
  email: 'admin@lendsqr.com',
  name: 'Adedeji',
  avatar: 'https://ui-avatars.com/api/?name=Adedeji&background=213F7D&color=fff&size=128',
}

function wrapper({ children }: { children: ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>
}

function renderUseAuth() {
  return renderHook(() => useAuth(), { wrapper })
}

describe('AuthContext', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  it('starts unauthenticated with no stored user', () => {
    const { result } = renderUseAuth()
    expect(result.current.isAuthenticated).toBe(false)
    expect(result.current.user).toBeNull()
  })

  it('restores user from localStorage on mount', async () => {
    localStorage.setItem('auth_user', JSON.stringify(mockUser))
    localStorage.setItem('auth_last_activity', String(Date.now()))
    const { result } = renderUseAuth()
    await waitFor(() => expect(result.current.isAuthenticated).toBe(true))
    expect(result.current.user?.email).toBe('admin@lendsqr.com')
  })

  it('login sets user and persists to localStorage', async () => {
    const { result } = renderUseAuth()
    expect(result.current.isAuthenticated).toBe(false)

    act(() => { result.current.login(mockUser) })

    await waitFor(() => expect(result.current.isAuthenticated).toBe(true))
    expect(result.current.user?.name).toBe('Adedeji')
    expect(localStorage.getItem('auth_user')).toBe(JSON.stringify(mockUser))
    expect(localStorage.getItem('auth_last_activity')).not.toBeNull()
  })

  it('logout clears user and localStorage', async () => {
    const { result } = renderUseAuth()

    act(() => { result.current.login(mockUser) })
    await waitFor(() => expect(result.current.isAuthenticated).toBe(true))

    act(() => { result.current.logout() })

    await waitFor(() => expect(result.current.isAuthenticated).toBe(false))
    expect(result.current.user).toBeNull()
    expect(localStorage.getItem('auth_user')).toBeNull()
    expect(localStorage.getItem('auth_last_activity')).toBeNull()
  })

  it('updateActivity refreshes lastActivity timestamp', async () => {
    const { result } = renderUseAuth()
    act(() => { result.current.login(mockUser) })
    await waitFor(() => expect(result.current.isAuthenticated).toBe(true))

    const before = localStorage.getItem('auth_last_activity')
    act(() => { result.current.updateActivity() })

    await waitFor(() => {
      const after = localStorage.getItem('auth_last_activity')
      expect(Number(after)).toBeGreaterThanOrEqual(Number(before ?? 0))
    })
  })

  it('useAuth throws when used outside AuthProvider', () => {
    expect(() => renderHook(() => useAuth())).toThrow('useAuth must be used within AuthProvider')
  })

  it('handles corrupted localStorage gracefully', async () => {
    localStorage.setItem('auth_user', 'not-valid-json')
    const { result } = renderUseAuth()
    await waitFor(() => expect(result.current.isAuthenticated).toBe(false))
    expect(result.current.user).toBeNull()
    expect(localStorage.getItem('auth_user')).toBeNull()
  })
})
