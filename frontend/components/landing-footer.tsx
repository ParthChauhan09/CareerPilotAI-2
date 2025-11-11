import Link from "next/link"
import { Briefcase, Mail, MapPin, Phone } from "lucide-react"

export function LandingFooter() {
  return (
    <footer className="w-full border-t py-12 md:py-16">
      <div className="w-full max-w-none px-4 md:px-6">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Briefcase className="h-6 w-6 text-primary" />
              <span className="font-bold">CareerPilotAI</span>
            </div>
            <p className="text-sm text-muted-foreground">
              AI-powered career document generation platform to help you land your dream job.
            </p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>Ahmedabad, India</span>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-medium">Product</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/#features" className="text-muted-foreground transition-colors hover:text-foreground">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/#pricing" className="text-muted-foreground transition-colors hover:text-foreground">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-muted-foreground transition-colors hover:text-foreground">
                  About
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-medium">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/blog" className="text-muted-foreground transition-colors hover:text-foreground">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-muted-foreground transition-colors hover:text-foreground">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/support" className="text-muted-foreground transition-colors hover:text-foreground">
                  Support
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-medium">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/terms-and-conditions" className="text-muted-foreground transition-colors hover:text-foreground">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="text-muted-foreground transition-colors hover:text-foreground">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/cancellation-refund" className="text-muted-foreground transition-colors hover:text-foreground">
                  Refund Policy
                </Link>
              </li>
              <li>
                <Link href="/shipping-delivery" className="text-muted-foreground transition-colors hover:text-foreground">
                  Delivery Policy
                </Link>
              </li>
              <li>
                <Link href="/contact-us" className="text-muted-foreground transition-colors hover:text-foreground">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t pt-8 md:flex-row">
          <p className="text-center text-sm text-muted-foreground md:text-left">
            © 2024 CareerPilotAI. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link href="mailto:info@careerpilotai.com" className="text-muted-foreground hover:text-foreground">
              <Mail className="h-5 w-5" />
              <span className="sr-only">Email</span>
            </Link>
            <Link href="tel:+919876543210" className="text-muted-foreground hover:text-foreground">
              <Phone className="h-5 w-5" />
              <span className="sr-only">Phone</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
