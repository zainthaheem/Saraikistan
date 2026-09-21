import type { Metadata } from 'next'
import Link from 'next/link'
import { client } from '@/sanity/lib/client'
import { urlFor } from '@/sanity/lib/image'
import { PortableText } from '@portabletext/react'

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

  const image = story.seoImage
    ? urlFor(story.seoImage).width(1200).height(630).fit('crop').url()
    : story.coverImage
      ? urlFor(story.coverImage).width(1200).height(630).fit('crop').url()
      : undefined

  return {
    title,
    description,

    alternates: {
      canonical: `https://saraikistan-ml2d.vercel.app/blog/${params.slug}`,
    },

    openGraph: {
      title,
      description,
      type: 'article',
      url: `https://saraikistan-ml2d.vercel.app/blog/${params.slug}`,
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

  return (
    <section className="min-h-screen bg-cream text-navy">

      {/* Cover Image */}
      {story.coverImage && (
        <div className="h-56 w-full overflow-hidden bg-shawl sm:h-72 lg:h-96">
          <img
            src={urlFor(story.coverImage)
              .width(1800)
              .height(700)
              .fit('crop')
              .url()}
            alt={story.title}
            className="h-full w-full object-cover"
          />
        </div>
      )}

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-6 pb-20 pt-8 sm:px-10 sm:pt-10 lg:px-12">

        {/* Story Header */}
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

        {/* Video */}
        {story.videoUrl && (
          <div className="mt-10 aspect-video w-full overflow-hidden bg-navy">
            <iframe
              src={story.videoUrl.replace('watch?v=', 'embed/')}
              className="h-full w-full"
              title={story.title}
              allowFullScreen
            />
          </div>
        )}

        {/* Story Body */}
        {story.body && (
          <div className="mt-10 max-w-3xl">

            <p className="font-body text-sm text-shawl">
              Story
            </p>

            <div className="prose prose-sm mt-4 max-w-none font-body leading-7 text-navy/75 sm:prose-base">
              <PortableText value={story.body} />
            </div>

          </div>
        )}

        {/* Gallery */}
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
                      .width(600)
                      .height(600)
                      .fit('crop')
                      .url()}
                    alt={`${story.title} — photo ${i + 1}`}
                    className="h-full w-full object-cover transition duration-500 hover:scale-105"
                  />
                </div>
              ))}

            </div>

          </div>
        )}

        {/* Image Credits */}
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
