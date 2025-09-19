import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '../../test/test-utils'
import LoginPage from '../LoginPage'

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
  })

  it('renders login form elements', () => {
    render(<LoginPage setUser={mockSetUser} />)

    // Just check that basic elements are present
    expect(screen.getByText('LOGIN')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Email or Staff ID')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument()
  })

  it('renders without crashing', () => {
    // Simple test to ensure component renders
    const { container } = render(<LoginPage setUser={mockSetUser} />)
    expect(container).toBeTruthy()
  })

  it('has login button', () => {
    render(<LoginPage setUser={mockSetUser} />)
    const loginButton = screen.getByRole('button', { name: /login/i })
    expect(loginButton).toBeInTheDocument()
  })

  it('has email input field', () => {
    render(<LoginPage setUser={mockSetUser} />)
    const emailInput = screen.getByPlaceholderText('Email or Staff ID')
    expect(emailInput).toBeInTheDocument()
  })

  it('has password input field', () => {
    render(<LoginPage setUser={mockSetUser} />)
    const passwordInput = screen.getByPlaceholderText('Password')
    expect(passwordInput).toBeInTheDocument()
  })

})
