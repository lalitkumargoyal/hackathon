import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ApolloWrapper } from "./providers/ApolloWrapper";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "ProductSphere | Product Discovery",
  description:
    "Discover and shop amazing products with ProductSphere - your trusted platform",
  keywords: ["products", "shopping", "online store"],
  authors: [{ name: "ProductSphere Team" }],
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen antialiased">
        <ApolloWrapper>
          {/* ARIA Live Region for dynamic announcements */}
          <div
            aria-live="polite"
            aria-atomic="true"
            className="sr-only"
            id="aria-live-region"
          />

          {children}
        </ApolloWrapper>
      </body>
    </html>
  );
}
