import type { Metadata } from 'next'
import { Inter, Poppins, Geist } from 'next/font/google'
import './globals.css'
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'})

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-heading',
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
    <html lang="id" className={cn(poppins.variable, "font-sans", geist.variable)}>
      <body className="antialiased min-h-screen flex flex-col font-sans bg-background text-foreground">
        {children}
      </body>
    </html>
  )
}
