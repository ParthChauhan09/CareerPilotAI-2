import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight, CheckCircle2 } from "lucide-react"

export function LandingHero() {
  return (
    <section className="relative w-full max-w-full overflow-hidden pt-12 pb-16 md:pt-20 md:pb-24 lg:pt-24 lg:pb-32">
      {/* Background gradient effects */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background opacity-70" />
      <div className="absolute inset-0 -z-20 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />

      <div className="absolute top-0 right-0 -z-10 h-[600px] w-[600px] rounded-full bg-primary/10 blur-3xl opacity-50 animate-pulse-glow" />
      <div className="absolute bottom-0 left-0 -z-10 h-[500px] w-[500px] rounded-full bg-purple-500/10 blur-3xl opacity-50 animate-pulse-glow [animation-delay:1s]" />

      <div className="w-full max-w-7xl mx-auto px-4 md:px-6">
        <div className="grid gap-8 lg:grid-cols-[1fr_450px] lg:gap-16 xl:grid-cols-[1fr_600px] items-center">
          <div className="flex flex-col justify-center space-y-8">
            <div className="space-y-6 animate-fade-in">
              <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary backdrop-blur-sm">
                <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse"></span>
                AI-Powered Career Documents
              </div>
              <h1 className="text-4xl font-bold tracking-tight sm:text-6xl md:text-7xl/none">
                Land Your Dream Job with <span className="text-gradient">CareerPilotAI</span>
              </h1>
              <p className="max-w-[600px] text-muted-foreground text-lg md:text-xl leading-relaxed animate-slide-in-from-bottom">
                Create professional resumes, cover letters, and LinkedIn bios tailored to your career goals in minutes with our advanced AI platform.
              </p>
              <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-4 md:space-x-6 pt-4">
                <ul className="grid gap-3">
                  <li className="flex items-center gap-3 text-muted-foreground">
                    <div className="h-6 w-6 rounded-full bg-green-500/10 flex items-center justify-center">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    </div>
                    <span>Tailored to specific job positions</span>
                  </li>
                  <li className="flex items-center gap-3 text-muted-foreground">
                    <div className="h-6 w-6 rounded-full bg-blue-500/10 flex items-center justify-center">
                      <CheckCircle2 className="h-4 w-4 text-blue-500" />
                    </div>
                    <span>Multiple export formats (PDF, TXT)</span>
                  </li>
                  <li className="flex items-center gap-3 text-muted-foreground">
                    <div className="h-6 w-6 rounded-full bg-purple-500/10 flex items-center justify-center">
                      <CheckCircle2 className="h-4 w-4 text-purple-500" />
                    </div>
                    <span>Professional templates and formatting</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="flex flex-wrap gap-4 animate-fade-in [animation-delay:300ms]">
              <Button asChild size="lg" className="h-12 px-8 text-base rounded-full shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all duration-300 hover:scale-105">
                <Link href="/login">
                  Get Started Free
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild className="h-12 px-8 text-base rounded-full backdrop-blur-sm hover:bg-muted/50 transition-all duration-300">
                <Link href="#features">See Features</Link>
              </Button>
            </div>
          </div>

          <div className="relative hidden lg:block perspective-1000">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/30 to-purple-500/30 rounded-2xl blur-2xl -z-10 transform rotate-3 scale-105"></div>
            <div className="relative z-10 overflow-hidden rounded-2xl border border-border/50 bg-background/60 backdrop-blur-xl shadow-2xl transform transition-transform duration-500 hover:rotate-1 hover:scale-[1.02]">
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="space-y-1">
                    <h3 className="text-xl font-semibold">Professional Resume</h3>
                    <div className="flex gap-2">
                      <div className="h-1.5 w-12 bg-primary rounded-full"></div>
                      <div className="h-1.5 w-8 bg-muted rounded-full"></div>
                    </div>
                  </div>
                  <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                    <div className="h-4 w-4 rounded-full bg-green-500 animate-pulse"></div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="space-y-3">
                    <div className="h-8 w-3/4 bg-muted/50 rounded-lg animate-pulse"></div>
                    <div className="h-4 w-1/2 bg-muted/30 rounded-lg animate-pulse"></div>
                  </div>

                  <div className="space-y-3 pt-4 border-t border-border/50">
                    <div className="flex justify-between">
                      <div className="h-4 w-1/3 bg-muted/40 rounded animate-pulse"></div>
                      <div className="h-4 w-1/4 bg-muted/40 rounded animate-pulse"></div>
                    </div>
                    <div className="h-3 w-full bg-muted/20 rounded animate-pulse"></div>
                    <div className="h-3 w-full bg-muted/20 rounded animate-pulse"></div>
                    <div className="h-3 w-5/6 bg-muted/20 rounded animate-pulse"></div>
                  </div>

                  <div className="space-y-3 pt-4 border-t border-border/50">
                    <div className="flex justify-between">
                      <div className="h-4 w-1/3 bg-muted/40 rounded animate-pulse"></div>
                      <div className="h-4 w-1/4 bg-muted/40 rounded animate-pulse"></div>
                    </div>
                    <div className="h-3 w-full bg-muted/20 rounded animate-pulse"></div>
                    <div className="h-3 w-full bg-muted/20 rounded animate-pulse"></div>
                    <div className="h-3 w-4/5 bg-muted/20 rounded animate-pulse"></div>
                  </div>
                </div>

                <div className="mt-8 flex gap-3">
                  <div className="h-10 flex-1 bg-primary/10 rounded-lg flex items-center justify-center text-primary text-sm font-medium">
                    Optimize
                  </div>
                  <div className="h-10 flex-1 bg-primary text-primary-foreground rounded-lg flex items-center justify-center text-sm font-medium shadow-lg shadow-primary/20">
                    Download PDF
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Badge */}
            <div className="absolute -top-6 -right-6 z-20 animate-bounce-slow">
              <div className="glass p-4 rounded-2xl shadow-xl border border-white/20 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white font-bold">
                  AI
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium">Powered by</p>
                  <p className="text-sm font-bold">Gemini 1.5 Pro</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
