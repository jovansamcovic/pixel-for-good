import type { Metadata } from "next";
import { Geist, Geist_Mono, Cormorant_Garamond, Dancing_Script } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Vedrana Marković Atelier",
  description: "Arhitektonski i interijerstki atelje osnovan u Kragujevcu. Projektovanje enterijera za stambene i poslovne objekte.",
  icons: {
    icon: "/favicon.webp",
  },
  keywords: ["arhitektura", "enterijer", "dizajn", "Kragujevac", "Vedrana Marković", "atelje", "interior design"],
  authors: [{ name: "Vedrana Marković" }],
  creator: "Vedrana Marković Atelier",
  openGraph: {
    title: "Vedrana Marković Atelier",
    description: "Arhitektonski i interijerstki atelje osnovan u Kragujevcu.",
    url: "https://vedrana-markovic-atelier.studio",
    siteName: "Vedrana Marković Atelier",
    locale: "sr_RS",
    type: "website",
  },
};

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300"],
  variable: "--font-cormorant",
});

const dancing = Dancing_Script({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-dancing",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${cormorant.variable} ${dancing.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
