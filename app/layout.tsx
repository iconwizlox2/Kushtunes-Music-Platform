import type { Metadata } from "next";
import "./globals.css";
import { ServiceWorkerRegistration } from "@/components/ServiceWorkerRegistration";
import { NotificationSystem } from "@/components/NotificationSystem";
import { AppProvider } from "@/lib/store";
import { Providers } from "@/components/Providers";
import { JsonLd } from "@/components/JsonLd";
import { siteUrl } from "@/lib/env";

const base = siteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(base),
  title: {
    default: "Kushtunes — Distribute Your Music Worldwide",
    template: "%s · Kushtunes"
  },
  description:
    "Upload once, deliver to Spotify, Apple Music, YouTube and more. Clear 10% commission, no annual fees.",
  alternates: {
    canonical: base
  },
  openGraph: {
    type: "website",
    url: base,
    siteName: "Kushtunes",
    title: "Kushtunes — Distribute Your Music Worldwide",
    description:
      "Upload once, deliver to all major platforms. Clear 10% commission, no annual fees.",
    images: [`${base}/og-image.png`]
  },
  twitter: {
    card: "summary_large_image",
    title: "Kushtunes — Distribute Your Music Worldwide",
    description:
      "Upload once, deliver to all major platforms. Clear 10% commission, no annual fees.",
    images: [`${base}/og-image.png`]
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png"
  },
  robots: {
    index: true,
    follow: true
  }
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#0ea5e9",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Kushtunes",
    url: base,
    logo: `${base}/logo.png`,
    sameAs: [
      "https://twitter.com/kushtunes",
      "https://instagram.com/kushtunes",
      "https://facebook.com/kushtunes"
    ]
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-dvh bg-black text-white antialiased">
        <JsonLd data={orgJsonLd} />
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
