import type React from "react"
import "@/app/globals.css"

import type { Metadata, Viewport } from "next"

import { ThemeProvider } from "@/lib/context/theme-context"
import { LanguageProvider } from "@/lib/context/language-context"

export const metadata: Metadata = {
  title: "Restaurant Menus",
  description: "Explore our restaurant menus",
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body className="overscroll-none">
        <ThemeProvider>
          <LanguageProvider>{children}</LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

