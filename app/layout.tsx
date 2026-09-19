import type { Metadata } from 'next'
import './globals.css'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Saraikistan — People, Culture, Heritage, Beyond',
  description:
    'A digital home for the people, culture, language and timeless beauty of the Saraiki region.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="m-0 w-full overflow-x-hidden font-body">
        <Nav />

        <main className="m-0 min-h-screen w-full max-w-none p-0">
          {children}
        </main>

        <Footer />
      </body>
    </html>
  )
}
