import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientBody from "./ClientBody";
import { AuthProvider } from '@/contexts/AuthContext';
import { HRMSProvider } from '@/contexts/HRMSContext';
import { Toaster } from '@/components/ui/sonner';
import ClientOnly from "./ClientOnly";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Walltik",
  description: "Walltik - CRM Management System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ClientOnly>
          <AuthProvider>
            <HRMSProvider>
              <ClientBody>{children}</ClientBody>
              <Toaster />
            </HRMSProvider>
          </AuthProvider>
        </ClientOnly>
      </body>
    </html>
  );
}
