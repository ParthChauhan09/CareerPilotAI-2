"use client"

import { useState, useEffect } from "react"
import { DashboardShell } from "@/components/dashboard-shell"
import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Check, Loader2 } from "lucide-react"
import { paymentAPI, userAPI } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import type { Plan, UserProfile } from "@/lib/types"

export default function SubscriptionPage() {
  const [plans, setPlans] = useState<Plan[]>([])
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [subscribingPlan, setSubscribingPlan] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      // Try to fetch from API
      try {
        const [plansRes, profileRes] = await Promise.all([paymentAPI.getPlans(), userAPI.getProfile()])

        if (plansRes.data.plans && plansRes.data.plans.length > 0) {
          setPlans(plansRes.data.plans)
        } else {
          // Fallback to mock data if API returns empty plans
          setPlans(getMockPlans())
        }

        setProfile(profileRes.data)
      } catch (apiError) {
        console.error("API error:", apiError)
        // Fallback to mock data
        setPlans(getMockPlans())
        setProfile({
          id: "mock-user-id",
          name: "Demo User",
          email: "demo@example.com",
          plan: "free",
          createdAt: new Date().toISOString()
        })
      }
    } catch (error) {
      toast({
        title: "Error loading data",
        description: "Could not load subscription information. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Mock plans data for development/demo (prices in Indian Rupees)
  const getMockPlans = () => {
    return [
      {
        id: "free",
        name: "Free",
        price: 0,
        currency: "inr",
        description: "Basic plan for casual users",
        features: [
          "1 Resume Generation",
          "1 Cover Letter Generation",
          "1 LinkedIn Bio Generation",
          "Basic Templates",
          "PDF Export"
        ]
      },
      {
        id: "basic",
        name: "Basic",
        price: 499,
        currency: "inr",
        description: "Perfect for job seekers",
        features: [
          "5 Resume Generations",
          "5 Cover Letter Generations",
          "3 LinkedIn Bio Generations",
          "Premium Templates",
          "PDF & DOCX Export",
          "Priority Support"
        ]
      },
      {
        id: "premium",
        name: "Premium",
        price: 999,
        currency: "inr",
        description: "For professionals and power users",
        features: [
          "Unlimited Resume Generations",
          "Unlimited Cover Letter Generations",
          "Unlimited LinkedIn Bio Generations",
          "All Premium Templates",
          "All Export Formats",
          "Priority Support",
          "Advanced AI Features"
        ]
      }
    ]
  }

  const handleSubscribe = async (planType: string) => {
    setSubscribingPlan(planType)
    try {
      const res = await paymentAPI.createOrder({ planType })
      const { orderId, amount, currency, keyId, planName, userEmail, userName } = res.data

      // Initialize Razorpay checkout
      const options = {
        key: keyId,
        amount: amount,
        currency: currency,
        name: "CareerPilotAI",
        description: `Upgrade to ${planName} Plan`,
        order_id: orderId,
        prefill: {
          name: userName,
          email: userEmail,
        },
        theme: {
          color: "#3B82F6",
        },
        handler: async function (response: any) {
          try {
            // Verify payment on backend
            await paymentAPI.verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              planType: planType,
            })

            toast({
              title: "Payment successful!",
              description: `You have successfully upgraded to the ${planName} plan.`,
            })

            // Refresh the page to show updated plan
            window.location.reload()
          } catch (error) {
            toast({
              title: "Payment verification failed",
              description: "Please contact support if the amount was deducted.",
              variant: "destructive",
            })
          }
        },
        modal: {
          ondismiss: function () {
            setSubscribingPlan(null)
          },
        },
      }

      // Load Razorpay script and open checkout
      const script = document.createElement("script")
      script.src = "https://checkout.razorpay.com/v1/checkout.js"
      script.onload = () => {
        const rzp = new (window as any).Razorpay(options)
        rzp.open()
      }
      script.onerror = () => {
        toast({
          title: "Payment gateway error",
          description: "Failed to load payment gateway. Please try again.",
          variant: "destructive",
        })
        setSubscribingPlan(null)
      }
      document.body.appendChild(script)
    } catch (error) {
      toast({
        title: "Subscription failed",
        description: "Could not process your subscription request. Please try again.",
        variant: "destructive",
      })
      setSubscribingPlan(null)
    }
  }

  return (
    <DashboardShell>
      <DashboardHeader heading="Subscription Plans" text="Choose the right plan for your career needs" />

      {loading ? (
        <div className="grid gap-6 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="flex flex-col">
              <CardHeader>
                <Skeleton className="h-5 w-[100px]" />
                <Skeleton className="h-8 w-[120px]" />
              </CardHeader>
              <CardContent className="flex-1 space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-10 w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-3">
          {plans.map((plan) => {
            const isCurrentPlan = profile?.plan === plan.name.toLowerCase()

            return (
              <Card key={plan.id} className="flex flex-col">
                <CardHeader>
                  <CardDescription>{isCurrentPlan && <Badge>Current Plan</Badge>}</CardDescription>
                  <CardTitle>{plan.name}</CardTitle>
                  <div className="text-3xl font-bold">
                    {plan.price === 0 ? '0' : `₹${plan.price}`}
                    <span className="text-sm font-normal text-muted-foreground">/month</span>
                  </div>
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="mb-4 text-sm text-muted-foreground">{plan.description}</p>
                  <ul className="space-y-2 text-sm">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center">
                        <Check className="mr-2 h-4 w-4 text-primary" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full"
                    variant={isCurrentPlan ? "outline" : "default"}
                    disabled={isCurrentPlan || subscribingPlan === plan.name.toLowerCase()}
                    onClick={() => handleSubscribe(plan.name.toLowerCase())}
                  >
                    {subscribingPlan === plan.name.toLowerCase() ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : isCurrentPlan ? (
                      "Current Plan"
                    ) : (
                      "Subscribe"
                    )}
                  </Button>
                </CardFooter>
              </Card>
            )
          })}
        </div>
      )}
    </DashboardShell>
  )
}
