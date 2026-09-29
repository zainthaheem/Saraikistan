
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

async function getRelatedPeople(categoryId: string | undefined, slug: string) {
  return client.fetch(
    `*[_type == "person" && slug.current != $slug && (!defined($categoryId) || category._ref == $categoryId)]
      | order(_createdAt desc)[0...4] {
        name,
        "slug": slug.current,
        "category": category->{title},
        profileImage
      }`,
    {
      slug,
      categoryId: categoryId || null,
    }
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
        <div className="mx-auto max-w-7xl px-6 pb-20 pt-6 sm:px-10 sm:pt-8 lg:px-12">
          <div className="border-t border-mustard pt-7">
            <p className="font-body text-base leading-7 text-navy/65 sm:text-lg">
              Person not found.
            </p>

            <Link
              href="/celebrities"
              className="mt-6 inline-block font-body text-sm text-shawl underline underline-offset-4 transition hover:text-mustard"
            >
              Back to People
            </Link>
          </div>
        </div>
      </section>
    )
  }

  const relatedPeople = await getRelatedPeople(
    person.categoryId,
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

      {/* Person Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(personSchema),
        }}
      />

      {/* Full-Width Cover Image */}
      {person.coverImage && (
        <div className="h-56 w-full overflow-hidden bg-shawl sm:h-72 lg:h-96">
          <img
            src={coverImage}
            alt={person.name}
            width={1800}
            height={700}
            loading="eager"
            decoding="async"
            className="h-full w-full object-cover"
          />
        </div>
      )}

      {/* Main Editorial Layout */}
      <div className="mx-auto max-w-7xl px-6 pb-20 pt-8 sm:px-10 sm:pt-10 lg:px-12">

        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-14">

          {/* LEFT: Biography and Gallery */}
          <main className="min-w-0">

            {/* Profile Header */}
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
                    <p className="font-body text-sm text-shawl">
                      {person.category.title}
                    </p>
                  )}

                  <h1 className="mt-2 font-display text-4xl leading-tight text-navy sm:text-5xl">
                    {person.name}
                  </h1>
                </div>

              </div>
            </div>

            {/* Social Links */}
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

            {/* Biography + Language Switcher */}
            {(person.bio || person.bioUrdu) && (
              <div className="mt-8 min-w-0">
                <LanguageSwitcher
                  english={person.bio}
                  urdu={person.bioUrdu}
                />
              </div>
            )}

            {/* Interactive Photo Gallery */}
            {person.gallery && person.gallery.length > 0 && (
              <div className="mt-14 border-t border-navy/10 pt-8">

                <div className="mb-6">
                  <p className="font-body text-xs uppercase tracking-[0.16em] text-shawl">
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

          {/* RIGHT: Sticky Sidebar */}
          <aside className="min-w-0 self-start lg:sticky lg:top-8">

            <div className="border-t-2 border-navy pt-5">

              {/* Related People */}
              <div>
                <p className="font-body text-xs uppercase tracking-[0.16em] text-shawl">
                  Discover More
                </p>

                <h2 className="mt-2 font-display text-3xl leading-tight text-navy">
                  Related People
                </h2>

                <p className="mt-3 font-body text-sm leading-6 text-navy/60">
                  Explore more personalities from the same field.
                </p>
              </div>

              {relatedPeople && relatedPeople.length > 0 ? (
                <div className="mt-6 divide-y divide-navy/10">

                  {relatedPeople.map((item: any) => {
                    const image = item.profileImage
                      ? urlFor(item.profileImage)
                          .width(200)
                          .height(200)
                          .fit('crop')
                          .auto('format')
                          .quality(80)
                          .url()
                      : undefined

                    return (
                      <Link
                        key={item.slug}
                        href={`/celebrities/${item.slug}`}
                        className="group flex min-w-0 gap-4 py-5 first:pt-0"
                      >
                        {image ? (
                          <img
                            src={image}
                            alt={item.name}
                            width={200}
                            height={200}
                            loading="lazy"
                            decoding="async"
                            className="h-20 w-20 shrink-0 rounded-full object-cover"
                          />
                        ) : (
                          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-navy/5 font-display text-2xl text-shawl">
                            {item.name?.charAt(0)}
                          </div>
                        )}

                        <div className="min-w-0 pt-1">
                          {item.category?.title && (
                            <p className="font-body text-[11px] uppercase tracking-[0.12em] text-shawl">
                              {item.category.title}
                            </p>
                          )}

                          <h3 className="mt-1 break-words font-display text-xl leading-snug text-navy transition group-hover:text-shawl">
                            {item.name}
                          </h3>

                          <span className="mt-2 inline-block font-body text-xs text-shawl underline underline-offset-4 transition group-hover:text-mustard">
                            Read biography
                          </span>
                        </div>
                      </Link>
                    )
                  })}

                </div>
              ) : (
                <p className="mt-6 font-body text-sm leading-6 text-navy/60">
                  Discover more people and personalities from Saraikistan.
                </p>
              )}

              {/* Explore All People */}
              <Link
                href="/celebrities"
                className="mt-5 flex items-center justify-between border border-navy/15 px-4 py-3 font-body text-sm text-navy transition hover:border-mustard hover:text-shawl"
              >
                <span>Explore All People</span>
                <span className="text-lg text-navy transition group-hover:text-mustard">
                  →
                </span>
              </Link>

            </div>

            {/* Explore Saraikistan — Matching Stories Theme */}
            <div className="mt-10 border-t-2 border-mustard bg-[#F1EADD] p-6">

              <p className="font-body text-xs uppercase tracking-[0.16em] text-shawl">
                Explore Saraikistan
              </p>

              <h2 className="mt-2 font-display text-2xl leading-tight text-navy">
                Discover Our Heritage
              </h2>

              <p className="mt-3 font-body text-sm leading-6 text-navy/65">
                Explore the people, places, traditions, and stories that shape Saraiki identity.
              </p>

              <div className="mt-6 divide-y divide-navy/10">

                <Link
                  href="/region"
                  className="flex items-center justify-between gap-4 py-3 font-body text-sm text-navy transition hover:text-shawl"
                >
                  <span>Places & Region</span>
                  <span className="shrink-0 text-lg text-mustard">→</span>
                </Link>

                <Link
                  href="/culture"
                  className="flex items-center justify-between gap-4 py-3 font-body text-sm text-navy transition hover:text-shawl"
                >
                  <span>Culture & Heritage</span>
                  <span className="shrink-0 text-lg text-mustard">→</span>
                </Link>

                <Link
                  href="/blog"
                  className="flex items-center justify-between gap-4 py-3 font-body text-sm text-navy transition hover:text-shawl"
                >
                  <span>Stories</span>
                  <span className="shrink-0 text-lg text-mustard">→</span>
                </Link>

                <Link
                  href="/news"
                  className="flex items-center justify-between gap-4 py-3 font-body text-sm text-navy transition hover:text-shawl"
                >
                  <span>Latest News</span>
                  <span className="shrink-0 text-lg text-mustard">→</span>
                </Link>

              </div>

            </div>

          </aside>

        </div>

      </div>
    </section>
  )
}
