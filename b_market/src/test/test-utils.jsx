import React from 'react'
import { render } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { vi } from 'vitest'
import './mocks' // Import Material-UI mocks

// Custom render function that includes providers
const AllTheProviders = ({ children }) => {
  return (
    <BrowserRouter>
      {children}
    </BrowserRouter>
  )
}

const customRender = (ui, options) =>
  render(ui, { wrapper: AllTheProviders, ...options })

// Mock user data for testing
export const mockUser = {
  id: 'test-user-id',
  email: 'test@example.com',
  fullName: 'Test User',
  role: 'admin',
  roleLabel: 'Administrator'
}

// Mock Supabase responses
export const mockSupabaseResponses = {
  success: (data) => ({ data, error: null }),
  error: (message) => ({ data: null, error: { message } }),
  session: (user) => ({ data: { session: { user } }, error: null }),
  noSession: () => ({ data: { session: null }, error: null })
}

// Helper to create mock Supabase auth state
export const createMockAuthState = (user = null) => {
  const mockSupabase = global.mockSupabase
  
  if (user) {
    mockSupabase.auth.getSession.mockResolvedValue(
      mockSupabaseResponses.session(user)
    )
  } else {
    mockSupabase.auth.getSession.mockResolvedValue(
      mockSupabaseResponses.noSession()
    )
  }
}

// Helper to create mock Supabase database responses
export const createMockDbResponse = (tableName, response) => {
  const mockSupabase = global.mockSupabase
  const mockQuery = {
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue(response),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis()
  }
  
  mockSupabase.from.mockImplementation((table) => {
    if (table === tableName) {
      return mockQuery
    }
    return {
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue(mockSupabaseResponses.success([])),
      insert: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      delete: vi.fn().mockReturnThis()
    }
  })
  
  return mockQuery
}

// Re-export everything
export * from '@testing-library/react'
export { customRender as render }
