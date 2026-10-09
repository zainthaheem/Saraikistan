
import type { Metadata } from 'next'
import Link from 'next/link'
import { client } from '@/sanity/lib/client'
import { urlFor } from '@/sanity/lib/image'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Saraiki Region | Places, Cities & Heritage',
  description:
    'Explore the cities, landscapes, historic sites and cultural places that form the living geography and heritage of the Saraiki region.',
  alternates: {
    canonical: 'https://saraikistan.org/region',
  },
  openGraph: {
    title: 'Saraiki Region | Places, Cities & Heritage',
    description:
      'Explore the cities, landscapes, historic sites and cultural places that form the living geography and heritage of the Saraiki region.',
    type: 'website',
    url: 'https://saraikistan.org/region',
    siteName: 'Saraikistan',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Saraiki Region | Places, Cities & Heritage',
    description:
      'Explore the cities, landscapes, historic sites and cultural places that form the living geography of the Saraiki region.',
  },
}

async function getPlaces() {
  return client.fetch(
    `*[_type == "place"] | order(title asc) {
      _id,
      title,
      slug,
      "category": category->{title},
      coverImage
    }`
  )
}

export default async function Region() {
  const places = await getPlaces()

  return (
    <main className="min-h-screen bg-cream text-navy">
      {/* PAGE HEADER */}
      <section>
        <div className="mx-auto max-w-7xl px-6 pb-10 pt-6 sm:px-10 sm:pb-12 sm:pt-8 lg:px-12">
          <p className="font-body text-sm text-shawl">
            Where Saraiki culture comes from
          </p>

          <h1 className="mt-2 font-display text-4xl leading-tight text-navy sm:text-5xl">
            Places
          </h1>
        </div>
      </section>

      {/* INTRO */}
      <section className="mx-auto max-w-7xl px-6 pb-10 sm:px-10 sm:pb-12 lg:px-12">
        <div className="border-t border-mustard pt-7">
          <div className="max-w-3xl">
            <p className="font-body text-base leading-7 text-navy/65 sm:text-lg sm:leading-8">
              Explore the cities, landscapes, historic sites and
              cultural places that form the living geography of
              the Saraiki region.
            </p>
          </div>
        </div>
      </section>

      {/* SARAIKI LANGUAGE MAP */}
      <section
        aria-labelledby="region-map-heading"
        className="mx-auto max-w-7xl px-6 pb-14 sm:px-10 sm:pb-16 lg:px-12"
      >
        <div className="border border-navy/10 bg-[#F3EBDD] p-4 sm:p-7 lg:p-9">
          <div className="mb-6 max-w-3xl">
            <p className="font-body text-xs uppercase tracking-[0.18em] text-mustard">
              Geography & language
            </p>

            <h2
              id="region-map-heading"
              className="mt-3 font-display text-3xl leading-tight text-navy sm:text-4xl"
            >
              The Saraiki-speaking region
            </h2>

            <p className="mt-4 font-body text-sm leading-7 text-navy/70 sm:text-base sm:leading-8">
              Saraiki is spoken across a region that extends beyond
              administrative boundaries. This census-based map shows
              the share of each Pakistani district’s population
              reporting Saraiki as their mother tongue in the 2023
              census.
            </p>
          </div>

          <div className="overflow-hidden border border-navy/10 bg-white">
            <a
              href="https://commons.wikimedia.org/wiki/File:Saraiki-speakers_by_Pakistani_District_-_2023_Census.svg"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open the original 2023 census map on Wikimedia Commons"
            >
              <img
                src="https://commons.wikimedia.org/wiki/Special:FilePath/Saraiki-speakers_by_Pakistani_District_-_2023_Census.svg?width=1600"
                alt="Map showing the proportion of people reporting Saraiki as their mother tongue in each Pakistani district according to the 2023 census."
                width={1600}
                height={1000}
                loading="lazy"
                decoding="async"
                className="h-auto w-full"
              />
            </a>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div className="border-l-2 border-mustard pl-4">
              <h3 className="font-display text-xl text-navy">
                The core cultural region
              </h3>
              <p className="mt-2 font-body text-sm leading-6 text-navy/65">
                Southern Punjab is a central part of Saraiki
                cultural life. Our cultural interpretation also
                includes Mianwali and recognises the northern
                Saraiki-speaking areas.
              </p>
            </div>

            <div className="border-l-2 border-shawl pl-4">
              <h3 className="font-display text-xl text-navy">
                A wider linguistic landscape
              </h3>
              <p className="mt-2 font-body text-sm leading-6 text-navy/65">
                Saraiki-speaking communities extend into adjoining
                areas, including parts of Khyber Pakhtunkhwa and
                Sindh. Language use can vary within individual
                districts.
              </p>
            </div>
          </div>

          <p className="mt-6 border-t border-navy/10 pt-4 font-body text-xs leading-5 text-navy/55">
            Map source: Abbasi786786, “Saraiki-speakers by Pakistani
            District – 2023 Census,” Wikimedia Commons, licensed
            under CC BY 4.0. The map is reproduced without
            modification. The census shows reported mother-tongue
            distribution; it does not define an official boundary
            for Saraikistan.
            {' '}
            <a
              href="https://creativecommons.org/licenses/by/4.0/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-shawl"
            >
              License details
            </a>
            {' · '}
            <a
              href="https://commons.wikimedia.org/wiki/File:Saraiki-speakers_by_Pakistani_District_-_2023_Census.svg"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-shawl"
            >
              Original map and author
            </a>
          </p>
        </div>
      </section>

      {places.length === 0 ? (
        /* EMPTY STATE */
        <section className="mx-auto max-w-7xl px-6 pb-20 sm:px-10 lg:px-12">
          <div className="border border-navy/10 bg-cream p-8 sm:p-12">
            <p className="font-body text-sm uppercase tracking-[0.14em] text-mustard">
              Places archive
            </p>

            <h2 className="mt-4 font-display text-3xl sm:text-4xl">
              The map is just beginning.
            </h2>

            <p className="mt-4 max-w-2xl font-body text-base leading-7 text-navy/60 sm:text-lg">
              No places have been added yet. Add your first place
              through the Studio and it will appear here.
            </p>
          </div>
        </section>
      ) : (
        /* PLACES GRID */
        <section className="mx-auto max-w-7xl px-6 pb-20 sm:px-10 lg:px-12">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {places.map((place: any, index: number) => {
              const imageBuilder = place.coverImage
                ? urlFor(place.coverImage)
                    .height(405)
                    .fit('crop')
                    .quality(65)
                    .format('webp')
                : null

              const imageUrl = imageBuilder
                ? imageBuilder.width(480).url()
                : null

              const imageSrcSet = imageBuilder
                ? [
                    `${imageBuilder.width(320).url()} 320w`,
                    `${imageBuilder.width(480).url()} 480w`,
                    `${imageBuilder.width(640).url()} 640w`,
                    `${imageBuilder.width(800).url()} 800w`,
                  ].join(', ')
                : undefined

              return (
                <Link
                  key={place._id}
                  href={`/region/${place.slug.current}`}
                  className="group block overflow-hidden border border-navy/10 bg-cream transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  {/* RESPONSIVE OPTIMIZED IMAGE */}
                  <div className="aspect-[16/9] overflow-hidden bg-shawl">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        srcSet={imageSrcSet}
                        sizes="(max-width: 639px) calc(100vw - 48px), (max-width: 1023px) calc(50vw - 56px), (max-width: 1280px) calc(33.333vw - 48px), 384px"
                        alt={`${place.title} - Saraikistan`}
                        width={480}
                        height={270}
                        loading={index === 0 ? 'eager' : 'lazy'}
                        fetchPriority={index === 0 ? 'high' : 'auto'}
                        decoding="async"
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center font-display text-cream/40">
                        Saraikistan
                      </div>
                    )}
                  </div>

                  {/* CONTENT */}
                  <div className="border-t-2 border-mustard p-6">
                    {place.category && (
                      <p className="font-body text-xs uppercase tracking-[0.14em] text-shawl">
                        {place.category.title}
                      </p>
                    )}

                    <h2 className="mt-2 font-display text-2xl text-navy">
                      {place.title}
                    </h2>

                    <span className="mt-5 inline-block font-body text-xs uppercase tracking-[0.12em] text-shawl transition group-hover:text-mustard">
                      Explore →
                    </span>
                  </div>
                </Link>
              )
            })}
          </div>
        </section>
      )}
    </main>
  )
}
