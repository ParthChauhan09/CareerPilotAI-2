"use client"

import type React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  LayoutDashboard,
  FileText,
  FileEdit,
  FileText as LinkedinIcon,
  User,
  CreditCard,
  Sparkles,
  Settings,
  Briefcase
} from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface SideNavProps extends React.HTMLAttributes<HTMLDivElement> {}

export function SideNav({ className, ...props }: SideNavProps) {
  const pathname = usePathname()

  interface NavItem {
    title: string;
    href: string;
    icon: React.ReactNode;
    active: boolean;
    badge?: number | null;
  }

  const mainNavItems: NavItem[] = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
      active: pathname === "/dashboard",
    },
    {
      title: "Resumes",
      href: "/resumes",
      icon: <FileText className="h-5 w-5" />,
      active: pathname.includes("/resumes"),
      badge: null, // Will be populated dynamically from API
    },
    {
      title: "Cover Letters",
      href: "/cover-letters",
      icon: <FileEdit className="h-5 w-5" />,
      active: pathname.includes("/cover-letters"),
      badge: null, // Will be populated dynamically from API
    },
    {
      title: "LinkedIn Bios",
      href: "/linkedin-bios",
      icon: <LinkedinIcon className="h-5 w-5" />,
      active: pathname.includes("/linkedin-bios"),
      badge: null, // Will be populated dynamically from API
    },
  ]

  const accountNavItems = [
    {
      title: "Profile",
      href: "/profile",
      icon: <User className="h-5 w-5" />,
      active: pathname === "/profile",
    },
    {
      title: "Subscription",
      href: "/subscription",
      icon: <CreditCard className="h-5 w-5" />,
      active: pathname === "/subscription",
    },
    {
      title: "Settings",
      href: "/settings",
      icon: <Settings className="h-5 w-5" />,
      active: pathname === "/settings",
    },
  ]

  return (
    <div
      className={cn(
        "relative border-r bg-card h-screen sticky top-0 w-[240px]",
        className
      )}
      {...props}
    >
      <div className="space-y-2 py-4 flex flex-col h-full">
        {/* Logo */}
        <div className="flex items-center mb-6 px-4">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 transition-all duration-300 hover:opacity-80"
          >
            <div className="relative">
              <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 opacity-70 blur-sm animate-pulse"></div>
              <div className="relative rounded-full bg-background p-1.5 transition-transform duration-300 hover:scale-110">
                <Briefcase className="h-6 w-6 text-primary" />
              </div>
            </div>
            <span className="font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              CareerPilotAI
            </span>
          </Link>
        </div>

        {/* Pro badge */}
        <div className="flex items-center justify-center px-4">
          <Link href="/subscription" className="w-full">
            <div className="flex w-full items-center justify-between rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-3 py-2 text-white transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20 hover:scale-[1.02]">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 animate-pulse" />
                <span className="text-sm font-medium">Pro Plan</span>
              </div>
              <Badge variant="outline" className="border-white/20 text-white">Active</Badge>
            </div>
          </Link>
        </div>

        {/* Main navigation */}
        <div className="px-3 py-2 flex-grow">
          <h2 className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Documents
          </h2>
          <div className="space-y-1">
            {mainNavItems.map((item, index) => (
              <Button
                key={index}
                variant={item.active ? "secondary" : "ghost"}
                className={`w-full justify-start transition-all duration-300 hover:translate-x-1`}
                asChild
              >
                <Link href={item.href}>
                  <span className={cn(
                    "transition-all duration-300",
                    item.active ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                  )}>
                    {item.icon}
                  </span>
                  <span className="ml-2">{item.title}</span>
                  {item.badge && (
                    <Badge className="ml-auto bg-primary/10 text-primary hover:bg-primary/20 transition-all duration-300">
                      {item.badge}
                    </Badge>
                  )}
                </Link>
              </Button>
            ))}
          </div>
        </div>

        {/* Account navigation */}
        <div className="px-3 py-2 mt-auto">
          <h2 className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Account
          </h2>
          <div className="space-y-1">
            {accountNavItems.map((item, index) => (
              <Button
                key={index}
                variant={item.active ? "secondary" : "ghost"}
                className={`w-full justify-start transition-all duration-300 hover:translate-x-1`}
                asChild
              >
                <Link href={item.href}>
                  <span className={cn(
                    "transition-all duration-300",
                    item.active ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                  )}>
                    {item.icon}
                  </span>
                  <span className="ml-2">{item.title}</span>
                </Link>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
