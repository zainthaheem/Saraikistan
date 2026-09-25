
import type { Metadata } from 'next'
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

  const image = item.seoImage
    ? urlFor(item.seoImage)
        .width(1200)
        .height(630)
        .fit('crop')
        .quality(75)
        .format('webp')
        .url()
    : item.coverImage
      ? urlFor(item.coverImage)
          .width(1200)
          .height(630)
          .fit('crop')
          .quality(75)
          .format('webp')
          .url()
      : undefined

  return {
    title,
    description,

    alternates: {
      canonical: `https://saraikistan.org/culture/${params.slug}`,
    },

    openGraph: {
      title,
      description,
      type: 'article',
      url: `https://saraikistan.org/culture/${params.slug}`,
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
  const item = await getCultureItem(params.slug)

  if (!item) {
    return (
      <section className="min-h-screen bg-cream text-navy">
        <div className="mx-auto max-w-7xl px-6 pb-20 pt-6 sm:px-10 sm:pt-8 lg:px-12">
          <div className="border-t border-mustard pt-7">
            <p className="max-w-3xl font-body text-base leading-7 text-navy/65 sm:text-lg">
              Not found.
            </p>
          </div>
        </div>
      </section>
    )
  }

  const itemUrl = `https://saraikistan.org/culture/${params.slug}`

  const itemImage = item.seoImage
    ? urlFor(item.seoImage)
        .width(1200)
        .height(630)
        .fit('crop')
        .quality(75)
        .format('webp')
        .url()
    : item.coverImage
      ? urlFor(item.coverImage)
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

  return (
    <section className="min-h-screen bg-cream text-navy">

      {/* Culture Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(cultureSchema).replace(/</g, '\\u003c'),
        }}
      />

      {/* Cover Image */}
      {item.coverImage && (
        <div className="h-56 w-full overflow-hidden bg-shawl sm:h-72 lg:h-96">
          <img
            src={urlFor(item.coverImage)
              .width(1400)
              .height(550)
              .fit('crop')
              .quality(72)
              .format('webp')
              .url()}
            alt={item.title}
            width={1400}
            height={550}
            loading="eager"
            fetchPriority="high"
            decoding="async"
            className="h-full w-full object-cover"
          />
        </div>
      )}

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-6 pb-20 pt-8 sm:px-10 sm:pt-10 lg:px-12">

        {/* Page Heading */}
        <div className="border-t border-mustard pt-7">

          {item.category && (
            <p className="font-body text-sm text-shawl">
              {item.category.title}
            </p>
          )}

          <h1 className="mt-2 max-w-4xl font-display text-4xl leading-tight text-navy sm:text-5xl">
            {item.title}
          </h1>

        </div>

        {/* Video */}
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

        {/* Bilingual Content */}
        {item.body && (
          <LanguageSwitcher
            english={item.body}
            urdu={item.bodyUrdu}
            englishLabel="About this tradition"
            urduLabel="اس روایت کے بارے میں"
          />
        )}

        {/* Gallery */}
        {item.gallery && item.gallery.length > 0 && (
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

      </div>

    </section>
  )
}
