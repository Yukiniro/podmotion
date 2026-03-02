import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import * as React from 'react'

import { Toaster } from '@/components/ui/sonner'

import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
})

export const metadata: Metadata = {
  title: 'Podmotion - Turn YouTube Videos into Podcasts',
  description:
    'Transform YouTube videos into vivid, expressive podcast audio with AI-powered script generation and emotion tagging.',
}

export const viewport: Viewport = {
  themeColor: '#ffffff',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
        <Toaster />
      </body>
    </html>
  )
}
