"use client"

import { useState } from "react"
import { Metadata } from "next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Mail, Phone, MapPin, Clock, MessageSquare, HelpCircle, CreditCard, Bug } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function ContactUsPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    category: "",
    message: ""
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      toast({
        title: "Message sent successfully!",
        description: "We'll get back to you within 24 hours.",
      })
      
      // Reset form
      setFormData({
        name: "",
        email: "",
        subject: "",
        category: "",
        message: ""
      })
    } catch (error) {
      toast({
        title: "Failed to send message",
        description: "Please try again or contact us directly via email.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Have questions about CareerPilotAI? We're here to help! Reach out to us through any of the channels below.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Information */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Email Support
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="font-medium">General Support</p>
                  <p className="text-sm text-muted-foreground">support@careerpilotai.com</p>
                </div>
                <div>
                  <p className="font-medium">Technical Issues</p>
                  <p className="text-sm text-muted-foreground">tech@careerpilotai.com</p>
                </div>
                <div>
                  <p className="font-medium">Billing & Payments</p>
                  <p className="text-sm text-muted-foreground">billing@careerpilotai.com</p>
                </div>
                <div>
                  <p className="font-medium">Legal & Privacy</p>
                  <p className="text-sm text-muted-foreground">legal@careerpilotai.com</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5" />
                  Phone Support
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-medium">+91-XXXXXXXXXX</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Monday to Friday: 9:00 AM - 6:00 PM IST
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Office Address
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  CareerPilotAI Technologies<br />
                  [Your Office Address]<br />
                  [City, State - PIN Code]<br />
                  India
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Response Times
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Email Support</span>
                  <span className="text-sm font-medium">24 hours</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Technical Issues</span>
                  <span className="text-sm font-medium">12 hours</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Billing Queries</span>
                  <span className="text-sm font-medium">6 hours</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Phone Support</span>
                  <span className="text-sm font-medium">Immediate</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Send us a Message</CardTitle>
                <CardDescription>
                  Fill out the form below and we'll get back to you as soon as possible.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        placeholder="Enter your full name"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        placeholder="Enter your email address"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">
                          <div className="flex items-center gap-2">
                            <MessageSquare className="h-4 w-4" />
                            General Inquiry
                          </div>
                        </SelectItem>
                        <SelectItem value="technical">
                          <div className="flex items-center gap-2">
                            <Bug className="h-4 w-4" />
                            Technical Support
                          </div>
                        </SelectItem>
                        <SelectItem value="billing">
                          <div className="flex items-center gap-2">
                            <CreditCard className="h-4 w-4" />
                            Billing & Payments
                          </div>
                        </SelectItem>
                        <SelectItem value="feature">
                          <div className="flex items-center gap-2">
                            <HelpCircle className="h-4 w-4" />
                            Feature Request
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject *</Label>
                    <Input
                      id="subject"
                      value={formData.subject}
                      onChange={(e) => handleInputChange("subject", e.target.value)}
                      placeholder="Brief description of your inquiry"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => handleInputChange("message", e.target.value)}
                      placeholder="Please provide detailed information about your inquiry..."
                      rows={6}
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* FAQ Section */}
            <Card className="mt-8">
              <CardHeader>
                <CardTitle>Frequently Asked Questions</CardTitle>
                <CardDescription>
                  Quick answers to common questions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">How do I upgrade my subscription?</h4>
                  <p className="text-sm text-muted-foreground">
                    Go to your dashboard, click on "Subscription" in the sidebar, and select your desired plan.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Can I get a refund?</h4>
                  <p className="text-sm text-muted-foreground">
                    Yes, we offer refunds within 7 days of purchase for eligible cases. Check our refund policy for details.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">How do I export my documents?</h4>
                  <p className="text-sm text-muted-foreground">
                    You can export documents in PDF, DOCX, or TXT format directly from your document view page.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Is my data secure?</h4>
                  <p className="text-sm text-muted-foreground">
                    Yes, we use industry-standard encryption and security measures to protect your data. Read our privacy policy for more details.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
