import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Cancellation and Refund Policy - CareerPilotAI",
  description: "Cancellation and Refund Policy for CareerPilotAI - Learn about our subscription cancellation process and refund terms.",
}

export default function CancellationRefundPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="prose prose-gray dark:prose-invert max-w-none">
          <h1 className="text-4xl font-bold mb-8">Cancellation and Refund Policy</h1>
          
          <p className="text-lg text-muted-foreground mb-8">
            <strong>Effective Date:</strong> {new Date().toLocaleDateString('en-IN', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Overview</h2>
            <p>
              This Cancellation and Refund Policy outlines the terms and conditions for cancelling your CareerPilotAI subscription and requesting refunds. We are committed to providing fair and transparent policies for our users.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. Subscription Plans</h2>
            <div className="bg-muted p-4 rounded-lg mb-4">
              <h3 className="text-xl font-medium mb-3">Available Plans:</h3>
              <ul className="list-disc pl-6">
                <li><strong>Free Plan:</strong> No payment required - No cancellation needed</li>
                <li><strong>Basic Plan:</strong> ₹499 - One-time payment for enhanced features</li>
                <li><strong>Premium Plan:</strong> ₹999 - One-time payment for unlimited access</li>
              </ul>
            </div>
            <p className="text-sm text-muted-foreground">
              Note: Our current plans are one-time payments, not recurring subscriptions.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. Cancellation Policy</h2>
            
            <h3 className="text-xl font-medium mb-3">3.1 Free Plan</h3>
            <p className="mb-4">
              You can stop using the free plan at any time by simply not accessing the service. No cancellation process is required.
            </p>

            <h3 className="text-xl font-medium mb-3">3.2 Paid Plans (Basic & Premium)</h3>
            <p className="mb-4">
              Since our paid plans are one-time purchases rather than recurring subscriptions, there is no automatic billing to cancel. However, you can:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Stop using the service at any time</li>
              <li>Request account deletion</li>
              <li>Downgrade to the free plan</li>
            </ul>

            <h3 className="text-xl font-medium mb-3">3.3 How to Cancel/Downgrade</h3>
            <p className="mb-4">To cancel or downgrade your account:</p>
            <ol className="list-decimal pl-6">
              <li>Log into your CareerPilotAI account</li>
              <li>Go to Settings > Account Management</li>
              <li>Select "Downgrade to Free" or "Delete Account"</li>
              <li>Follow the confirmation process</li>
              <li>Or contact our support team at support@careerpilotai.com</li>
            </ol>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. Refund Policy</h2>
            
            <h3 className="text-xl font-medium mb-3">4.1 Refund Eligibility</h3>
            <p className="mb-4">
              We offer refunds under the following circumstances:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li><strong>Technical Issues:</strong> If our service is unavailable for more than 48 hours due to technical problems</li>
              <li><strong>Billing Errors:</strong> If you were charged incorrectly due to a system error</li>
              <li><strong>Duplicate Payments:</strong> If you were charged multiple times for the same purchase</li>
              <li><strong>Unauthorized Transactions:</strong> If your payment was made without your authorization</li>
            </ul>

            <h3 className="text-xl font-medium mb-3">4.2 Refund Timeline</h3>
            <p className="mb-4">
              Refund requests must be submitted within <strong>7 days</strong> of the original purchase date.
            </p>

            <h3 className="text-xl font-medium mb-3">4.3 Non-Refundable Situations</h3>
            <p className="mb-4">
              Refunds will not be provided in the following cases:
            </p>
            <ul className="list-disc pl-6">
              <li>Change of mind after using the service</li>
              <li>Failure to use the service after purchase</li>
              <li>Dissatisfaction with AI-generated content quality</li>
              <li>User error or misunderstanding of service features</li>
              <li>Requests made after the 7-day refund period</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. Refund Process</h2>
            
            <h3 className="text-xl font-medium mb-3">5.1 How to Request a Refund</h3>
            <ol className="list-decimal pl-6 mb-4">
              <li>Contact our support team at <strong>refunds@careerpilotai.com</strong></li>
              <li>Include your order ID and reason for refund request</li>
              <li>Provide any supporting documentation if applicable</li>
              <li>Our team will review your request within 2-3 business days</li>
            </ol>

            <h3 className="text-xl font-medium mb-3">5.2 Refund Processing Time</h3>
            <ul className="list-disc pl-6">
              <li><strong>Review Period:</strong> 2-3 business days</li>
              <li><strong>Processing Time:</strong> 5-7 business days after approval</li>
              <li><strong>Bank Credit:</strong> 3-5 additional business days (varies by bank)</li>
            </ul>

            <h3 className="text-xl font-medium mb-3">5.3 Refund Method</h3>
            <p>
              Refunds will be processed back to the original payment method used for the purchase through Razorpay's secure refund system.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. Partial Refunds</h2>
            <p>
              In certain circumstances, we may offer partial refunds based on the usage of our services. This will be evaluated on a case-by-case basis.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7. Data Retention After Cancellation</h2>
            <ul className="list-disc pl-6">
              <li><strong>Account Downgrade:</strong> Your data remains accessible with free plan limitations</li>
              <li><strong>Account Deletion:</strong> All data is permanently deleted after 30 days</li>
              <li><strong>Data Export:</strong> You can export your data before deletion</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">8. Dispute Resolution</h2>
            <p className="mb-4">
              If you're not satisfied with our refund decision, you can:
            </p>
            <ul className="list-disc pl-6">
              <li>Escalate the matter to our management team</li>
              <li>Contact Razorpay's dispute resolution team</li>
              <li>Seek resolution through appropriate consumer protection agencies</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">9. Policy Changes</h2>
            <p>
              We reserve the right to modify this Cancellation and Refund Policy at any time. Changes will be effective immediately upon posting on our website. Users will be notified of significant changes via email.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">10. Contact Information</h2>
            <p className="mb-4">
              For cancellation or refund requests, please contact us:
            </p>
            <div className="bg-muted p-4 rounded-lg">
              <p><strong>Refunds:</strong> refunds@careerpilotai.com</p>
              <p><strong>Support:</strong> support@careerpilotai.com</p>
              <p><strong>Phone:</strong> +91-7048610747</p>
              <p><strong>Business Hours:</strong> Monday to Friday, 9:00 AM to 6:00 PM IST</p>
            </div>
          </section>

          <div className="border-t pt-8 mt-8">
            <p className="text-sm text-muted-foreground">
              This Cancellation and Refund Policy was last updated on {new Date().toLocaleDateString('en-IN', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}. 
              By using CareerPilotAI, you acknowledge that you have read and understood this policy.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
