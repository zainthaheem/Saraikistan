
import type { Metadata } from 'next'
import Link from 'next/link'
import { client } from '@/sanity/lib/client'
import { urlFor } from '@/sanity/lib/image'
import LanguageSwitcher from '@/components/LanguageSwitcher'

export const revalidate = 60

async function getPlace(slug: string) {
  return client.fetch(
    `*[_type == "place" && slug.current == $slug][0] {
      title,
      "category": category->{title},
      coverImage,
      imageCredits,
      gallery,
      videoUrl,
      body,
      bodyUrdu,
      seoTitle,
      seoDescription,
      seoImage
    }`,
    { slug }
  )
}

async function getRelatedPlaces(slug: string) {
  return client.fetch(
    `*[
      _type == "place" &&
      slug.current != $slug
    ] | order(_createdAt desc)[0...4] {
      title,
      coverImage,
      "slug": slug.current,
      "category": category->{title}
    }`,
    { slug }
  )
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const place = await getPlace(params.slug)

  if (!place) {
    return {
      title: 'Place Not Found | Saraikistan',
      description:
        'The requested place could not be found on Saraikistan.',
    }
  }

  const title =
    place.seoTitle ||
    `${place.title} | Saraikistan`

  const description =
    place.seoDescription ||
    `Explore ${place.title}, its history, culture and significance in the Saraiki region.`

  const imageSource = place.seoImage || place.coverImage

  const image = imageSource
    ? urlFor(imageSource)
        .width(1200)
        .height(630)
        .fit('crop')
        .quality(80)
        .format('webp')
        .url()
    : undefined

  const canonicalUrl =
    `https://saraikistan.org/region/${params.slug}`

  return {
    title,
    description,

    alternates: {
      canonical: canonicalUrl,
    },

    openGraph: {
      title,
      description,
      type: 'website',
      url: canonicalUrl,
      siteName: 'Saraikistan',
      images: image
        ? [
            {
              url: image,
              width: 1200,
              height: 630,
              alt: place.title,
            },
          ]
        : undefined,
    },

    twitter: {
      card: image ? 'summary_large_image' : 'summary',
      title,
      description,
      images: image ? [image] : undefined,
    },
  }
}

