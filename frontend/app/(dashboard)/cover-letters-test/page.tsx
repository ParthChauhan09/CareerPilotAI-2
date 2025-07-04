"use client"

// Force dynamic rendering to avoid SSG issues with React 19
export const dynamic = 'force-dynamic'

import { DashboardShell } from "@/components/dashboard-shell"
import { DashboardHeader } from "@/components/dashboard-header"

export default function CoverLettersTestPage() {
  return (
    <DashboardShell>
      <DashboardHeader
        heading="Cover Letters Test"
        text="This is a test page for cover letters"
      />
      <div className="mt-8">
        <p>If you can see this page, the routing is working correctly.</p>
      </div>
    </DashboardShell>
  )
}
