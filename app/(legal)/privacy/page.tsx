import type { Metadata } from "next";
import { siteUrl } from "@/lib/env";
import { JsonLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Kushtunes Privacy Policy.",
  alternates: { canonical: `${siteUrl()}/privacy` },
  openGraph: { url: `${siteUrl()}/privacy` }
};

export default function PrivacyPolicy() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Privacy Policy",
    url: `${siteUrl()}/privacy`
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-8">Privacy Policy</h1>
          
          <div className="prose prose-slate max-w-none">
            <p className="text-sm text-slate-600 mb-8">
              <strong>Last updated:</strong> {new Date().toLocaleDateString()}
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">1. Information We Collect</h2>
              <p className="text-slate-700 mb-4">
                We collect information you provide directly to us, such as when you create an account, upload content, or contact us for support.
              </p>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">1.1 Personal Information</h3>
              <ul className="list-disc list-inside text-slate-700 mb-4">
                <li>Name, email address, and contact information</li>
                <li>Payment and billing information</li>
                <li>KYC documents (government ID, tax information)</li>
                <li>Profile information and preferences</li>
              </ul>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">1.2 Content Information</h3>
              <ul className="list-disc list-inside text-slate-700 mb-4">
                <li>Audio files and metadata</li>
                <li>Cover art and promotional materials</li>
                <li>Artist information and biographies</li>
                <li>Release information and track details</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">2. How We Use Your Information</h2>
              <p className="text-slate-700 mb-4">
                We use the information we collect to:
              </p>
              <ul className="list-disc list-inside text-slate-700 mb-4">
                <li>Provide, maintain, and improve our services</li>
                <li>Process and distribute your music content</li>
                <li>Process payments and calculate royalties</li>
                <li>Communicate with you about your account and services</li>
                <li>Comply with legal obligations and enforce our terms</li>
                <li>Protect against fraud and unauthorized access</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">3. Information Sharing</h2>
              <p className="text-slate-700 mb-4">
                We may share your information in the following circumstances:
              </p>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">3.1 Service Providers</h3>
              <ul className="list-disc list-inside text-slate-700 mb-4">
                <li>Music distribution partners (Spotify, Apple Music, etc.)</li>
                <li>Payment processors (Stripe, PayPal)</li>
                <li>Cloud storage providers</li>
                <li>Analytics and monitoring services</li>
              </ul>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">3.2 Legal Requirements</h3>
              <ul className="list-disc list-inside text-slate-700 mb-4">
                <li>When required by law or legal process</li>
                <li>To protect our rights and property</li>
                <li>To prevent fraud or illegal activity</li>
                <li>In case of emergency to protect user safety</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">4. Data Security</h2>
              <p className="text-slate-700 mb-4">
                We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet or electronic storage is 100% secure.
              </p>
              <ul className="list-disc list-inside text-slate-700 mb-4">
                <li>Encryption of data in transit and at rest</li>
                <li>Regular security audits and updates</li>
                <li>Access controls and authentication</li>
                <li>Secure data centers and infrastructure</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">5. Your Rights (GDPR)</h2>
              <p className="text-slate-700 mb-4">
                If you are located in the European Union, you have certain rights regarding your personal data:
              </p>
              <ul className="list-disc list-inside text-slate-700 mb-4">
                <li><strong>Access:</strong> Request a copy of your personal data</li>
                <li><strong>Rectification:</strong> Correct inaccurate or incomplete data</li>
                <li><strong>Erasure:</strong> Request deletion of your personal data</li>
                <li><strong>Portability:</strong> Receive your data in a structured format</li>
                <li><strong>Objection:</strong> Object to processing of your data</li>
                <li><strong>Restriction:</strong> Request limitation of processing</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">6. Data Retention</h2>
              <p className="text-slate-700 mb-4">
                We retain your information for as long as necessary to provide our services and fulfill the purposes outlined in this policy. Specifically:
              </p>
              <ul className="list-disc list-inside text-slate-700 mb-4">
                <li>Account information: Until account deletion</li>
                <li>Content: Until removed by user or termination</li>
                <li>Financial records: 7 years for tax compliance</li>
                <li>Analytics data: 2 years maximum</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">7. Cookies and Tracking</h2>
              <p className="text-slate-700 mb-4">
                We use cookies and similar technologies to enhance your experience on our platform:
              </p>
              <ul className="list-disc list-inside text-slate-700 mb-4">
                <li><strong>Essential cookies:</strong> Required for basic functionality</li>
                <li><strong>Analytics cookies:</strong> Help us understand usage patterns</li>
                <li><strong>Preference cookies:</strong> Remember your settings</li>
                <li><strong>Marketing cookies:</strong> Deliver relevant advertisements</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">8. Children's Privacy</h2>
              <p className="text-slate-700 mb-4">
                Our Service is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">9. International Transfers</h2>
              <p className="text-slate-700 mb-4">
                Your information may be transferred to and processed in countries other than your country of residence. We ensure appropriate safeguards are in place for such transfers, including standard contractual clauses approved by the European Commission.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">10. Changes to This Policy</h2>
              <p className="text-slate-700 mb-4">
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date. We encourage you to review this Privacy Policy periodically.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">11. Contact Us</h2>
              <p className="text-slate-700 mb-4">
                If you have any questions about this Privacy Policy or our privacy practices, please contact us:
              </p>
              <div className="bg-slate-50 rounded-lg p-4">
                <p className="text-slate-700">
                  <strong>Email:</strong> privacy@kushtunes.com<br />
                  <strong>Address:</strong> Kushtunes Privacy Officer<br />
                  456 Sunset Boulevard, Los Angeles, CA 90028<br />
                  <strong>Phone:</strong> +1 (323) 555-0123<br />
                  <strong>Data Protection Officer:</strong> dpo@kushtunes.com
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
      </div>
    </>
  );
}
