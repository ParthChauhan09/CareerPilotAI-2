"use client"

import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { Briefcase, LogIn, Menu, UserPlus } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export function LandingHeader() {
  const { isAuthenticated } = useAuth()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-all duration-200">
      <div className="w-full max-w-none flex h-16 items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center space-x-2 py-2 transition-all duration-200 hover:opacity-80"
        >
          <Briefcase className="h-5 w-5 text-primary animate-fade-in" />
          <span className="font-bold text-base bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70 animate-fade-in">
            CareerPilotAI
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8 text-sm font-medium">
          <Link
            href="/#features"
            className="relative px-1 py-2 transition-colors hover:text-foreground text-foreground/70 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-primary after:transition-all hover:after:w-full"
          >
            Features
          </Link>
          <Link
            href="/#pricing"
            className="relative px-1 py-2 transition-colors hover:text-foreground text-foreground/70 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-primary after:transition-all hover:after:w-full"
          >
            Pricing
          </Link>
          <Link
            href="/about"
            className="relative px-1 py-2 transition-colors hover:text-foreground text-foreground/70 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-primary after:transition-all hover:after:w-full"
          >
            About
          </Link>
          <Link
            href="/blog"
            className="relative px-1 py-2 transition-colors hover:text-foreground text-foreground/70 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-primary after:transition-all hover:after:w-full"
          >
            Blog
          </Link>
          <Link
            href="/contact-us"
            className="relative px-1 py-2 transition-colors hover:text-foreground text-foreground/70 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-primary after:transition-all hover:after:w-full"
          >
            Contact
          </Link>
        </nav>

        {/* Right Side Actions */}
        <div className="flex items-center space-x-3 py-2">
          <ModeToggle />

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            {isAuthenticated ? (
              <Button asChild variant="gradient" size="sm" className="animate-fade-in">
                <Link href="/dashboard">Dashboard</Link>
              </Button>
            ) : (
              <>
                <Button variant="ghost" asChild size="sm" className="group">
                  <Link href="/login" className="flex items-center">
                    <LogIn className="mr-1 h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    <span>Login</span>
                  </Link>
                </Button>
                <Button asChild variant="gradient" size="sm" className="animate-fade-in">
                  <Link href="/register" className="flex items-center">
                    <UserPlus className="mr-1 h-4 w-4" />
                    <span>Register</span>
                  </Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Trigger */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden rounded-full">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="border-l-primary/10 w-[250px]">
              <div className="flex items-center space-x-2 mb-6">
                <Briefcase className="h-5 w-5 text-primary" />
                <span className="font-bold text-base bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                  CareerPilotAI
                </span>
              </div>
              <nav className="flex flex-col space-y-4 text-sm font-medium">
                <Link
                  href="/#features"
                  className="flex items-center px-2 py-2 rounded-md transition-colors hover:bg-accent hover:text-foreground"
                >
                  Features
                </Link>
                <Link
                  href="/#pricing"
                  className="flex items-center px-2 py-2 rounded-md transition-colors hover:bg-accent hover:text-foreground"
                >
                  Pricing
                </Link>
                <Link
                  href="/about"
                  className="flex items-center px-2 py-2 rounded-md transition-colors hover:bg-accent hover:text-foreground"
                >
                  About
                </Link>
                <Link
                  href="/blog"
                  className="flex items-center px-2 py-2 rounded-md transition-colors hover:bg-accent hover:text-foreground"
                >
                  Blog
                </Link>
                <Link
                  href="/contact-us"
                  className="flex items-center px-2 py-2 rounded-md transition-colors hover:bg-accent hover:text-foreground"
                >
                  Contact
                </Link>

                <div className="h-px w-full bg-border my-2"></div>

                {isAuthenticated ? (
                  <Button asChild variant="gradient" size="sm" className="w-full">
                    <Link href="/dashboard">Dashboard</Link>
                  </Button>
                ) : (
                  <>
                    <Button asChild variant="outline" size="sm" className="w-full">
                      <Link href="/login" className="flex items-center justify-center">
                        <LogIn className="mr-1 h-4 w-4" />
                        <span>Login</span>
                      </Link>
                    </Button>
                    <Button asChild variant="gradient" size="sm" className="w-full">
                      <Link href="/register" className="flex items-center justify-center">
                        <UserPlus className="mr-1 h-4 w-4" />
                        <span>Register</span>
                      </Link>
                    </Button>
                  </>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
