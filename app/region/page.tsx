import type { Metadata } from ‘next’
import Image from ‘next/image’
import Link from ‘next/link’
import { client } from ‘@/sanity/lib/client’
import { urlFor } from ‘@/sanity/lib/image’

export const revalidate = 60

export const metadata: Metadata = {
title: ‘Saraiki Region | Places, Cities & Heritage’,
description:
‘Explore the cities, landscapes, historic sites and cultural places that form the living geography and heritage of the Saraiki region.’,
alternates: {
canonical: ‘https://saraikistan.org/region’,
},
openGraph: {
title: ‘Saraiki Region | Places, Cities & Heritage’,
description:
‘Explore the cities, landscapes, historic sites and cultural places that form the living geography and heritage of the Saraiki region.’,
type: ‘website’,
url: ‘https://saraikistan.org/region’,
siteName: ‘Saraikistan’,
},
twitter: {
card: ‘summary_large_image’,
title: ‘Saraiki Region | Places, Cities & Heritage’,
description:
‘Explore the cities, landscapes, historic sites and cultural places that form the living geography of the Saraiki region.’,
},
}

async function getPlaces() {
return client.fetch(*[_type == "place"] | order(title asc) { _id, title, slug, "category": category->{title}, coverImage })
}

export default async function Region() {
const places = await getPlaces()

return (
Where Saraiki culture comes from
      <h1 className="mt-2 font-display text-4xl leading-tight text-navy sm:text-5xl">
        Places
      </h1>
    </div>
  </section>
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
  <section
    aria-labelledby="region-map-heading"
    className="mx-auto max-w-7xl px-6 pb-14 sm:px-10 sm:pb-16 lg:px-12"
  >
    <div className="border border-navy/10 bg-[#F3EBDD] p-4 sm:p-7 lg:p-9">
      <div className="mb-6 max-w-3xl">
        <p className="font-body text-xs uppercase tracking-[0.18em] text-mustard">
          Geography &amp; language
        </p>
        <h2
          id="region-map-heading"
          className="mt-3 font-display text-3xl leading-tight text-navy sm:text-4xl"
        >
          The Saraiki Cultural Region
        </h2>
        <p className="mt-4 font-body text-sm leading-7 text-navy/70 sm:text-base sm:leading-8">
          Saraikistan describes a historical, cultural and
          linguistic region associated with Saraiki-speaking
          communities across southern and adjoining parts of
          Pakistan. Its cultural landscape includes historic
          cities, folk music, poetry, Sufi traditions and
          diverse environments.
        </p>
      </div>
      <figure className="overflow-hidden border border-navy/10 bg-[#F3EBDD]">
        <Image
          src="/images/saraikistan-map.svg"
          alt="Illustrative map of the Saraiki cultural and linguistic region, showing selected districts, cities and adjoining areas of Pakistan."
          width={1536}
          height={1024}
          sizes="(max-width: 767px) calc(100vw - 64px), (max-width: 1279px) calc(100vw - 112px), 1152px"
          className="h-auto w-full"
        />
        <figcaption className="border-t border-navy/10 px-4 py-3 font-body text-xs leading-5 text-navy/60 sm:px-5">
          An illustrative cultural overview of the Saraiki
          region. The highlighted areas represent a broad
          cultural and linguistic interpretation, not official
          administrative boundaries.
        </figcaption>
      </figure>
      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        <div className="border-l-2 border-mustard pl-4">
          <h3 className="font-display text-xl text-navy">
            Core cultural centres
          </h3>
          <p className="mt-2 font-body text-sm leading-6 text-navy/65">
            Multan, Dera Ghazi Khan and surrounding areas are
            important centres of Saraiki language, literature,
            music and cultural life. Mianwali and northern
            Saraiki-speaking areas are also part of the wider
            regional context.
          </p>
        </div>
        <div className="border-l-2 border-shawl pl-4">
          <h3 className="font-display text-xl text-navy">
            A living linguistic landscape
          </h3>
          <p className="mt-2 font-body text-sm leading-6 text-navy/65">
            Saraiki-speaking communities extend across adjoining
            areas. Language use and cultural identities can
            vary within individual districts, and the region
            has no universally agreed official boundary.
          </p>
        </div>
      </div>
    </div>
  </section>
  {places.length === 0 ? (
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
