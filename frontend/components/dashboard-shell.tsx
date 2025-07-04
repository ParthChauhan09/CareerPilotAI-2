"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { UserNav } from "@/components/user-nav"
import { ModeToggle } from "@/components/mode-toggle"
import { SideNav } from "@/components/side-nav"
import { Loader2, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

interface DashboardShellProps {
  children: React.ReactNode
}

export function DashboardShell({ children }: DashboardShellProps) {
  const { isAuthenticated, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      console.log("Not authenticated, redirecting to login")
      router.push("/login")
    }
  }, [isAuthenticated, loading, router])

  // Close mobile sidebar when route changes
  useEffect(() => {
    setIsMobileSidebarOpen(false)
  }, [pathname])

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground animate-pulse">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Mobile sidebar trigger - only visible on small screens */}
      <Sheet open={isMobileSidebarOpen} onOpenChange={setIsMobileSidebarOpen}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="lg:hidden fixed top-4 left-4 z-50 h-10 w-10 rounded-full shadow-md"
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-[280px]">
          <SideNav className="w-full border-none" />
        </SheetContent>
      </Sheet>

      {/* Desktop sidebar - hidden on small screens */}
      <SideNav className="hidden lg:block" />

      {/* Main content area */}
      <div className="flex-1 flex flex-col">
        {/* Top bar with user controls - only visible on mobile */}
        <header className="sticky top-0 z-40 flex h-16 items-center justify-end gap-4 border-b bg-background/80 backdrop-blur-md px-4 md:px-6 transition-all duration-200 lg:hidden">
          <ModeToggle />
          <UserNav />
        </header>

        {/* Main content with enhanced background pattern */}
        <main className="flex-1 space-y-6 p-4 pt-6 md:p-8 relative">
          {/* Improved background pattern with subtle animation */}
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_60%,transparent_100%)] dark:bg-[radial-gradient(#1f2937_1px,transparent_1px)] opacity-70" />

          {/* Content with animation */}
          <div className="animate-fade-in">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
