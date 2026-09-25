
import type { Metadata } from 'next'
import Link from 'next/link'
import { client } from '@/sanity/lib/client'
import { urlFor } from '@/sanity/lib/image'
import LanguageSwitcher from '@/components/LanguageSwitcher'

export const revalidate = 60

async function getStory(slug: string) {
  return client.fetch(
    `*[_type == "story" && slug.current == $slug][0] {
      title,
      "category": category->{title},
      publishedAt,
      coverImage,
      imageCredits,
      gallery,
      videoUrl,
      body,
      bodyUrdu,
      seoTitle,
      seoDescription,
      seoImage,
      "relatedPersonName": relatedPerson->name,
      "relatedPersonSlug": relatedPerson->slug.current
    }`,
    { slug }
  )
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const story = await getStory(params.slug)

  if (!story) {
    return {
      title: 'Story Not Found | Saraikistan',
      description:
        'The requested story could not be found on Saraikistan.',
    }
  }

  const title =
    story.seoTitle ||
    `${story.title} | Saraikistan`

  const description =
    story.seoDescription ||
    `Read ${story.title} on Saraikistan — stories, history, people and culture from the Saraiki region.`

  const imageSource = story.seoImage || story.coverImage

  const image = imageSource
    ? urlFor(imageSource)
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
      canonical: `https://saraikistan.org/blog/${params.slug}`,
    },

    openGraph: {
      title,
      description,
      type: 'article',
      url: `https://saraikistan.org/blog/${params.slug}`,
      siteName: 'Saraikistan',
      images: image
        ? [
            {
              url: image,
              width: 1200,
              height: 630,
              alt: story.title,
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

export default async function StoryPage({
  params,
}: {
  params: { slug: string }
}) {
  const story = await getStory(params.slug)

  if (!story) {
    return (
      <section className="min-h-screen bg-cream text-navy">
        <div className="mx-auto max-w-7xl px-6 pb-20 pt-6 sm:px-10 sm:pt-8 lg:px-12">
          <div className="border-t border-mustard pt-7">
            <p className="font-body text-base leading-7 text-navy/65 sm:text-lg">
              Not found.
            </p>
          </div>
        </div>
      </section>
    )
  }

  const storyUrl = `https://saraikistan.org/blog/${params.slug}`

  const articleImageSource = story.seoImage || story.coverImage

  const articleImage = articleImageSource
    ? urlFor(articleImageSource)
        .width(1200)
        .height(630)
        .fit('crop')
        .quality(75)
        .format('webp')
        .url()
    : undefined

  const coverImage = story.coverImage
    ? urlFor(story.coverImage)
        .width(1400)
        .height(550)
        .fit('crop')
        .quality(72)
        .format('webp')
        .url()
    : undefined

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': `${storyUrl}#article`,
    headline: story.title,
    description:
      story.seoDescription ||
      `Read ${story.title} on Saraikistan — stories, history, people and culture from the Saraiki region.`,
    url: storyUrl,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': storyUrl,
    },
    ...(story.publishedAt
      ? { datePublished: story.publishedAt }
      : {}),
    ...(articleImage ? { image: articleImage } : {}),
    ...(story.category?.title
      ? { articleSection: story.category.title }
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
    ...(story.relatedPersonName && story.relatedPersonSlug
      ? {
          about: {
            '@type': 'Person',
            name: story.relatedPersonName,
            url: `https://saraikistan.org/celebrities/${story.relatedPersonSlug}`,
          },
        }
      : {}),
  }

  return (
    <section className="min-h-screen bg-cream text-navy">
      {/* ARTICLE STRUCTURED DATA */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleSchema).replace(/</g, '\\u003c'),
        }}
      />

      {/* COVER IMAGE */}
      {coverImage && (
        <div className="h-56 w-full overflow-hidden bg-shawl sm:h-72 lg:h-96">
          <img
            src={coverImage}
            alt={story.title}
            width={1400}
            height={550}
            loading="eager"
            fetchPriority="high"
            decoding="async"
            className="h-full w-full object-cover"
          />
        </div>
      )}

      {/* MAIN CONTENT */}
      <div className="mx-auto max-w-7xl px-6 pb-20 pt-8 sm:px-10 sm:pt-10 lg:px-12">
        {/* STORY HEADER */}
        <div className="border-t border-mustard pt-7">
          {story.category && (
            <p className="font-body text-sm text-shawl">
              {story.category.title}
            </p>
          )}

          <h1 className="mt-2 max-w-4xl font-display text-4xl leading-tight text-navy sm:text-5xl">
            {story.title}
          </h1>

          {story.publishedAt && (
            <p className="mt-4 font-body text-sm text-navy/50">
              {new Date(story.publishedAt).toLocaleDateString()}
            </p>
          )}

          {story.relatedPersonName && story.relatedPersonSlug && (
            <Link
              href={`/celebrities/${story.relatedPersonSlug}`}
              className="mt-3 inline-block font-body text-sm text-shawl underline underline-offset-4 transition hover:text-mustard"
            >
              About {story.relatedPersonName} →
            </Link>
          )}
        </div>

        {/* VIDEO */}
        {story.videoUrl && (
          <div className="mt-10 aspect-video w-full overflow-hidden bg-navy">
            <iframe
              src={story.videoUrl.replace('watch?v=', 'embed/')}
              className="h-full w-full"
              title={story.title}
              loading="lazy"
              allowFullScreen
            />
          </div>
        )}

        {/* STORY BODY */}
        {(story.body || story.bodyUrdu) && (
          <div className="mt-10 max-w-3xl">
            <LanguageSwitcher
              english={story.body}
              urdu={story.bodyUrdu}
            />
          </div>
        )}

        {/* GALLERY */}
        {story.gallery && story.gallery.length > 0 && (
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
              {story.gallery.map((img: any, i: number) => (
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
                    alt={`${story.title} — photo ${i + 1}`}
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
        {story.imageCredits && (
          <details className="group mt-14 border-t border-navy/10 pt-5">
            <summary className="flex cursor-pointer list-none items-center justify-between font-body text-xs uppercase tracking-[0.12em] text-shawl transition hover:text-mustard [&::-webkit-details-marker]:hidden">
              <span>Image Credits</span>

              <span className="flex h-7 w-7 items-center justify-center border border-navy/15 text-lg leading-none transition group-open:rotate-45 group-open:border-mustard group-open:text-mustard">
                +
              </span>
            </summary>

            <div className="mt-5 max-w-3xl border-l-2 border-mustard pl-5">
              <p className="whitespace-pre-line font-body text-sm leading-6 text-navy/60">
                {story.imageCredits}
              </p>
            </div>
          </details>
        )}
      </div>
    </section>
  )
}
