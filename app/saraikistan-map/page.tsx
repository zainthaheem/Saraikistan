
import type { Metadata } from 'next'
import Link from 'next/link'
import { client } from '@/sanity/lib/client'
import MapLanguageContent from './MapLanguageContent'

export const revalidate = 60

const fallbackMap = {
  title: 'Saraikistan Map',
  seoTitle: 'Saraikistan Map | Saraiki Cultural Region & Cities',
  seoDescription:
    'Explore the Saraikistan map, discover the Saraiki cultural region in Pakistan, and learn about its cities and heritage.',
  intro:
    'Explore the Saraiki cultural region through our illustrative Saraikistan map. Discover the wider geographical context of Saraiki-speaking communities, important cultural centres and the heritage that connects them.',
  mainMap: null,
  regionDescription:
    'The Saraiki cultural region is associated with the Saraiki language and a rich heritage of folk music, poetry, Sufi traditions, literature and local customs. Its cultural landscape is particularly associated with southern Punjab and extends into adjoining areas where Saraiki-speaking communities live.',
  boundaryDisclaimer:
    'This is an illustrative cultural and linguistic map. It does not represent official administrative boundaries.',
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
    'Saraikistan map illustrating the Saraiki cultural region and selected cities in Pakistan.'

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
          intro={map.intro || fallbackMap.intro}
          introUr={map.introUr}
          regionDescription={
            map.regionDescription ||
            fallbackMap.regionDescription
          }
          regionDescriptionUr={map.regionDescriptionUr}
          boundaryDisclaimer={
            map.boundaryDisclaimer ||
            fallbackMap.boundaryDisclaimer
          }
          boundaryDisclaimerUr={map.boundaryDisclaimerUr}
          mainMapUrl={mainMapUrl}
          mainMapAlt={mainMapAlt}
          mainMapAltUr={map.mainMap?.altUr}
          mainMapCaption={map.mainMap?.caption}
          mainMapCaptionUr={map.mainMap?.captionUr}
          additionalImages={additionalImages}
        />
      </section>

      <section className="border-y border-navy/10 bg-[#F3EBDD]">
        <div className="mx-auto grid max-w-7xl gap-5 px-6 py-10 sm:grid-cols-2 sm:px-10 sm:py-12 lg:px-12">
          <Link
            href="/region"
            className="group border-b border-navy/10 bg-cream p-6 transition-colors hover:border-mustard sm:p-8"
          >
            <p className="font-body text-xs uppercase tracking-[0.15em] text-shawl">
              Discover destinations
            </p>

            <h2 className="mt-3 font-display text-2xl text-navy sm:text-3xl">
              Places &amp; Cities
            </h2>

            <p className="mt-3 font-body text-sm leading-6 text-navy/65">
              Explore the cities, historic sites, landmarks and
              cultural places documented on Saraikistan.
            </p>

            <span className="mt-5 inline-block font-body text-xs font-semibold uppercase tracking-[0.1em] text-shawl transition-colors group-hover:text-mustard">
              Explore places
            </span>
          </Link>

          <Link
            href="/culture"
            className="group border-b border-navy/10 bg-cream p-6 transition-colors hover:border-mustard sm:p-8"
          >
            <p className="font-body text-xs uppercase tracking-[0.15em] text-shawl">
              Discover traditions
            </p>

            <h2 className="mt-3 font-display text-2xl text-navy sm:text-3xl">
              Saraiki Culture
            </h2>

            <p className="mt-3 font-body text-sm leading-6 text-navy/65">
              Discover Saraiki language, folk music, poetry,
              traditions and cultural heritage.
            </p>

            <span className="mt-5 inline-block font-body text-xs font-semibold uppercase tracking-[0.1em] text-shawl transition-colors group-hover:text-mustard">
              Explore culture
            </span>
          </Link>
        </div>
      </section>
    </main>
  )
}
