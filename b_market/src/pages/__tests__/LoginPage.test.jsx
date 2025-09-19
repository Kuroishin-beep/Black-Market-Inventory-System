import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '../../test/test-utils'
import userEvent from '@testing-library/user-event'
import LoginPage from '../LoginPage'
import { mockSupabaseResponses, createMockAuthState } from '../../test/test-utils'

// Mock react-router-dom
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

describe('LoginPage', () => {
  const mockSetUser = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    createMockAuthState(null) // No user logged in initially
  })

  it('renders login form elements', () => {
    render(<LoginPage setUser={mockSetUser} />)

    expect(screen.getByText('LOGIN')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Email or Staff ID')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument()
    expect(screen.getByText("Don't have an account yet?")).toBeInTheDocument()
  })

  it('shows password toggle functionality', async () => {
    const user = userEvent.setup()
    render(<LoginPage setUser={mockSetUser} />)

    const passwordInput = screen.getByPlaceholderText('Password')
    // Find the password toggle button by its class name
    const toggleButton = document.querySelector('.login-card__password-toggle')

    expect(passwordInput).toHaveAttribute('type', 'password')

    await user.click(toggleButton)
    expect(passwordInput).toHaveAttribute('type', 'text')

    await user.click(toggleButton)
    expect(passwordInput).toHaveAttribute('type', 'password')
  })

  it('shows error for empty form submission', async () => {
    const user = userEvent.setup()
    render(<LoginPage setUser={mockSetUser} />)

    const submitButton = screen.getByRole('button', { name: /login/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('Please enter both email and password.')).toBeInTheDocument()
    })
  })

  it('shows error for empty email', async () => {
    const user = userEvent.setup()
    render(<LoginPage setUser={mockSetUser} />)

    const passwordInput = screen.getByPlaceholderText('Password')
    const submitButton = screen.getByRole('button', { name: /login/i })

    await user.type(passwordInput, 'password123')
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('Please enter both email and password.')).toBeInTheDocument()
    })
  })

  it('shows error for empty password', async () => {
    const user = userEvent.setup()
    render(<LoginPage setUser={mockSetUser} />)

    const emailInput = screen.getByPlaceholderText('Email or Staff ID')
    const submitButton = screen.getByRole('button', { name: /login/i })

    await user.type(emailInput, 'test@example.com')
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('Please enter both email and password.')).toBeInTheDocument()
    })
  })

  it('handles successful login', async () => {
    const user = userEvent.setup()
    const mockSupabase = global.mockSupabase

    // Mock successful login
    mockSupabase.auth.signInWithPassword.mockResolvedValue(
      mockSupabaseResponses.success({
        user: { id: 'user-id', email: 'test@example.com', confirmed_at: '2023-01-01T00:00:00Z' }
      })
    )

    // Mock successful role fetch
    mockSupabase.from.mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue(
        mockSupabaseResponses.success({ role_id: 'admin' })
      )
    })

    render(<LoginPage setUser={mockSetUser} />)

    const emailInput = screen.getByPlaceholderText('Email or Staff ID')
    const passwordInput = screen.getByPlaceholderText('Password')
    const submitButton = screen.getByRole('button', { name: /login/i })

    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, 'password123')
    await user.click(submitButton)

    await waitFor(() => {
      expect(mockSetUser).toHaveBeenCalledWith({
        id: 'user-id',
        email: 'test@example.com',
        role: 'admin'
      })
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard')
    })
  })

  it('handles login error', async () => {
    const user = userEvent.setup()
    const mockSupabase = global.mockSupabase

    mockSupabase.auth.signInWithPassword.mockResolvedValue(
      mockSupabaseResponses.error('Invalid credentials')
    )

    render(<LoginPage setUser={mockSetUser} />)

    const emailInput = screen.getByPlaceholderText('Email or Staff ID')
    const passwordInput = screen.getByPlaceholderText('Password')
    const submitButton = screen.getByRole('button', { name: /login/i })

    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, 'wrongpassword')
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument()
    })
  })

  it('handles unconfirmed email error', async () => {
    const user = userEvent.setup()
    const mockSupabase = global.mockSupabase

    mockSupabase.auth.signInWithPassword.mockResolvedValue(
      mockSupabaseResponses.error('Email not confirmed')
    )

    render(<LoginPage setUser={mockSetUser} />)

    const emailInput = screen.getByPlaceholderText('Email or Staff ID')
    const passwordInput = screen.getByPlaceholderText('Password')
    const submitButton = screen.getByRole('button', { name: /login/i })

    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, 'password123')
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/Your email is not confirmed/)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /Resend Confirmation Email/ })).toBeInTheDocument()
    })
  })

  it('handles resend confirmation email', async () => {
    const user = userEvent.setup()
    const mockSupabase = global.mockSupabase

    // First, trigger the unconfirmed email error
    mockSupabase.auth.signInWithPassword.mockResolvedValue(
      mockSupabaseResponses.error('Email not confirmed')
    )

    render(<LoginPage setUser={mockSetUser} />)

    const emailInput = screen.getByPlaceholderText('Email or Staff ID')
    const passwordInput = screen.getByPlaceholderText('Password')
    const submitButton = screen.getByRole('button', { name: /login/i })

    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, 'password123')
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/Your email is not confirmed/)).toBeInTheDocument()
    })

    // Mock successful resend
    mockSupabase.auth.resend.mockResolvedValue(mockSupabaseResponses.success({}))

    const resendButton = screen.getByRole('button', { name: /Resend Confirmation Email/ })
    await user.click(resendButton)

    await waitFor(() => {
      expect(screen.getByText('Confirmation email resent. Please check your inbox.')).toBeInTheDocument()
    })
  })

  it('navigates to signup page when signup button is clicked', async () => {
    const user = userEvent.setup()
    render(<LoginPage setUser={mockSetUser} />)

    const signupButton = screen.getByRole('button', { name: /signup/i })
    await user.click(signupButton)

    expect(mockNavigate).toHaveBeenCalledWith('/signup')
  })
})
