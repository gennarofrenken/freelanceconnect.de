import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CookieConsent } from "@/components/legal/CookieConsent";
import { AuthProvider } from "@/lib/auth";
import { DemoRoleSwitcher } from "@/components/dev/DemoRoleSwitcher";
import { AiAssistant } from "@/components/ai/AiAssistant";
import { OrganizationJsonLd, WebsiteJsonLd } from "@/components/seo/JsonLd";
import { ConsentAnalytics } from "@/components/analytics/ConsentAnalytics";
import { getSiteUrl } from "@/lib/site-config";

const SITE_URL = getSiteUrl();

const DEMO_MODE =
  process.env.NODE_ENV !== "production" ||
  process.env.NEXT_PUBLIC_DEMO_MODE === "1";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0d3e6f" },
  ],
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "FreelanceConnect – IT-Freelancer & Projekte in Deutschland",
    template: "%s | FreelanceConnect",
  },
  description:
    "FreelanceConnect ist die Plattform für IT-Freelancer und Unternehmen in der DACH-Region. Finden Sie passende Projekte oder qualifizierte Experten – ohne Vermittlungsgebühr.",
  applicationName: "FreelanceConnect",
  category: "business",
  keywords: [
    "Freelancer",
    "IT-Freelancer",
    "Projekte",
    "Freiberufler",
    "Projektbörse",
    "DACH",
    "Deutschland",
    "SAP Freelancer",
    "Cloud Berater",
    "Data Scientist",
  ],
  authors: [{ name: "FreelanceConnect" }],
  alternates: {
    canonical: SITE_URL,
    languages: { "de-DE": SITE_URL },
  },
  openGraph: {
    type: "website",
    locale: "de_DE",
    url: SITE_URL,
    siteName: "FreelanceConnect",
    title: "FreelanceConnect – Die Plattform für IT-Freelancer & Projekte",
    description:
      "Passende Projekte und qualifizierte Freelancer in der DACH-Region. Direkt, transparent, ohne Vermittlungsgebühr.",
  },
  twitter: {
    card: "summary_large_image",
    title: "FreelanceConnect – IT-Freelancer & Projekte (DACH)",
    description:
      "Direkt, transparent, ohne Vermittlungsgebühr. Über 12.000 aktive Projekte.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/apple-touch-icon.svg", type: "image/svg+xml" }],
  },
  manifest: "/manifest.webmanifest",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" className={`${jakarta.variable} h-full`}>
      <head>
        <OrganizationJsonLd />
        <WebsiteJsonLd />
      </head>
      <body className="min-h-full flex flex-col bg-white text-ink-900">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[100] focus:rounded-lg focus:bg-brand-700 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
        >
          Zum Inhalt springen
        </a>
        <AuthProvider>
          <Navbar />
          <main id="main" className="flex-1">
            {children}
          </main>
          <Footer />
          <CookieConsent />
          {DEMO_MODE && <DemoRoleSwitcher />}
          <AiAssistant />
          <ConsentAnalytics />
        </AuthProvider>
      </body>
    </html>
  );
}
