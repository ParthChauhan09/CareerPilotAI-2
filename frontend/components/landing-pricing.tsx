import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, X } from "lucide-react"
import { config } from "@/lib/config"

export function LandingPricing() {
  return (
    <section id="pricing" className="w-full py-8 md:py-16 lg:py-24">
      <div className="w-full max-w-none px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm font-medium text-primary">Pricing</div>
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
              Choose the Right Plan for Your Career
            </h2>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Affordable plans for every stage of your career journey. All prices in Indian Rupees (₹).
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-8 md:grid-cols-3">
          <Card className="relative overflow-hidden transition-all duration-300 hover:shadow-md flex flex-col">
            <div className="absolute inset-x-0 top-0 h-2 bg-gradient-to-r from-primary/40 to-primary/10"></div>
            <CardHeader className="flex-shrink-0 pb-4">
              <CardTitle>Free</CardTitle>
              <div className="text-3xl font-bold">
                ₹0
                <span className="text-sm font-normal text-muted-foreground">/month</span>
              </div>
              <CardDescription>Perfect for trying out our services.</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col py-2">
              <ul className="space-y-1 text-sm flex-grow">
                <li className="flex items-center py-0.5">
                  <Check className="mr-2 h-4 w-4 text-primary flex-shrink-0" />
                  <span>1 Resume Generation</span>
                </li>
                <li className="flex items-center py-0.5">
                  <Check className="mr-2 h-4 w-4 text-primary flex-shrink-0" />
                  <span>1 Cover Letter Generation</span>
                </li>
                <li className="flex items-center py-0.5">
                  <Check className="mr-2 h-4 w-4 text-primary flex-shrink-0" />
                  <span>1 LinkedIn Bio Generation</span>
                </li>
                <li className="flex items-center py-0.5">
                  <Check className="mr-2 h-4 w-4 text-primary flex-shrink-0" />
                  <span>Basic Templates</span>
                </li>
                <li className="flex items-center py-0.5">
                  <Check className="mr-2 h-4 w-4 text-primary flex-shrink-0" />
                  <span>PDF Export</span>
                </li>
                <li className="flex items-center py-0.5">
                  <X className="mr-2 h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <span className="text-muted-foreground">DOCX Export</span>
                </li>
                <li className="flex items-center py-0.5">
                  <Check className="mr-2 h-4 w-4 text-primary flex-shrink-0" />
                  <span>TXT Export</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full" asChild>
                <Link href="/login">Get Started</Link>
              </Button>
            </CardFooter>
          </Card>
          <Card className="relative overflow-hidden border-primary transition-all duration-300 hover:shadow-md flex flex-col">
            <div className="absolute inset-x-0 top-0 h-2 bg-gradient-to-r from-primary to-primary/60"></div>
            <CardHeader className="flex-shrink-0 pb-4">
              <div className="inline-block rounded-lg bg-primary px-3 py-1 text-sm text-primary-foreground">
                Popular
              </div>
              <CardTitle>Basic</CardTitle>
              <div className="text-3xl font-bold">
                ₹{config.pricing.basic}
                <span className="text-sm font-normal text-muted-foreground">/month</span>
              </div>
              <CardDescription>For active job seekers.</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col py-2">
              <ul className="space-y-1 text-sm flex-grow">
                <li className="flex items-center py-0.5">
                  <Check className="mr-2 h-4 w-4 text-primary flex-shrink-0" />
                  <span>5 Resume Generations</span>
                </li>
                <li className="flex items-center py-0.5">
                  <Check className="mr-2 h-4 w-4 text-primary flex-shrink-0" />
                  <span>5 Cover Letter Generations</span>
                </li>
                <li className="flex items-center py-0.5">
                  <Check className="mr-2 h-4 w-4 text-primary flex-shrink-0" />
                  <span>3 LinkedIn Bio Generations</span>
                </li>
                <li className="flex items-center py-0.5">
                  <Check className="mr-2 h-4 w-4 text-primary flex-shrink-0" />
                  <span>Premium Templates</span>
                </li>
                <li className="flex items-center py-0.5">
                  <Check className="mr-2 h-4 w-4 text-primary flex-shrink-0" />
                  <span>PDF Export</span>
                </li>
                <li className="flex items-center py-0.5">
                  <Check className="mr-2 h-4 w-4 text-primary flex-shrink-0" />
                  <span>DOCX Export</span>
                </li>
                <li className="flex items-center py-0.5">
                  <Check className="mr-2 h-4 w-4 text-primary flex-shrink-0" />
                  <span>TXT Export</span>
                </li>
                <li className="flex items-center py-0.5">
                  <Check className="mr-2 h-4 w-4 text-primary flex-shrink-0" />
                  <span>Priority Support</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full" asChild>
                <Link href="/login">Subscribe</Link>
              </Button>
            </CardFooter>
          </Card>
          <Card className="relative overflow-hidden transition-all duration-300 hover:shadow-md flex flex-col">
            <div className="absolute inset-x-0 top-0 h-2 bg-gradient-to-r from-primary/80 via-primary to-primary/80"></div>
            <CardHeader className="flex-shrink-0 pb-4">
              <CardTitle>Premium</CardTitle>
              <div className="text-3xl font-bold">
                ₹{config.pricing.premium}
                <span className="text-sm font-normal text-muted-foreground">/month</span>
              </div>
              <CardDescription>For professionals and power users.</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col py-2">
              <ul className="space-y-1 text-sm flex-grow">
                <li className="flex items-center py-0.5">
                  <Check className="mr-2 h-4 w-4 text-primary flex-shrink-0" />
                  <span>Unlimited Resume Generations</span>
                </li>
                <li className="flex items-center py-0.5">
                  <Check className="mr-2 h-4 w-4 text-primary flex-shrink-0" />
                  <span>Unlimited Cover Letter Generations</span>
                </li>
                <li className="flex items-center py-0.5">
                  <Check className="mr-2 h-4 w-4 text-primary flex-shrink-0" />
                  <span>Unlimited LinkedIn Bio Generations</span>
                </li>
                <li className="flex items-center py-0.5">
                  <Check className="mr-2 h-4 w-4 text-primary flex-shrink-0" />
                  <span>All Premium Templates</span>
                </li>
                <li className="flex items-center py-0.5">
                  <Check className="mr-2 h-4 w-4 text-primary flex-shrink-0" />
                  <span>All Export Formats</span>
                </li>
                <li className="flex items-center py-0.5">
                  <Check className="mr-2 h-4 w-4 text-primary flex-shrink-0" />
                  <span>Priority Support</span>
                </li>
                <li className="flex items-center py-0.5">
                  <Check className="mr-2 h-4 w-4 text-primary flex-shrink-0" />
                  <span>Advanced AI Features</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full" asChild>
                <Link href="/login">Subscribe</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="mt-12 text-center">
          <p className="text-muted-foreground">
            All plans include secure document storage and access to our AI-powered generation tools.
            <br />
            Need help choosing? <Link href="/contact" className="text-primary underline underline-offset-4 hover:text-primary/80">Contact us</Link> for assistance.
          </p>
        </div>
      </div>
    </section>
  )
}
