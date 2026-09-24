import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Hamdhi Haris Portfolio",
  description: "Hamdhi Haris Portfolio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var forceLight = ['/admin', '/maintenance', '/dev-login'].some(function (route) {
                  return window.location.pathname === route || window.location.pathname.startsWith(route + '/');
                });

                if (localStorage.theme === 'dark' && !forceLight) {
                  document.documentElement.classList.add('dark')
                } else {
                  document.documentElement.classList.remove('dark')
                }
              } catch (_) {}
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased text-slate-900 dark:text-white transition-colors duration-300`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
