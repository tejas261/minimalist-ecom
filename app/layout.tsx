import React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Providers } from "./providers";
import { GlobalErrorBoundary } from "@/components/global-error-boundary";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MINIMAL - Modern Minimalistic Clothing",
  description:
    "Discover timeless pieces crafted with care. Sustainable fashion for the modern minimalist.",
  generator: "v0.dev",
  openGraph: {
    title: "MINIMAL - Modern Minimalistic Clothing",
    description:
      "Discover timeless pieces crafted with care. Sustainable fashion for the modern minimalist.",
    url: "https://minimalist-clothing.com/",
    siteName: "MINIMAL Clothing",
    images: [
      {
        url: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=1200&q=80",
        width: 1200,
        height: 630,
        alt: "Minimalist clothing hero background",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MINIMAL - Modern Minimalistic Clothing",
    description:
      "Discover timeless pieces crafted with care. Sustainable fashion for the modern minimalist.",
    images: [
      "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=1200&q=80",
    ],
    site: "@minimalclothing",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only absolute top-2 left-2 z-50 bg-primary text-primary-foreground px-4 py-2 rounded"
        >
          Skip to main content
        </a>
        <Providers>
          <div className="flex min-h-screen flex-col w-full items-center">
            <Header />
            <GlobalErrorBoundary>
              <main id="main-content" className="flex-1 w-full">
                {children}
              </main>
            </GlobalErrorBoundary>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
