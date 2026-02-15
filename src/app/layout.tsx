import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { RedirectToSignIn, SignedIn, SignedOut } from "@clerk/nextjs";
import { ThemeProvider } from "@/providers/ThemeProvider";
import Navbar from "@/layout/Navbar";
import ConvexClerkProvider from "@/providers/ConvexClerkProvider";
import { Toaster } from "react-hot-toast";
import { ErrorBoundary } from "@/lib/errors";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "V-Sync",
  description: "V-Sync is a platform for video interviews and assessments.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ConvexClerkProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <ErrorBoundary>
              <SignedIn>
                <div className="min-h-screen">
                  <Navbar />
                  <main className="px-4 sm:px-6 lg:px-8">{children}</main>
                </div>
              </SignedIn>

              <SignedOut>
                <div className="min-h-screen flex items-center justify-center">
                  <RedirectToSignIn />
                </div>
              </SignedOut>
            </ErrorBoundary>
          </ThemeProvider>
        </ConvexClerkProvider>
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}
