
import type { Metadata } from 'next'
import Link from 'next/link'
import { client } from '@/sanity/lib/client'
import { urlFor } from '@/sanity/lib/image'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import PhotoGallery from '@/components/PhotoGallery'

export const revalidate = 60

// Get one person from Sanity using a validated slug.
// This avoids the missing $slug parameter error.
async function getPerson(slug: string) {
  if (!slug || !/^[a-zA-Z0-9-]+$/.test(slug)) {
    return null
  }

  const query = `*[
    _type == "person" &&
    slug.current == ${JSON.stringify(slug)}
  ][0] {
    name,
    "category": category->{
      _id,
      title
    },
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
  }`

  return client.fetch(query)
}

// Get related people from the same category.
async function getRelatedPeople(
  categoryId: string | undefined,
  currentSlug: string
) {
  if (!categoryId) {
    return []
  }

  const query = `*[
    _type == "person" &&
    defined(slug.current) &&
    slug.current != ${JSON.stringify(currentSlug)} &&
    category._ref == ${JSON.stringify(categoryId)}
  ]
  | order(name asc)[0...4] {
    name,
    "slug": slug.current,
    profileImage,
    "category": category->{title}
  }`

  return client.fetch(query)
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
              Back to People
            </Link>
          </div>
        </div>
      </section>
    )
  }

  const relatedPeople = await getRelatedPeople(
    person.category?._id,
    params.slug
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

  const coverImage = person.coverImage
    ? urlFor(person.coverImage)
        .width(1800)
        .height(700)
        .fit('crop')
        .auto('format')
        .quality(85)
        .url()
    : undefined

  const socialLinks =
    person.socialLinks
      ?.map((link: any) => link.url)
      .filter(Boolean) || []

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
    sameAs:
      socialLinks.length > 0
        ? socialLinks
        : undefined,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': pageUrl,
    },
  }

  return (
    <section className="min-h-screen bg-cream text-navy">

      {/* Person Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(personSchema),
        }}
      />

      {/* Full-Width Cover Image */}
      {person.coverImage && (
        <div className="h-56 w-full overflow-hidden bg-shawl sm:h-72 lg:h-[440px]">
          <img
            src={coverImage}
            alt={person.name}
            width={1800}
            height={700}
            loading="eager"
            decoding="async"
            fetchPriority="high"
            className="h-full w-full object-cover"
          />
        </div>
      )}

      {/* Main Page Container */}
      <div className="mx-auto max-w-7xl px-5 pb-16 pt-8 sm:px-8 sm:pb-20 sm:pt-10 lg:px-12">

        {/* Profile Header */}
        <div className="border-t border-mustard pt-7 sm:pt-9">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-7">

            {person.profileImage && (
              <img
                src={profileImage}
                alt={person.name}
                width={240}
                height={240}
                loading="lazy"
                decoding="async"
                className="h-24 w-24 shrink-0 rounded-full border-4 border-cream object-cover shadow-sm sm:h-32 sm:w-32"
              />
            )}

            <div className="min-w-0">
              <Link
                href="/celebrities"
                className="font-body text-xs uppercase tracking-[0.14em] text-shawl transition hover:text-mustard"
              >
                People of Saraikistan
              </Link>

              {person.category && (
                <p className="mt-3 font-body text-sm font-medium text-shawl">
                  {person.category.title}
                </p>
              )}

              <h1 className="mt-2 break-words font-display text-3xl leading-tight text-navy sm:text-4xl lg:text-5xl">
                {person.name}
              </h1>
            </div>

          </div>
        </div>

        {/* Social Links */}
        {person.socialLinks &&
          person.socialLinks.length > 0 && (
            <div className="mt-7 flex flex-wrap gap-x-6 gap-y-3 border-b border-navy/10 pb-6 font-body text-sm">
              {person.socialLinks.map(
                (link: any, i: number) =>
                  link.url && (
                    <a
                      key={i}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="break-all text-shawl underline underline-offset-4 transition hover:text-mustard"
                    >
                      {link.platform || 'Social Profile'}
                    </a>
                  )
              )}
            </div>
          )
        }

        {/* Editorial Two-Column Layout */}
        <div className="mt-10 grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-start lg:gap-14 xl:grid-cols-[minmax(0,1fr)_320px]">

          {/* Main Biography Column */}
          <main className="min-w-0">

            {/* Biography Heading */}
            {(person.bio || person.bioUrdu) && (
              <div className="mb-6 border-b border-navy/10 pb-5">
                <p className="font-body text-xs uppercase tracking-[0.16em] text-shawl">
                  Biography
                </p>

                <h2 className="mt-2 font-display text-3xl leading-tight text-navy sm:text-4xl">
                  The Life and Legacy of {person.name}
                </h2>

                <p className="mt-3 max-w-2xl font-body text-sm leading-6 text-navy/60">
                  Discover the life, work, and cultural contributions of{' '}
                  {person.name} and their place in Saraiki heritage.
                </p>
              </div>
            )}

            {/* English / Urdu Biography */}
            {(person.bio || person.bioUrdu) && (
              <div className="min-w-0">
                <LanguageSwitcher
                  english={person.bio}
                  urdu={person.bioUrdu}
                />
              </div>
            )}

            {/* Interactive Photo Gallery */}
            {person.gallery &&
              person.gallery.length > 0 && (
                <div className="mt-14 border-t border-navy/10 pt-8">

                  <div className="mb-6">
                    <p className="font-body text-xs uppercase tracking-[0.14em] text-shawl">
                      Photo Archive
                    </p>

                    <h2 className="mt-2 font-display text-3xl text-navy sm:text-4xl">
                      Gallery
                    </h2>

                    <p className="mt-3 font-body text-sm leading-6 text-navy/60">
                      Photographs and memories documenting the life and work of{' '}
                      {person.name}.
                    </p>
                  </div>

                  <PhotoGallery
                    images={person.gallery}
                    personName={person.name}
                  />

                </div>
              )
            }

            {/* Image Credits */}
            {person.imageCredits && (
              <div className="mt-14 border-t border-navy/10 pt-6">
                <details className="group">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-body text-xs uppercase tracking-[0.12em] text-shawl transition hover:text-mustard [&::-webkit-details-marker]:hidden">
                    <span>Image Credits</span>

                    <span className="flex h-7 w-7 shrink-0 items-center justify-center border border-navy/15 text-lg leading-none text-shawl transition group-open:rotate-45 group-open:border-mustard group-open:text-mustard">
                      +
                    </span>
                  </summary>

                  <div className="mt-5 border-l-2 border-mustard/60 pl-4">
                    <p className="whitespace-pre-line break-words font-body text-xs leading-6 text-navy/55">
                      {person.imageCredits}
                    </p>
                  </div>
                </details>
              </div>
            )}

          </main>

          {/* Right Sidebar */}
          <aside className="min-w-0 space-y-10 lg:sticky lg:top-8">

            {/* Related People */}
            {relatedPeople.length > 0 && (
              <div className="border-t-2 border-navy pt-5">

                <div className="mb-6">
                  <p className="font-body text-xs uppercase tracking-[0.14em] text-shawl">
                    Discover More
                  </p>

                  <h2 className="mt-2 font-display text-2xl leading-tight text-navy sm:text-3xl">
                    Related People
                  </h2>

                  <p className="mt-2 font-body text-sm leading-6 text-navy/60">
                    Explore more personalities from the same field.
                  </p>
                </div>

                <div className="divide-y divide-navy/10">
                  {relatedPeople.map((related: any) => {
                    const relatedImage = related.profileImage
                      ? urlFor(related.profileImage)
                          .width(180)
                          .height(180)
                          .fit('crop')
                          .auto('format')
                          .quality(75)
                          .url()
                      : undefined

                    return (
                      <Link
                        key={related.slug}
                        href={`/celebrities/${related.slug}`}
                        className="group flex gap-4 py-5 first:pt-0"
                      >
                        {relatedImage ? (
                          <img
                            src={relatedImage}
                            alt={related.name}
                            width={100}
                            height={100}
                            loading="lazy"
                            decoding="async"
                            className="h-20 w-20 shrink-0 rounded-full object-cover transition duration-300 group-hover:opacity-80 sm:h-24 sm:w-24"
                          />
                        ) : (
                          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-shawl/10 font-display text-2xl text-shawl sm:h-24 sm:w-24">
                            {related.name?.charAt(0)}
                          </div>
                        )}

                        <div className="min-w-0 self-center">
                          {related.category?.title && (
                            <p className="mb-1 font-body text-[11px] uppercase tracking-[0.1em] text-shawl">
                              {related.category.title}
                            </p>
                          )}

                          <h3 className="break-words font-display text-lg leading-snug text-navy transition group-hover:text-shawl sm:text-xl">
                            {related.name}
                          </h3>

                          <span className="mt-2 inline-block font-body text-xs text-shawl underline underline-offset-4 transition group-hover:text-mustard">
                            Read biography
                          </span>
                        </div>
                      </Link>
                    )
                  })}
                </div>

                <Link
                  href="/celebrities"
                  className="mt-5 inline-flex w-full items-center justify-between border border-navy/15 px-4 py-3 font-body text-sm text-navy transition hover:border-mustard hover:text-mustard"
                >
                  <span>Explore All People</span>
                  <span aria-hidden="true">→</span>
                </Link>

              </div>
            )}

            {/* Explore Saraikistan */}
            <div className="border-t-2 border-mustard bg-white/40 p-5 sm:p-6">

              <p className="font-body text-xs uppercase tracking-[0.14em] text-shawl">
                Explore Saraikistan
              </p>

              <h2 className="mt-2 font-display text-2xl leading-tight text-navy">
                Discover Our Heritage
              </h2>

              <p className="mt-3 font-body text-sm leading-6 text-navy/65">
                Explore the people, places, traditions, and stories that shape Saraiki identity.
              </p>

              <div className="mt-5 divide-y divide-navy/10">

                <Link
                  href="/region"
                  className="flex items-center justify-between gap-3 py-3 font-body text-sm text-navy transition hover:text-shawl"
                >
                  <span>Places & Region</span>
                  <span aria-hidden="true">→</span>
                </Link>

                <Link
                  href="/culture"
                  className="flex items-center justify-between gap-3 py-3 font-body text-sm text-navy transition hover:text-shawl"
                >
                  <span>Culture & Heritage</span>
                  <span aria-hidden="true">→</span>
                </Link>

                <Link
                  href="/stories"
                  className="flex items-center justify-between gap-3 py-3 font-body text-sm text-navy transition hover:text-shawl"
                >
                  <span>Stories</span>
                  <span aria-hidden="true">→</span>
                </Link>

                <Link
                  href="/news"
                  className="flex items-center justify-between gap-3 py-3 font-body text-sm text-navy transition hover:text-shawl"
                >
                  <span>Latest News</span>
                  <span aria-hidden="true">→</span>
                </Link>

              </div>

            </div>

            {/* About Saraikistan */}
            <div className="border-t border-navy/15 pt-5">
              <p className="font-body text-xs uppercase tracking-[0.14em] text-shawl">
                Our Mission
              </p>

              <p className="mt-3 font-display text-xl leading-relaxed text-navy">
                Preserving Saraiki culture, celebrating its people, and sharing our heritage with the world.
              </p>

              <Link
                href="/about"
                className="mt-4 inline-block font-body text-sm text-shawl underline underline-offset-4 transition hover:text-mustard"
              >
                About Saraikistan
              </Link>
            </div>

          </aside>

        </div>

      </div>
    </section>
  )
}
