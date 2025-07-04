"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Briefcase, FileText, FileEdit, Linkedin, Search } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"

export function MainNav() {
  const pathname = usePathname()
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  // Check if the current URL has a specific tab parameter
  const getIsTabActive = (tabName: string) => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const currentTab = urlParams.get('tab');
      return currentTab === tabName;
    }
    return false;
  }

  const navItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      active: pathname === "/dashboard" && !pathname.includes("?tab="),
    },
    {
      name: "Resumes",
      href: "/dashboard?tab=resume",
      active: pathname.includes("/dashboard") && getIsTabActive("resume"),
    },
    {
      name: "Cover Letters",
      href: "/dashboard?tab=coverLetter",
      active: pathname.includes("/dashboard") && getIsTabActive("coverLetter"),
    },
    {
      name: "LinkedIn",
      href: "/dashboard?tab=linkedin",
      active: pathname.includes("/dashboard") && getIsTabActive("linkedin"),
    },
  ]

  return (
    <div className="flex items-center gap-6 md:gap-10">
      <Link
        href="/dashboard"
        className="flex items-center gap-2 transition-all duration-200 hover:opacity-80"
      >
        <div className="relative">
          <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 opacity-70 blur-sm"></div>
          <div className="relative rounded-full bg-background p-1.5">
            <Briefcase className="h-6 w-6 text-primary" />
          </div>
        </div>
        <span className="hidden font-bold md:inline-block bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
          CareerPilotAI
        </span>
      </Link>

      <nav className="hidden md:flex items-center space-x-1">
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              "px-3 py-2 rounded-md text-sm font-medium transition-all duration-200",
              item.active
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-accent hover:text-foreground"
            )}
          >
            {item.name}
          </Link>
        ))}
      </nav>

      <div className={cn(
        "hidden md:flex items-center transition-all duration-300 overflow-hidden",
        isSearchOpen ? "w-64" : "w-9"
      )}>
        {isSearchOpen ? (
          <div className="flex items-center w-full rounded-md border border-input bg-background">
            <Input
              type="search"
              placeholder="Search..."
              className="border-0 focus-visible:ring-0 h-9"
            />
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-l-none"
              onClick={() => setIsSearchOpen(false)}
            >
              <Search className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-full"
            onClick={() => setIsSearchOpen(true)}
          >
            <Search className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  )
}
