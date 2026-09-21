import type { Metadata } from 'next'
import { client } from '@/sanity/lib/client'
import { urlFor } from '@/sanity/lib/image'
import { PortableText } from '@portabletext/react'

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

  const title =
    post.seoTitle ||
    `${post.title} | Saraikistan`

  const description =
    post.seoDescription ||
    `Read the latest news and developments from the Saraiki region on Saraikistan.`

  const image = post.seoImage
    ? urlFor(post.seoImage).width(1200).height(630).fit('crop').url()
    : post.coverImage
      ? urlFor(post.coverImage).width(1200).height(630).fit('crop').url()
      : undefined

  return {
    title,
    description,

    alternates: {
      canonical: `https://saraikistan-ml2d.vercel.app/news/${params.slug}`,
    },

    openGraph: {
      title,
      description,
      type: 'article',
      url: `https://saraikistan-ml2d.vercel.app/news/${params.slug}`,
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
  const post = await getNewsPost(params.slug)

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

  const postUrl =
    `https://saraikistan-ml2d.vercel.app/news/${params.slug}`

  const articleImage = post.seoImage
    ? urlFor(post.seoImage).width(1200).height(630).fit('crop').url()
    : post.coverImage
      ? urlFor(post.coverImage).width(1200).height(630).fit('crop').url()
      : undefined

  const newsArticleSchema = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    '@id': `${postUrl}#newsarticle`,
    headline: post.title,
    description:
      post.seoDescription ||
      `Read the latest news and developments from the Saraiki region on Saraikistan.`,
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
    author: {
      '@type': post.author ? 'Person' : 'Organization',
      name: post.author || 'Saraikistan',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Saraikistan',
      url: 'https://saraikistan-ml2d.vercel.app',
    },
  }

  return (
    <section className="min-h-screen bg-cream text-navy">

      {/* NewsArticle Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(newsArticleSchema).replace(
            /</g,
            '\\u003c'
          ),
        }}
      />

      {/* Cover Image */}
      {post.coverImage && (
        <div className="h-56 w-full overflow-hidden bg-shawl sm:h-72 lg:h-96">
          <img
            src={urlFor(post.coverImage)
              .width(1800)
              .height(700)
              .fit('crop')
              .url()}
            alt={post.title}
            className="h-full w-full object-cover"
          />
        </div>
      )}

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-6 pb-20 pt-8 sm:px-10 sm:pt-10 lg:px-12">

        {/* Article Header */}
        <div className="border-t border-mustard pt-7">

          {post.category && (
            <p className="font-body text-sm text-shawl">
              {post.category.title}
            </p>
          )}

          <h1 className="mt-2 max-w-4xl font-display text-4xl leading-tight text-navy sm:text-5xl">
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

            {post.newsType && (
              <span>
                {formatNewsType(post.newsType)}
              </span>
            )}

          </div>

          {/* SOURCE */}
          {post.source && (
            <p className="mt-3 font-body text-xs text-navy/45">
              Source · {post.source}
            </p>
          )}

        </div>

        {/* Video */}
        {post.videoUrl && (
          <div className="mt-10 aspect-video w-full overflow-hidden bg-navy">
            <iframe
              src={post.videoUrl.replace('watch?v=', 'embed/')}
              className="h-full w-full"
              title={post.title}
              allowFullScreen
            />
          </div>
        )}

        {/* Article Body */}
        {post.body && (
          <div className="mt-10 max-w-3xl">

            <p className="font-body text-sm text-shawl">
              Article
            </p>

            <div className="prose prose-sm mt-4 max-w-none font-body leading-7 text-navy/75 sm:prose-base">
              <PortableText value={post.body} />
            </div>

          </div>
        )}

        {/* Gallery */}
        {post.gallery && post.gallery.length > 0 && (
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

              {post.gallery.map((img: any, i: number) => (
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
                    alt={`${post.title} — photo ${i + 1}`}
                    className="h-full w-full object-cover transition duration-500 hover:scale-105"
                  />
                </div>
              ))}

            </div>

          </div>
        )}

        {/* Image Credits */}
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

      </div>

    </section>
  )
}
