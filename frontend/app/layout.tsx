import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "@/app/globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/lib/auth-context"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

// Force dynamic rendering to avoid SSG issues


export const metadata: Metadata = {
  title: "CareerPilotAI",
  description: "Generate professional resumes, cover letters, and LinkedIn bios",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased transition-colors duration-300`}>
        <AuthProvider>
          <ThemeProvider>
            <div className="animate-fade-in [animation-delay:100ms] transition-all duration-300 w-full">
              {children}
            </div>
            <Toaster />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
