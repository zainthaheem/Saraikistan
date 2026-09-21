import type { Metadata } from 'next'
import { client } from '@/sanity/lib/client'
import { urlFor } from '@/sanity/lib/image'
import { PortableText } from '@portabletext/react'

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
      seoTitle,
      seoDescription,
      seoImage
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

  const image = place.seoImage
    ? urlFor(place.seoImage).width(1200).height(630).fit('crop').url()
    : place.coverImage
      ? urlFor(place.coverImage).width(1200).height(630).fit('crop').url()
      : undefined

  return {
    title,
    description,

    alternates: {
      canonical: `https://saraikistan-ml2d.vercel.app/region/${params.slug}`,
    },

    openGraph: {
      title,
      description,
      type: 'website',
      url: `https://saraikistan-ml2d.vercel.app/region/${params.slug}`,
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
  const place = await getPlace(params.slug)

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

  const placeUrl = `https://saraikistan-ml2d.vercel.app/region/${params.slug}`

  const placeImage = place.seoImage
    ? urlFor(place.seoImage).width(1200).height(630).fit('crop').url()
    : place.coverImage
      ? urlFor(place.coverImage).width(1200).height(630).fit('crop').url()
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

  return (
    <section className="min-h-screen bg-cream text-navy">

      {/* Place Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(placeSchema).replace(/</g, '\\u003c'),
        }}
      />

      {/* Cover Image */}
      {place.coverImage && (
        <div className="h-56 w-full overflow-hidden bg-shawl sm:h-72 lg:h-96">
          <img
            src={urlFor(place.coverImage)
              .width(1800)
              .height(700)
              .fit('crop')
              .url()}
            alt={place.title}
            className="h-full w-full object-cover"
          />
        </div>
      )}

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-6 pb-20 pt-8 sm:px-10 sm:pt-10 lg:px-12">

        <div className="border-t border-mustard pt-7">

          {/* Category */}
          {place.category && (
            <p className="font-body text-sm text-shawl">
              {place.category.title}
            </p>
          )}

          {/* Title */}
          <h1 className="mt-2 max-w-4xl font-display text-4xl leading-tight text-navy sm:text-5xl">
            {place.title}
          </h1>

        </div>

        {/* Video */}
        {place.videoUrl && (
          <div className="mt-10 aspect-video w-full overflow-hidden bg-navy">
            <iframe
              src={place.videoUrl.replace('watch?v=', 'embed/')}
              className="h-full w-full"
              title={place.title}
              allowFullScreen
            />
          </div>
        )}

        {/* Body */}
        {place.body && (
          <div className="mt-10 max-w-3xl">

            <p className="font-body text-sm text-shawl">
              About this place
            </p>

            <div className="prose prose-sm mt-4 max-w-none font-body leading-7 text-navy/75 sm:prose-base">
              <PortableText value={place.body} />
            </div>

          </div>
        )}

        {/* Gallery */}
        {place.gallery && place.gallery.length > 0 && (
          <div className="mt-14">

            <div className="mb-6">
              <p className="font-body text-sm text-shawl">
                Gallery
              </p>

              <h2 className="mt-2 font-display text-3xl text-navy sm:text-4xl">
                Photos
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">

              {place.gallery.map((img: any, i: number) => (
                <div
                  key={i}
                  className="aspect-square overflow-hidden bg-shawl"
                >
                  <img
                    src={urlFor(img)
                      .width(600)
                      .height(600)
                      .fit('crop')
                      .url()}
                    alt={`${place.title} — photo ${i + 1}`}
                    className="h-full w-full object-cover transition duration-500 hover:scale-105"
                  />
                </div>
              ))}

            </div>

          </div>
        )}

        {/* Image Credits */}
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

      </div>
    </section>
  )
}
