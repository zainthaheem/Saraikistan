
import type { Metadata } from 'next'
import { client } from '@/sanity/lib/client'
import { urlFor } from '@/sanity/lib/image'
import MapLanguageContent from './MapLanguageContent'

export const revalidate = 60

type GalleryItem = {
  asset?: {
    _ref?: string
  }
  alt?: string
  caption?: string
}

type MapDocument = {
  title?: string
  titleUr?: string
  summary?: string
  summaryUr?: string
  content?: unknown
  contentUr?: unknown
  mainImage?: {
    asset?: {
      _ref?: string
    }
    alt?: string
  }
  gallery?: GalleryItem[]
  seoTitle?: string
  seoDescription?: string
  seoImage?: {
    asset?: {
      _ref?: string
    }
  }
}

const mapQuery = `*[_type == "saraikistanMap" && published == true][0]{
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
    alt,
    caption
  },
  seoTitle,
  seoDescription,
  seoImage{
    asset
  }
}`

export async function generateMetadata(): Promise<Metadata> {
  const map = await client.fetch<MapDocument | null>(mapQuery)

  const title =
    map?.seoTitle || 'Saraikistan Map | Saraiki Cultural Region'

  const description =
    map?.seoDescription ||
    'Explore the Saraiki cultural region through its cities, cultural centres, language and heritage.'

  const seoImageUrl = map?.seoImage?.asset
    ? urlFor(map.seoImage).width(1200).height(630).url()
    : undefined

  return {
    title,
    description,
    alternates: {
      canonical: 'https://saraikistan.org/saraikistan-map',
    },
    openGraph: {
      title,
      description,
      url: 'https://saraikistan.org/saraikistan-map',
      siteName: 'Saraikistan',
      type: 'website',
      ...(seoImageUrl
        ? {
            images: [
              {
                url: seoImageUrl,
                width: 1200,
                height: 630,
                alt: title,
              },
            ],
          }
        : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      ...(seoImageUrl ? { images: [seoImageUrl] } : {}),
    },
  }
}

export default async function SaraikistanMapPage() {
  const map = await client.fetch<MapDocument | null>(mapQuery)

  if (!map) {
    return (
      <main className="min-h-screen bg-cream px-6 py-20 text-navy sm:px-10">
        <div className="mx-auto max-w-4xl border-t border-mustard pt-8">
          <p className="font-body text-xs uppercase tracking-[0.16em] text-shawl">
            Saraikistan
          </p>

          <h1 className="mt-4 font-display text-4xl leading-tight sm:text-5xl">
            Saraikistan Map
          </h1>

          <p className="mt-6 font-body text-base leading-8 text-navy/70">
            The map is currently unavailable. Please check back soon.
          </p>
        </div>
      </main>
    )
  }

  const mainImageUrl = map.mainImage?.asset
    ? urlFor(map.mainImage).width(2000).quality(85).format('webp').url()
    : ''

  const galleryImages = (map.gallery || [])
    .filter((image) => Boolean(image.asset))
    .map((image) => ({
      url: urlFor(image).width(1200).quality(80).format('webp').url(),
      alt: image.alt || '',
      caption: image.caption || '',
    }))

  return (
    <main className="min-h-screen bg-cream text-navy">
      <section className="mx-auto w-full max-w-7xl px-5 py-10 sm:px-10 sm:py-14 lg:px-12 lg:py-16">
        <MapLanguageContent
          title={map.title || 'Saraikistan Map'}
          titleUr={map.titleUr || ''}
          summary={map.summary || ''}
          summaryUr={map.summaryUr || ''}
          content={map.content}
          contentUr={map.contentUr}
          mainImageUrl={mainImageUrl}
          mainImageAlt={map.mainImage?.alt || map.title || 'Saraikistan cultural map'}
          galleryImages={galleryImages}
        />
      </section>
    </main>
  )
}
