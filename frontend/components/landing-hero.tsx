import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight, CheckCircle2 } from "lucide-react"

export function LandingHero() {
  return (
    <section className="relative w-full overflow-hidden pt-4 pb-8 md:pt-6 md:pb-16 lg:pt-8 lg:pb-20">
      {/* Background gradient effects */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background/10 via-background/50 to-background opacity-50" />
      <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_center,rgba(var(--primary-rgb),0.12),transparent_50%)]" />
      <div className="absolute top-0 right-0 -z-10 h-[500px] w-[500px] rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute bottom-0 left-0 -z-10 h-[500px] w-[500px] rounded-full bg-primary/5 blur-3xl" />

      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
          <div className="flex flex-col justify-center space-y-8">
            <div className="space-y-6 animate-fade-in">
              <div className="inline-flex items-center rounded-full border bg-background px-3 py-1 text-sm">
                <span className="flex h-2 w-2 rounded-full bg-primary"></span>
                <span className="ml-2 text-foreground">AI-Powered Career Documents</span>
              </div>
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl md:text-6xl/none bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                Land Your Dream Job with CareerPilotAI
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl animate-slide-in-from-bottom">
                Create professional resumes, cover letters, and LinkedIn bios tailored to your career goals in minutes with our AI-powered platform.
              </p>
              <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-4 md:space-x-6">
                <ul className="grid gap-2">
                  <li className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    <span>Tailored to specific job positions</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    <span>Multiple export formats (PDF, DOCX, TXT)</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    <span>Professional templates and formatting</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="flex flex-wrap gap-4 animate-fade-in [animation-delay:300ms]">
              <Button asChild size="lg" variant="gradient" className="group">
                <Link href="/login">
                  Get Started Free
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild className="backdrop-blur-sm">
                <Link href="#features">See Features</Link>
              </Button>
            </div>
          </div>
          <div className="relative hidden lg:block">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/10 rounded-lg blur-xl -z-10"></div>
            <div className="relative z-10 overflow-hidden rounded-lg border bg-background/80 backdrop-blur shadow-xl">
              <div className="p-6">
                <div className="space-y-2 mb-4">
                  <h3 className="text-xl font-semibold">Professional Resume</h3>
                  <div className="h-1 w-12 bg-primary rounded-full"></div>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="h-6 w-3/4 bg-muted rounded animate-pulse"></div>
                    <div className="h-6 w-1/2 bg-muted rounded animate-pulse"></div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 w-full bg-muted/60 rounded animate-pulse"></div>
                    <div className="h-4 w-full bg-muted/60 rounded animate-pulse"></div>
                    <div className="h-4 w-3/4 bg-muted/60 rounded animate-pulse"></div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-5 w-1/3 bg-muted/80 rounded animate-pulse"></div>
                    <div className="h-4 w-full bg-muted/60 rounded animate-pulse"></div>
                    <div className="h-4 w-full bg-muted/60 rounded animate-pulse"></div>
                    <div className="h-4 w-2/3 bg-muted/60 rounded animate-pulse"></div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-5 w-1/3 bg-muted/80 rounded animate-pulse"></div>
                    <div className="h-4 w-full bg-muted/60 rounded animate-pulse"></div>
                    <div className="h-4 w-5/6 bg-muted/60 rounded animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2 z-20">
              <div className="relative h-24 w-24 rounded-full border-4 border-background bg-primary/10 backdrop-blur flex items-center justify-center shadow-lg animate-bounce-slow">
                <span className="text-xs font-bold text-center">AI-Powered</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
