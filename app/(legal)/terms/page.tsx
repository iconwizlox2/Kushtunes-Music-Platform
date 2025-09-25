import type { Metadata } from "next";
import { siteUrl } from "@/lib/env";
import { JsonLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Kushtunes Terms of Service.",
  alternates: { canonical: `${siteUrl()}/terms` },
  openGraph: { url: `${siteUrl()}/terms` }
};

export default function TermsOfService() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Terms of Service",
    url: `${siteUrl()}/terms`
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-8">Terms of Service</h1>
          
          <div className="prose prose-slate max-w-none">
            <p className="text-sm text-slate-600 mb-8">
              <strong>Last updated:</strong> {new Date().toLocaleDateString()}
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">1. Acceptance of Terms</h2>
              <p className="text-slate-700 mb-4">
                By accessing and using Kushtunes ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">2. Service Description</h2>
              <p className="text-slate-700 mb-4">
                Kushtunes provides music distribution services, allowing artists to upload, distribute, and monetize their music across various digital platforms including but not limited to Spotify, Apple Music, Amazon Music, YouTube Music, and other streaming services.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">3. User Accounts</h2>
              <p className="text-slate-700 mb-4">
                To use our Service, you must create an account. You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account.
              </p>
              <ul className="list-disc list-inside text-slate-700 mb-4">
                <li>You must provide accurate and complete information</li>
                <li>You must be at least 18 years old to create an account</li>
                <li>You must complete KYC (Know Your Customer) verification</li>
                <li>You are responsible for all content uploaded to your account</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">4. Content and Intellectual Property</h2>
              <p className="text-slate-700 mb-4">
                You retain all rights to your original musical content. By uploading content to our Service, you grant us a non-exclusive license to distribute your content through our partner platforms.
              </p>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">4.1 Content Requirements</h3>
              <ul className="list-disc list-inside text-slate-700 mb-4">
                <li>All content must be original or properly licensed</li>
                <li>No copyrighted material without permission</li>
                <li>No hate speech, violence, or illegal content</li>
                <li>Audio files must be in WAV or FLAC format</li>
                <li>Cover art must be 3000x3000 pixels, JPG or PNG format</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">5. Distribution Agreement</h2>
              <p className="text-slate-700 mb-4">
                By submitting content for distribution, you agree to the following terms:
              </p>
              <ul className="list-disc list-inside text-slate-700 mb-4">
                <li>We will distribute your content to selected platforms</li>
                <li>Distribution may take 7-14 days for processing</li>
                <li>Platforms may reject content that violates their policies</li>
                <li>You are responsible for ensuring content compliance</li>
                <li>We reserve the right to remove content that violates our policies</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">6. Revenue and Payments</h2>
              <p className="text-slate-700 mb-4">
                Revenue from streaming and downloads will be collected by our partner platforms and distributed according to the following terms:
              </p>
              <ul className="list-disc list-inside text-slate-700 mb-4">
                <li>Revenue reports are provided monthly</li>
                <li>Minimum payout threshold: $25</li>
                <li>Payouts are processed within 30 days of request</li>
                <li>All payments are subject to applicable taxes</li>
                <li>We take a 10% commission on gross revenue</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">7. Prohibited Uses</h2>
              <p className="text-slate-700 mb-4">
                You may not use our Service:
              </p>
              <ul className="list-disc list-inside text-slate-700 mb-4">
                <li>For any unlawful purpose or to solicit others to perform unlawful acts</li>
                <li>To violate any international, federal, provincial, or state regulations, rules, laws, or local ordinances</li>
                <li>To infringe upon or violate our intellectual property rights or the intellectual property rights of others</li>
                <li>To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate</li>
                <li>To submit false or misleading information</li>
                <li>To upload or transmit viruses or any other type of malicious code</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">8. Termination</h2>
              <p className="text-slate-700 mb-4">
                We may terminate or suspend your account and bar access to the Service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever and without limitation, including but not limited to a breach of the Terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">9. Disclaimer</h2>
              <p className="text-slate-700 mb-4">
                The information on this Service is provided on an "as is" basis. To the fullest extent permitted by law, this Company excludes all representations, warranties, conditions and terms relating to our Service and the use of this Service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">10. Limitation of Liability</h2>
              <p className="text-slate-700 mb-4">
                In no event shall Kushtunes, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your use of the Service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">11. Governing Law</h2>
              <p className="text-slate-700 mb-4">
                These Terms shall be interpreted and governed by the laws of the United States, without regard to its conflict of law provisions. Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">12. Changes to Terms</h2>
              <p className="text-slate-700 mb-4">
                We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days notice prior to any new terms taking effect.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">13. Contact Information</h2>
              <p className="text-slate-700 mb-4">
                If you have any questions about these Terms of Service, please contact us at:
              </p>
              <div className="bg-slate-50 rounded-lg p-4">
                <p className="text-slate-700">
                  <strong>Email:</strong> legal@kushtunes.com<br />
                  <strong>Address:</strong> Kushtunes Legal Department<br />
                  456 Sunset Boulevard, Los Angeles, CA 90028<br />
                  <strong>Phone:</strong> +1 (323) 555-0123
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
