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
    <section id="features" className="relative w-full py-8 md:py-16 lg:py-24 overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 -z-10 bg-muted/40" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] dark:bg-[radial-gradient(#1f2937_1px,transparent_1px)]" />

      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2 animate-fade-in">
            <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
              Features
            </div>
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
              Everything You Need for Your Job Search
            </h2>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed animate-fade-in [animation-delay:200ms]">
              CareerPilotAI provides all the tools you need to create professional career documents and land your dream
              job.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={index}
              className={cn(
                "group flex flex-col items-center space-y-4 rounded-lg border p-6 transition-all duration-200 hover:shadow-md hover:border-primary/20 hover:bg-accent/50",
                "animate-fade-in [animation-delay:var(--delay)]"
              )}
              style={{ "--delay": `${(index + 1) * 100}ms` } as React.CSSProperties}
            >
              <div className="rounded-full bg-primary/10 p-4 transition-all duration-300 group-hover:scale-110 group-hover:bg-primary/20">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold">{feature.title}</h3>
              <p className="text-center text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* How It Works Section */}
        <div className="mt-20">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2 animate-fade-in">
              <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                How It Works
              </div>
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                Simple Process, Powerful Results
              </h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed animate-fade-in [animation-delay:200ms]">
                Get started in minutes and transform your job application process
              </p>
            </div>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {howItWorks.map((step, index) => (
              <div
                key={index}
                className="relative flex flex-col items-center p-6 animate-fade-in [animation-delay:var(--delay)]"
                style={{ "--delay": `${(index + 1) * 150}ms` } as React.CSSProperties}
              >
                {/* Connector line */}
                {index < howItWorks.length - 1 && (
                  <div className="absolute top-8 left-[calc(50%)] h-0.5 w-[calc(100%-2rem)] bg-gradient-to-r from-primary/50 to-transparent hidden lg:block"></div>
                )}
                <div className="relative mb-4">
                  <div className="absolute inset-0 rounded-full bg-primary/20 blur-sm"></div>
                  <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full border-2 border-primary/50 bg-background text-2xl font-bold text-primary">
                    {step.number}
                  </div>
                </div>
                <h3 className="mb-2 text-xl font-bold">{step.title}</h3>
                <p className="text-center text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Benefits Section */}
        <div className="mt-24 grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="flex flex-col items-center space-y-4 rounded-lg border p-6 transition-all duration-200 hover:shadow-md animate-fade-in">
            <Zap className="h-10 w-10 text-primary" />
            <h3 className="text-xl font-bold">Fast & Efficient</h3>
            <p className="text-center text-muted-foreground">
              Generate professional documents in seconds, not hours. Save time and focus on your job search.
            </p>
          </div>
          <div className="flex flex-col items-center space-y-4 rounded-lg border p-6 transition-all duration-200 hover:shadow-md animate-fade-in [animation-delay:150ms]">
            <Shield className="h-10 w-10 text-primary" />
            <h3 className="text-xl font-bold">Secure & Private</h3>
            <p className="text-center text-muted-foreground">
              Your data is encrypted and never shared. We prioritize your privacy and security.
            </p>
          </div>
          <div className="flex flex-col items-center space-y-4 rounded-lg border p-6 transition-all duration-200 hover:shadow-md animate-fade-in [animation-delay:300ms]">
            <Clock className="h-10 w-10 text-primary" />
            <h3 className="text-xl font-bold">Always Available</h3>
            <p className="text-center text-muted-foreground">
              Access your documents anytime, anywhere. Make updates and generate new versions whenever needed.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
