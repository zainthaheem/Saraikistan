import type { Metadata } from 'next'
import './globals.css'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import { client } from '@/sanity/lib/client'

export const revalidate = 60

async function getSiteSettings() {
  return client.fetch(`
    *[_type == "siteSettings"][0]{
      siteTitle,
      tagline
    }
  `)
}

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()

  const siteTitle = settings?.siteTitle || 'Saraikistan'
  const tagline =
    settings?.tagline ||
    'A digital home for the people, culture, language and timeless beauty of the Saraiki region.'

  return {
    title: `${siteTitle} — People, Culture, Heritage, Beyond`,
    description: tagline,
  }
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
