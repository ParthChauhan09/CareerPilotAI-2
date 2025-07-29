import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Shipping and Delivery Policy - CareerPilotAI",
  description: "Shipping and Delivery Policy for CareerPilotAI - Learn about our digital service delivery terms and access policies.",
}

export default function ShippingDeliveryPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="prose prose-gray dark:prose-invert max-w-none">
          <h1 className="text-4xl font-bold mb-8">Shipping and Delivery Policy</h1>
          
          <p className="text-lg text-muted-foreground mb-8">
            <strong>Effective Date:</strong> {new Date().toLocaleDateString('en-IN', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Nature of Our Services</h2>
            <p className="mb-4">
              CareerPilotAI provides <strong>digital services only</strong>. We do not ship physical products. All our services are delivered electronically through our web platform. This policy explains how we deliver our digital services and provide access to your purchased features.
            </p>
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-blue-800 dark:text-blue-200 font-medium">
                📱 Digital Service Delivery: Instant access to AI-powered career document generation tools
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. Service Delivery Methods</h2>
            
            <h3 className="text-xl font-medium mb-3">2.1 Instant Digital Access</h3>
            <p className="mb-4">Upon successful payment, you will receive:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Immediate access to your purchased plan features</li>
              <li>Account upgrade confirmation via email</li>
              <li>Access to premium templates and tools</li>
              <li>Enhanced generation limits based on your plan</li>
            </ul>

            <h3 className="text-xl font-medium mb-3">2.2 Document Generation and Download</h3>
            <p className="mb-4">Generated documents are delivered through:</p>
            <ul className="list-disc pl-6">
              <li><strong>PDF Downloads:</strong> Instant download after generation</li>
              <li><strong>DOCX Files:</strong> Microsoft Word compatible format</li>
              <li><strong>TXT Files:</strong> Plain text format for basic editing</li>
              <li><strong>Online Access:</strong> View and edit documents in your dashboard</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. Delivery Timeframes</h2>
            
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">Account Activation</h4>
                <p className="text-green-700 dark:text-green-300 text-sm">Instant (within 30 seconds of payment)</p>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Document Generation</h4>
                <p className="text-blue-700 dark:text-blue-300 text-sm">30 seconds to 2 minutes per document</p>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
                <h4 className="font-semibold text-purple-800 dark:text-purple-200 mb-2">Email Confirmations</h4>
                <p className="text-purple-700 dark:text-purple-300 text-sm">Within 5 minutes of transaction</p>
              </div>
              <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg border border-orange-200 dark:border-orange-800">
                <h4 className="font-semibold text-orange-800 dark:text-orange-200 mb-2">Support Response</h4>
                <p className="text-orange-700 dark:text-orange-300 text-sm">Within 24 hours on business days</p>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. Access Requirements</h2>
            
            <h3 className="text-xl font-medium mb-3">4.1 Technical Requirements</h3>
            <p className="mb-4">To access our services, you need:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Stable internet connection</li>
              <li>Modern web browser (Chrome, Firefox, Safari, Edge)</li>
              <li>Valid email address for account verification</li>
              <li>JavaScript enabled in your browser</li>
            </ul>

            <h3 className="text-xl font-medium mb-3">4.2 Account Access</h3>
            <ul className="list-disc pl-6">
              <li>24/7 access to your account and generated documents</li>
              <li>Cross-device compatibility (desktop, tablet, mobile)</li>
              <li>Secure login with email and password</li>
              <li>Data synchronization across all devices</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. Service Availability</h2>
            
            <h3 className="text-xl font-medium mb-3">5.1 Uptime Commitment</h3>
            <p className="mb-4">
              We strive to maintain 99.9% service uptime. Our services are available 24/7, except during:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Scheduled maintenance (announced 24 hours in advance)</li>
              <li>Emergency maintenance for security or critical updates</li>
              <li>Force majeure events beyond our control</li>
            </ul>

            <h3 className="text-xl font-medium mb-3">5.2 Service Interruptions</h3>
            <p>
              In case of service interruptions, we will notify users via email and our status page. Extended outages may result in service credit or refunds as per our refund policy.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. Data Storage and Backup</h2>
            
            <h3 className="text-xl font-medium mb-3">6.1 Document Storage</h3>
            <ul className="list-disc pl-6 mb-4">
              <li>All generated documents are stored securely in the cloud</li>
              <li>Documents remain accessible throughout your subscription period</li>
              <li>Automatic backups ensure data protection</li>
              <li>Export options available for local storage</li>
            </ul>

            <h3 className="text-xl font-medium mb-3">6.2 Data Retention</h3>
            <p>
              Your documents and account data are retained according to our data retention policy outlined in our Privacy Policy.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7. Delivery Confirmation</h2>
            
            <p className="mb-4">Delivery confirmation is provided through:</p>
            <ul className="list-disc pl-6">
              <li><strong>Email Notifications:</strong> Payment confirmation and account upgrade notices</li>
              <li><strong>Dashboard Updates:</strong> Real-time plan status in your account</li>
              <li><strong>Feature Access:</strong> Immediate availability of premium features</li>
              <li><strong>Download Receipts:</strong> Confirmation for each document generated</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">8. Failed Delivery Resolution</h2>
            
            <h3 className="text-xl font-medium mb-3">8.1 Common Issues and Solutions</h3>
            <div className="space-y-4">
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <h4 className="font-medium mb-2">Payment Successful but No Access</h4>
                <p className="text-sm text-muted-foreground">Contact support with your transaction ID for immediate resolution</p>
              </div>
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <h4 className="font-medium mb-2">Document Generation Fails</h4>
                <p className="text-sm text-muted-foreground">Refresh the page and try again. Contact support if the issue persists</p>
              </div>
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <h4 className="font-medium mb-2">Email Confirmations Not Received</h4>
                <p className="text-sm text-muted-foreground">Check spam folder and verify email address in account settings</p>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">9. International Access</h2>
            <p>
              Our digital services are accessible worldwide, subject to local laws and regulations. Service performance may vary based on geographic location and internet infrastructure.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">10. Contact for Delivery Issues</h2>
            <p className="mb-4">
              If you experience any issues with service delivery or access, please contact us:
            </p>
            <div className="bg-muted p-4 rounded-lg">
              <p><strong>Technical Support:</strong> support@careerpilotai.com</p>
              <p><strong>Account Issues:</strong> accounts@careerpilotai.com</p>
              <p><strong>Phone:</strong> +91-XXXXXXXXXX</p>
              <p><strong>Response Time:</strong> Within 24 hours on business days</p>
              <p><strong>Emergency Support:</strong> Available for critical access issues</p>
            </div>
          </section>

          <div className="border-t pt-8 mt-8">
            <p className="text-sm text-muted-foreground">
              This Shipping and Delivery Policy was last updated on {new Date().toLocaleDateString('en-IN', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}. 
              By using CareerPilotAI, you acknowledge that you understand our digital service delivery methods.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
