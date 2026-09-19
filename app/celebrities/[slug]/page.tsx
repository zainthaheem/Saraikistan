import type { Metadata } from 'next'
import { client } from '@/sanity/lib/client'
import { urlFor } from '@/sanity/lib/image'
import { PortableText } from '@portabletext/react'

export const revalidate = 60

async function getPerson(slug: string) {
  return client.fetch(
    `*[_type == "person" && slug.current == $slug][0] {
      name,
      "category": category->{title},
      profileImage,
      coverImage,
      gallery,
      bio,
      socialLinks,
      seoTitle,
      seoDescription,
      seoImage
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
    ? urlFor(person.seoImage).width(1200).height(630).fit('crop').url()
    : person.coverImage
      ? urlFor(person.coverImage).width(1200).height(630).fit('crop').url()
      : person.profileImage
        ? urlFor(person.profileImage).width(1200).height(630).fit('crop').url()
        : undefined

  return {
    title,
    description,

    alternates: {
      canonical: `https://saraikistan-ml2d.vercel.app/celebrities/${params.slug}`,
    },

    openGraph: {
      title,
      description,
      type: 'profile',
      url: `https://saraikistan-ml2d.vercel.app/celebrities/${params.slug}`,
      siteName: 'Saraikistan',
      images: image
        ? [
            {
              url: image,
              width: 1200,
              height: 630,
              alt: person.name,
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

  return (
    <section className="min-h-screen bg-cream text-navy">

      {/* Cover Image */}
      {person.coverImage && (
        <div className="h-56 w-full overflow-hidden bg-shawl sm:h-72 lg:h-96">
          <img
            src={urlFor(person.coverImage)
              .width(1800)
              .height(700)
              .fit('crop')
              .url()}
            alt={person.name}
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
                src={urlFor(person.profileImage)
                  .width(240)
                  .height(240)
                  .fit('crop')
                  .url()}
                alt={person.name}
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

        {/* Biography */}
        {person.bio && (
          <div className="mt-10 max-w-3xl">

            <p className="font-body text-sm text-shawl">
              Biography
            </p>

            <div className="prose prose-sm mt-4 max-w-none font-body leading-7 text-navy/75 sm:prose-base">
              <PortableText value={person.bio} />
            </div>

          </div>
        )}

        {/* Gallery */}
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

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">

              {person.gallery.map((img: any, i: number) => (
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
                    alt={`${person.name} — photo ${i + 1}`}
                    className="h-full w-full object-cover transition duration-500 hover:scale-105"
                  />
                </div>
              ))}

            </div>

          </div>
        )}

      </div>

    </section>
  )
}
