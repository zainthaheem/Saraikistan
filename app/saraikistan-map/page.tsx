import type { Metadata } from 'next'
import Link from 'next/link'
import { client } from '@/sanity/lib/client'

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
          seoTitle,
          seoDescription,
          intro,
          "mainMap": mainMap {
            "url": asset->url,
            alt,
            caption
          },
          "additionalImages": additionalImages[] {
            "url": asset->url,
            alt,
            caption
          },
          regionDescription,
          boundaryDisclaimer
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
  caption?: string
}

type MapContent = {
  title?: string
  seoTitle?: string
  seoDescription?: string
  intro?: string
  mainMap?: MapImage | null
  additionalImages?: MapImage[]
  regionDescription?: string
  boundaryDisclaimer?: string
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

  const additionalImages = (map.additionalImages || []).filter(
    (image) => image.url
  )

  return (
    <main className="min-h-screen bg-cream text-navy">
      <section className="mx-auto max-w-7xl px-6 pb-8 pt-12 sm:px-10 sm:pb-10 sm:pt-16 lg:px-12">
        <div className="max-w-4xl">
          <p className="font-body text-xs uppercase tracking-[0.18em] text-mustard">
            Geography, language &amp; heritage
          </p>

          <h1 className="mt-3 font-display text-4xl leading-tight text-navy sm:text-5xl lg:text-6xl">
            {map.title || fallbackMap.title}
          </h1>

          <p className="mt-5 max-w-3xl font-body text-base leading-7 text-navy/70 sm:text-lg sm:leading-8">
            {map.intro || fallbackMap.intro}
          </p>
        </div>
      </section>

      <section
        aria-labelledby="map-heading"
        className="mx-auto max-w-7xl px-6 pb-12 sm:px-10 sm:pb-14 lg:px-12"
      >
        <div className="border border-navy/10 bg-[#F3EBDD] p-3 sm:p-6 lg:p-8">
          <div className="mb-5">
            <p className="font-body text-xs uppercase tracking-[0.16em] text-mustard">
              Cultural atlas
            </p>

            <h2
              id="map-heading"
              className="mt-2 font-display text-2xl text-navy sm:text-3xl"
            >
              Explore the Saraiki Cultural Region
            </h2>

            <p className="mt-2 font-body text-sm leading-6 text-navy/65 sm:text-base">
              View the full-size map for a closer look at the
              Saraiki cultural region.
            </p>
          </div>

          <figure className="overflow-hidden border border-navy/10 bg-cream">
            <a
              href={mainMapUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open the full-size Saraikistan cultural map"
              className="block focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-shawl"
            >
              <img
                src={mainMapUrl}
                alt={mainMapAlt}
                width={1536}
                height={1024}
                fetchPriority="high"
                decoding="async"
                className="block h-auto w-full"
              />
            </a>

            {map.mainMap?.caption && (
              <figcaption className="border-t border-navy/10 px-4 py-3 font-body text-sm leading-6 text-navy/65 sm:px-5">
                {map.mainMap.caption}
              </figcaption>
            )}
          </figure>

          <div className="mt-5">
            <a
              href={mainMapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-10 items-center justify-center border border-mustard bg-mustard px-5 py-2.5 font-body text-xs font-semibold uppercase tracking-[0.1em] text-navy transition-colors hover:border-[#B17B29] hover:bg-[#B17B29] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-shawl"
            >
              View Full Map
            </a>
          </div>

          <p className="mt-4 font-body text-xs leading-5 text-navy/60">
            {map.boundaryDisclaimer ||
              fallbackMap.boundaryDisclaimer}
          </p>
        </div>
      </section>

      {additionalImages.length > 0 && (
        <section className="mx-auto max-w-7xl px-6 pb-12 sm:px-10 sm:pb-14 lg:px-12">
          <div className="mb-6">
            <p className="font-body text-xs uppercase tracking-[0.16em] text-mustard">
              More to discover
            </p>

            <h2 className="mt-2 font-display text-3xl text-navy sm:text-4xl">
              More Maps &amp; Cultural Images
            </h2>

            <p className="mt-3 max-w-3xl font-body text-base leading-7 text-navy/65">
              Explore additional maps, regional illustrations and
              cultural photographs from the Saraiki region.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {additionalImages.map((image, index) => (
              <figure
                key={`${image.url}-${index}`}
                className="overflow-hidden border border-navy/10 bg-[#F3EBDD]"
              >
                <a
                  href={image.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`View ${image.alt || `cultural image ${index + 1}`}`}
                >
                  <img
                    src={image.url}
                    alt={image.alt || 'Saraikistan cultural image'}
                    width={1000}
                    height={700}
                    loading="lazy"
                    decoding="async"
                    className="block h-auto w-full"
                  />
                </a>

                {image.caption && (
                  <figcaption className="p-4 font-body text-sm leading-6 text-navy/65">
                    {image.caption}
                  </figcaption>
                )}
              </figure>
            ))}
          </div>
        </section>
      )}

      <section className="mx-auto max-w-7xl px-6 pb-14 sm:px-10 sm:pb-16 lg:px-12">
        <div className="max-w-4xl">
          <h2 className="font-display text-3xl leading-tight text-navy sm:text-4xl">
            About the Saraiki Cultural Region
          </h2>

          <div className="mt-5 space-y-4 font-body text-base leading-7 text-navy/70 sm:text-lg sm:leading-8">
            <p>
              {map.regionDescription ||
                fallbackMap.regionDescription}
            </p>

            <p>
              Multan, Dera Ghazi Khan, Bahawalpur and other
              cultural centres contribute to the region&apos;s
              diverse history and identity. Language use and
              cultural affiliations vary across localities, so
              the region should not be understood as having one
              universally agreed official boundary.
            </p>

            <p>
              This Saraikistan map provides a visual introduction
              to that cultural and linguistic landscape. It is
              intended for educational and cultural exploration,
              rather than as an authoritative administrative map.
            </p>
          </div>
        </div>
      </section>

      <section className="border-y border-navy/10 bg-[#F3EBDD]">
        <div className="mx-auto grid max-w-7xl gap-5 px-6 py-10 sm:grid-cols-2 sm:px-10 sm:py-12 lg:px-12">
          <Link
            href="/region"
            className="group border border-navy/10 bg-cream p-6 transition-colors hover:border-mustard sm:p-8"
          >
            <p className="font-body text-xs uppercase tracking-[0.15em] text-mustard">
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
            className="group border border-navy/10 bg-cream p-6 transition-colors hover:border-mustard sm:p-8"
          >
            <p className="font-body text-xs uppercase tracking-[0.15em] text-mustard">
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
