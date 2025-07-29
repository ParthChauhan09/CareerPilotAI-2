"use client"

import { DashboardShell } from "@/components/dashboard-shell"
import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { XCircle, ArrowLeft, CreditCard } from "lucide-react"
import Link from "next/link"

export default function PaymentCancelPage() {
  return (
    <DashboardShell>
      <DashboardHeader
        heading="Payment Cancelled"
        text="Your payment was cancelled or failed to process"
      />

      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
            <CardTitle className="text-2xl">Payment Cancelled</CardTitle>
            <CardDescription>
              Your payment was not processed. No charges have been made to your account.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg bg-muted p-4">
              <h4 className="font-medium mb-2">What happened?</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• You cancelled the payment process</li>
                <li>• Payment gateway encountered an error</li>
                <li>• Network connectivity issues</li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <Button asChild className="w-full">
                <Link href="/subscription">
                  <CreditCard className="mr-2 h-4 w-4" />
                  Try Again
                </Link>
              </Button>
              
              <Button variant="outline" asChild className="w-full">
                <Link href="/dashboard">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Dashboard
                </Link>
              </Button>
            </div>

            <div className="text-center text-sm text-muted-foreground">
              <p>Need help? Contact our support team for assistance.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  )
}
