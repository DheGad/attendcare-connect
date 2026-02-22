import type { Metadata, Viewport } from "next";
import { Inter, Outfit } from "next/font/google";
import { NextAuthProvider } from "@/components/system/NextAuthProvider";
import { AppErrorBoundary } from "@/components/system/AppErrorBoundary";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: "AttendCare 4.1",
  description: "Proof-of-Care & Decision Infrastructure",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "AttendCare OS"
  }
};

export const viewport: Viewport = {
  themeColor: "#0A0E17",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  console.log("MARKER: layout.tsx is rendering");
  return (
    <html lang="en">
      <body className={`${inter.variable} ${outfit.variable} font-sans antialiased`}>
        <NextAuthProvider>
          <AppErrorBoundary>
            {children}
          </AppErrorBoundary>
        </NextAuthProvider>
      </body>
    </html>
  );
}
