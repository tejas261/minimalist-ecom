import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { Providers } from "../providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sign In - MINIMAL",
  description: "Sign in to your MINIMAL account",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <Providers>
            <div className="min-h-screen bg-background">
              <a
                href="#main-content"
                className="sr-only focus:not-sr-only absolute top-2 left-2 z-50 bg-primary text-primary-foreground px-4 py-2 rounded"
              >
                Skip to main content
              </a>
              <main
                id="main-content"
                className="min-h-screen flex items-center justify-center p-4"
              >
                {children}
              </main>
            </div>
          </Providers>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
