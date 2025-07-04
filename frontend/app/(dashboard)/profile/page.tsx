"use client"

// Force dynamic rendering to avoid SSG issues with React 19
export const dynamic = 'force-dynamic'

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { DashboardShell } from "@/components/dashboard-shell"
import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { userAPI } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/lib/auth-context"
import type { UserProfile, UsageStats } from "@/lib/types"
import {
  Loader2,
  User,
  CreditCard,
  Settings,
  FileText,
  FileEdit,
  Shield,
  Bell,
  Calendar,
  Lock,
  Mail,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  LogOut
} from "lucide-react"

export default function ProfilePage() {
  const { user: authUser, logout } = useAuth()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [usageStats, setUsageStats] = useState<UsageStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [updating, setUpdating] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)
  const [activeTab, setActiveTab] = useState("profile")

  // Form states
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [passwordError, setPasswordError] = useState("")

  // No notification preferences as they are not implemented

  const { toast } = useToast()

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  // Get initials for avatar
  const getInitials = (name: string) => {
    if (!name || name.trim() === "") return "U"

    return name
      .split(" ")
      .filter(part => part.length > 0)
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2) // Limit to 2 characters for better display
  }

  // Get color for avatar based on user name
  const getUserColor = () => {
    const colors = [
      "bg-blue-500",
      "bg-green-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-indigo-500",
      "bg-teal-500",
      "bg-orange-500",
      "bg-red-500",
      "bg-amber-500",
      "bg-emerald-500",
      "bg-cyan-500",
      "bg-violet-500",
    ]

    const userName = profile?.name || authUser?.name
    if (!userName) return colors[0]

    // Simple hash function to get consistent color for a user
    const hash = userName.split("").reduce((acc, char) => {
      return acc + char.charCodeAt(0)
    }, 0)

    return colors[hash % colors.length]
  }

  // Format percentage for display
  const formatPercentage = (used: number, limit: number) => {
    if (!used || !limit) return 0
    if (limit <= 0) return 100 // For unlimited plans
    return Math.min(Math.round((used / limit) * 100), 100)
  }

  // Get progress bar color based on usage percentage
  const getProgressColor = (percentage: number) => {
    if (percentage >= 80) return "bg-red-500"
    if (percentage >= 50) return "bg-amber-500"
    return "bg-green-500"
  }

  // Safely get usage value with fallbacks
  const getUsageValue = (usageStats: any, type: string) => {
    if (!usageStats) return 0

    // Handle different possible data structures
    if (usageStats.usage && usageStats.usage[type]) {
      return usageStats.usage[type]
    }

    // Fallback for old structure or different format
    if (usageStats[type]) {
      return usageStats[type]
    }

    // Default fallback
    return 0
  }

  // Safely get limit value with fallbacks
  const getLimitValue = (usageStats: any, type: string) => {
    if (!usageStats) return 1

    // Handle different possible data structures
    if (usageStats.limits && usageStats.limits[type]) {
      return usageStats.limits[type]
    }

    // Fallback for old structure or different format
    if (usageStats[`${type}Limit`]) {
      return usageStats[`${type}Limit`]
    }

    // Default fallback
    return 1
  }

  useEffect(() => {
    fetchProfileData()
  }, [])

  const fetchProfileData = async () => {
    setLoading(true)
    try {
      try {
        const [profileRes, usageRes] = await Promise.all([userAPI.getProfile(), userAPI.getUsageStats()])

        console.log("Profile API response:", profileRes)
        console.log("Usage API response:", usageRes)

        // Extract user data from profile response
        const userData = profileRes.data.data?.user || profileRes.data.user || profileRes.data
        console.log("Extracted user data:", userData)
        setProfile(userData)

        // Extract usage data from usage response
        const usageData = usageRes.data.data || usageRes.data
        console.log("Extracted usage data:", usageData)
        setUsageStats(usageData)

        // Set form values
        setName(userData?.name || "")
        setEmail(userData?.email || "")
      } catch (apiError) {
        console.error("API error:", apiError)

        // Fallback to mock data
        const mockProfile = {
          id: "mock-user-id",
          name: "Demo User",
          email: "demo@example.com",
          planType: "free",
          createdAt: new Date().toISOString()
        }

        const mockUsage = {
          usage: {
            resumeGenerations: 0,
            coverLetterGenerations: 0,
            linkedinGenerations: 0
          },
          limits: {
            resumeGenerations: 1,
            coverLetterGenerations: 1,
            linkedinGenerations: 1
          },
          planType: "free"
        }

        setProfile(mockProfile)
        setUsageStats(mockUsage)

        // Set form values
        setName(mockProfile.name)
        setEmail(mockProfile.email)

        toast({
          title: "Demo Mode",
          description: "Using demo data since the API is not available.",
        })
      }
    } catch (error) {
      toast({
        title: "Error fetching profile",
        description: "Could not load your profile information. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const refreshProfileData = async () => {
    setRefreshing(true)
    try {
      await fetchProfileData()
      toast({
        title: "Profile refreshed",
        description: "Your profile information has been updated.",
      })
    } catch (error) {
      // Error is already handled in fetchProfileData
    } finally {
      setRefreshing(false)
    }
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate password is provided
    if (!currentPassword) {
      toast({
        title: "Password required",
        description: "Please enter your current password to confirm these changes.",
        variant: "destructive",
      })
      return
    }

    setUpdating(true)

    try {
      const res = await userAPI.updateProfile({
        name,
        email,
        currentPassword
      })

      // Extract user data from response
      const userData = res.data.user || res.data
      setProfile(userData)

      // Reset password field
      setCurrentPassword("")

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully",
      })
    } catch (error: any) {
      // Handle specific error cases
      let errorMessage = "Could not update your profile. Please try again."

      if (error.response?.status === 401) {
        errorMessage = "Incorrect password. Please try again."
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error
      }

      toast({
        title: "Update failed",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setUpdating(false)
    }
  }

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate passwords match
    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match")
      return
    }

    if (newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters")
      return
    }

    setPasswordError("")
    setUpdating(true)

    try {
      // Call the real API endpoint
      await userAPI.updatePassword({
        currentPassword,
        newPassword,
        confirmPassword
      })

      toast({
        title: "Password updated",
        description: "Your password has been updated successfully",
        variant: "success",
        duration: 5000, // Show for 5 seconds
        key: "password-update-success"
      })

      // Reset form
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
    } catch (error: any) {
      console.error("Password update error:", error)

      // Get the error message from the response
      let errorMessage = "Could not update your password. Please try again."
      let errorStatus = 0

      if (error.response) {
        errorStatus = error.response.status
        if (error.response.data && error.response.data.message) {
          errorMessage = error.response.data.message
        }
      }

      // Show toast with error message
      toast({
        title: "Update failed",
        description: errorMessage,
        variant: "destructive",
        duration: 5000, // Show for 5 seconds
        key: `password-update-error-${errorStatus}`
      })

      // Handle specific error cases
      if (errorStatus === 401) {
        // Incorrect current password
        setPasswordError("Current password is incorrect")
        // Focus on the current password field
        const currentPasswordField = document.getElementById("currentPassword") as HTMLInputElement
        if (currentPasswordField) {
          currentPasswordField.focus()
        }
      }
    } finally {
      setUpdating(false)
    }
  }



  const handleLogout = async () => {
    setLoggingOut(true)
    try {
      // The logout function in auth context already shows a toast
      await logout()
    } catch (error) {
      // Only show error toast here
      toast({
        title: "Logout failed",
        description: "Could not log you out. Please try again.",
        variant: "destructive",
      })
      setLoggingOut(false)
    }
  }

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Profile"
        text="Manage your account settings and preferences"
      >
        <Button
          variant="outline"
          size="icon"
          onClick={refreshProfileData}
          disabled={refreshing}
          className="h-9 w-9 transition-all duration-300 hover:bg-primary/10 hover:border-primary/30"
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : 'transition-transform duration-300 hover:rotate-180'}`} />
          <span className="sr-only">Refresh</span>
        </Button>
      </DashboardHeader>

      {loading ? (
        <div className="grid gap-8 md:grid-cols-3">
          <Skeleton className="h-[300px] w-full" />
          <Skeleton className="h-[300px] w-full md:col-span-2" />
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-3">
          {/* Profile Summary Card */}
          <div className="space-y-8">
            <Card className="overflow-hidden border-muted-foreground/20 transition-all duration-300 hover:shadow-md">
              <CardHeader className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950/50 dark:to-slate-900/30 pb-6">
                <div className="flex flex-col items-center justify-center">
                  <Avatar className={`h-24 w-24 ${getUserColor()} text-white mb-4`}>
                    <AvatarImage src="" alt={profile?.name || authUser?.name || "User"} />
                    <AvatarFallback className="text-2xl font-semibold">
                      {profile?.name ? getInitials(profile.name) : authUser?.name ? getInitials(authUser.name) : "U"}
                    </AvatarFallback>
                  </Avatar>
                  <CardTitle className="text-center">Your Profile</CardTitle>
                  <Badge variant="outline" className="mt-2 capitalize">
                    {profile?.planType || authUser?.planType || "Free"} Plan
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-4 pb-2">
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      Member Since
                    </span>
                    <span className="font-medium">
                      {profile?.createdAt ? formatDate(profile.createdAt) : "N/A"}
                    </span>
                  </div>
                  <Separator />

                  {/* Account Usage Section */}
                  {usageStats && (
                    <div className="space-y-3">
                      <h3 className="text-sm font-medium flex items-center justify-between">
                        <span>Account Usage</span>
                        <Badge variant="outline" className="capitalize">
                          {usageStats.planType || profile?.planType || "Free"}
                        </Badge>
                      </h3>

                      {/* User Info */}
                      <div className="bg-muted/20 p-3 rounded-md border border-muted/30 space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="flex items-center gap-2 text-muted-foreground">
                            <User className="h-4 w-4" />
                            Name
                          </span>
                          <span className="font-medium truncate max-w-[150px]" title={profile?.name || authUser?.name || "User"}>
                            {profile?.name || authUser?.name || "User"}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="flex items-center gap-2 text-muted-foreground">
                            <Mail className="h-4 w-4" />
                            Email
                          </span>
                          <span className="font-medium truncate max-w-[150px]" title={profile?.email || authUser?.email || "user@example.com"}>
                            {profile?.email || authUser?.email || "user@example.com"}
                          </span>
                        </div>
                      </div>

                      {/* Remaining Limits Section */}
                      <div className="bg-muted/20 p-3 rounded-md border border-muted/30">
                        <h4 className="text-xs font-semibold uppercase mb-3">Remaining Limits</h4>

                        {/* Resume Generations */}
                        <div className="space-y-1 mb-3">
                          <div className="flex items-center justify-between text-sm">
                            <span className="flex items-center gap-2 text-muted-foreground">
                              <FileText className="h-4 w-4" />
                              Resumes
                            </span>
                            <span className="font-medium">
                              {getUsageValue(usageStats, 'resumeGenerations')} /
                              {getLimitValue(usageStats, 'resumeGenerations') < 0 ? "∞" : getLimitValue(usageStats, 'resumeGenerations')}
                            </span>
                          </div>
                          <div className="relative pt-1">
                            <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200 dark:bg-gray-700">
                              <div
                                className={`${getProgressColor(formatPercentage(
                                  getUsageValue(usageStats, 'resumeGenerations'),
                                  getLimitValue(usageStats, 'resumeGenerations')
                                ))} h-full rounded`}
                                style={{ width: `${formatPercentage(
                                  getUsageValue(usageStats, 'resumeGenerations'),
                                  getLimitValue(usageStats, 'resumeGenerations')
                                )}%` }}
                              ></div>
                            </div>
                          </div>
                          <div className="text-xs text-right font-medium">
                            <span className={getLimitValue(usageStats, 'resumeGenerations') - getUsageValue(usageStats, 'resumeGenerations') <= 0 ? "text-red-500" : "text-green-500"}>
                              {getLimitValue(usageStats, 'resumeGenerations') < 0 ? "Unlimited" :
                                Math.max(0, getLimitValue(usageStats, 'resumeGenerations') - getUsageValue(usageStats, 'resumeGenerations'))}
                              {getLimitValue(usageStats, 'resumeGenerations') < 0 ? "" : " remaining"}
                            </span>
                          </div>
                        </div>

                        {/* Cover Letter Generations */}
                        <div className="space-y-1 mb-3">
                          <div className="flex items-center justify-between text-sm">
                            <span className="flex items-center gap-2 text-muted-foreground">
                              <FileEdit className="h-4 w-4" />
                              Cover Letters
                            </span>
                            <span className="font-medium">
                              {getUsageValue(usageStats, 'coverLetterGenerations')} /
                              {getLimitValue(usageStats, 'coverLetterGenerations') < 0 ? "∞" : getLimitValue(usageStats, 'coverLetterGenerations')}
                            </span>
                          </div>
                          <div className="relative pt-1">
                            <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200 dark:bg-gray-700">
                              <div
                                className={`${getProgressColor(formatPercentage(
                                  getUsageValue(usageStats, 'coverLetterGenerations'),
                                  getLimitValue(usageStats, 'coverLetterGenerations')
                                ))} h-full rounded`}
                                style={{ width: `${formatPercentage(
                                  getUsageValue(usageStats, 'coverLetterGenerations'),
                                  getLimitValue(usageStats, 'coverLetterGenerations')
                                )}%` }}
                              ></div>
                            </div>
                          </div>
                          <div className="text-xs text-right font-medium">
                            <span className={getLimitValue(usageStats, 'coverLetterGenerations') - getUsageValue(usageStats, 'coverLetterGenerations') <= 0 ? "text-red-500" : "text-green-500"}>
                              {getLimitValue(usageStats, 'coverLetterGenerations') < 0 ? "Unlimited" :
                                Math.max(0, getLimitValue(usageStats, 'coverLetterGenerations') - getUsageValue(usageStats, 'coverLetterGenerations'))}
                              {getLimitValue(usageStats, 'coverLetterGenerations') < 0 ? "" : " remaining"}
                            </span>
                          </div>
                        </div>

                        {/* LinkedIn Generations */}
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-sm">
                            <span className="flex items-center gap-2 text-muted-foreground">
                              <FileEdit className="h-4 w-4" />
                              LinkedIn Profiles
                            </span>
                            <span className="font-medium">
                              {getUsageValue(usageStats, 'linkedinGenerations')} /
                              {getLimitValue(usageStats, 'linkedinGenerations') < 0 ? "∞" : getLimitValue(usageStats, 'linkedinGenerations')}
                            </span>
                          </div>
                          <div className="relative pt-1">
                            <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200 dark:bg-gray-700">
                              <div
                                className={`${getProgressColor(formatPercentage(
                                  getUsageValue(usageStats, 'linkedinGenerations'),
                                  getLimitValue(usageStats, 'linkedinGenerations')
                                ))} h-full rounded`}
                                style={{ width: `${formatPercentage(
                                  getUsageValue(usageStats, 'linkedinGenerations'),
                                  getLimitValue(usageStats, 'linkedinGenerations')
                                )}%` }}
                              ></div>
                            </div>
                          </div>
                          <div className="text-xs text-right font-medium">
                            <span className={getLimitValue(usageStats, 'linkedinGenerations') - getUsageValue(usageStats, 'linkedinGenerations') <= 0 ? "text-red-500" : "text-green-500"}>
                              {getLimitValue(usageStats, 'linkedinGenerations') < 0 ? "Unlimited" :
                                Math.max(0, getLimitValue(usageStats, 'linkedinGenerations') - getUsageValue(usageStats, 'linkedinGenerations'))}
                              {getLimitValue(usageStats, 'linkedinGenerations') < 0 ? "" : " remaining"}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Free Plan Upgrade Prompt */}
                      {(usageStats.planType === "free" || profile?.planType === "free") && (
                        <div className="mt-2 text-xs text-muted-foreground bg-muted/30 p-2 rounded border border-muted">
                          <p className="font-medium mb-1">Free Plan Limitations</p>
                          <p>Upgrade to unlock more document generations and premium features.</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="border-t p-4 bg-muted/5 flex flex-col gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full gap-1 hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                  asChild
                >
                  <Link href="/subscription">
                    <CreditCard className="mr-1 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    Upgrade Plan
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full gap-1 text-red-600 hover:bg-red-100 hover:text-red-700 dark:hover:bg-red-950 dark:hover:text-red-500 transition-all duration-300"
                  onClick={handleLogout}
                  disabled={loggingOut}
                >
                  {loggingOut ? (
                    <>
                      <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                      Logging out...
                    </>
                  ) : (
                    <>
                      <LogOut className="mr-1 h-4 w-4" />
                      Log Out
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>

            {/* Account Security Summary */}
            <Card className="overflow-hidden border-muted-foreground/20 transition-all duration-300 hover:shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-muted-foreground" />
                  Account Security
                </CardTitle>
                <CardDescription>Security status and settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    Password
                  </span>
                  <Badge variant="outline">Set</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-sm">
                    <AlertCircle className="h-4 w-4 text-amber-500" />
                    Two-Factor Auth
                  </span>
                  <Badge variant="outline" className="bg-muted">Not Set</Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Area */}
          <div className="md:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="profile" className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline">Profile</span>
                </TabsTrigger>
                <TabsTrigger value="security" className="flex items-center gap-1">
                  <Lock className="h-4 w-4" />
                  <span className="hidden sm:inline">Security</span>
                </TabsTrigger>
              </TabsList>

              {/* Profile Tab */}
              <TabsContent value="profile" className="mt-6 space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>Update your personal details</CardDescription>
                  </CardHeader>
                  <form onSubmit={handleUpdateProfile}>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Your full name"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Your email address"
                          required
                        />
                        <p className="text-xs text-muted-foreground">
                          This email will be used for account notifications and communications.
                        </p>
                      </div>

                      <div className="space-y-2 pt-4 border-t">
                        <Label htmlFor="confirmPassword" className="font-medium text-red-500">
                          Confirm with Password
                        </Label>
                        <Input
                          id="confirmPassword"
                          type="password"
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          placeholder="Enter your current password to save changes"
                          required
                        />
                        <p className="text-xs text-muted-foreground">
                          For security reasons, please enter your current password to confirm these changes.
                        </p>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between border-t pt-6">
                      <Button type="button" variant="outline">Cancel</Button>
                      <Button type="submit" disabled={updating}>
                        {updating ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Updating...
                          </>
                        ) : (
                          "Save Changes"
                        )}
                      </Button>
                    </CardFooter>
                  </form>
                </Card>
              </TabsContent>

              {/* Security Tab */}
              <TabsContent value="security" className="mt-6 space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Change Password</CardTitle>
                    <CardDescription>Update your account password</CardDescription>
                  </CardHeader>
                  <form onSubmit={handleUpdatePassword}>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="currentPassword">Current Password</Label>
                        <Input
                          id="currentPassword"
                          type="password"
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="newPassword">New Password</Label>
                        <Input
                          id="newPassword"
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm New Password</Label>
                        <Input
                          id="confirmPassword"
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          required
                        />
                        {passwordError && (
                          <p className="text-sm text-red-500 mt-1">{passwordError}</p>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <p>Password must be at least 6 characters long.</p>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between border-t pt-6">
                      <Button type="button" variant="outline">Cancel</Button>
                      <Button type="submit" disabled={updating}>
                        {updating ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Updating...
                          </>
                        ) : (
                          "Update Password"
                        )}
                      </Button>
                    </CardFooter>
                  </form>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Two-Factor Authentication</CardTitle>
                    <CardDescription>Add an extra layer of security to your account</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col space-y-4">
                      <div className="flex items-start space-x-4">
                        <Shield className="h-8 w-8 text-muted-foreground mt-1" />
                        <div>
                          <h4 className="text-sm font-medium">Protect your account with 2FA</h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            Two-factor authentication adds an additional layer of security to your account by requiring more than just a password to sign in.
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">
                      Enable Two-Factor Authentication
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>


            </Tabs>
          </div>
        </div>
      )}
    </DashboardShell>
  )
}
