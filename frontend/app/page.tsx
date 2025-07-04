// Force dynamic rendering to avoid SSG issues with React 19
export const dynamic = 'force-dynamic'

import { LandingHero } from "@/components/landing-hero"
import { LandingFeatures } from "@/components/landing-features"
import { LandingPricing } from "@/components/landing-pricing"
import { LandingFooter } from "@/components/landing-footer"
import { LandingHeader } from "@/components/landing-header"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <LandingHeader />
      <main className="flex-1">
        <LandingHero />
        <LandingFeatures />
        <LandingPricing />
      </main>
      <LandingFooter />
    </div>
  )
}
