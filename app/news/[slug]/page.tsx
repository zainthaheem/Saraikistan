import type { Metadata } from 'next'
import Link from 'next/link'
import { client } from '@/sanity/lib/client'
import { urlFor } from '@/sanity/lib/image'
import LanguageSwitcher from '@/components/LanguageSwitcher'

export const revalidate = 60

async function getNewsPost(slug: string) {
  return client.fetch(
    `*[_type == "newsPost" && slug.current == $slug][0] {
      title,
      "category": category->{title},
      publishedAt,
      author,
      source,
      newsType,
      coverImage {
        ...,
        "dimensions": asset->metadata.dimensions
      },
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

async function getRelatedNews(slug: string) {
  return client.fetch(
    `*[
      _type == "newsPost" &&
      slug.current != $slug
    ] | order(publishedAt desc)[0...4] {
      title,
      publishedAt,
      coverImage,
      "slug": slug.current,
      "category": category->{title},
      newsType
    }`,
    { slug }
  )
}

function formatNewsType(type: string) {
  const labels: Record<string, string> = {
    'original-reporting': 'Original Reporting',
    'press-release': 'Press Release',
    'source-report': 'Source Report',
    'editorial-analysis': 'Editorial / Analysis',
    'community-submission': 'Community Submission',
  }

  return labels[type] || type
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const post = await getNewsPost(params.slug)

  if (!post) {
    return {
      title: 'News Article Not Found | Saraikistan',
      description:
        'The requested news article could not be found on Saraikistan.',
    }
  }

  const title = post.seoTitle || `${post.title} | Saraikistan`

  const description =
    post.seoDescription ||
    'Read the latest news and developments from the Saraiki region on Saraikistan.'

  const image = post.seoImage
    ? urlFor(post.seoImage)
        .width(1200)
        .height(630)
        .fit('crop')
        .quality(75)
        .format('webp')
        .url()
    : post.coverImage
      ? urlFor(post.coverImage)
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
      canonical: `https://saraikistan.org/news/${params.slug}`,
    },

    openGraph: {
      title,
      description,
      type: 'article',
      url: `https://saraikistan.org/news/${params.slug}`,
      siteName: 'Saraikistan',
      images: image
        ? [
            {
              url: image,
              width: 1200,
              height: 630,
              alt: post.title,
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

export default async function NewsPostPage({
  params,
}: {
  params: { slug: string }
}) {
  const [post, relatedNews] = await Promise.all([
    getNewsPost(params.slug),
    getRelatedNews(params.slug),
  ])

  if (!post) {
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

  const postUrl = `https://saraikistan.org/news/${params.slug}`

  const articleImage = post.seoImage
    ? urlFor(post.seoImage)
        .width(1200)
        .height(630)
        .fit('crop')
        .quality(75)
        .format('webp')
        .url()
    : post.coverImage
      ? urlFor(post.coverImage)
          .width(1200)
          .height(630)
          .fit('crop')
          .quality(75)
          .format('webp')
          .url()
      : undefined

  const newsArticleSchema = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    '@id': `${postUrl}#newsarticle`,
    headline: post.title,
    description:
      post.seoDescription ||
      'Read the latest news and developments from the Saraiki region on Saraikistan.',
    url: postUrl,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': postUrl,
    },
    ...(post.publishedAt
      ? {
          datePublished: post.publishedAt,
          dateModified: post.publishedAt,
        }
      : {}),
    ...(articleImage ? { image: articleImage } : {}),
    ...(post.category?.title
      ? { articleSection: post.category.title }
      : {}),
    ...(post.newsType
      ? { genre: formatNewsType(post.newsType) }
      : {}),
    ...(post.source
      ? { isBasedOn: post.source }
      : {}),
    inLanguage: 'en',
    author: post.author
      ? {
          '@type': 'Person',
          name: post.author,
        }
      : {
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

  /*
   * The cover image is now displayed using its original aspect ratio.
   * We no longer force a 1400x550 crop or a fixed-height container.
   * This prevents important text at the top/bottom of news covers
   * from being cut off on individual article pages.
   */
  const coverWidth = post.coverImage?.dimensions?.width || 1600
  const coverHeight = post.coverImage?.dimensions?.height || 900

  const coverImageUrl = post.coverImage
    ? urlFor(post.coverImage)
        .width(1600)
        .quality(78)
        .format('webp')
        .url()
    : undefined

  return (
    <section className="min-h-screen bg-cream text-navy">

      {/* NEWS ARTICLE STRUCTURED DATA */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(newsArticleSchema).replace(
            /</g,
            '\\u003c'
          ),
        }}
      />

      {/* FULL COVER IMAGE — PRESERVE ORIGINAL ASPECT RATIO */}
      {coverImageUrl && (
        <div className="w-full overflow-hidden bg-shawl">
          <img
            src={coverImageUrl}
            alt={post.title}
            width={coverWidth}
            height={coverHeight}
            loading="eager"
            fetchPriority="high"
            decoding="async"
            className="block h-auto w-full"
          />
        </div>
      )}

      {/* EDITORIAL CONTENT LAYOUT */}
      <div className="mx-auto max-w-7xl px-6 pb-20 pt-8 sm:px-10 sm:pt-10 lg:px-12">

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-12 xl:grid-cols-[minmax(0,1fr)_320px] xl:gap-16">

          {/* MAIN NEWS ARTICLE */}
          <article className="min-w-0">

            {/* ARTICLE HEADER */}
            <div className="border-t border-mustard pt-7">

              {post.category && (
                <p className="font-body text-sm uppercase tracking-[0.12em] text-shawl">
                  {post.category.title}
                </p>
              )}

              <h1 className="mt-3 max-w-4xl font-display text-4xl leading-tight text-navy sm:text-5xl lg:text-[3.25rem]">
                {post.title}
              </h1>

              {/* ARTICLE META */}
              <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 font-body text-xs text-navy/50">

                {post.publishedAt && (
                  <span>
                    Published ·{' '}
                    {new Date(post.publishedAt).toLocaleDateString('en-GB', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                )}

                {post.author && (
                  <span>
                    By {post.author}
                  </span>
                )}

              </div>

              {/* NEWS TYPE */}
              {post.newsType && (
                <div className="mt-4">
                  <span className="inline-block border border-mustard/60 px-3 py-1.5 font-body text-[10px] uppercase tracking-[0.12em] text-shawl">
                    {formatNewsType(post.newsType)}
                  </span>
                </div>
              )}

            </div>

            {/* VIDEO */}
            {post.videoUrl && (
              <div className="mt-10 aspect-video w-full overflow-hidden bg-navy">
                <iframe
                  src={post.videoUrl.replace('watch?v=', 'embed/')}
                  className="h-full w-full"
                  title={post.title}
                  loading="lazy"
                  allowFullScreen
                />
              </div>
            )}

            {/* BILINGUAL ARTICLE BODY */}
            {(post.body || post.bodyUrdu) && (
              <div className="mt-10 w-full max-w-3xl">
                <LanguageSwitcher
                  english={post.body}
                  urdu={post.bodyUrdu}
                />
              </div>
            )}

            {/* GALLERY */}
            {post.gallery && post.gallery.length > 0 && (
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

                  {post.gallery.map((img: any, i: number) => (
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
                        alt={`${post.title} — photo ${i + 1}`}
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

            {/* SOURCES */}
            {post.source && (
              <div className="mt-14 border-t border-navy/10 pt-6">

                <h2 className="font-display text-2xl text-navy sm:text-3xl">
                  Sources
                </h2>

                <div className="mt-4 max-w-3xl border-l-2 border-mustard pl-5">

                  <p className="whitespace-pre-line break-words font-body text-sm leading-7 text-navy/65">
                    {post.source}
                  </p>

                </div>

              </div>
            )}

            {/* IMAGE CREDITS */}
            {post.imageCredits && (
              <details className="group mt-14 border-t border-navy/10 pt-5">

                <summary className="flex cursor-pointer list-none items-center justify-between font-body text-xs uppercase tracking-[0.12em] text-shawl transition hover:text-mustard [&::-webkit-details-marker]:hidden">

                  <span>
                    Image Credits
                  </span>

                  <span className="flex h-7 w-7 items-center justify-center border border-navy/15 text-lg leading-none transition group-open:rotate-45 group-open:border-mustard group-open:text-mustard">
                    +
                  </span>

                </summary>

                <div className="mt-5 max-w-3xl border-l-2 border-mustard pl-5">

                  <p className="whitespace-pre-line font-body text-sm leading-6 text-navy/60">
                    {post.imageCredits}
                  </p>

                </div>

              </details>
            )}

          </article>

          {/* EDITORIAL SIDEBAR */}
          <aside className="min-w-0 lg:border-l lg:border-navy/10 lg:pl-8 xl:pl-10">

            {/* SIDEBAR INTRODUCTION */}
            <div className="border-t border-mustard pt-5">

              <p className="font-body text-xs uppercase tracking-[0.18em] text-shawl">
                Saraikistan News
              </p>

              <h2 className="mt-2 font-display text-2xl text-navy">
                Latest Developments
              </h2>

              <p className="mt-3 font-body text-sm leading-6 text-navy/60">
                Stay informed about the latest developments, events, and stories from the Saraiki region.
              </p>

            </div>

            {/* RELATED NEWS ARTICLES */}
            {relatedNews && relatedNews.length > 0 && (
              <div className="mt-8">

                <div className="mb-5 flex items-center justify-between border-b border-navy/10 pb-3">

                  <h3 className="font-display text-xl text-navy">
                    More News
                  </h3>

                  <Link
                    href="/news"
                    className="font-body text-xs text-shawl transition hover:text-mustard"
                  >
                    View All →
                  </Link>

                </div>

                <div className="space-y-6">

                  {relatedNews.map((item: any) => {
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
                        href={`/news/${item.slug}`}
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
                            {new Date(item.publishedAt).toLocaleDateString(
                              'en-GB',
                              {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric',
                              }
                            )}
                          </p>
                        )}

                      </Link>
                    )
                  })}

                </div>

              </div>
            )}

            {/* EXPLORE SARAIkISTAN */}
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

            {/* NEWS CONTRIBUTION */}
            <div className="mt-10 border-t border-navy/10 pt-6">

              <p className="font-body text-xs uppercase tracking-[0.15em] text-shawl">
                Saraikistan
              </p>

              <h3 className="mt-3 font-display text-xl leading-snug text-navy">
                Stories from Our Region
              </h3>

              <p className="mt-2 font-body text-sm leading-6 text-navy/60">
                Discover the people, places, heritage, and developments shaping the Saraiki region.
              </p>

              <Link
                href="/about"
                className="mt-4 inline-flex items-center gap-2 border-b border-mustard pb-1 font-body text-sm text-shawl transition hover:text-mustard"
              >
                About Saraikistan <span>→</span>
              </Link>

            </div>

          </aside>

        </div>

      </div>

    </section>
  )
}
