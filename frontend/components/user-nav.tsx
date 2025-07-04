"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuShortcut,
} from "@/components/ui/dropdown-menu"
import {
  CreditCard,
  LogOut,
  Settings,
  User,
  Bell,
  Sparkles,
  HelpCircle,
  ChevronDown
} from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"

export function UserNav() {
  const { user, logout } = useAuth()
  const [notifications] = useState(3)

  const handleLogout = async () => {
    await logout()
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

  // Generate a consistent color based on the user's name
  const getUserColor = () => {
    if (!user?.name) return "bg-blue-500"

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

    // Simple hash function to get a consistent color for a user
    const hash = user.name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
    return colors[hash % colors.length]
  }

  return (
    <div className="flex items-center gap-2">
      {/* User menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative flex items-center gap-2 rounded-full pl-2 pr-1">
            <Avatar className={`h-8 w-8 ${getUserColor()} text-white`}>
              <AvatarImage src="" alt={user?.name || "User"} />
              <AvatarFallback className="text-white font-semibold">
                {user?.name ? getInitials(user.name) : "U"}
              </AvatarFallback>
            </Avatar>
            <span className="hidden text-sm font-medium md:inline-block">
              {user?.name?.split(" ")[0] || "User"}
            </span>
            <ChevronDown className="h-4 w-4 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end">
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{user?.name}</p>
              <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem asChild>
              <Link href="/profile" className="flex w-full cursor-pointer items-center">
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
                <DropdownMenuShortcut>⇧P</DropdownMenuShortcut>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/subscription" className="flex w-full cursor-pointer items-center">
                <CreditCard className="mr-2 h-4 w-4" />
                <span>Subscription</span>
                <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/settings" className="flex w-full cursor-pointer items-center">
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
                <DropdownMenuShortcut>⌘,</DropdownMenuShortcut>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={handleLogout}
            className="text-red-600 focus:bg-red-100 focus:text-red-600 dark:focus:bg-red-950 dark:focus:text-red-500"
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
            <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
