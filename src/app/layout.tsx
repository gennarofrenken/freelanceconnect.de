import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CookieConsent } from "@/components/legal/CookieConsent";
import { AuthProvider } from "@/lib/auth";
import { DemoRoleSwitcher } from "@/components/dev/DemoRoleSwitcher";
import { AiAssistant } from "@/components/ai/AiAssistant";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://freelanceconnect.de"),
  title: {
    default: "FreelanceConnect – IT-Freelancer & Projekte in Deutschland",
    template: "%s | FreelanceConnect",
  },
  description:
    "FreelanceConnect ist die Plattform für IT-Freelancer und Unternehmen in der DACH-Region. Finden Sie passende Projekte oder qualifizierte Experten – ohne Vermittlungsgebühr.",
  keywords: [
    "Freelancer",
    "IT-Freelancer",
    "Projekte",
    "Freiberufler",
    "Projektbörse",
    "DACH",
    "Deutschland",
  ],
  authors: [{ name: "FreelanceConnect" }],
  openGraph: {
    type: "website",
    locale: "de_DE",
    url: "https://freelanceconnect.de",
    siteName: "FreelanceConnect",
    title: "FreelanceConnect – Die Plattform für IT-Freelancer & Projekte",
    description:
      "Passende Projekte und qualifizierte Freelancer in der DACH-Region. Direkt, transparent, ohne Vermittlungsgebühr.",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/apple-touch-icon.svg", type: "image/svg+xml" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" className={`${jakarta.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-white text-ink-900">
        <AuthProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <CookieConsent />
          <DemoRoleSwitcher />
          <AiAssistant />
        </AuthProvider>
      </body>
    </html>
  );
}
