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

  it('renders without crashing', () => {
    const mockUser = { id: '1', email: 'test@example.com', role: 'admin' }
    
    const { container } = render(
      <ProtectedRoute user={mockUser}>
        <TestComponent />
      </ProtectedRoute>
    )

    expect(container).toBeTruthy()
  })

  it('handles null user', () => {
    render(
      <ProtectedRoute user={null}>
        <TestComponent />
      </ProtectedRoute>
    )

    // Should redirect or handle null user gracefully
    expect(screen.getByTestId('navigate')).toBeInTheDocument()
  })
})
