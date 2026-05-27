import { describe, it, expect } from 'vitest'
import { mockLogin } from '@/lib/auth'

describe('mockLogin', () => {
  it('returns success with user for correct credentials', () => {
    const result = mockLogin('admin@lendsqr.com', 'password123')
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.user.email).toBe('admin@lendsqr.com')
      expect(result.user.name).toBe('Adedeji')
    }
  })

  it('returns success for email with different case', () => {
    const result = mockLogin('ADMIN@lendsqr.com', 'password123')
    expect(result.success).toBe(true)
  })

  it('returns error for empty email', () => {
    const result = mockLogin('', 'password123')
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error).toBe('Email is required')
    }
  })

  it('returns error for empty password', () => {
    const result = mockLogin('admin@lendsqr.com', '')
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error).toBe('Password is required')
    }
  })

  it('returns error for wrong email', () => {
    const result = mockLogin('wrong@email.com', 'password123')
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error).toBe('Invalid email or password')
    }
  })

  it('returns error for wrong password', () => {
    const result = mockLogin('admin@lendsqr.com', 'wrongpassword')
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error).toBe('Invalid email or password')
    }
  })

  it('returns error for whitespace-only email', () => {
    const result = mockLogin('   ', 'password123')
    expect(result.success).toBe(false)
  })

  it('returns error when both fields are empty', () => {
    const result = mockLogin('', '')
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error).toBe('Email is required')
    }
  })
})
