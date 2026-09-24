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
    canonical: 'https://saraikistan-ml2d.vercel.app/region',
  },
  openGraph: {
    title: 'Saraiki Region | Places, Cities & Heritage',
    description:
      'Explore the cities, landscapes, historic sites and cultural places that form the living geography and heritage of the Saraiki region.',
    type: 'website',
    url: 'https://saraikistan-ml2d.vercel.app/region',
    siteName: 'Saraikistan',
  },
  twitter: {
    card: 'summary',
    title: 'Saraiki Region | Places, Cities & Heritage',
    description:
      'Explore the cities, landscapes, historic sites and cultural places that form the living geography and heritage of the Saraiki region.',
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
      <section className="mx-auto max-w-7xl px-6 pb-12 sm:px-10 sm:pb-16 lg:px-12">

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

            {places.map((place: any) => (

              <Link
                key={place._id}
                href={`/region/${place.slug.current}`}
                className="group block overflow-hidden border border-navy/10 bg-cream transition duration-300 hover:-translate-y-1 hover:shadow-xl"
              >

                {/* IMAGE */}
                <div className="aspect-[16/9] overflow-hidden bg-shawl">

                  {place.coverImage ? (
                    <img
                      src={urlFor(place.coverImage)
                        .width(900)
                        .height(506)
                        .fit('crop')
                        .url()}
                      alt={place.title}
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

            ))}

          </div>

        </section>

      )}

    </main>
  )
}
