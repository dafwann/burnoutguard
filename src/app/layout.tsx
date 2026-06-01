import type { Metadata } from 'next'

import './globals.css'

import { Inter, Plus_Jakarta_Sans } from 'next/font/google'

import { Toaster } from 'sonner'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',   // ← tambahkan ini
  preload: true,
})

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',   // ← tambahkan ini
  preload: true,
})

export const metadata: Metadata = {
  title: 'BurnoutGuard',
  description: 'BurnoutGuard App',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${jakarta.variable} bg-background text-foreground antialiased`}
      >
        {children}

        <Toaster
          richColors
          position="top-right"
          closeButton
          duration={3000}
        />
      </body>
    </html>
  )
}