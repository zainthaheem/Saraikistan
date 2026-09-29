
import type { Metadata } from 'next'
import Link from 'next/link'
import { client } from '@/sanity/lib/client'
import { urlFor } from '@/sanity/lib/image'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import PhotoGallery from '@/components/PhotoGallery'

export const revalidate = 60

async function getPerson(slug: string) {
  return client.fetch(
    `*[_type == "person" && slug.current == $slug][0] {
      name,
      "category": category->{title},
      "categoryId": category._ref,
      profileImage,
      coverImage,
      gallery[]{
        _key,
        _type,
        asset,
        caption,
        credit
      },
      bio,
      bioUrdu,
      socialLinks,
      seoTitle,
      seoDescription,
      seoImage,
      imageCredits
    }`,
    { slug }
  )
}

async function getRelatedPeople(
  slug: string,
  categoryId?: string
) {
  const query = categoryId
    ? `*[
        _type == "person" &&
        slug.current != $slug &&
        category._ref == $categoryId
      ] | order(_createdAt desc)[0...4] {
        name,
        "slug": slug.current,
        "category": category->{title},
        profileImage
      }`
    : `*[
        _type == "person" &&
        slug.current != $slug
      ] | order(_createdAt desc)[0...4] {
        name,
        "slug": slug.current,
        "category": category->{title},
        profileImage
      }`

  return client.fetch(query, { slug, categoryId })
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const person = await getPerson(params.slug)

  if (!person) {
    return {
      title: 'Person Not Found | Saraikistan',
      description:
        'The requested person could not be found on Saraikistan.',
    }
  }

  const title =
    person.seoTitle ||
    `${person.name} | Saraikistan`

  const description =
    person.seoDescription ||
    `Explore the life, work and cultural contribution of ${person.name} on Saraikistan.`

  const image = person.seoImage
    ? urlFor(person.seoImage)
        .width(1200)
        .height(630)
        .fit('crop')
        .auto('format')
        .quality(85)
        .url()
    : person.coverImage
      ? urlFor(person.coverImage)
          .width(1200)
          .height(630)
          .fit('crop')
          .auto('format')
          .quality(85)
          .url()
      : undefined

  const pageUrl =
    `https://saraikistan.org/celebrities/${params.slug}`

  return {
    title,
    description,

    alternates: {
      canonical: pageUrl,
    },

    openGraph: {
      title,
      description,
      type: 'profile',
      url: pageUrl,
      siteName: 'Saraikistan',
      images: image
        ? [
            {
              url: image,
              width: 1200,
              height: 630,
              alt: `${person.name} | Saraikistan`,
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

export default async function PersonPage({
  params,
}: {
  params: { slug: string }
}) {
  const person = await getPerson(params.slug)

  if (!person) {
    return (
      <section className="min-h-screen bg-cream text-navy">
        <div className="mx-auto max-w-7xl px-6 pb-20 pt-6 sm:px-10 sm:pt-8 lg:px-12">
          <div className="border-t border-mustard pt-7">
            <p className="font-body text-base leading-7 text-navy/65 sm:text-lg">
              Person not found.
            </p>

            <Link
              href="/celebrities"
              className="mt-5 inline-block font-body text-sm text-shawl underline underline-offset-4 transition hover:text-mustard"
            >
              Back to People →
            </Link>
          </div>
        </div>
      </section>
    )
  }

  const relatedPeople = await getRelatedPeople(
    params.slug,
    person.categoryId
  )

  const profileImage = person.profileImage
    ? urlFor(person.profileImage)
        .width(800)
        .height(800)
        .fit('crop')
        .auto('format')
        .quality(85)
        .url()
    : undefined

  // Preserve the original cover image proportions.
  const coverImage = person.coverImage
    ? urlFor(person.coverImage)
        .width(1800)
        .auto('format')
        .quality(85)
        .url()
    : undefined

  const socialLinks =
    person.socialLinks?.map((link: any) => link.url).filter(Boolean) || []

  const pageUrl =
    `https://saraikistan.org/celebrities/${params.slug}`

  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: person.name,
    url: pageUrl,
    image: profileImage || coverImage,
    description:
      person.seoDescription ||
      `Explore the life, work and cultural contribution of ${person.name} on Saraikistan.`,
    jobTitle: person.category?.title || undefined,
    sameAs: socialLinks.length > 0 ? socialLinks : undefined,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': pageUrl,
    },
  }

  return (
    <section className="min-h-screen bg-cream text-navy">

      {/* PERSON STRUCTURED DATA */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(personSchema).replace(/</g, '\\u003c'),
        }}
      />

      {/* FULL-WIDTH COVER IMAGE — NO CROPPING */}
      {coverImage && (
        <div className="w-full overflow-hidden bg-navy">
          <img
            src={coverImage}
            alt={person.name}
            width={1800}
            loading="eager"
            fetchPriority="high"
            decoding="async"
            className="mx-auto block h-auto max-h-[75vh] w-full object-contain object-center"
          />
        </div>
      )}

      {/* EDITORIAL CONTENT LAYOUT */}
      <div className="mx-auto max-w-7xl px-6 pb-20 pt-8 sm:px-10 sm:pt-10 lg:px-12">

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-12 xl:grid-cols-[minmax(0,1fr)_320px] xl:gap-16">

          {/* MAIN BIOGRAPHY COLUMN */}
          <article className="min-w-0">

            {/* PROFILE HEADER */}
            <div className="border-t border-mustard pt-7">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-center">

                {person.profileImage && (
                  <img
                    src={profileImage}
                    alt={person.name}
                    width={240}
                    height={240}
                    loading="lazy"
                    decoding="async"
                    className="h-28 w-28 shrink-0 rounded-full border-4 border-cream object-cover sm:h-32 sm:w-32"
                  />
                )}

                <div className="min-w-0">
                  {person.category && (
                    <p className="font-body text-sm uppercase tracking-[0.12em] text-shawl">
                      {person.category.title}
                    </p>
                  )}

                  <h1 className="mt-3 font-display text-4xl leading-tight text-navy sm:text-5xl lg:text-[3.25rem]">
                    {person.name}
                  </h1>

                  <p className="mt-3 max-w-3xl font-body text-sm leading-6 text-navy/60">
                    Explore the life, work, and cultural contributions of {person.name} and their place in Saraiki heritage.
                  </p>
                </div>

              </div>
            </div>

            {/* SOCIAL LINKS */}
            {person.socialLinks && person.socialLinks.length > 0 && (
              <div className="mt-7 flex flex-wrap gap-x-6 gap-y-3 border-b border-navy/10 pb-6 font-body text-sm">
                {person.socialLinks.map((link: any, i: number) => (
                  <a
                    key={i}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-shawl underline underline-offset-4 transition hover:text-mustard"
                  >
                    {link.platform}
                  </a>
                ))}
              </div>
            )}

            {/* BIOGRAPHY AND LANGUAGE SWITCHER */}
            {(person.bio || person.bioUrdu) && (
              <div className="mt-8 w-full">
                <LanguageSwitcher
                  english={person.bio}
                  urdu={person.bioUrdu}
                />
              </div>
            )}

            {/* PHOTO GALLERY */}
            {person.gallery && person.gallery.length > 0 && (
              <div className="mt-14">

                <div className="mb-6">
                  <p className="font-body text-sm uppercase tracking-[0.12em] text-shawl">
                    Photo Archive
                  </p>

                  <h2 className="mt-2 font-display text-3xl text-navy sm:text-4xl">
                    Gallery
                  </h2>

                  <p className="mt-3 font-body text-sm leading-6 text-navy/60">
                    Photographs and memories documenting the life and work of {person.name}.
                  </p>
                </div>

                <PhotoGallery
                  images={person.gallery}
                  personName={person.name}
                />

              </div>
            )}

            {/* IMAGE CREDITS */}
            {person.imageCredits && (
              <details className="group mt-14 border-t border-navy/10 pt-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-body text-xs uppercase tracking-[0.12em] text-shawl transition hover:text-mustard [&::-webkit-details-marker]:hidden">
                  <span>Image Credits</span>

                  <span className="flex h-7 w-7 shrink-0 items-center justify-center border border-navy/15 text-lg leading-none transition group-open:rotate-45 group-open:border-mustard group-open:text-mustard">
                    +
                  </span>
                </summary>

                <div className="mt-5 max-w-3xl border-l-2 border-mustard pl-5">
                  <p className="whitespace-pre-line break-words font-body text-sm leading-6 text-navy/60">
                    {person.imageCredits}
                  </p>
                </div>
              </details>
            )}

          </article>

          {/* EDITORIAL SIDEBAR */}
          {/* No sticky positioning: sidebar scrolls naturally with the page. */}
          <aside className="min-w-0 lg:border-l lg:border-navy/10 lg:pl-8 xl:pl-10">

            {/* SIDEBAR HEADING */}
            <div className="border-t border-mustard pt-5">
              <p className="font-body text-xs uppercase tracking-[0.18em] text-shawl">
                Discover More
              </p>

              <h2 className="mt-2 font-display text-2xl text-navy">
                Related People
              </h2>

              <p className="mt-3 font-body text-sm leading-6 text-navy/60">
                Explore more personalities from the same field and discover the people who shape Saraiki heritage.
              </p>
            </div>

            {/* RELATED PEOPLE */}
            {relatedPeople && relatedPeople.length > 0 && (
              <div className="mt-8">

                <div className="mb-5 flex items-center justify-between border-b border-navy/10 pb-3">
                  <h3 className="font-display text-xl text-navy">
                    More People
                  </h3>

                  <Link
                    href="/celebrities"
                    className="font-body text-xs text-shawl transition hover:text-mustard"
                  >
                    View All →
                  </Link>
                </div>

                <div className="space-y-6">
                  {relatedPeople.map((item: any) => {
                    const thumbnail = item.profileImage
                      ? urlFor(item.profileImage)
                          .width(240)
                          .height(240)
                          .fit('crop')
                          .auto('format')
                          .quality(70)
                          .url()
                      : undefined

                    return (
                      <Link
                        key={item.slug}
                        href={`/celebrities/${item.slug}`}
                        className="group flex items-start gap-4 border-b border-navy/10 pb-5 last:border-b-0"
                      >
                        {thumbnail ? (
                          <div className="h-20 w-20 shrink-0 overflow-hidden rounded-full bg-shawl sm:h-24 sm:w-24">
                            <img
                              src={thumbnail}
                              alt={item.name}
                              width={240}
                              height={240}
                              loading="lazy"
                              decoding="async"
                              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                            />
                          </div>
                        ) : (
                          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-shawl/10 font-display text-2xl text-shawl sm:h-24 sm:w-24">
                            {item.name?.charAt(0) || 'S'}
                          </div>
                        )}

                        <div className="min-w-0 flex-1 pt-1">
                          {item.category?.title && (
                            <p className="font-body text-[11px] uppercase tracking-[0.12em] text-shawl">
                              {item.category.title}
                            </p>
                          )}

                          <h4 className="mt-1 font-display text-lg leading-snug text-navy transition group-hover:text-shawl">
                            {item.name}
                          </h4>

                          <span className="mt-2 inline-block font-body text-xs text-shawl underline underline-offset-4 transition group-hover:text-mustard">
                            Read biography
                          </span>
                        </div>
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
