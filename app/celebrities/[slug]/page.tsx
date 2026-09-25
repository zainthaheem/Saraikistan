
import type { Metadata } from 'next'
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
          </div>
        </div>
      </section>
    )
  }

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

      {/* Cover Image */}
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

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-6 pb-20 pt-8 sm:px-10 sm:pt-10 lg:px-12">

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

            <div>
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
        {person.bio && (
          <LanguageSwitcher
            english={person.bio}
            urdu={person.bioUrdu}
          />
        )}

        {/* Interactive Photo Gallery */}
        {person.gallery && person.gallery.length > 0 && (
          <div className="mt-14">

            <div className="mb-6">
              <p className="font-body text-sm text-shawl">
                Gallery
              </p>

              <h2 className="mt-2 font-display text-3xl text-navy sm:text-4xl">
                Photos
              </h2>
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
            <details className="group max-w-3xl">
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

      </div>
    </section>
  )
}
