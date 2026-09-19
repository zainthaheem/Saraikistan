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
    <html lang="en" className="m-0 w-full p-0">
      <body className="m-0 w-full min-w-0 max-w-none overflow-x-hidden p-0 font-body">
        <Nav />

        <div className="m-0 w-full min-w-0 max-w-none p-0">
          {children}
        </div>

        <Footer />
      </body>
    </html>
  )
}
