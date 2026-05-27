import { describe, it, expect } from 'vitest'
import { getUsers, getUserById, getDashboardStats, getStatusDistribution, getRecentUsers } from '@/lib/data'

describe('getUsers', () => {
  it('returns exactly 500 users', () => {
    const users = getUsers()
    expect(users).toHaveLength(500)
  })

  it('each user has required fields', () => {
    const users = getUsers()
    for (const user of users) {
      expect(user.id).toBeDefined()
      expect(user.userName).toBeDefined()
      expect(user.email).toBeDefined()
      expect(user.status).toBeDefined()
      expect(user.profile).toBeDefined()
      expect(user.education).toBeDefined()
      expect(user.socials).toBeDefined()
      expect(user.guarantor).toBeDefined()
    }
  })

  it('users have valid status values', () => {
    const users = getUsers()
    const validStatuses = ['active', 'inactive', 'pending', 'blacklisted']
    for (const user of users) {
      expect(validStatuses).toContain(user.status)
    }
  })
})

describe('getUserById', () => {
  it('returns a user for a valid id', () => {
    const users = getUsers()
    const user = getUserById(users[0].id)
    expect(user).toBeDefined()
    expect(user!.id).toBe(users[0].id)
  })

  it('returns undefined for a non-existent id', () => {
    const user = getUserById('non-existent-id')
    expect(user).toBeUndefined()
  })

  it('all user ids are unique', () => {
    const users = getUsers()
    const ids = users.map(u => u.id)
    expect(new Set(ids).size).toBe(500)
  })
})

describe('getDashboardStats', () => {
  it('totalUsers equals 500', () => {
    const stats = getDashboardStats()
    expect(stats.totalUsers).toBe(500)
  })

  it('activeUsers count is consistent with getUsers filter', () => {
    const users = getUsers()
    const expectedActive = users.filter(u => u.status === 'active').length
    expect(getDashboardStats().activeUsers).toBe(expectedActive)
  })

  it('usersWithLoans is a non-negative number', () => {
    const stats = getDashboardStats()
    expect(stats.usersWithLoans).toBeGreaterThanOrEqual(0)
    expect(stats.usersWithLoans).toBeLessThanOrEqual(500)
  })

  it('usersWithSavings is a non-negative number', () => {
    const stats = getDashboardStats()
    expect(stats.usersWithSavings).toBeGreaterThanOrEqual(0)
    expect(stats.usersWithSavings).toBeLessThanOrEqual(500)
  })

  it('all stats sum consistently', () => {
    const stats = getDashboardStats()
    expect(stats.totalUsers).toBe(
      stats.activeUsers + getStatusDistribution().pending +
      getStatusDistribution().inactive + getStatusDistribution().blacklisted
    )
  })
})

describe('getStatusDistribution', () => {
  it('returns all four status keys', () => {
    const dist = getStatusDistribution()
    expect(dist).toHaveProperty('active')
    expect(dist).toHaveProperty('pending')
    expect(dist).toHaveProperty('inactive')
    expect(dist).toHaveProperty('blacklisted')
  })

  it('distribution counts sum to 500', () => {
    const dist = getStatusDistribution()
    const total = dist.active + dist.pending + dist.inactive + dist.blacklisted
    expect(total).toBe(500)
  })

  it('has at least one user per status', () => {
    const dist = getStatusDistribution()
    expect(dist.active).toBeGreaterThan(0)
    expect(dist.pending).toBeGreaterThan(0)
    expect(dist.inactive).toBeGreaterThan(0)
    expect(dist.blacklisted).toBeGreaterThan(0)
  })
})

describe('getRecentUsers', () => {
  it('returns the requested number of users', () => {
    expect(getRecentUsers(5)).toHaveLength(5)
    expect(getRecentUsers(8)).toHaveLength(8)
    expect(getRecentUsers(500)).toHaveLength(500)
  })

  it('returns users sorted by createdAt descending', () => {
    const recent = getRecentUsers(10)
    for (let i = 1; i < recent.length; i++) {
      expect(new Date(recent[i - 1].createdAt).getTime())
        .toBeGreaterThanOrEqual(new Date(recent[i].createdAt).getTime())
    }
  })

  it('max count does not exceed total users', () => {
    expect(getRecentUsers(1000)).toHaveLength(500)
  })

  it('returns 8 users by default', () => {
    expect(getRecentUsers()).toHaveLength(8)
  })
})
