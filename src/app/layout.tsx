import type { Metadata } from "next";
import { auth } from "@/auth";
import { Cinzel, Montserrat } from "next/font/google";
import { Navbar } from "@/components/layout/Navbar";
import { AnalyticsTracker } from "@/components/AnalyticsTracker";

import "./globals.css";

const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-cinzel",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Kuma Dojo | Karate Tradicional en Costa Rica",
    template: "%s | Kuma Dojo Costa Rica",
  },
  description: "Dojo de Karate Shotokan en Costa Rica. Aprende defensa personal, disciplina y tradición. Clases para niños y adultos en San José. Únete a Kuma Dojo.",
  keywords: ["Karate Costa Rica", "Dojo San José", "Clases de Karate", "Defensa Personal", "Shotokan", "Artes Marciales Costa Rica", "Kuma Dojo"],
  authors: [{ name: "Kuma Dojo Team" }],
  creator: "Kuma Dojo",
  publisher: "Kuma Dojo",
  openGraph: {
    title: "Kuma Dojo | Karate Tradicional en Costa Rica",
    description: "Formando carácter a través del Karate Shotokan. Únete a nuestro dojo en Costa Rica.",
    url: "https://kumadojocr.com",
    siteName: "Kuma Dojo Costa Rica",
    locale: "es_CR",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${cinzel.variable} ${montserrat.variable} antialiased font-sans text-white`}
      >
        <div className="fixed inset-0 bg-black/40 z-[-1] pointer-events-none" />
        <AnalyticsTracker />
        <Navbar user={session?.user} />
        {children}
      </body>
    </html>
  );
}
