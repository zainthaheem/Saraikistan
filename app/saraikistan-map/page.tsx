import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { client } from '@/sanity/lib/client'
import { urlFor } from '@/sanity/lib/image'

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
          mainMap {
            asset,
            alt,
            caption
          },
          additionalImages[] {
            asset,
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

type MapContent = {
  title?: string
  seoTitle?: string
  seoDescription?: string
  intro?: string
  mainMap?: {
    asset?: {
      _ref?: string
      _type?: string
    }
    alt?: string
    caption?: string
  } | null
  additionalImages?: Array<{
    asset?: {
      _ref?: string
      _type?: string
    }
    alt?: string
    caption?: string
  }>
  regionDescription?: string
  boundaryDisclaimer?: string
}

export async function generateMetadata(): Promise<Metadata> {
  const map = (await getMapContent()) as MapContent

  const title =
    map.seoTitle || fallbackMap.seoTitle

  const description =
    map.seoDescription || fallbackMap.seoDescription

  const mainImageUrl = map.mainMap?.asset
    ? urlFor(map.mainMap as never).width(1200).url()
    : 'https://saraikistan.org/images/saraikistan-cultural-map.webp'

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
          url: mainImageUrl,
          alt: map.mainMap?.alt || 'Saraikistan cultural region map',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [mainImageUrl],
    },
  }
}

export default async function SaraikistanMapPage() {
  const map = (await getMapContent()) as MapContent

  const mainMapUrl = map.mainMap?.asset
    ? urlFor(map.mainMap as never).width(2000).url()
    : '/images/saraikistan-cultural-map.webp'

  const mainMapAlt =
    map.mainMap?.alt ||
    'Saraikistan map illustrating the Saraiki cultural region and selected cities in Pakistan.'

  const additionalImages = (map.additionalImages || []).filter(
    (image) => image.asset?._ref
  )

  return (
    <main className="min-h-screen bg-cream text-navy">
      <section className="mx-auto max-w-7xl px-6 pb-8 pt-14 sm:px-10 sm:pb-12 sm:pt-20 lg:px-12">
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
        className="mx-auto max-w-7xl px-6 pb-12 sm:px-10 sm:pb-16 lg:px-12"
      >
        <div className="border border-navy/10 bg-[#F3EBDD] p-3 sm:p-6 lg:p-8">
          <div className="mb-5">
            <h2
              id="map-heading"
              className="font-display text-2xl text-navy sm:text-3xl"
            >
              Explore the Saraiki Cultural Region
            </h2>

            <p className="mt-2 font-body text-sm leading-6 text-navy/65 sm:text-base">
              View the map in detail or open the original image
              in a separate browser tab.
            </p>
          </div>

          <a
            href={mainMapUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="View the full-size Saraikistan cultural map"
            className="group block overflow-hidden border border-navy/10 bg-cream focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-shawl"
          >
            {map.mainMap?.asset ? (
              <Image
                src={mainMapUrl}
                alt={mainMapAlt}
                width={1536}
                height={1024}
                priority
                sizes="(max-width: 767px) calc(100vw - 48px), (max-width: 1279px) calc(100vw - 112px), 1152px"
                className="block h-auto w-full transition-opacity duration-300 group-hover:opacity-90"
              />
            ) : (
              <Image
                src="/images/saraikistan-cultural-map.webp"
                alt={mainMapAlt}
                width={1536}
                height={1024}
                priority
                sizes="(max-width: 767px) calc(100vw - 48px), (max-width: 1279px) calc(100vw - 112px), 1152px"
                className="block h-auto w-full transition-opacity duration-300 group-hover:opacity-90"
              />
            )}
          </a>

          {map.mainMap?.caption && (
            <p className="mt-3 font-body text-sm leading-6 text-navy/65">
              {map.mainMap.caption}
            </p>
          )}

          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <a
              href={mainMapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-12 items-center justify-center gap-2 bg-[#1E3A8A] px-6 py-3 font-body text-sm font-medium text-white transition hover:bg-[#0F172A] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-shawl"
            >
              View Full Map
              <span aria-hidden="true">↗</span>
            </a>

            <a
              href={mainMapUrl}
              download="saraikistan-cultural-map"
              className="inline-flex min-h-12 items-center justify-center gap-2 border border-navy/20 px-6 py-3 font-body text-sm font-medium text-navy transition hover:bg-white/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-shawl"
            >
              Download Map
              <span aria-hidden="true">↓</span>
            </a>
          </div>

          <p className="mt-4 font-body text-xs leading-5 text-navy/60">
            {map.boundaryDisclaimer ||
              fallbackMap.boundaryDisclaimer}
          </p>
        </div>
      </section>

      {additionalImages.length > 0 && (
        <section className="mx-auto max-w-7xl px-6 pb-14 sm:px-10 sm:pb-16 lg:px-12">
          <div className="mb-6">
            <h2 className="font-display text-3xl text-navy sm:text-4xl">
              More Maps &amp; Cultural Images
            </h2>

            <p className="mt-3 max-w-3xl font-body text-base leading-7 text-navy/65">
              Explore additional maps, illustrations and images
              documenting the Saraiki cultural region.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {additionalImages.map((image, index) => {
              const imageUrl = urlFor(image as never)
                .width(1000)
                .url()

              return (
                <figure
                  key={image.asset?._ref || index}
                  className="overflow-hidden border border-navy/10 bg-[#F3EBDD]"
                >
                  <a
                    href={imageUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`View image: ${image.alt || `Cultural map ${index + 1}`}`}
                  >
                    <Image
                      src={imageUrl}
                      alt={image.alt || 'Saraikistan cultural image'}
                      width={1000}
                      height={700}
                      sizes="(max-width: 639px) calc(100vw - 48px), (max-width: 1023px) calc(50vw - 56px), 384px"
                      className="block h-auto w-full"
                    />
                  </a>

                  {image.caption && (
                    <figcaption className="p-4 font-body text-sm leading-6 text-navy/65">
                      {image.caption}
                    </figcaption>
                  )}
                </figure>
              )
            })}
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
        <div className="mx-auto grid max-w-7xl gap-5 px-6 py-10 sm:grid-cols-2 sm:px-10 sm:py-14 lg:px-12">
          <Link
            href="/region"
            className="group border border-navy/10 bg-cream p-6 transition hover:border-mustard sm:p-8"
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

            <span className="mt-5 inline-block font-body text-sm text-shawl group-hover:text-mustard">
              Explore places →
            </span>
          </Link>

          <Link
            href="/culture"
            className="group border border-navy/10 bg-cream p-6 transition hover:border-mustard sm:p-8"
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

            <span className="mt-5 inline-block font-body text-sm text-shawl group-hover:text-mustard">
              Explore culture →
            </span>
          </Link>
        </div>
      </section>
    </main>
  )
}
