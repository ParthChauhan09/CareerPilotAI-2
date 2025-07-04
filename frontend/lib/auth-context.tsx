"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { authAPI } from "@/lib/api"
import type { AuthState } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    loading: true,
    error: null,
  })

  const router = useRouter()
  const { toast } = useToast()

  // Load user on initial render and when token changes
  useEffect(() => {
    const loadUser = async () => {
      // Check if token exists
      const token = localStorage.getItem("token")
      if (!token) {
        setAuthState((prev) => ({ ...prev, loading: false }))
        return
      }

      try {
        console.log("Fetching current user with token:", token)
        const res = await authAPI.getCurrentUser()
        console.log("Current user data:", res.data)
        setAuthState({
          user: res.data.user, // Make sure we're accessing the correct property
          isAuthenticated: true,
          loading: false,
          error: null,
        })
      } catch (err: any) {
        console.error("Error loading user:", err)
        localStorage.removeItem("token")
        setAuthState({
          user: null,
          isAuthenticated: false,
          loading: false,
          error: "Authentication failed",
        })
      }
    }

    loadUser()
  }, [])

  // Register user
  const register = async (name: string, email: string, password: string) => {
    setAuthState((prev) => ({ ...prev, loading: true, error: null }))
    try {
      console.log("Attempting registration with:", { name, email })
      const res = await authAPI.register({ name, email, password })
      console.log("Registration response:", res.data)

      // Extract token and user data from response
      const { token, user } = res.data.data

      // Store token in localStorage
      localStorage.setItem("token", token)

      // Update auth state with user data
      setAuthState({
        user,
        isAuthenticated: true,
        loading: false,
        error: null,
      })

      toast({
        title: "Registration successful",
        description: "Welcome to CareerPilotAI!",
      })

      // Navigate to dashboard
      console.log("Redirecting to dashboard")
      router.push("/dashboard")
    } catch (err: any) {
      console.error("Registration error:", err)
      setAuthState((prev) => ({
        ...prev,
        loading: false,
        error: err.response?.data?.error || "Registration failed",
      }))
      toast({
        title: "Registration failed",
        description: err.response?.data?.error || "Please try again",
        variant: "destructive",
      })
    }
  }

  // Login user
  const login = async (email: string, password: string) => {
    setAuthState((prev) => ({ ...prev, loading: true, error: null }))
    try {
      console.log("Attempting login with:", { email })
      const res = await authAPI.login({ email, password })
      console.log("Login response:", res.data)

      // Extract token and user data from response
      const { token, user } = res.data.data

      // Store token in localStorage
      localStorage.setItem("token", token)

      // Update auth state with user data
      setAuthState({
        user,
        isAuthenticated: true,
        loading: false,
        error: null,
      })

      toast({
        title: "Login successful",
        description: "Welcome back!",
      })

      // Navigate to dashboard
      console.log("Redirecting to dashboard")
      router.push("/dashboard")
    } catch (err: any) {
      console.error("Login error:", err)
      setAuthState((prev) => ({
        ...prev,
        loading: false,
        error: err.response?.data?.error || "Login failed",
      }))
      toast({
        title: "Login failed",
        description: err.response?.data?.error || "Invalid credentials",
        variant: "destructive",
      })
    }
  }

  // Logout user
  const logout = async () => {
    try {
      await authAPI.logout()
    } catch (err) {
      console.error("Logout error:", err)
    } finally {
      localStorage.removeItem("token")
      setAuthState({
        user: null,
        isAuthenticated: false,
        loading: false,
        error: null,
      })
      toast({
        title: "Logged out",
        description: "You have been logged out successfully",
        variant: "success",
        duration: 4000,
        key: "logout-success"
      })
      router.push("/login")
    }
  }

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
