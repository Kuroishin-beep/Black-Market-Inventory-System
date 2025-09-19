import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock Supabase client
const mockSupabase = {
  auth: {
    getSession: vi.fn().mockResolvedValue({
      data: { session: null },
      error: null
    }),
    signInWithPassword: vi.fn().mockResolvedValue({
      data: { user: null },
      error: null
    }),
    signUp: vi.fn().mockResolvedValue({
      data: { user: null },
      error: null
    }),
    signOut: vi.fn().mockResolvedValue({
      error: null
    }),
    onAuthStateChange: vi.fn(() => ({
      data: { subscription: { unsubscribe: vi.fn() } }
    })),
    resend: vi.fn().mockResolvedValue({
      data: {},
      error: null
    })
  },
  from: vi.fn(() => ({
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue({
      data: null,
      error: null
    }),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis()
  }))
}

// Mock the supabase client
vi.mock('../supabaseClient', () => ({
  supabase: mockSupabase
}))

// Mock react-router-dom
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => vi.fn(),
    useLocation: () => ({ pathname: '/' }),
    BrowserRouter: ({ children }) => children,
    Routes: ({ children }) => children,
    Route: ({ children }) => children,
    Navigate: ({ to }) => `Navigate to ${to}`,
  }
})

// Global test utilities
global.mockSupabase = mockSupabase