export default async function PlacePage({
  params,
}: {
  params: { slug: string }
}) {
  const [place, relatedPlaces] = await Promise.all([
    getPlace(params.slug),
    getRelatedPlaces(params.slug),
  ])

  if (!place) {
    return (
      <section className="min-h-screen bg-cream text-navy">
        <div className="mx-auto max-w-7xl px-6 pb-20 pt-6 sm:px-10 sm:pt-8 lg:px-12">
          <div className="border-t border-mustard pt-7">
            <p className="font-body text-base leading-7 text-navy/65 sm:text-lg">
              Place not found.
            </p>
          </div>
        </div>
      </section>
    )
  }

  const placeUrl =
    `https://saraikistan.org/region/${params.slug}`

  const placeImageSource = place.seoImage || place.coverImage

  const placeImage = placeImageSource
    ? urlFor(placeImageSource)
        .width(1200)
        .height(630)
        .fit('crop')
        .quality(80)
        .format('webp')
        .url()
    : undefined

  const placeSchema = {
    '@context': 'https://schema.org',
    '@type': 'Place',
    '@id': `${placeUrl}#place`,
    name: place.title,
    url: placeUrl,
    description:
      place.seoDescription ||
      `Explore ${place.title}, its history, culture and significance in the Saraiki region.`,
    ...(placeImage ? { image: placeImage } : {}),
    ...(place.category?.title
      ? { additionalType: place.category.title }
      : {}),
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': placeUrl,
    },
  }

  const coverImageUrl = place.coverImage
    ? urlFor(place.coverImage)
        .width(1800)
        .height(700)
        .fit('crop')
        .quality(75)
        .format('webp')
        .url()
    : undefined

  return (
    <section className="min-h-screen bg-cream text-navy">
      {/* PLACE STRUCTURED DATA */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(placeSchema).replace(/</g, '\\u003c'),
        }}
      />

      {/* FULL-WIDTH COVER IMAGE */}
      {coverImageUrl && (
        <div className="h-56 w-full overflow-hidden bg-shawl sm:h-72 lg:h-96">
          <img
            src={coverImageUrl}
            alt={`${place.title} - Saraikistan`}
            width={1800}
            height={700}
            loading="eager"
            fetchPriority="high"
            decoding="async"
            className="h-full w-full object-cover"
          />
        </div>
      )}

      {/* EDITORIAL CONTENT LAYOUT */}
      <div className="mx-auto max-w-7xl px-6 pb-20 pt-8 sm:px-10 sm:pt-10 lg:px-12">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-12 xl:grid-cols-[minmax(0,1fr)_320px] xl:gap-16">

          {/* MAIN PLACE COLUMN */}
          <article className="min-w-0">
            {/* PLACE HEADER */}
            <div className="border-t border-mustard pt-7">
              {place.category && (
                <p className="font-body text-sm uppercase tracking-[0.12em] text-shawl">
                  {place.category.title}
                </p>
              )}

              <h1 className="mt-3 max-w-4xl font-display text-4xl leading-tight text-navy sm:text-5xl lg:text-[3.25rem]">
                {place.title}
              </h1>
            </div>

            {/* VIDEO */}
            {place.videoUrl && (
              <div className="mt-10 aspect-video w-full overflow-hidden bg-navy">
                <iframe
                  src={place.videoUrl.replace('watch?v=', 'embed/')}
                  className="h-full w-full"
                  title={place.title}
                  loading="lazy"
                  allowFullScreen
                />
              </div>
            )}

            {/* PLACE BODY */}
            {(place.body || place.bodyUrdu) && (
              <div className="mt-10 w-full max-w-3xl">
                <LanguageSwitcher
                  english={place.body}
                  urdu={place.bodyUrdu}
                  englishLabel="About this place"
                  urduLabel="اس جگہ کے بارے میں"
                />
              </div>
            )}

            {/* GALLERY */}
            {place.gallery && place.gallery.length > 0 && (
              <div className="mt-14">
                <div className="mb-6">
                  <p className="font-body text-sm uppercase tracking-[0.12em] text-shawl">
                    Gallery
                  </p>

                  <h2 className="mt-2 font-display text-3xl text-navy sm:text-4xl">
                    Photos
                  </h2>
                </div>

                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3">
                  {place.gallery.map((img: any, i: number) => (
                    <div
                      key={i}
                      className="aspect-square overflow-hidden bg-shawl"
                    >
                      <img
                        src={urlFor(img)
                          .width(500)
                          .height(500)
                          .fit('crop')
                          .quality(65)
                          .format('webp')
                          .url()}
                        alt={`${place.title} — photo ${i + 1}`}
                        width={500}
                        height={500}
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-cover transition duration-500 hover:scale-105"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* IMAGE CREDITS */}
            {place.imageCredits && (
              <details className="group mt-14 border-t border-navy/10 pt-5">
                <summary className="flex cursor-pointer list-none items-center justify-between font-body text-xs uppercase tracking-[0.12em] text-shawl transition hover:text-mustard [&::-webkit-details-marker]:hidden">
                  <span>Image Credits</span>

                  <span className="flex h-7 w-7 items-center justify-center border border-navy/15 text-lg leading-none transition group-open:rotate-45 group-open:border-mustard group-open:text-mustard">
                    +
                  </span>
                </summary>

                <div className="mt-5 max-w-3xl border-l-2 border-mustard pl-5">
                  <p className="whitespace-pre-line font-body text-sm leading-6 text-navy/60">
                    {place.imageCredits}
                  </p>
                </div>
              </details>
            )}
          </article>

          {/* EDITORIAL SIDEBAR */}
          <aside className="min-w-0 self-start lg:border-l lg:border-navy/10 lg:pl-8 xl:pl-10">

            {/* SIDEBAR HEADING */}
            <div className="border-t border-mustard pt-5">
              <p className="font-body text-xs uppercase tracking-[0.18em] text-shawl">
                Explore Saraikistan
              </p>

              <h2 className="mt-2 font-display text-2xl text-navy">
                Discover More
              </h2>

              <p className="mt-3 font-body text-sm leading-6 text-navy/60">
                Explore more stories, people, places, and cultural heritage from the Saraiki region.
              </p>
            </div>

            {/* RELATED PLACES */}
            {relatedPlaces && relatedPlaces.length > 0 && (
              <div className="mt-8">
                <div className="mb-5 flex items-center justify-between border-b border-navy/10 pb-3">
                  <h3 className="font-display text-xl text-navy">
                    More Places
                  </h3>

                  <Link
                    href="/region"
                    className="font-body text-xs text-shawl transition hover:text-mustard"
                  >
                    View All →
                  </Link>
                </div>

                <div className="space-y-6">
                  {relatedPlaces.map((item: any) => {
                    const thumbnail = item.coverImage
                      ? urlFor(item.coverImage)
                          .width(400)
                          .height(260)
                          .fit('crop')
                          .quality(65)
                          .format('webp')
                          .url()
                      : undefined

                    return (
                      <Link
                        key={item.slug}
                        href={`/region/${item.slug}`}
                        className="group block"
                      >
                        {thumbnail && (
                          <div className="mb-3 aspect-[16/10] overflow-hidden bg-shawl">
                            <img
                              src={thumbnail}
                              alt={item.title}
                              width={400}
                              height={260}
                              loading="lazy"
                              decoding="async"
                              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                            />
                          </div>
                        )}

                        {item.category?.title && (
                          <p className="font-body text-[11px] uppercase tracking-[0.12em] text-shawl">
                            {item.category.title}
                          </p>
                        )}

                        <h4 className="mt-1 font-display text-lg leading-snug text-navy transition group-hover:text-shawl">
                          {item.title}
                        </h4>

                        <span className="mt-2 inline-block font-body text-xs text-shawl underline underline-offset-4 transition group-hover:text-mustard">
                          Explore place
                        </span>
                      </Link>
                    )
                  })}
                </div>
              </div>
            )}

            {/* EXPLORE MORE — MATCHES STORIES SIDEBAR */}
            <div className="mt-10 border-t border-navy/10 pt-6">
              <h3 className="font-display text-xl text-navy">
                Explore More
              </h3>

              <nav className="mt-4 space-y-0">
                {[
                  { label: 'Stories & Heritage', href: '/blog' },
                  { label: 'Latest News', href: '/news' },
                  { label: 'People of Saraikistan', href: '/celebrities' },
                  { label: 'Places & Destinations', href: '/region' },
                  { label: 'Culture & Traditions', href: '/culture' },
                ].map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center justify-between border-b border-navy/10 py-3 font-body text-sm text-navy/75 transition hover:text-shawl"
                  >
                    <span>{item.label}</span>
                    <span className="text-mustard">→</span>
                  </Link>
                ))}
              </nav>
            </div>
          </aside>
        </div>
      </div>
    </section>
  )
}
