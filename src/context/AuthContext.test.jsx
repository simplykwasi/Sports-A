import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { AuthProvider, useAuth } from '../context/AuthContext'

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}
global.localStorage = localStorageMock

// Test component that uses auth
function TestComponent() {
  const { currentUser, hasAccount } = useAuth()
  return (
    <div>
      <div data-testid="hasAccount">{hasAccount ? 'true' : 'false'}</div>
      <div data-testid="currentUser">{currentUser ? currentUser.username : 'null'}</div>
    </div>
  )
}

describe('AuthContext', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('provides initial auth state', () => {
    localStorageMock.getItem.mockReturnValue(null) // No stored session

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    expect(screen.getByTestId('hasAccount')).toHaveTextContent('false')
    expect(screen.getByTestId('currentUser')).toHaveTextContent('null')
  })
})