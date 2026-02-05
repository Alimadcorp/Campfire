import "./globals.css";
import localFont from "next/font/local";
import { Geist, Geist_Mono } from "next/font/google";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const primaryFont = localFont({
  src: "../public/font.otf",
  variable: "--font-primary",
  display: "swap",
});

export const secFont = localFont({
  src: "../public/sec.otf",
  variable: "--font-subheading",
  display: "swap",
});

import { Source_Serif_4 } from "next/font/google";

export const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-source-serif",
  display: "swap",
});

export const metadata = {
  title: "Campfire Lahore - Lahore Game Jam",
  description:
    "Join Campfire Lahore! A teen-led game jam where you'll build amazing games with other high schoolers. Part of the global Campfire event happening in 200+ cities on Feb 28 - Mar 1, 2026.",
  keywords:
    "game jam, hackathon, teen coding, Hack Club, game development, Lahore, Pakistan, Campfire",
  authors: [{ name: "Muhammad Ali", url: "https://alimad.co" }],
  alternates: {
    canonical: "https://campfire.hackclub.com/lahore",
  },
  icons: "https://campfire.hackclub.com/favicon.png",
  openGraph: {
    title: "Campfire Lahore - Lahore Game Jam",
    description:
      "Join Campfire Lahore! A teen-led game jam where you'll build amazing games with other high schoolers. Feb 28 - Mar 1, 2026.",
    url: "https://campfire.hackclub.com/lahore",
    siteName: "Campfire",
    images: [
      {
        url: "https://campfire.hackclub.com/og-banner.png",
        width: 1200,
        height: 630,
        alt: "Campfire Lahore",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Campfire Lahore - Lahore Game Jam",
    description:
      "Join Campfire Lahore! A teen-led game jam where you'll build amazing games with other high schoolers. Feb 28 - Mar 1, 2026.",
    images: ["https://campfire.hackclub.com/og-banner.png"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" crosspilot="" suppressHydrationWarning>
      <body
        className={`${primaryFont.variable} ${secFont.variable} ${sourceSerif.variable} ${geistSans.variable} ${geistMono.variable} antialiased bg-black`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
