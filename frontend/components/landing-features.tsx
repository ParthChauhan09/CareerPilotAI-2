import { FileText, FileEdit, Linkedin, Download, Zap, FolderArchive, Sparkles, Shield, Clock } from "lucide-react"
import { cn } from "@/lib/utils"

export function LandingFeatures() {
  const features = [
    {
      icon: <FileText className="h-6 w-6 text-primary" />,
      title: "AI Resume Builder",
      description: "Create professional resumes tailored to specific job positions with our Gemini-powered AI generator."
    },
    {
      icon: <FileEdit className="h-6 w-6 text-primary" />,
      title: "Cover Letter Generator",
      description: "Generate personalized cover letters that highlight your skills and experience for any job application."
    },
    {
      icon: <Linkedin className="h-6 w-6 text-primary" />,
      title: "LinkedIn Bio Creator",
      description: "Craft engaging LinkedIn bios that showcase your professional brand and attract recruiters."
    },
    {
      icon: <Download className="h-6 w-6 text-primary" />,
      title: "Multiple Export Formats",
      description: "Export your documents in PDF, DOCX, or TXT formats based on your subscription plan."
    },
    {
      icon: <Sparkles className="h-6 w-6 text-primary" />,
      title: "Premium Templates",
      description: "Access professionally designed templates with our Basic and Premium plans for standout documents."
    },
    {
      icon: <FolderArchive className="h-6 w-6 text-primary" />,
      title: "Document Management",
      description: "Store, organize, and access all your career documents in one secure location."
    }
  ]

  const howItWorks = [
    {
      number: "01",
      title: "Create an Account",
      description: "Sign up for free and get instant access to our AI-powered document generation tools."
    },
    {
      number: "02",
      title: "Enter Your Details",
      description: "Fill in your professional information, skills, and experience in our user-friendly forms."
    },
    {
      number: "03",
      title: "Generate Documents",
      description: "Our AI instantly creates tailored resumes, cover letters, and LinkedIn bios based on your input."
    },
    {
      number: "04",
      title: "Export & Apply",
      description: "Download your documents in your preferred format and start applying for jobs with confidence."
    }
  ]

  return (
    <section id="features" className="relative w-full py-16 md:py-24 lg:py-32 overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 -z-10 bg-muted/30" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] dark:bg-[radial-gradient(#1f2937_1px,transparent_1px)] opacity-50" />

      <div className="w-full max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-16">
          <div className="space-y-4 animate-fade-in">
            <div className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
              Features
            </div>
            <h2 className="text-3xl font-bold tracking-tighter md:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
              Everything You Need for Your Job Search
            </h2>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed animate-fade-in [animation-delay:200ms]">
              CareerPilotAI provides all the tools you need to create professional career documents and land your dream
              job.
            </p>
          </div>
        </div>

        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={index}
              className={cn(
                "glass-card group flex flex-col items-start space-y-4 rounded-2xl p-8 transition-all duration-300 hover:-translate-y-1",
                "animate-fade-in [animation-delay:var(--delay)]"
              )}
              style={{ "--delay": `${(index + 1) * 100}ms` } as React.CSSProperties}
            >
              <div className="rounded-xl bg-primary/10 p-4 transition-all duration-300 group-hover:scale-110 group-hover:bg-primary/20 group-hover:shadow-lg group-hover:shadow-primary/10">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold group-hover:text-primary transition-colors">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* How It Works Section */}
        <div className="mt-32">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-16">
            <div className="space-y-4 animate-fade-in">
              <div className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
                How It Works
              </div>
              <h2 className="text-3xl font-bold tracking-tighter md:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                Simple Process, Powerful Results
              </h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed animate-fade-in [animation-delay:200ms]">
                Get started in minutes and transform your job application process
              </p>
            </div>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4 relative">
            {/* Connecting line for desktop */}
            <div className="absolute top-12 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-primary/20 to-transparent hidden lg:block -z-10"></div>

            {howItWorks.map((step, index) => (
              <div
                key={index}
                className="relative flex flex-col items-center p-6 animate-fade-in [animation-delay:var(--delay)]"
                style={{ "--delay": `${(index + 1) * 150}ms` } as React.CSSProperties}
              >
                <div className="relative mb-6 group">
                  <div className="absolute inset-0 rounded-full bg-primary/20 blur-md group-hover:blur-lg transition-all duration-300"></div>
                  <div className="relative z-10 flex h-24 w-24 items-center justify-center rounded-full border-4 border-background bg-card text-3xl font-bold text-primary shadow-xl group-hover:scale-110 transition-transform duration-300">
                    {step.number}
                  </div>
                </div>
                <h3 className="mb-3 text-xl font-bold">{step.title}</h3>
                <p className="text-center text-muted-foreground leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Benefits Section */}
        <div className="mt-32 grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="flex flex-col items-center space-y-4 rounded-2xl border border-border/50 bg-card/50 p-8 text-center transition-all duration-300 hover:shadow-lg hover:border-primary/20 animate-fade-in">
            <div className="p-3 rounded-full bg-orange-500/10 text-orange-500 mb-2">
              <Zap className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold">Fast & Efficient</h3>
            <p className="text-muted-foreground">
              Generate professional documents in seconds, not hours. Save time and focus on your job search.
            </p>
          </div>
          <div className="flex flex-col items-center space-y-4 rounded-2xl border border-border/50 bg-card/50 p-8 text-center transition-all duration-300 hover:shadow-lg hover:border-primary/20 animate-fade-in [animation-delay:150ms]">
            <div className="p-3 rounded-full bg-blue-500/10 text-blue-500 mb-2">
              <Shield className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold">Secure & Private</h3>
            <p className="text-muted-foreground">
              Your data is encrypted and never shared. We prioritize your privacy and security.
            </p>
          </div>
          <div className="flex flex-col items-center space-y-4 rounded-2xl border border-border/50 bg-card/50 p-8 text-center transition-all duration-300 hover:shadow-lg hover:border-primary/20 animate-fade-in [animation-delay:300ms]">
            <div className="p-3 rounded-full bg-green-500/10 text-green-500 mb-2">
              <Clock className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold">Always Available</h3>
            <p className="text-muted-foreground">
              Access your documents anytime, anywhere. Make updates and generate new versions whenever needed.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
