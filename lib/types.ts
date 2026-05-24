export interface Profile {
  firstName: string
  lastName: string
  phoneNumber: string
  avatar: string
  gender: string
  bvn: string
  address: string
  currency: string
}

export interface Guarantor {
  firstName: string
  lastName: string
  phoneNumber: string
  gender: string
  address: string
}

export interface Socials {
  facebook: string
  instagram: string
  twitter: string
}

export interface Education {
  level: string
  employmentStatus: string
  sector: string
  duration: string
  officeEmail: string
  monthlyIncome: [string, string]
  loanRepayment: string
}

export type UserStatus = 'active' | 'inactive' | 'pending' | 'blacklisted'

export interface User {
  id: string
  createdAt: string
  orgName: string
  userName: string
  email: string
  phoneNumber: string
  lastActiveDate: string
  status: UserStatus
  profile: Profile
  guarantor: Guarantor
  accountBalance: string
  accountNumber: string
  socials: Socials
  education: Education
}

export interface DashboardStats {
  totalUsers: number
  activeUsers: number
  usersWithLoans: number
  usersWithSavings: number
}
