export interface AuthUser {
  email: string
  name: string
  avatar: string
}

export const MOCK_CREDENTIALS = {
  email: 'admin@lendsqr.com',
  password: 'password123',
}

const MOCK_USER: AuthUser = {
  email: 'admin@lendsqr.com',
  name: 'Adedeji',
  avatar: 'https://ui-avatars.com/api/?name=Adedeji&background=213F7D&color=fff&size=128',
}

export function mockLogin(email: string, password: string): { success: true; user: AuthUser } | { success: false; error: string } {
  if (!email.trim()) {
    return { success: false, error: 'Email is required' }
  }
  if (!password.trim()) {
    return { success: false, error: 'Password is required' }
  }
  if (email.toLowerCase() !== MOCK_CREDENTIALS.email || password !== MOCK_CREDENTIALS.password) {
    return { success: false, error: 'Invalid email or password' }
  }
  return { success: true, user: MOCK_USER }
}
