import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Privacy Policy - CareerPilotAI",
  description: "Privacy Policy for CareerPilotAI - Learn how we collect, use, and protect your personal information.",
}

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="prose prose-gray dark:prose-invert max-w-none">
          <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
          
          <p className="text-lg text-muted-foreground mb-8">
            <strong>Effective Date:</strong> {new Date().toLocaleDateString('en-IN', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
            <p>
              Welcome to CareerPilotAI ("we," "our," or "us"). We are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website and services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. Information We Collect</h2>
            
            <h3 className="text-xl font-medium mb-3">2.1 Personal Information</h3>
            <ul className="list-disc pl-6 mb-4">
              <li>Name and email address (for account creation)</li>
              <li>Professional information (resume details, work experience, skills)</li>
              <li>Payment information (processed securely through Razorpay)</li>
              <li>Communication preferences</li>
            </ul>

            <h3 className="text-xl font-medium mb-3">2.2 Usage Information</h3>
            <ul className="list-disc pl-6 mb-4">
              <li>Device information and browser type</li>
              <li>IP address and location data</li>
              <li>Usage patterns and feature interactions</li>
              <li>Generated content and document history</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. How We Use Your Information</h2>
            <ul className="list-disc pl-6">
              <li>Provide and improve our AI-powered career document generation services</li>
              <li>Process payments and manage subscriptions</li>
              <li>Send important service updates and notifications</li>
              <li>Provide customer support and respond to inquiries</li>
              <li>Analyze usage patterns to enhance user experience</li>
              <li>Comply with legal obligations and prevent fraud</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. Information Sharing and Disclosure</h2>
            <p className="mb-4">We do not sell, trade, or rent your personal information. We may share information in the following circumstances:</p>
            <ul className="list-disc pl-6">
              <li><strong>Service Providers:</strong> With trusted third-party providers (Razorpay for payments, Google Gemini for AI services)</li>
              <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
              <li><strong>Business Transfers:</strong> In connection with mergers or acquisitions</li>
              <li><strong>Consent:</strong> With your explicit consent for specific purposes</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. Data Security</h2>
            <p>
              We implement industry-standard security measures to protect your information, including encryption, secure servers, and regular security audits. However, no method of transmission over the internet is 100% secure.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. Your Rights</h2>
            <p className="mb-4">You have the right to:</p>
            <ul className="list-disc pl-6">
              <li>Access and update your personal information</li>
              <li>Delete your account and associated data</li>
              <li>Opt-out of marketing communications</li>
              <li>Request data portability</li>
              <li>Lodge complaints with data protection authorities</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7. Cookies and Tracking</h2>
            <p>
              We use cookies and similar technologies to enhance your experience, analyze usage, and provide personalized content. You can control cookie settings through your browser preferences.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">8. Data Retention</h2>
            <p>
              We retain your information for as long as necessary to provide our services and comply with legal obligations. You may request deletion of your data at any time.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">9. International Transfers</h2>
            <p>
              Your information may be transferred to and processed in countries other than India. We ensure appropriate safeguards are in place for such transfers.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">10. Children's Privacy</h2>
            <p>
              Our services are not intended for children under 18. We do not knowingly collect personal information from children under 18.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">11. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new policy on our website and updating the effective date.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">12. Contact Us</h2>
            <p className="mb-4">
              If you have any questions about this Privacy Policy or our data practices, please contact us:
            </p>
            <div className="bg-muted p-4 rounded-lg">
              <p><strong>Email:</strong> chauhanparth6100.com</p>
              <p><strong>Address:</strong> CareerPilotAI, India</p>
              <p><strong>Phone:</strong> +91-7048610747</p>
            </div>
          </section>

          <div className="border-t pt-8 mt-8">
            <p className="text-sm text-muted-foreground">
              This Privacy Policy was last updated on {new Date().toLocaleDateString('en-IN', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}. 
              By using CareerPilotAI, you acknowledge that you have read and understood this Privacy Policy.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
