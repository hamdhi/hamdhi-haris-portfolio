import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import GlobalThemeSync from "@/components/GlobalThemeSync";

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
                if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark')
                } else {
                  document.documentElement.classList.remove('dark')
                }
                
                if (localStorage.accentHue) {
                  var hue = localStorage.accentHue;
                  var style = document.createElement('style');
                  style.id = 'dynamic-theme-accent';
                  style.innerHTML = ':root { --accent-hue: ' + hue + '; --color-accent: hsl(' + hue + ', 89%, 48%); --color-accent-light: hsl(' + hue + ', 89%, 60%); --color-accent-dark: hsl(' + hue + ', 89%, 30%); }';
                  document.head.appendChild(style);
                }
              } catch (_) {}
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-50 dark:bg-[#020617] text-slate-900 dark:text-white transition-colors duration-300`}
      >
        <GlobalThemeSync />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
