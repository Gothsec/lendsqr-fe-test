import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import LoginPage from '@/app/login/page'

const mockPush = vi.fn()
const mockReplace = vi.fn()
const mockLogin = vi.fn()

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: mockReplace,
  }),
}))

vi.mock('@/context/AuthContext', () => ({
  useAuth: () => ({
    login: mockLogin,
    isAuthenticated: false,
    user: null,
    logout: vi.fn(),
    updateActivity: vi.fn(),
  }),
  AuthProvider: ({ children }: { children: React.ReactNode }) => children,
}))

vi.mock('next/image', () => ({
  __esModule: true,
  default: ({ alt }: { alt: string }) => <div data-testid="mock-image" data-alt={alt} />,
}))

describe('LoginPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the login form', () => {
    render(<LoginPage />)
    expect(screen.getByText('Welcome!')).toBeInTheDocument()
    expect(screen.getByText('Enter details to login.')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument()
    expect(screen.getByText('LOG IN')).toBeInTheDocument()
  })

  it('shows the logo and illustration', () => {
    render(<LoginPage />)
    const images = screen.getAllByTestId('mock-image')
    expect(images.length).toBeGreaterThanOrEqual(2)
  })

  it('has a SHOW/HIDE password toggle', async () => {
    const user = userEvent.setup()
    render(<LoginPage />)
    const toggle = screen.getByText('SHOW')
    expect(toggle).toBeInTheDocument()

    await user.click(toggle)
    expect(screen.getByText('HIDE')).toBeInTheDocument()

    await user.click(screen.getByText('HIDE'))
    expect(screen.getByText('SHOW')).toBeInTheDocument()
  })

  it('has a clickable FORGOT PASSWORD link', async () => {
    const user = userEvent.setup()
    render(<LoginPage />)
    const forgot = screen.getByText('FORGOT PASSWORD?')
    expect(forgot).toBeInTheDocument()
    expect(forgot).toHaveAttribute('href', '#')
  })

  it('renders LOG IN button disabled when loading', async () => {
    const user = userEvent.setup()
    render(<LoginPage />)
    const emailInput = screen.getByPlaceholderText('Email')
    const passwordInput = screen.getByPlaceholderText('Password')
    const submitButton = screen.getByText('LOG IN')

    await user.type(emailInput, 'admin@lendsqr.com')
    await user.type(passwordInput, 'password123')
    await user.click(submitButton)

    expect(await screen.findByText('LOGGING IN...')).toBeInTheDocument()
  })
})
