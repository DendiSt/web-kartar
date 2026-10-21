import type { Metadata } from 'next'
import { Manrope, Inter } from 'next/font/google'
import './globals.css'
import { cn } from "@/lib/utils"
import { ThemeProvider } from '@/components/ThemeProvider'

// Charlie Display substitute as defined in DESIGN.md
const manrope = Manrope({
  subsets: ['latin'],
  weight: ['400', '500', '700', '800'],
  variable: '--font-heading',
})

// Charlie Text substitute as defined in DESIGN.md
const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-sans',
})

export const metadata: Metadata = {
  title: 'Karang Taruna Tirtajaya 01',
  description: 'Website Resmi Karang Taruna Dusun Tirtajaya 01',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="id" className={cn(manrope.variable, inter.variable, "font-sans")} suppressHydrationWarning>
      <body className="antialiased min-h-screen flex flex-col font-sans bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
