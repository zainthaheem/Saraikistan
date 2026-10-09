import type { Metadata } from 'next'
import Link from 'next/link'
import { client } from '@/sanity/lib/client'
import { urlFor } from '@/sanity/lib/image'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Saraiki Region | Places, Cities & Heritage',
  description:
    'Explore cities, historic sites, landmarks and cultural places across the Saraiki region. Discover the heritage and destinations of Saraiki-speaking communities.',
  alternates: {
    canonical: 'https://saraikistan.org/region',
  },
  openGraph: {
    title: 'Saraiki Region | Places, Cities & Heritage',
    description:
      'Explore cities, historic sites, landmarks and cultural places across the Saraiki region.',
    type: 'website',
    url: 'https://saraikistan.org/region',
    siteName: 'Saraikistan',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Saraiki Region | Places, Cities & Heritage',
    description:
      'Discover Saraiki cities, historic destinations and cultural heritage across the region.',
  },
}

async function getPlaces() {
  return client.fetch(`
    *[_type == "place"] | order(title asc) {
      _id,
      title,
      slug,
      "category": category->{title},
      coverImage
    }
  `)
}

export default async function Region() {
  const places = await getPlaces()

  return (
    <main className="min-h-screen bg-cream text-navy">
      <section className="mx-auto max-w-7xl px-6 pb-8 pt-16 sm:px-10 sm:pb-10 sm:pt-20 lg:px-12">
        <div className="max-w-4xl">
          <p className="font-body text-xs uppercase tracking-[0.18em] text-mustard">
            Discover the land and its heritage
          </p>

          <h1 className="mt-2 font-display text-4xl leading-tight text-navy sm:text-5xl lg:text-6xl">
            Places &amp; Cities
          </h1>

          <p className="mt-5 max-w-3xl font-body text-base leading-7 text-navy/65 sm:text-lg sm:leading-8">
            Explore the cities, historic sites, shrines, landmarks
            and landscapes that shape the cultural heritage of
            the Saraiki region. Discover the places, stories and
            traditions that connect communities across this
            diverse part of Pakistan.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-12 sm:px-10 sm:pb-14 lg:px-12">
        <div className="border-t border-mustard pt-7">
          <div className="grid gap-6 sm:grid-cols-[1fr_auto] sm:items-center">
            <div className="max-w-3xl">
              <p className="font-body text-xs uppercase tracking-[0.16em] text-mustard">
                Geography &amp; cultural identity
              </p>

              <h2 className="mt-2 font-display text-2xl text-navy sm:text-3xl">
                Discover the Saraiki Region
              </h2>

              <p className="mt-3 font-body text-sm leading-7 text-navy/65 sm:text-base sm:leading-7">
                From historic cities and Sufi heritage to local
                landscapes and cultural centres, the Saraiki
                region has a rich and varied history. Explore
                individual destinations or view our illustrated
                map to understand the wider cultural and
                linguistic landscape.
              </p>
            </div>

            <Link
              href="/saraikistan-map"
              className="inline-flex min-h-10 items-center justify-center self-start border border-mustard bg-mustard px-5 py-2.5 font-body text-xs font-semibold uppercase tracking-[0.1em] text-navy transition-colors hover:border-[#B17B29] hover:bg-[#B17B29] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-shawl sm:self-center"
            >
              View Saraikistan Map
            </Link>
          </div>
        </div>
      </section>

      {places.length === 0 ? (
        <section className="mx-auto max-w-7xl px-6 pb-20 sm:px-10 lg:px-12">
          <div className="border border-navy/10 bg-[#F3EBDD] p-8 sm:p-12">
            <p className="font-body text-xs uppercase tracking-[0.14em] text-mustard">
              Places archive
            </p>

            <h2 className="mt-4 font-display text-3xl text-navy sm:text-4xl">
              Discoveries are on the way.
            </h2>

            <p className="mt-4 max-w-2xl font-body text-base leading-7 text-navy/60 sm:text-lg">
              No places have been added yet. Publish your first
              place through Sanity Studio and it will appear here.
              You can also explore the Saraikistan map for a
              broader view of the cultural region.
            </p>

            <Link
              href="/saraikistan-map"
              className="mt-6 inline-flex min-h-10 items-center justify-center border border-mustard bg-mustard px-5 py-2.5 font-body text-xs font-semibold uppercase tracking-[0.1em] text-navy transition-colors hover:border-[#B17B29] hover:bg-[#B17B29] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-shawl"
            >
              View Saraikistan Map
            </Link>
          </div>
        </section>
      ) : (
        <section
          aria-label="Places and cities in the Saraiki region"
          className="mx-auto max-w-7xl px-6 pb-20 sm:px-10 lg:px-12"
        >
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
                  href={
                    place.slug?.current
                      ? `/region/${place.slug.current}`
                      : '/region'
                  }
                  className="group block overflow-hidden border border-navy/10 bg-cream transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
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
                      Explore
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
