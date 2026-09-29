
import type { Metadata } from 'next'
import Link from 'next/link'
import { client } from '@/sanity/lib/client'
import { urlFor } from '@/sanity/lib/image'
import LanguageSwitcher from '@/components/LanguageSwitcher'

export const revalidate = 60

async function getCultureItem(slug: string) {
  return client.fetch(
    `*[_type == "culture" && slug.current == $slug][0] {
      title,
      "category": category->{title},
      coverImage,
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

async function getRelatedCulture(slug: string) {
  return client.fetch(
    `*[
      _type == "culture" &&
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
  const item = await getCultureItem(params.slug)

  if (!item) {
    return {
      title: 'Culture | Saraikistan',
      description:
        'Explore Saraiki culture, traditions, language, music and heritage on Saraikistan.',
    }
  }

  const title =
    item.seoTitle ||
    `${item.title} | Saraikistan`

  const description =
    item.seoDescription ||
    `Explore ${item.title}, a part of the cultural traditions and heritage of the Saraiki region.`

  const imageSource = item.seoImage || item.coverImage

  const image = imageSource
    ? urlFor(imageSource)
        .width(1200)
        .height(630)
        .fit('crop')
        .quality(75)
        .format('webp')
        .url()
    : undefined

  const canonicalUrl =
    `https://saraikistan.org/culture/${params.slug}`

  return {
    title,
    description,

    alternates: {
      canonical: canonicalUrl,
    },

    openGraph: {
      title,
      description,
      type: 'article',
      url: canonicalUrl,
      siteName: 'Saraikistan',
      images: image
        ? [
            {
              url: image,
              width: 1200,
              height: 630,
              alt: item.title,
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

export default async function CulturePage({
  params,
}: {
  params: { slug: string }
}) {
  const [item, relatedCulture] = await Promise.all([
    getCultureItem(params.slug),
    getRelatedCulture(params.slug),
  ])

  if (!item) {
    return (
      <section className="min-h-screen bg-cream text-navy">
        <div className="mx-auto max-w-7xl px-6 pb-20 pt-6 sm:px-10 sm:pt-8 lg:px-12">
          <div className="border-t border-mustard pt-7">
            <p className="font-body text-base leading-7 text-navy/65 sm:text-lg">
              Culture item not found.
            </p>
          </div>
        </div>
      </section>
    )
  }

  const itemUrl =
    `https://saraikistan.org/culture/${params.slug}`

  const itemImageSource = item.seoImage || item.coverImage

  const itemImage = itemImageSource
    ? urlFor(itemImageSource)
        .width(1200)
        .height(630)
        .fit('crop')
        .quality(75)
        .format('webp')
        .url()
    : undefined

  const cultureSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': `${itemUrl}#article`,
    headline: item.title,
    description:
      item.seoDescription ||
      `Explore ${item.title}, a part of the cultural traditions and heritage of the Saraiki region.`,
    url: itemUrl,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': itemUrl,
    },
    ...(itemImage ? { image: itemImage } : {}),
    ...(item.category?.title
      ? { articleSection: item.category.title }
      : {}),
    inLanguage: 'en',
    author: {
      '@type': 'Organization',
      name: 'Saraikistan',
      url: 'https://saraikistan.org',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Saraikistan',
      url: 'https://saraikistan.org',
    },
  }

  const coverImageUrl = item.coverImage
    ? urlFor(item.coverImage)
        .width(1800)
        .height(700)
        .fit('crop')
        .quality(75)
        .format('webp')
        .url()
    : undefined

  return (
    <section className="min-h-screen bg-cream text-navy">
      {/* CULTURE STRUCTURED DATA */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(cultureSchema).replace(/</g, '\\u003c'),
        }}
      />

      {/* FULL-WIDTH COVER IMAGE */}
      {coverImageUrl && (
        <div className="h-56 w-full overflow-hidden bg-shawl sm:h-72 lg:h-96">
          <img
            src={coverImageUrl}
            alt={`${item.title} - Saraikistan`}
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

          {/* MAIN CULTURE COLUMN */}
          <article className="min-w-0">
            {/* CULTURE HEADER */}
            <div className="border-t border-mustard pt-7">
              {item.category && (
                <p className="font-body text-sm uppercase tracking-[0.12em] text-shawl">
                  {item.category.title}
                </p>
              )}

              <h1 className="mt-3 max-w-4xl font-display text-4xl leading-tight text-navy sm:text-5xl lg:text-[3.25rem]">
                {item.title}
              </h1>
            </div>

            {/* VIDEO */}
            {item.videoUrl && (
              <div className="mt-10 aspect-video w-full overflow-hidden bg-navy">
                <iframe
                  src={item.videoUrl.replace('watch?v=', 'embed/')}
                  className="h-full w-full"
                  title={item.title}
                  loading="lazy"
                  allowFullScreen
                />
              </div>
            )}

            {/* BILINGUAL CONTENT */}
            {(item.body || item.bodyUrdu) && (
              <div className="mt-10 w-full max-w-3xl">
                <LanguageSwitcher
                  english={item.body}
                  urdu={item.bodyUrdu}
                  englishLabel="About this tradition"
                  urduLabel="اس روایت کے بارے میں"
                />
              </div>
            )}

            {/* GALLERY */}
            {item.gallery && item.gallery.length > 0 && (
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
                  {item.gallery.map((img: any, i: number) => (
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
                        alt={`${item.title} — photo ${i + 1}`}
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
                Discover the traditions, heritage, people, and stories of the Saraiki region.
              </p>
            </div>

            {/* RELATED CULTURE */}
            {relatedCulture && relatedCulture.length > 0 && (
              <div className="mt-8">
                <div className="mb-5 flex items-center justify-between border-b border-navy/10 pb-3">
                  <h3 className="font-display text-xl text-navy">
                    More Culture
                  </h3>

                  <Link
                    href="/culture"
                    className="font-body text-xs text-shawl transition hover:text-mustard"
                  >
                    View All →
                  </Link>
                </div>

                <div className="space-y-6">
                  {relatedCulture.map((related: any) => {
                    const thumbnail = related.coverImage
                      ? urlFor(related.coverImage)
                          .width(400)
                          .height(260)
                          .fit('crop')
                          .quality(65)
                          .format('webp')
                          .url()
                      : undefined

                    return (
                      <Link
                        key={related.slug}
                        href={`/culture/${related.slug}`}
                        className="group block"
                      >
                        {thumbnail && (
                          <div className="mb-3 aspect-[16/10] overflow-hidden bg-shawl">
                            <img
                              src={thumbnail}
                              alt={related.title}
                              width={400}
                              height={260}
                              loading="lazy"
                              decoding="async"
                              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                            />
                          </div>
                        )}

                        {related.category?.title && (
                          <p className="font-body text-[11px] uppercase tracking-[0.12em] text-shawl">
                            {related.category.title}
                          </p>
                        )}

                        <h4 className="mt-1 font-display text-lg leading-snug text-navy transition group-hover:text-shawl">
                          {related.title}
                        </h4>

                        <span className="mt-2 inline-block font-body text-xs text-shawl underline underline-offset-4 transition group-hover:text-mustard">
                          Explore culture
                        </span>
                      </Link>
                    )
                  })}
                </div>
              </div>
            )}

            {/* EXPLORE MORE */}
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
                ].map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="flex items-center justify-between border-b border-navy/10 py-3 font-body text-sm text-navy/75 transition hover:text-shawl"
                  >
                    <span>{link.label}</span>
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
