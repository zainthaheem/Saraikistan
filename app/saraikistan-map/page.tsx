import type { Metadata } from 'next'
import { client } from '@/sanity/lib/client'
import { urlFor } from '@/sanity/lib/image'
import MapLanguageContent from './MapLanguageContent'

export const revalidate = 60

type SanityImage = {
  asset?: {
    _ref?: string
    _type?: string
  }
  alt?: string
  caption?: string
}

type MapDocument = {
  _id: string
  title?: string
  titleUr?: string
  summary?: string
  summaryUr?: string
  content?: unknown
  contentUr?: unknown
  mainImage?: SanityImage
  gallery?: SanityImage[]
  seoTitle?: string
  seoTitleUr?: string
  seoDescription?: string
  seoDescriptionUr?: string
  seoImage?: SanityImage
}

const mapQuery = `
  *[_type == "saraikistanMap" && published == true][0] {
    _id,
    title,
    titleUr,
    summary,
    summaryUr,
    content,
    contentUr,
    mainImage {
      asset,
      alt
    },
    gallery[] {
      asset,
      alt,
      caption
    },
    seoTitle,
    seoTitleUr,
    seoDescription,
    seoDescriptionUr,
    seoImage {
      asset
    }
  }
`

async function getMap(): Promise<MapDocument | null> {
  return client.fetch(mapQuery)
}

export async function generateMetadata(): Promise<Metadata> {
  const map = await getMap()

  const title = map?.seoTitle || map?.title || 'Saraikistan Map'

  const description =
    map?.seoDescription ||
    map?.summary ||
    'Explore the Saraiki cultural region, its cities, language and heritage.'

  const socialImage =
    map?.seoImage?.asset
      ? urlFor(map.seoImage).width(1200).height(630).fit('max').url()
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
      type: 'website',
      url: 'https://saraikistan.org/saraikistan-map',
      siteName: 'Saraikistan',
      images: socialImage ? [{ url: socialImage }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: socialImage ? [socialImage] : undefined,
    },
  }
}

export default async function SaraikistanMapPage() {
  const map = await getMap()

  if (!map) {
    return (
      <main className="min-h-[60vh] bg-cream px-6 py-20 text-navy sm:px-10">
        <section className="mx-auto max-w-4xl">
          <p className="font-body text-xs uppercase tracking-[0.16em] text-shawl">
            Saraikistan
          </p>

          <h1 className="mt-4 font-display text-4xl sm:text-5xl">
            Saraikistan Map
          </h1>

          <p className="mt-6 max-w-2xl font-body text-base leading-8 text-navy/70">
            The map is not available yet. Please check that the
            Saraikistan Map document exists in Sanity and its Published
            toggle is enabled.
          </p>
        </section>
      </main>
    )
  }

  const mainImageUrl = map.mainImage?.asset
    ? urlFor(map.mainImage).width(2000).fit('max').quality(85).url()
    : ''

  const galleryImages = (map.gallery || [])
    .filter((image) => image.asset)
    .map((image) => ({
      url: urlFor(image).width(1200).fit('max').quality(82).url(),
      alt: image.alt || '',
      caption: image.caption || '',
    }))

  return (
    <main className="min-h-screen bg-cream text-navy">
      <section className="mx-auto max-w-7xl px-5 pb-16 pt-10 sm:px-10 sm:pb-20 sm:pt-14 lg:px-12 lg:pt-16">
        <div className="mx-auto max-w-5xl">
          <MapLanguageContent
            title={map.title || 'Saraikistan Map'}
            titleUr={map.titleUr || ''}
            summary={map.summary || ''}
            summaryUr={map.summaryUr || ''}
            content={map.content}
            contentUr={map.contentUr}
            mainImageUrl={mainImageUrl}
            mainImageAlt={
              map.mainImage?.alt ||
              map.title ||
              'Saraikistan cultural map'
            }
            galleryImages={galleryImages}
          />
        </div>
      </section>
    </main>
  )
}
