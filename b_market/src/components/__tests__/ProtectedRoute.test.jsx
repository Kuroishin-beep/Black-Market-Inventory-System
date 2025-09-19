import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '../../test/test-utils'
import ProtectedRoute from '../ProtectedRoutes'

// Mock react-router-dom Navigate component
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    Navigate: ({ to }) => <div data-testid="navigate" data-to={to}>Navigate to {to}</div>,
  }
})

describe('ProtectedRoute', () => {
  const TestComponent = () => <div>Protected Content</div>

  it('renders children when user is logged in', () => {
    const mockUser = { id: '1', email: 'test@example.com', role: 'admin' }
    
    render(
      <ProtectedRoute user={mockUser}>
        <TestComponent />
      </ProtectedRoute>
    )

    expect(screen.getByText('Protected Content')).toBeInTheDocument()
  })

  it('redirects to login when user is not logged in', () => {
    render(
      <ProtectedRoute user={null}>
        <TestComponent />
      </ProtectedRoute>
    )

    const navigate = screen.getByTestId('navigate')
    expect(navigate).toHaveAttribute('data-to', '/login')
  })

  it('redirects to login when user has no role', () => {
    const mockUser = { id: '1', email: 'test@example.com' } // no role
    
    render(
      <ProtectedRoute user={mockUser}>
        <TestComponent />
      </ProtectedRoute>
    )

    const navigate = screen.getByTestId('navigate')
    expect(navigate).toHaveAttribute('data-to', '/login')
  })

  it('renders children when user has required role', () => {
    const mockUser = { id: '1', email: 'test@example.com', role: 'admin' }
    
    render(
      <ProtectedRoute user={mockUser} allowedRoles={['admin', 'manager']}>
        <TestComponent />
      </ProtectedRoute>
    )

    expect(screen.getByText('Protected Content')).toBeInTheDocument()
  })

  it('redirects to dashboard when user role is not in allowed roles', () => {
    const mockUser = { id: '1', email: 'test@example.com', role: 'user' }
    
    render(
      <ProtectedRoute user={mockUser} allowedRoles={['admin', 'manager']}>
        <TestComponent />
      </ProtectedRoute>
    )

    const navigate = screen.getByTestId('navigate')
    expect(navigate).toHaveAttribute('data-to', '/dashboard')
  })

  it('renders children when no allowed roles specified', () => {
    const mockUser = { id: '1', email: 'test@example.com', role: 'user' }
    
    render(
      <ProtectedRoute user={mockUser}>
        <TestComponent />
      </ProtectedRoute>
    )

    expect(screen.getByText('Protected Content')).toBeInTheDocument()
  })
})
