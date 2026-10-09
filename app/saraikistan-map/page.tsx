import type { Metadata } from 'next'
import { client } from '@/sanity/lib/client'
import MapLanguageContent from './MapLanguageContent'

export const revalidate = 60

const fallbackMap = {
  title: 'Saraikistan Map',
  seoTitle: 'Saraikistan Map | Saraiki Cultural Region & Cities',
  seoDescription:
    'Explore the Saraikistan map, discover the Saraiki cultural region in Pakistan, and learn about its cities and heritage.',
  intro: '',
  mainMap: null,
  regionDescription: '',
  boundaryDisclaimer: '',
  additionalImages: [],
}

async function getMapContent() {
  try {
    const map = await client.fetch(`
      *[_type == "saraikistanMap" && published == true]
        | order(_updatedAt desc)[0] {
          title,
          titleUr,
          seoTitle,
          seoDescription,
          intro,
          introUr,
          "mainMap": mainMap {
            "url": asset->url,
            alt,
            altUr,
            caption,
            captionUr
          },
          "additionalImages": additionalImages[] {
            "url": asset->url,
            alt,
            altUr,
            caption,
            captionUr
          },
          regionDescription,
          regionDescriptionUr,
          boundaryDisclaimer,
          boundaryDisclaimerUr
        }
    `)

    return map || fallbackMap
  } catch {
    return fallbackMap
  }
}

type MapImage = {
  url?: string
  alt?: string
  altUr?: string
  caption?: string
  captionUr?: string
}

type MapContent = {
  title?: string
  titleUr?: string
  seoTitle?: string
  seoDescription?: string
  intro?: string
  introUr?: string
  mainMap?: MapImage | null
  additionalImages?: MapImage[]
  regionDescription?: string
  regionDescriptionUr?: string
  boundaryDisclaimer?: string
  boundaryDisclaimerUr?: string
}

export async function generateMetadata(): Promise<Metadata> {
  const map = (await getMapContent()) as MapContent

  const title = map.seoTitle || fallbackMap.seoTitle
  const description =
    map.seoDescription || fallbackMap.seoDescription
  const imageUrl =
    map.mainMap?.url ||
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
          alt: map.mainMap?.alt || 'Saraikistan cultural region map',
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
  const map = (await getMapContent()) as MapContent

  const mainMapUrl =
    map.mainMap?.url ||
    '/images/saraikistan-cultural-map.webp'

  const mainMapAlt =
    map.mainMap?.alt ||
    'Saraikistan cultural region map'

  const additionalImages = (map.additionalImages || [])
    .filter(
      (image): image is MapImage & { url: string } =>
        Boolean(image.url)
    )
    .map((image) => ({
      url: image.url,
      alt: image.alt,
      altUr: image.altUr,
      caption: image.caption,
      captionUr: image.captionUr,
    }))

  return (
    <main className="min-h-screen bg-cream text-navy">
      <section className="mx-auto max-w-7xl px-6 pb-10 pt-6 sm:px-10 sm:pb-12 sm:pt-8 lg:px-12">
        <MapLanguageContent
          title={map.title || fallbackMap.title}
          titleUr={map.titleUr}
          intro={map.intro || ''}
          introUr={map.introUr}
          regionDescription={map.regionDescription || ''}
          regionDescriptionUr={map.regionDescriptionUr}
          boundaryDisclaimer={map.boundaryDisclaimer || ''}
          boundaryDisclaimerUr={map.boundaryDisclaimerUr}
          mainMapUrl={mainMapUrl}
          mainMapAlt={mainMapAlt}
          mainMapAltUr={map.mainMap?.altUr}
          mainMapCaption={map.mainMap?.caption}
          mainMapCaptionUr={map.mainMap?.captionUr}
          additionalImages={additionalImages}
        />
      </section>
    </main>
  )
}
