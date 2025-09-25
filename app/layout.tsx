import type { Metadata } from "next";
import "./globals.css";
import { ServiceWorkerRegistration } from "@/components/ServiceWorkerRegistration";
import { NotificationSystem } from "@/components/NotificationSystem";
import { AppProvider } from "@/lib/store";
import { Providers } from "@/components/Providers";

export const metadata: Metadata = {
  title: "Kushtunes — Professional Music Distribution Platform",
  description:
    "Distribute your music to 180+ platforms worldwide. Upload singles, EPs, and albums with transparent pricing. Keep 100% royalties. Trusted by 50,000+ artists.",
  keywords: [
    "music distribution",
    "music streaming",
    "independent artists",
    "music publishing",
    "royalties",
    "Spotify",
    "Apple Music",
    "music platform",
    "artist tools",
    "music analytics"
  ],
  authors: [{ name: "Kushtunes Team" }],
  creator: "Kushtunes",
  publisher: "Kushtunes",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: [
    { rel: "icon", url: "/favicon.ico" },
    { rel: "apple-touch-icon", url: "/apple-touch-icon.png" },
  ],
  manifest: "/site.webmanifest",
  openGraph: {
    title: "Kushtunes — Professional Music Distribution Platform",
    description: "Distribute your music to 180+ platforms worldwide. Upload singles, EPs, and albums with transparent pricing. Keep 100% royalties.",
    url: "https://kushtunes.com",
    siteName: "Kushtunes",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "https://kushtunes.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Kushtunes - Professional Music Distribution Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kushtunes — Professional Music Distribution Platform",
    description: "Distribute your music to 180+ platforms worldwide. Upload singles, EPs, and albums with transparent pricing.",
    images: ["https://kushtunes.com/og-image.jpg"],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Kushtunes",
  },
  formatDetection: {
    telephone: false,
  },
  metadataBase: new URL("https://kushtunes.com"),
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#0ea5e9",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Kushtunes" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#0ea5e9" />
        <meta name="msapplication-tap-highlight" content="no" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Kushtunes",
              "description": "Professional music distribution platform for artists worldwide",
              "url": "https://kushtunes.com",
              "logo": "https://kushtunes.com/logo.png",
              "sameAs": [
                "https://twitter.com/kushtunes",
                "https://instagram.com/kushtunes",
                "https://facebook.com/kushtunes"
              ],
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+1-555-KUSHTUNES",
                "contactType": "customer service",
                "availableLanguage": ["English"]
              },
              "offers": [
                {
                  "@type": "Offer",
                  "name": "Free Plan",
                  "description": "Upload unlimited singles, keep 100% royalties, basic analytics",
                  "price": "0",
                  "priceCurrency": "USD",
                  "priceValidUntil": "2025-12-31"
                },
                {
                  "@type": "Offer",
                  "name": "Musician Plan",
                  "description": "Everything in Free + albums & EPs + advanced analytics + HyperFollow pages",
                  "price": "20",
                  "priceCurrency": "USD",
                  "priceValidUntil": "2025-12-31"
                },
                {
                  "@type": "Offer",
                  "name": "Label Plan",
                  "description": "Everything in Musician + up to 100 artists + priority support + custom label pages",
                  "price": "80",
                  "priceCurrency": "USD",
                  "priceValidUntil": "2025-12-31"
                }
              ]
            })
          }}
        />
      </head>
      <body className="min-h-dvh bg-black text-white antialiased">
        <Providers>
          <AppProvider>
            <div className="flex min-h-dvh flex-col">
              {children}
            </div>
            <ServiceWorkerRegistration />
            <NotificationSystem />
          </AppProvider>
        </Providers>
      </body>
    </html>
  );
}
