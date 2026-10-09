
import type { Metadata } from 'next'
import { client } from '@/sanity/lib/client'
import MapLanguageContent from './MapLanguageContent'

export const revalidate = 60

const fallbackMap = {
  title: 'Saraikistan Map',
  seoTitle: 'Saraikistan Map | Saraiki Cultural Region & Cities',
  seoDescription:
    'Explore the Saraikistan map and discover the Saraiki cultural region, its cities and cultural heritage.',
}

type MapImage = {
  url?: string
}

type MapContent = {
  title?: string
  titleUr?: string
  summary?: string
  summaryUr?: string
  content?: string
  contentUr?: string
  mainImage?: MapImage | null
  mainImageAlt?: string
  additionalImages?: MapImage[]
  seoTitle?: string
  seoTitleUr?: string
  seoDescription?: string
  seoDescriptionUr?: string
  seoImage?: MapImage | null
}

async function getMapContent(): Promise<MapContent> {
  try {
    const map = await client.fetch(`
      *[_type == "saraikistanMap" && published == true]
        | order(_updatedAt desc)[0] {
          title,
          titleUr,
          summary,
          summaryUr,
          content,
          contentUr,
          "mainImage": mainImage {
            "url": asset->url
          },
          mainImageAlt,
          "additionalImages": additionalImages[] {
            "url": asset->url
          },
          seoTitle,
          seoTitleUr,
          seoDescription,
          seoDescriptionUr,
          "seoImage": seoImage {
            "url": asset->url
          }
        }
    `)

    return map || {}
  } catch {
    return {}
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const map = await getMapContent()

  const title = map.seoTitle || fallbackMap.seoTitle
  const description =
    map.seoDescription || fallbackMap.seoDescription
  const imageUrl =
    map.seoImage?.url ||
    map.mainImage?.url ||
    'https://saraikistan.org/images/saraikistan-cultural-map.webp'

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
      images: [
        {
          url: imageUrl,
          alt: map.mainImageAlt || 'Saraikistan cultural region map',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
  }
}

export default async function SaraikistanMapPage() {
  const map = await getMapContent()

  const mainImageUrl =
    map.mainImage?.url ||
    '/images/saraikistan-cultural-map.webp'

  const additionalImages = (map.additionalImages || [])
    .filter(
      (image): image is MapImage & { url: string } =>
        Boolean(image.url)
    )
    .map((image) => ({
      url: image.url,
    }))

  return (
    <main className="min-h-screen bg-cream text-navy">
      <section className="mx-auto max-w-7xl px-6 pb-10 pt-6 sm:px-10 sm:pb-12 sm:pt-8 lg:px-12">
        <MapLanguageContent
          title={map.title || fallbackMap.title}
          titleUr={map.titleUr}
          summary={map.summary || ''}
          summaryUr={map.summaryUr}
          content={map.content || ''}
          contentUr={map.contentUr}
          mainImageUrl={mainImageUrl}
          mainImageAlt={map.mainImageAlt || map.title || fallbackMap.title}
          additionalImages={additionalImages}
        />
      </section>
    </main>
  )
}
