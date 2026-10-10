import type { Metadata } from 'next'
import Link from 'next/link'
import { client } from '@/sanity/lib/client'
import { urlFor } from '@/sanity/lib/image'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import PhotoGallery from '@/components/PhotoGallery'

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

async function getRelatedStories(slug: string) {
  return client.fetch(
    `*[
      _type == "story" &&
      slug.current != $slug
    ] | order(publishedAt desc)[0...4] {
      title,
      publishedAt,
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
      canonical: `https://saraikistan.org/stories/${params.slug}`,
    },

    openGraph: {
      title,
      description,
      type: 'article',
      url: `https://saraikistan.org/stories/${params.slug}`,
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
  const [story, relatedStories] = await Promise.all([
    getStory(params.slug),
    getRelatedStories(params.slug),
  ])

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

  const storyUrl = `https://saraikistan.org/stories/${params.slug}`

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

      {/* FULL-WIDTH COVER IMAGE */}
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

      {/* EDITORIAL CONTENT LAYOUT */}
      <div className="mx-auto max-w-7xl px-6 pb-20 pt-8 sm:px-10 sm:pt-10 lg:px-12">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-12 xl:grid-cols-[minmax(0,1fr)_320px] xl:gap-16">
          {/* MAIN ARTICLE COLUMN */}
          <article className="min-w-0">
            {/* STORY HEADER */}
            <div className="border-t border-mustard pt-7">
              {story.category && (
                <p className="font-body text-sm uppercase tracking-[0.12em] text-shawl">
                  {story.category.title}
                </p>
              )}

              <h1 className="mt-3 max-w-4xl font-display text-4xl leading-tight text-navy sm:text-5xl lg:text-[3.25rem]">
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
              <div className="mt-10 w-full max-w-3xl">
                <LanguageSwitcher
                  english={story.body}
                  urdu={story.bodyUrdu}
                />
              </div>
            )}

            {/* SHARED PHOTO GALLERY */}
            {story.gallery && story.gallery.length > 0 && (
              <div className="mt-14">
                <div className="mb-6">
                  <p className="font-body text-sm uppercase tracking-[0.12em] text-shawl">
                    Gallery
                  </p>

                  <h2 className="mt-2 font-display text-3xl text-navy sm:text-4xl">
                    Photos
                  </h2>
                </div>

                <PhotoGallery
                  images={story.gallery}
                  personName={story.title}
                />
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
          </article>

          {/* EDITORIAL SIDEBAR */}
          <aside className="min-w-0 lg:border-l lg:border-navy/10 lg:pl-8 xl:pl-10">
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

            {/* RELATED STORIES */}
            {relatedStories && relatedStories.length > 0 && (
              <div className="mt-8">
                <div className="mb-5 flex items-center justify-between border-b border-navy/10 pb-3">
                  <h3 className="font-display text-xl text-navy">
                    More Stories
                  </h3>

                  <Link
                    href="/stories"
                    className="font-body text-xs text-shawl transition hover:text-mustard"
                  >
                    View All →
                  </Link>
                </div>

                <div className="space-y-6">
                  {relatedStories.map((item: any) => {
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
                        href={`/stories/${item.slug}`}
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

                        {item.publishedAt && (
                          <p className="mt-2 font-body text-xs text-navy/45">
                            {new Date(item.publishedAt).toLocaleDateString()}
                          </p>
                        )}
                      </Link>
                    )
                  })}
                </div>
              </div>
            )}

            {/* SECTION EXPLORATION LINKS */}
            <div className="mt-10 border-t border-navy/10 pt-6">
              <h3 className="font-display text-xl text-navy">
                Explore More
              </h3>

              <nav className="mt-4 space-y-0">
                {[
                  { label: 'Stories & Heritage', href: '/stories' },
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

            {/* FEATURED RELATED PERSON */}
            {story.relatedPersonName && story.relatedPersonSlug && (
              <div className="mt-10 border-t border-navy/10 pt-6">
                <p className="font-body text-xs uppercase tracking-[0.15em] text-shawl">
                  Featured Personality
                </p>

                <h3 className="mt-3 font-display text-xl leading-snug text-navy">
                  {story.relatedPersonName}
                </h3>

                <p className="mt-2 font-body text-sm leading-6 text-navy/60">
                  Discover the life and contributions of {story.relatedPersonName}.
                </p>

                <Link
                  href={`/celebrities/${story.relatedPersonSlug}`}
                  className="mt-4 inline-flex items-center gap-2 border-b border-mustard pb-1 font-body text-sm text-shawl transition hover:text-mustard"
                >
                  Read Biography <span>→</span>
                </Link>
              </div>
            )}
          </aside>
        </div>
      </div>
    </section>
  )
}
