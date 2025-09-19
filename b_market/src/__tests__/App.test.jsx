import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '../test/test-utils'
import App from '../App'
import { createMockAuthState, createMockDbResponse, mockSupabaseResponses } from '../test/test-utils'

// Mock all the page components
vi.mock('../pages/LandingPage', () => ({
  default: () => <div>Landing Page</div>
}))

vi.mock('../pages/LoginPage', () => ({
  default: ({ setUser }) => (
    <div>
      <div>Login Page</div>
      <button onClick={() => setUser({ id: '1', email: 'test@example.com', role: 'admin' })}>
        Mock Login
      </button>
    </div>
  )
}))

vi.mock('../pages/SignUpPage', () => ({
  default: () => <div>Sign Up Page</div>
}))

vi.mock('../pages/DashboardPage', () => ({
  default: ({ user }) => <div>Dashboard Page - User: {user?.email}</div>
}))

vi.mock('../pages/ProductListPage', () => ({
  default: ({ user }) => <div>Products Page - User: {user?.email}</div>
}))

vi.mock('../pages/OrdersPage', () => ({
  default: ({ user }) => <div>Orders Page - User: {user?.email}</div>
}))

vi.mock('../pages/CSRPage', () => ({
  default: ({ userRole }) => <div>CSR Page - Role: {userRole}</div>
}))

vi.mock('../pages/TeamLeaderPage', () => ({
  default: ({ userRole }) => <div>Team Leader Page - Role: {userRole}</div>
}))

vi.mock('../pages/ProcurementPage', () => ({
  default: ({ userRole }) => <div>Procurement Page - Role: {userRole}</div>
}))

vi.mock('../pages/WarehousePage', () => ({
  default: ({ userRole }) => <div>Warehouse Page - Role: {userRole}</div>
}))

vi.mock('../pages/AccountingPage', () => ({
  default: ({ userRole }) => <div>Accounting Page - Role: {userRole}</div>
}))

describe('App', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders landing page for root route when not logged in', async () => {
    createMockAuthState(null)
    
    render(<App />)

    await waitFor(() => {
      expect(screen.getByText('Landing Page')).toBeInTheDocument()
    })
  })

  it('renders login page for /login route when not logged in', async () => {
    createMockAuthState(null)
    
    // Mock window.location for routing
    Object.defineProperty(window, 'location', {
      value: { pathname: '/login' },
      writable: true
    })

    render(<App />)

    await waitFor(() => {
      expect(screen.getByText('Login Page')).toBeInTheDocument()
    })
  })

  it('renders signup page for /signup route when not logged in', async () => {
    createMockAuthState(null)
    
    Object.defineProperty(window, 'location', {
      value: { pathname: '/signup' },
      writable: true
    })

    render(<App />)

    await waitFor(() => {
      expect(screen.getByText('Sign Up Page')).toBeInTheDocument()
    })
  })

  it('redirects to login when accessing protected route without authentication', async () => {
    createMockAuthState(null)
    
    Object.defineProperty(window, 'location', {
      value: { pathname: '/dashboard' },
      writable: true
    })

    render(<App />)

    await waitFor(() => {
      expect(screen.getByText('Login Page')).toBeInTheDocument()
    })
  })

  it('renders dashboard when user is authenticated', async () => {
    const mockUser = { id: '1', email: 'test@example.com' }
    createMockAuthState(mockUser)
    
    // Mock successful user profile fetch
    createMockDbResponse('employees', mockSupabaseResponses.success({
      id: '1',
      email: 'test@example.com',
      full_name: 'Test User',
      roles: { role: 'admin', label: 'Administrator' }
    }))

    Object.defineProperty(window, 'location', {
      value: { pathname: '/dashboard' },
      writable: true
    })

    render(<App />)

    await waitFor(() => {
      expect(screen.getByText(/Dashboard Page - User: test@example.com/)).toBeInTheDocument()
    })
  })

  it('renders role-specific pages for authorized users', async () => {
    const mockUser = { id: '1', email: 'test@example.com' }
    createMockAuthState(mockUser)
    
    // Mock successful user profile fetch with admin role
    createMockDbResponse('employees', mockSupabaseResponses.success({
      id: '1',
      email: 'test@example.com',
      full_name: 'Test User',
      roles: { role: 'admin', label: 'Administrator' }
    }))

    Object.defineProperty(window, 'location', {
      value: { pathname: '/procurement' },
      writable: true
    })

    render(<App />)

    await waitFor(() => {
      expect(screen.getByText(/Procurement Page - Role: admin/)).toBeInTheDocument()
    })
  })

  it('redirects to dashboard when user role is not authorized for specific page', async () => {
    const mockUser = { id: '1', email: 'test@example.com' }
    createMockAuthState(mockUser)
    
    // Mock successful user profile fetch with user role (not admin)
    createMockDbResponse('employees', mockSupabaseResponses.success({
      id: '1',
      email: 'test@example.com',
      full_name: 'Test User',
      roles: { role: 'user', label: 'User' }
    }))

    Object.defineProperty(window, 'location', {
      value: { pathname: '/procurement' },
      writable: true
    })

    render(<App />)

    await waitFor(() => {
      expect(screen.getByText(/Dashboard Page - User: test@example.com/)).toBeInTheDocument()
    })
  })

  it('handles authentication state changes', async () => {
    const mockSupabase = global.mockSupabase
    
    // Initially no session
    createMockAuthState(null)
    
    render(<App />)

    // Should show landing page initially
    await waitFor(() => {
      expect(screen.getByText('Landing Page')).toBeInTheDocument()
    })

    // Simulate auth state change to logged in
    const mockAuthStateChange = mockSupabase.auth.onAuthStateChange.mock.calls[0][0]
    const mockUser = { id: '1', email: 'test@example.com' }
    
    // Mock successful user profile fetch
    createMockDbResponse('employees', mockSupabaseResponses.success({
      id: '1',
      email: 'test@example.com',
      full_name: 'Test User',
      roles: { role: 'admin', label: 'Administrator' }
    }))

    // Trigger auth state change
    mockAuthStateChange('SIGNED_IN', { user: mockUser })

    await waitFor(() => {
      expect(screen.getByText(/Dashboard Page - User: test@example.com/)).toBeInTheDocument()
    })
  })
})
