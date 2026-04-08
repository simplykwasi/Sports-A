import { useMemo, useState } from 'react'
import { AuthContext } from './auth-context'
import {
  persistSession,
  persistUsers,
  readStoredSession,
  readStoredUsers,
} from '../lib/authStorage'

function getInitialAuthState() {
  const storedUsers = readStoredUsers()
  const storedSession = readStoredSession()
  const sessionUser = storedUsers.find((user) => user.username === storedSession?.username) || null

  return {
    currentUser: sessionUser,
    isAuthReady: true,
  }
}

// Shared frontend auth state for sign in, sign up, profile, and header behavior.
export function AuthProvider({ children }) {
  const [{ currentUser, isAuthReady }, setAuthState] = useState(getInitialAuthState)

  const authValue = useMemo(
    () => ({
      currentUser,
      hasAccount: Boolean(currentUser),
      isAuthReady,
      signIn: ({ username, password }) => {
        const normalizedUsername = username.trim()
        const normalizedPassword = password.trim()

        if (!normalizedUsername || !normalizedPassword) {
          return { ok: false, error: 'Enter your username and password.' }
        }

        const storedUsers = readStoredUsers()
        const matchedUser = storedUsers.find(
          (user) => user.username.toLowerCase() === normalizedUsername.toLowerCase(),
        )

        if (!matchedUser || matchedUser.password !== normalizedPassword) {
          return { ok: false, error: 'Invalid username or password.' }
        }

        persistSession({ username: matchedUser.username })
        setAuthState({ currentUser: matchedUser, isAuthReady: true })

        return { ok: true, user: matchedUser }
      },
      register: ({ username, phoneNumber, password }) => {
        const normalizedUsername = username.trim()
        const normalizedPhoneNumber = phoneNumber.trim()
        const normalizedPassword = password.trim()

        if (!normalizedUsername || !normalizedPhoneNumber || !normalizedPassword) {
          return { ok: false, error: 'Fill in username, phone number, and password.' }
        }

        const storedUsers = readStoredUsers()
        const usernameExists = storedUsers.some(
          (user) => user.username.toLowerCase() === normalizedUsername.toLowerCase(),
        )

        if (usernameExists) {
          return { ok: false, error: 'That username already exists. Use another one.' }
        }

        const newUser = {
          username: normalizedUsername,
          phoneNumber: normalizedPhoneNumber,
          password: normalizedPassword,
          joinedAt: new Date().toISOString(),
        }

        persistUsers([...storedUsers, newUser])
        persistSession({ username: newUser.username })
        setAuthState({ currentUser: newUser, isAuthReady: true })

        return { ok: true, user: newUser }
      },
      signOut: () => {
        persistSession(null)
        setAuthState((state) => ({ ...state, currentUser: null }))
      },
    }),
    [currentUser, isAuthReady],
  )

  return <AuthContext.Provider value={authValue}>{children}</AuthContext.Provider>
}
