import type { Metadata } from 'next'
import { Inter, Poppins, Fira_Code } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
})

const firaCode = Fira_Code({
  subsets: ['latin'],
  variable: '--font-fira-code',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'GrowPath - AI-Powered Personalized Learning',
  description: 'Transform your learning journey with AI-generated personalized study plans tailored to your schedule and goals.',
  keywords: ['learning', 'AI', 'education', 'personalized learning', 'study plan'],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable} ${firaCode.variable}`}>
      <body className="antialiased">{children}</body>
    </html>
  )
}
