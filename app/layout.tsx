import type { Metadata } from "next";
import "./globals.css";
import { ServiceWorkerRegistration } from "@/components/ServiceWorkerRegistration";
import { NotificationSystem } from "@/components/NotificationSystem";
import { AppProvider } from "@/lib/store";

export const metadata: Metadata = {
  title: "Kushtunes — From the Nile to the World",
  description:
    "Kushtunes helps artists release music globally. Mobile-first, modern, and built for creators.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
  manifest: "/site.webmanifest",
  openGraph: {
    title: "Kushtunes",
    description: "From the Nile to the World.",
    url: "https://kushtunes.com",
    siteName: "Kushtunes",
    locale: "en_US",
    type: "website",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Kushtunes",
  },
  formatDetection: {
    telephone: false,
  },
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
      </head>
      <body className="min-h-dvh bg-black text-white antialiased">
        <AppProvider>
          <div className="flex min-h-dvh flex-col">
            {children}
          </div>
          <ServiceWorkerRegistration />
          <NotificationSystem />
        </AppProvider>
      </body>
    </html>
  );
}
