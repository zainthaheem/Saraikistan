
import type { Metadata } from 'next'
import { client } from '@/sanity/lib/client'
import MapLanguageContent from './MapLanguageContent'

export const revalidate = 60

type MapDocument = {
  title?: string
  titleUr?: string
  summary?: string
  summaryUr?: string
  content?: unknown[]
  contentUr?: unknown[]
  mainImage?: {
    asset?: {
      _ref?: string
    }
    alt?: string
  }
  gallery?: unknown[]
  seoTitle?: string
  seoTitleUr?: string
  seoDescription?: string
  seoDescriptionUr?: string
  seoImage?: unknown
}

export async function generateMetadata(): Promise<Metadata> {
  const map = await client.fetch<MapDocument | null>(
    `*[_type == "saraikistanMap" && published == true][0]{
      seoTitle,
      seoDescription,
      seoImage
    }`
  )

  return {
    title: map?.seoTitle || 'Saraikistan Map | Saraiki Cultural Region',
    description:
      map?.seoDescription ||
      'Explore the Saraiki cultural region through its cities, heritage and cultural geography.',
    alternates: {
      canonical: 'https://saraikistan.org/saraikistan-map',
    },
    openGraph: {
      title: map?.seoTitle || 'Saraikistan Map | Saraiki Cultural Region',
      description:
        map?.seoDescription ||
        'Explore the Saraiki cultural region, its cities and heritage.',
      type: 'website',
      url: 'https://saraikistan.org/saraikistan-map',
      siteName: 'Saraikistan',
    },
  }
}

export default async function SaraikistanMapPage() {
  const map = await client.fetch<MapDocument | null>(
    `*[_type == "saraikistanMap" && published == true][0]{
      title,
      titleUr,
      summary,
      summaryUr,
      content,
      contentUr,
      mainImage{
        asset,
        alt
      },
      gallery[]{
        asset,
        caption,
        alt
      },
      seoTitle,
      seoTitleUr,
      seoDescription,
      seoDescriptionUr,
      seoImage
    }`
  )

  if (!map) {
    return (
      <main className="min-h-screen bg-cream px-6 py-24 text-navy">
        <div className="mx-auto max-w-3xl border-t border-mustard pt-8">
          <p className="font-body text-xs uppercase tracking-[0.16em] text-shawl">
            Saraikistan
          </p>
          <h1 className="mt-4 font-display text-4xl sm:text-5xl">
            Saraikistan Map
          </h1>
          <p className="mt-6 font-body text-base leading-8 text-navy/70">
            The map is being prepared. Please check back soon.
          </p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-cream text-navy">
      <MapLanguageContent
        map={map}
      />
    </main>
  )
}
