// src/context/AuthContext.jsx
import { useState, useEffect } from 'react'
import { supabase, isSupabaseConfigured } from '../services/supabaseClient'
import { AuthContext } from './auth'

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const [authLoading, setAuthLoading] = useState(false)
  const [authError, setAuthError] = useState(null)

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false)
      return
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session)
        setUser(session?.user ?? null)
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signInWithGoogle = async () => {
    if (!isSupabaseConfigured) {
      console.error('Cannot sign in: Supabase is not configured')
      return
    }
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
        },
      })
      if (error) throw error
    } catch (error) {
      console.error('Error signing in with Google:', error.message)
    }
  }

  const signInWithEmail = async (email, password) => {
    if (!isSupabaseConfigured) {
      const message = 'Authentication is not configured'
      setAuthError(message)
      return { success: false, error: message }
    }
    try {
      setAuthLoading(true)
      setAuthError(null)
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error
      return { success: true, user: data.user }
    } catch (error) {
      const message = error.message || 'Failed to sign in'
      setAuthError(message)
      return { success: false, error: message }
    } finally {
      setAuthLoading(false)
    }
  }

  const signUp = async (email, password) => {
    if (!isSupabaseConfigured) {
      const message = 'Authentication is not configured'
      setAuthError(message)
      return { success: false, error: message }
    }
    try {
      setAuthLoading(true)
      setAuthError(null)
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })
      if (error) throw error
      return { success: true, user: data.user }
    } catch (error) {
      const message = error.message || 'Failed to create account'
      setAuthError(message)
      return { success: false, error: message }
    } finally {
      setAuthLoading(false)
    }
  }

  const signOut = async () => {
    if (!isSupabaseConfigured) return
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
    } catch (error) {
      console.error('Error signing out:', error.message)
    }
  }

  const value = {
    user,
    session,
    loading,
    authLoading,
    authError,
    signInWithGoogle,
    signInWithEmail,
    signUp,
    signOut,
    isAuthenticated: !!user,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}