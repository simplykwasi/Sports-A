import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { supabase, onAuthStateChange } from '../lib/supabaseClient';

export const AuthContext = createContext(null);

/**
 * Supabase-based authentication provider with session persistence
 */
export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Initialize auth state from session on mount
  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.user) {
        setCurrentUser(session.user);
      }
      setIsAuthReady(true);
    };

    checkSession();

    // Subscribe to auth state changes
    const { data: authListener } = onAuthStateChange((event, session) => {
      if (session?.user) {
        setCurrentUser(session.user);
      } else {
        setCurrentUser(null);
      }
      setIsAuthReady(true);
    });

    return () => {
      authListener?.subscription?.unsubscribe?.();
    };
  }, []);

  /**
   * Register new user and create profile
   */
  const register = useCallback(async (email, password, displayName) => {
    setIsLoading(true);
    setError(null);
    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { display_name: displayName },
        },
      });

      if (signUpError) throw signUpError;

      // Create user profile in profiles table
      if (data.user) {
        const { error: profileError } = await supabase.from('profiles').insert([
          {
            user_id: data.user.id,
            email: data.user.email,
            display_name: displayName,
            created_at: new Date().toISOString(),
          },
        ]);

        if (profileError && profileError.code !== '23505') {
          // 23505 = unique constraint, profile already exists
          console.error('Profile creation failed:', profileError);
        }
      }

      setCurrentUser(data.user);
      return { ok: true, user: data.user };
    } catch (err) {
      setError(err.message);
      return { ok: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Login with email and password
   */
  const login = useCallback(async (email, password) => {
    setIsLoading(true);
    setError(null);
    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) throw signInError;

      setCurrentUser(data.user);
      return { ok: true, user: data.user };
    } catch (err) {
      setError(err.message);
      return { ok: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Logout current user
   */
  const logout = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { error: signOutError } = await supabase.auth.signOut();
      if (signOutError) throw signOutError;

      setCurrentUser(null);
      return { ok: true };
    } catch (err) {
      setError(err.message);
      return { ok: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const authValue = useMemo(
    () => ({
      currentUser,
      hasAccount: Boolean(currentUser),
      isAuthReady,
      isLoading,
      error,
      register,
      login,
      logout,
    }),
    [currentUser, isAuthReady, isLoading, error, register, login, logout]
  );

  return <AuthContext.Provider value={authValue}>{children}</AuthContext.Provider>;
}
