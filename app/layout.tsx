import type { Metadata } from "next";
import {
  Cormorant_Garamond,
  Dancing_Script,
  Geist,
  Geist_Mono,
} from "next/font/google";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin", "latin-ext"],
  weight: ["300"],
  variable: "--font-cormorant",
});

const dancing = Dancing_Script({
  subsets: ["latin", "latin-ext"],
  weight: ["400"],
  variable: "--font-dancing",
});

export const metadata: Metadata = {
  title: {
    default: "Izaberi pixel",
    template: "%s | Izaberi pixel",
  },
  description:
    "Humanitarna platforma za prikupljanje sredstava kupovinom piksela. Izaberi svoj piksel i postani deo zajedničke slike dobrote.",
  applicationName: "Izaberi pixel",
  keywords: [
    "humanitarna akcija",
    "humanitarne donacije",
    "donacije",
    "kupovina piksela",
    "piksel dobrote",
    "izaberi pixel",
    "pixel po pixel",
    "Kragujevac",
  ],
  authors: [
    {
      name: "Izaberi pixel",
    },
  ],
  creator: "Izaberi pixel",
  publisher: "Izaberi pixel",
  icons: {
    icon: "/favicon.webp",
    shortcut: "/favicon.webp",
    apple: "/favicon.webp",
  },
  openGraph: {
    title: "Izaberi pixel",
    description:
      "Jedan piksel. Jedan korak bliže cilju. Izaberi svoj piksel i ostavi trag u zajedničkom srcu.",
    siteName: "Izaberi pixel",
    locale: "sr_RS",
    type: "website",
    images: [
      {
        url: "/og-image.webp",
        width: 1200,
        height: 630,
        alt: "Izaberi pixel — humanitarna akcija",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Izaberi pixel",
    description:
      "Izaberi svoj piksel i postani deo zajedničke slike dobrote.",
    images: ["/og-image.webp"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

type RootLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

export default function RootLayout({
  children,
}: RootLayoutProps) {
  return (
    <html
      lang="sr"
      className={[
        geistSans.variable,
        geistMono.variable,
        cormorant.variable,
        dancing.variable,
        "h-full antialiased",
      ].join(" ")}
    >
      <body className="flex min-h-full flex-col">
        {children}
      </body>
    </html>
  );
}