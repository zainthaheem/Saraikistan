import type { Metadata } from 'next'
import './globals.css'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import { client } from '@/sanity/lib/client'
import { urlFor } from '@/sanity/lib/image'

export const revalidate = 60

async function getSiteSettings() {
  return client.fetch(`
    *[_type == "siteSettings"][0]{
      siteTitle,
      tagline,
      headerImage
    }
  `)
}

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()

  const siteTitle = settings?.siteTitle || 'Saraikistan'

  const description =
    settings?.tagline ||
    'A digital home for the people, culture, language, heritage and stories of the Saraiki region.'

  const socialImage = settings?.headerImage
    ? urlFor(settings.headerImage)
        .width(1200)
        .height(630)
        .fit('crop')
        .url()
    : undefined

  const title = `${siteTitle} — People, Culture, Heritage, Beyond`

  return {
    metadataBase: new URL('https://saraikistan-ml2d.vercel.app'),

    title: {
      default: title,
      template: `%s | ${siteTitle}`,
    },

    description,

    keywords: [
      'Saraikistan',
      'Saraiki',
      'Saraiki culture',
      'Saraiki language',
      'Saraiki people',
      'Saraiki region',
      'Saraiki heritage',
      'South Punjab',
      'Saraiki literature',
      'Saraiki history',
      'Saraiki traditions',
      'Saraiki music',
    ],

    authors: [
      {
        name: 'Saraikistan',
      },
    ],

    creator: 'Saraikistan',
    publisher: 'Saraikistan',

    alternates: {
      canonical: 'https://saraikistan-ml2d.vercel.app',
    },

    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: 'https://saraikistan-ml2d.vercel.app',
      siteName: siteTitle,
      title,
      description,
      images: socialImage
        ? [
            {
              url: socialImage,
              width: 1200,
              height: 630,
              alt: 'Saraikistan — People, Culture, Heritage, Beyond',
            },
          ]
        : undefined,
    },

    twitter: {
      card: socialImage ? 'summary_large_image' : 'summary',
      title,
      description,
      images: socialImage ? [socialImage] : undefined,
    },

    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
        'max-video-preview': -1,
      },
    },
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
