import rawUsers from '@/data/users.json'
import type { User } from '@/lib/types'

const users: User[] = rawUsers.map((u: Record<string, unknown>) => ({
  ...u,
  id: String(u.id),
})) as User[]

export function getUsers(): User[] {
  return users
}

export function getUserById(id: string): User | undefined {
  return users.find(u => u.id === id)
}

export function getDashboardStats() {
  const total = users.length
  const active = users.filter(u => u.status === 'active').length
  const withLoans = users.filter(u => {
    const repayment = u.education.loanRepayment.replace(/[₦,]/g, '')
    return Number(repayment) > 0
  }).length
  const withSavings = users.filter(u => {
    const balance = u.accountBalance.replace(/[₦,]/g, '')
    return Number(balance) > 500000
  }).length

  return { totalUsers: total, activeUsers: active, usersWithLoans: withLoans, usersWithSavings: withSavings }
}

export function getStatusDistribution() {
  return {
    active: users.filter(u => u.status === 'active').length,
    pending: users.filter(u => u.status === 'pending').length,
    inactive: users.filter(u => u.status === 'inactive').length,
    blacklisted: users.filter(u => u.status === 'blacklisted').length,
  }
}

export function getRecentUsers(count: number = 8): User[] {
  return [...users]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, count)
}
