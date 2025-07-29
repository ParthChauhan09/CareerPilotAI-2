"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { DashboardShell } from "@/components/dashboard-shell"
import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, ArrowRight, Home } from "lucide-react"
import Link from "next/link"

export default function PaymentSuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [paymentId, setPaymentId] = useState<string | null>(null)

  useEffect(() => {
    // Get payment ID from URL parameters if available
    const razorpayPaymentId = searchParams.get("razorpay_payment_id")
    if (razorpayPaymentId) {
      setPaymentId(razorpayPaymentId)
    }
  }, [searchParams])

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Payment Successful"
        text="Your subscription has been activated successfully"
      />

      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl">Payment Successful!</CardTitle>
            <CardDescription>
              Thank you for upgrading your CareerPilotAI subscription. Your new plan is now active.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {paymentId && (
              <div className="rounded-lg bg-muted p-3">
                <p className="text-sm text-muted-foreground">Payment ID:</p>
                <p className="font-mono text-sm">{paymentId}</p>
              </div>
            )}
            
            <div className="space-y-2">
              <Button asChild className="w-full">
                <Link href="/subscription">
                  View Subscription Details
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              
              <Button variant="outline" asChild className="w-full">
                <Link href="/dashboard">
                  <Home className="mr-2 h-4 w-4" />
                  Go to Dashboard
                </Link>
              </Button>
            </div>

            <div className="text-center text-sm text-muted-foreground">
              <p>You can now enjoy all the features of your upgraded plan!</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  )
}
