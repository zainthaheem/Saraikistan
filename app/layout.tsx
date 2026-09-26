
import type { Metadata } from 'next'
import Script from 'next/script'
import { Playfair_Display, Montserrat } from 'next/font/google'
import './globals.css'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import ScrollToTop from '@/components/ScrollToTop'
import { client } from '@/sanity/lib/client'
import { urlFor } from '@/sanity/lib/image'

const baseUrl = 'https://saraikistan.org'

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-playfair',
})

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-montserrat',
})

export const revalidate = 60

async function getSiteSettings() {
  return client.fetch(`
    *[_type == "siteSettings"][0]{
      siteTitle,
      tagline,
      headerImage,
      logo {
        asset,
        crop,
        hotspot
      }
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
    metadataBase: new URL(baseUrl),

    alternates: {
      canonical: '/',
    },

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

    authors: [{ name: 'Saraikistan' }],
    creator: 'Saraikistan',
    publisher: 'Saraikistan',

    verification: {
      google: 'NjAgnLZ3JG6G2QHd4t2PhirONbwdU2ags6jPpdl5Yp4',
    },

    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: baseUrl,
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

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
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

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteTitle,
    alternateName: 'Saraikistan',
    url: baseUrl,
    description,
    publisher: {
      '@type': 'Organization',
      name: siteTitle,
      url: baseUrl,
      logo: socialImage
        ? {
            '@type': 'ImageObject',
            url: socialImage,
          }
        : undefined,
    },
  }

  return (
    <html
      lang="en"
      className={`${playfair.variable} ${montserrat.variable}`}
    >
      <head>
        {/* Google AdSense account verification */}
        <meta
          name="google-adsense-account"
          content="ca-pub-9866879353406837"
        />

        {/* Google AdSense script */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9866879353406837"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />

        {/* Website structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
      </head>

      <body className="m-0 w-full overflow-x-hidden font-body">
        <Nav initialLogo={settings?.logo} />

        <main className="m-0 min-h-screen w-full max-w-none p-0">
          {children}
        </main>

        <Footer />

        <ScrollToTop />
      </body>
    </html>
  )
}
