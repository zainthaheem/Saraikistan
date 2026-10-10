
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
      coverImage {
        ...,
        "dimensions": asset->metadata.dimensions
      },
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

function SocialIcon({ platform }: { platform: string }) {
  const name = platform.toLowerCase()

  if (name.includes('facebook')) {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-5 w-5">
        <path d="M13.5 21v-8h2.7l.4-3.1h-3.1v-2c0-.9.3-1.5 1.6-1.5h1.7V3.6c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3v2.1H7.3V13h2.8v8h3.4Z" />
      </svg>
    )
  }

  if (name.includes('youtube')) {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-5 w-5">
        <path d="M23 7.1a3 3 0 0 0-2.1-2.2C19 4.4 12 4.4 12 4.4s-7 0-8.9.5A3 3 0 0 0 1 7.1a31 31 0 0 0-.5 4.9 31 31 0 0 0 .5 4.9 3 3 0 0 0 2.1 2.2c1.9.5 8.9.5 8.9.5s7 0 8.9-.5a3 3 0 0 0 2.1-2.2 31 31 0 0 0 .5-4.9 31 31 0 0 0-.5-4.9ZM9.5 15.5v-7l6 3.5-6 3.5Z" />
      </svg>
    )
  }

  if (name.includes('instagram')) {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true" className="h-5 w-5">
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.8" r="1" fill="currentColor" stroke="none" />
      </svg>
    )
  }

  if (name.includes('tiktok') || name.includes('tik tok')) {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-5 w-5">
        <path d="M19.6 7.1a5.5 5.5 0 0 1-3.4-1.2v8.2a5.7 5.7 0 1 1-5-5.6v3.2a2.6 2.6 0 1 0 1.8 2.5V2h3.2a5.5 5.5 0 0 0 3.4 3.1v2Z" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true" className="h-5 w-5">
      <path d="M10 13a5 5 0 0 0 7.1 0l2-2a5 5 0 0 0-7.1-7.1l-1.2 1.2" />
      <path d="M14 11a5 5 0 0 0-7.1 0l-2 2A5 5 0 0 0 12 20.1l1.2-1.2" />
    </svg>
  )
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
        <div className="mx-auto max-w-7xl px-5 pb-20 pt-5 sm:px-10 sm:pt-8 lg:px-12">
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

  const coverWidth =
    person.coverImage?.dimensions?.width || 1600

  const coverHeight =
    person.coverImage?.dimensions?.height || 900

  const coverImage = person.coverImage
    ? urlFor(person.coverImage)
        .width(2400)
        .auto('format')
        .quality(82)
        .url()
    : undefined

  const coverImage640 = person.coverImage
    ? urlFor(person.coverImage)
        .width(640)
        .auto('format')
        .quality(78)
        .url()
    : undefined

  const coverImage1024 = person.coverImage
    ? urlFor(person.coverImage)
        .width(1024)
        .auto('format')
        .quality(80)
        .url()
    : undefined

  const coverImage1600 = person.coverImage
    ? urlFor(person.coverImage)
        .width(1600)
        .auto('format')
        .quality(82)
        .url()
    : undefined

  const socialLinks =
    person.socialLinks?.filter((link: any) => link?.url) || []

  const pageUrl =
    `https://saraikistan.org/celebrities/${params.slug}`

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://saraikistan.org/',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'People',
        item: 'https://saraikistan.org/celebrities',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: person.name,
        item: pageUrl,
      },
    ],
  }

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
    sameAs:
      socialLinks.length > 0
        ? socialLinks.map((link: any) => link.url)
        : undefined,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': pageUrl,
    },
  }

  return (
    <section className="min-h-screen bg-cream text-navy">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(personSchema).replace(
            /</g,
            '\\u003c'
          ),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema).replace(
            /</g,
            '\\u003c'
          ),
        }}
      />

      {/* Cover image: unchanged desktop presentation */}
      {coverImage && (
        <div className="w-full overflow-hidden bg-navy">
          <img
            src={coverImage}
            srcSet={
              coverImage640 && coverImage1024 && coverImage1600
                ? `${coverImage640} 640w, ${coverImage1024} 1024w, ${coverImage1600} 1600w, ${coverImage} 2400w`
                : undefined
            }
            sizes="100vw"
            alt={person.name}
            width={coverWidth}
            height={coverHeight}
            loading="eager"
            fetchPriority="high"
            decoding="async"
            className="block h-auto w-full"
          />
        </div>
      )}

      <div className="mx-auto max-w-7xl px-5 pb-16 pt-4 sm:px-10 sm:pb-20 sm:pt-8 lg:px-12">
        <nav
          aria-label="Breadcrumb"
          className="mb-5 border-b border-navy/10 pb-3 sm:mb-8 sm:pb-4"
        >
          <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 font-body text-xs text-navy/55 sm:text-sm">
            <li>
              <Link href="/" className="transition hover:text-shawl">
                Home
              </Link>
            </li>
            <li aria-hidden="true" className="text-mustard">/</li>
            <li>
              <Link
                href="/celebrities"
                className="transition hover:text-shawl"
              >
                People
              </Link>
            </li>
            <li aria-hidden="true" className="text-mustard">/</li>
            <li
              aria-current="page"
              className="max-w-[220px] truncate text-navy/70 sm:max-w-none"
            >
              {person.name}
            </li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 gap-9 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-12 xl:grid-cols-[minmax(0,1fr)_320px] xl:gap-16">
          <article className="min-w-0">
            <header className="border-t border-mustard pt-5 sm:pt-7">
              <div className="flex items-center gap-4 sm:gap-6">
                {profileImage && (
                  <div className="shrink-0">
                    <img
                      src={profileImage}
                      alt={person.name}
                      width={240}
                      height={240}
                      loading="lazy"
                      decoding="async"
                      className="h-24 w-24 rounded-full border-4 border-cream object-cover shadow-sm sm:h-32 sm:w-32"
                    />
                  </div>
                )}

                <div className="min-w-0 flex-1">
                  {person.category?.title && (
                    <p className="font-body text-[10px] uppercase tracking-[0.16em] text-shawl sm:text-sm sm:tracking-[0.18em]">
                      {person.category.title}
                    </p>
                  )}

                  <h1 className="mt-2 break-words font-display text-3xl leading-[1.08] text-navy sm:mt-3 sm:text-5xl lg:text-[3.5rem]">
                    {person.name}
                  </h1>

                  <p className="mt-2 font-body text-sm leading-6 text-navy/60 sm:mt-4 sm:max-w-3xl sm:text-base sm:leading-7">
                    Explore the life, work, and cultural contributions of{' '}
                    {person.name} and his place in Saraiki heritage.
                  </p>
                </div>
              </div>
            </header>

            {socialLinks.length > 0 && (
              <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3 border-b border-navy/10 pb-5 sm:mt-7 sm:gap-x-6 sm:pb-6">
                {socialLinks.map((link: any, i: number) => {
                  const platform = String(link.platform || 'Official Link')
                  const label = `${person.name} on ${platform}`

                  return (
                    <a
                      key={`${platform}-${i}`}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      title={platform}
                      className="inline-flex items-center gap-2 text-shawl transition hover:text-mustard"
                    >
                      <SocialIcon platform={platform} />
                      <span className="font-body text-xs sm:hidden">
                        {platform}
                      </span>
                      <span className="sr-only sm:not-sr-only sm:hidden">
                        {platform}
                      </span>
                    </a>
                  )
                })}
              </div>
            )}

            {(person.bio || person.bioUrdu) && (
              <section
                aria-label={`${person.name} biography`}
                className="mt-6 w-full sm:mt-8"
              >
                <LanguageSwitcher
                  english={person.bio}
                  urdu={person.bioUrdu}
                />
              </section>
            )}

            {person.gallery && person.gallery.length > 0 && (
              <section className="mt-10 sm:mt-14" aria-labelledby="gallery-heading">
                <div className="mb-5 border-t border-navy/10 pt-5 sm:mb-6 sm:pt-6">
                  <p className="font-body text-xs uppercase tracking-[0.18em] text-shawl sm:text-sm">
                    Photo Archive
                  </p>
                  <h2
                    id="gallery-heading"
                    className="mt-2 font-display text-3xl text-navy sm:text-4xl"
                  >
                    Gallery
                  </h2>
                  <p className="mt-3 max-w-2xl font-body text-sm leading-6 text-navy/60">
                    Photographs and memories documenting the life and work of{' '}
                    {person.name}.
                  </p>
                </div>

                <PhotoGallery
                  images={person.gallery}
                  personName={person.name}
                />
              </section>
            )}

            {person.imageCredits && (
              <details className="group mt-10 border-t border-navy/10 pt-5 sm:mt-14">
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

          <aside className="min-w-0 lg:border-l lg:border-navy/10 lg:pl-8 xl:pl-10">
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

            <div className="mt-10 border-t border-navy/10 pt-6">
              <h3 className="font-display text-xl text-navy">
                Explore More
              </h3>
              <nav className="mt-4 space-y-0" aria-label="Explore Saraikistan">
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
                    <span aria-hidden="true" className="text-mustard">
                      →
                    </span>
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
