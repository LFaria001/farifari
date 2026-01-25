import './globals.css'
import type { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Wiki Meaty - The Crowdsourced Meat Encyclopedia',
  description: 'Explore meat cuts, cooking methods, and recipes from around the world.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main style={{ minHeight: 'calc(100vh - 140px)' }}>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
