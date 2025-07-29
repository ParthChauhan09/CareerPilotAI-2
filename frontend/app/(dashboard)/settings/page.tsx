"use client"

import { useState, useEffect } from "react"
import { DashboardShell } from "@/components/dashboard-shell"
import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { userAPI } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Lock, Eye, EyeOff, Mail, Moon, Sun, FileText, ExternalLink } from "lucide-react"
import Link from "next/link"
import { useTheme } from "next-themes"

export default function SettingsPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const { toast } = useToast()
  const { theme, setTheme } = useTheme()

  // Privacy settings
  const [twoFactorAuth, setTwoFactorAuth] = useState(false)
  const [showEmail, setShowEmail] = useState(true)

  // Appearance settings
  const [currentTheme, setCurrentTheme] = useState(theme || "system")

  useEffect(() => {
    // Simulate loading user settings
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const handleSavePrivacy = async () => {
    setSaving(true)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      toast({
        title: "Settings updated",
        description: "Your privacy settings have been saved successfully",
      })
    } catch (error) {
      toast({
        title: "Failed to save settings",
        description: "There was an error saving your privacy settings",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const handleThemeChange = (value: string) => {
    setCurrentTheme(value)
    setTheme(value)

    toast({
      title: "Theme updated",
      description: `Theme changed to ${value}`,
    })
  }

  return (
    <DashboardShell>
      <DashboardHeader heading="Settings" text="Manage your application settings and preferences" />

      <Tabs defaultValue="privacy" className="space-y-6">
        <TabsList>
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="legal">Legal</TabsTrigger>
        </TabsList>

        <TabsContent value="privacy" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                <span>Privacy Settings</span>
              </CardTitle>
              <CardDescription>
                Manage your privacy and security preferences
              </CardDescription>
            </CardHeader>
            {loading ? (
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Skeleton className="h-5 w-[250px]" />
                  <Skeleton className="h-4 w-[400px]" />
                  <Skeleton className="h-8 w-[60px]" />
                </div>
                <Separator />
                <div className="space-y-2">
                  <Skeleton className="h-5 w-[250px]" />
                  <Skeleton className="h-4 w-[400px]" />
                  <Skeleton className="h-8 w-[60px]" />
                </div>
              </CardContent>
            ) : (
              <>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="two-factor">Two-Factor Authentication</Label>
                      <p className="text-sm text-muted-foreground">
                        Add an extra layer of security to your account
                      </p>
                    </div>
                    <Switch
                      id="two-factor"
                      checked={twoFactorAuth}
                      onCheckedChange={setTwoFactorAuth}
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="show-email">Show Email Address</Label>
                      <p className="text-sm text-muted-foreground">
                        Allow your email to be visible to other users
                      </p>
                    </div>
                    <Switch
                      id="show-email"
                      checked={showEmail}
                      onCheckedChange={setShowEmail}
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={handleSavePrivacy} disabled={saving}>
                    {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Changes
                  </Button>
                </CardFooter>
              </>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {currentTheme === "dark" ? (
                  <Moon className="h-5 w-5" />
                ) : (
                  <Sun className="h-5 w-5" />
                )}
                <span>Appearance Settings</span>
              </CardTitle>
              <CardDescription>
                Customize the look and feel of the application
              </CardDescription>
            </CardHeader>
            {loading ? (
              <CardContent className="space-y-4">
                <Skeleton className="h-10 w-full" />
              </CardContent>
            ) : (
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Theme</Label>
                    <div className="flex flex-wrap gap-4">
                      <Button
                        variant={currentTheme === "light" ? "default" : "outline"}
                        className="flex items-center gap-2"
                        onClick={() => handleThemeChange("light")}
                      >
                        <Sun className="h-4 w-4" />
                        Light
                      </Button>
                      <Button
                        variant={currentTheme === "dark" ? "default" : "outline"}
                        className="flex items-center gap-2"
                        onClick={() => handleThemeChange("dark")}
                      >
                        <Moon className="h-4 w-4" />
                        Dark
                      </Button>
                      <Button
                        variant={currentTheme === "system" ? "default" : "outline"}
                        className="flex items-center gap-2"
                        onClick={() => handleThemeChange("system")}
                      >
                        <span>System</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="legal" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                <span>Legal Information</span>
              </CardTitle>
              <CardDescription>
                Review our policies and legal documents
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-3">
                  <h4 className="font-medium">Policies</h4>
                  <div className="space-y-2">
                    <Link
                      href="/privacy-policy"
                      className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors group"
                      target="_blank"
                    >
                      <div>
                        <p className="font-medium">Privacy Policy</p>
                        <p className="text-sm text-muted-foreground">How we collect and use your data</p>
                      </div>
                      <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-foreground" />
                    </Link>
                    <Link
                      href="/terms-and-conditions"
                      className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors group"
                      target="_blank"
                    >
                      <div>
                        <p className="font-medium">Terms & Conditions</p>
                        <p className="text-sm text-muted-foreground">Service terms and user agreements</p>
                      </div>
                      <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-foreground" />
                    </Link>
                  </div>
                </div>
                <div className="space-y-3">
                  <h4 className="font-medium">Support</h4>
                  <div className="space-y-2">
                    <Link
                      href="/cancellation-refund"
                      className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors group"
                      target="_blank"
                    >
                      <div>
                        <p className="font-medium">Refund Policy</p>
                        <p className="text-sm text-muted-foreground">Cancellation and refund terms</p>
                      </div>
                      <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-foreground" />
                    </Link>
                    <Link
                      href="/shipping-delivery"
                      className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors group"
                      target="_blank"
                    >
                      <div>
                        <p className="font-medium">Delivery Policy</p>
                        <p className="text-sm text-muted-foreground">Digital service delivery terms</p>
                      </div>
                      <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-foreground" />
                    </Link>
                    <Link
                      href="/contact-us"
                      className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors group"
                      target="_blank"
                    >
                      <div>
                        <p className="font-medium">Contact Us</p>
                        <p className="text-sm text-muted-foreground">Get help and support</p>
                      </div>
                      <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-foreground" />
                    </Link>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardShell>
  )
}
