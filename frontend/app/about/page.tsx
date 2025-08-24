// Force dynamic rendering to avoid SSG issues with React 19
export const dynamic = 'force-dynamic'

import { LandingHeader } from "@/components/landing-header"
import { LandingFooter } from "@/components/landing-footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Briefcase, Users, Target, Zap, Award, Rocket, Brain, Shield } from "lucide-react"
import Link from "next/link"

export default function AboutPage() {
  const features = [
    {
      icon: Brain,
      title: "AI-Powered Generation",
      description: "Advanced Gemini AI technology creates personalized, professional documents tailored to your career goals."
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Generate professional resumes, cover letters, and LinkedIn bios in seconds, not hours."
    },
    {
      icon: Shield,
      title: "Privacy First",
      description: "Your personal data is encrypted and secure. We never share your information with third parties."
    },
    {
      icon: Award,
      title: "Professional Quality",
      description: "LaTeX-based templates ensure your documents look polished and ATS-friendly."
    }
  ]

  const stats = [
    { number: "10,000+", label: "Documents Generated" },
    { number: "95%", label: "User Satisfaction" },
    { number: "50+", label: "Industries Covered" },
    { number: "24/7", label: "AI Availability" }
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <LandingHeader />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 md:py-32 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10"></div>
          <div className="container px-4 md:px-6 relative">
            <div className="max-w-4xl mx-auto text-center space-y-8">
              <Badge variant="outline" className="animate-fade-in">
                <Briefcase className="w-3 h-3 mr-1" />
                About CareerPilotAI
              </Badge>
              
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight animate-slide-in-from-bottom">
                Empowering Your{" "}
                <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  Career Journey
                </span>
              </h1>
              
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed animate-fade-in [animation-delay:200ms]">
                CareerPilotAI is revolutionizing how professionals create career documents. 
                Using cutting-edge AI technology, we help you craft compelling resumes, 
                cover letters, and LinkedIn profiles that get results.
              </p>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-20 bg-muted/30">
          <div className="container px-4 md:px-6">
            <div className="max-w-6xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                  <div className="flex items-center gap-2">
                    <Target className="w-6 h-6 text-primary" />
                    <h2 className="text-3xl font-bold">Our Mission</h2>
                  </div>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    We believe everyone deserves access to professional-quality career documents. 
                    Our mission is to democratize career success by providing AI-powered tools 
                    that level the playing field for job seekers worldwide.
                  </p>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    Whether you're a recent graduate, career changer, or seasoned professional, 
                    CareerPilotAI adapts to your unique background and goals to create documents 
                    that truly represent your potential.
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                  {stats.map((stat, index) => (
                    <Card key={index} className="text-center p-6 border-primary/10 hover:border-primary/20 transition-colors">
                      <CardContent className="p-0">
                        <div className="text-3xl font-bold text-primary mb-2">{stat.number}</div>
                        <div className="text-sm text-muted-foreground">{stat.label}</div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20">
          <div className="container px-4 md:px-6">
            <div className="max-w-6xl mx-auto">
              <div className="text-center space-y-4 mb-16">
                <h2 className="text-3xl md:text-4xl font-bold">Why Choose CareerPilotAI?</h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  We combine advanced AI technology with career expertise to deliver exceptional results.
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8">
                {features.map((feature, index) => (
                  <Card key={index} className="p-6 border-primary/10 hover:border-primary/20 transition-all duration-300 hover:shadow-lg">
                    <CardContent className="p-0">
                      <div className="flex items-start gap-4">
                        <div className="p-3 rounded-lg bg-primary/10">
                          <feature.icon className="w-6 h-6 text-primary" />
                        </div>
                        <div className="space-y-2">
                          <h3 className="text-xl font-semibold">{feature.title}</h3>
                          <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-20 bg-muted/30">
          <div className="container px-4 md:px-6">
            <div className="max-w-4xl mx-auto text-center space-y-8">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Users className="w-6 h-6 text-primary" />
                <h2 className="text-3xl md:text-4xl font-bold">Built by Career Experts</h2>
              </div>
              
              <p className="text-xl text-muted-foreground leading-relaxed">
                Our team combines decades of HR experience, recruitment expertise, and 
                cutting-edge AI technology. We understand what employers look for and 
                how to make your application stand out in today's competitive job market.
              </p>
              
              <div className="grid md:grid-cols-3 gap-6 mt-12">
                <Card className="p-6 text-center border-primary/10">
                  <CardContent className="p-0">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Brain className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-2">AI Specialists</h3>
                    <p className="text-sm text-muted-foreground">Expert machine learning engineers</p>
                  </CardContent>
                </Card>
                
                <Card className="p-6 text-center border-primary/10">
                  <CardContent className="p-0">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Users className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-2">HR Professionals</h3>
                    <p className="text-sm text-muted-foreground">Seasoned recruitment experts</p>
                  </CardContent>
                </Card>
                
                <Card className="p-6 text-center border-primary/10">
                  <CardContent className="p-0">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Rocket className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-2">Career Coaches</h3>
                    <p className="text-sm text-muted-foreground">Professional development specialists</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="container px-4 md:px-6">
            <div className="max-w-4xl mx-auto text-center space-y-8">
              <h2 className="text-3xl md:text-4xl font-bold">Ready to Transform Your Career?</h2>
              <p className="text-xl text-muted-foreground">
                Join thousands of professionals who have accelerated their careers with CareerPilotAI.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" variant="gradient" className="animate-fade-in">
                  <Link href="/register">Get Started Free</Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href="/#pricing">View Pricing</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <LandingFooter />
    </div>
  )
}
