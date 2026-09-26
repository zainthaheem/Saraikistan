
import type { Metadata } from 'next'
import Link from 'next/link'
import { client } from '@/sanity/lib/client'
import { urlFor } from '@/sanity/lib/image'

export const revalidate = 60

export const metadata: Metadata = {
  metadataBase: new URL('https://saraikistan.org'),
  title: 'Saraiki People | Singers, Poets, Writers & Scholars',
  description:
    'Discover notable Saraiki singers, poets, writers, scholars and other people who represent the culture and living heritage of the Saraiki region.',
  alternates: {
    canonical: 'https://saraikistan.org/celebrities',
  },
  openGraph: {
    title: 'Saraiki People | Singers, Poets, Writers & Scholars',
    description:
      'Discover notable Saraiki singers, poets, writers, scholars and other people who represent the culture and living heritage of the Saraiki region.',
    type: 'website',
    url: 'https://saraikistan.org/celebrities',
    siteName: 'Saraikistan',
  },
  twitter: {
    card: 'summary',
    title: 'Saraiki People | Singers, Poets, Writers & Scholars',
    description:
      'Discover notable Saraiki singers, poets, writers, scholars and other people who represent the culture and living heritage of the Saraiki region.',
  },
}

async function getPeople() {
  return client.fetch(
    `*[_type == "person"] | order(name asc) {
      _id,
      name,
      slug,
      "category": category->{title},
      profileImage
    }`
  )
}

function PersonCard({
  person,
}: {
  person: any
}) {
  const imageBuilder = person.profileImage
    ? urlFor(person.profileImage)
        .height(160)
        .fit('crop')
        .quality(75)
        .format('webp')
    : null

  const imageUrl = imageBuilder
    ? imageBuilder.width(160).url()
    : null

  const imageSrcSet = imageBuilder
    ? [
        `${imageBuilder.width(96).url()} 96w`,
        `${imageBuilder.width(128).url()} 128w`,
        `${imageBuilder.width(160).url()} 160w`,
        `${imageBuilder.width(224).url()} 224w`,
      ].join(', ')
    : undefined

  return (
    <Link
      href={`/celebrities/${person.slug.current}`}
      className="group flex items-center gap-6 border-b border-navy/10 py-8 transition duration-300 hover:bg-navy/[0.02]"
    >
      <div className="h-24 w-24 shrink-0 overflow-hidden rounded-full bg-shawl sm:h-28 sm:w-28">
        {imageUrl ? (
          <img
            src={imageUrl}
            srcSet={imageSrcSet}
            sizes="(max-width: 639px) 96px, 112px"
            alt={person.name}
            width={160}
            height={160}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center font-display text-sm text-cream/50">
            Saraikistan
          </div>
        )}
      </div>

      <div className="min-w-0">
        <h3 className="font-display text-2xl leading-tight text-navy transition group-hover:text-shawl sm:text-3xl">
          {person.name}
        </h3>

        <span className="mt-4 inline-block font-body text-xs uppercase tracking-[0.12em] text-shawl transition group-hover:text-mustard">
          View profile →
        </span>
      </div>
    </Link>
  )
}

export default async function Celebrities() {
  const people = await getPeople()

  const groupedPeople = people.reduce(
    (groups: any, person: any) => {
      const category = person.category?.title || 'Other'

      if (!groups[category]) {
        groups[category] = []
      }

      groups[category].push(person)

      return groups
    },
    {}
  )

  const categoryOrder = [
    'Singers',
    'Poets',
    'Writers',
    'Scholars',
    'Leaders',
  ]

  const orderedCategories = [
    ...categoryOrder.filter(
      (category) => groupedPeople[category]
    ),
    ...Object.keys(groupedPeople)
      .filter(
        (category) => !categoryOrder.includes(category)
      )
      .sort(),
  ]

  return (
    <section className="min-h-screen bg-cream text-navy">
      <div className="mx-auto max-w-7xl px-6 pb-10 pt-6 sm:px-10 sm:pb-12 sm:pt-8 lg:px-12">
        <p className="font-body text-sm text-shawl">
          Notable Saraikis
        </p>

        <h1 className="mt-2 font-display text-4xl leading-tight text-navy sm:text-5xl">
          People
        </h1>

        <p className="mt-5 max-w-3xl font-body text-base leading-7 text-navy/65 sm:text-lg sm:leading-8">
          Singers, poets, writers, scholars, and other notable people who
          represent Saraiki culture and its living heritage.
        </p>
      </div>

      <div className="mx-auto max-w-7xl px-6 pb-20 sm:px-10 lg:px-12">
        {people.length === 0 ? (
          <div className="border-t border-mustard pt-7">
            <p className="max-w-3xl font-body text-base leading-7 text-navy/55 sm:text-lg">
              No people added yet. Add your first entry in the Studio.
            </p>
          </div>
        ) : (
          <div className="space-y-16 border-t border-mustard pt-10">
            {orderedCategories.map((category) => {
              const categoryPeople = groupedPeople[category]
              const visiblePeople = categoryPeople.slice(0, 5)
              const remainingPeople = categoryPeople.slice(5)

              return (
                <section key={category}>
                  <div className="mb-6 border-b border-navy/10 pb-4">
                    <p className="font-body text-xs uppercase tracking-[0.16em] text-shawl">
                      Category
                    </p>

                    <h2 className="mt-1 font-display text-3xl text-navy sm:text-4xl">
                      {category}
                    </h2>
                  </div>

                  <div className="grid gap-0 sm:grid-cols-2 sm:gap-x-10">
                    {visiblePeople.map((person: any) => (
                      <PersonCard
                        key={person._id}
                        person={person}
                      />
                    ))}
                  </div>

                  {remainingPeople.length > 0 && (
                    <details className="group mt-2">
                      <summary className="flex cursor-pointer list-none items-center justify-center border-b border-navy/10 py-6 font-body text-xs uppercase tracking-[0.14em] text-shawl transition hover:text-mustard [&::-webkit-details-marker]:hidden">
                        <span>
                          View all {category} ({categoryPeople.length})
                        </span>

                        <span className="ml-3 flex h-7 w-7 items-center justify-center border border-navy/15 text-lg leading-none transition group-open:rotate-45 group-open:border-mustard group-open:text-mustard">
                          +
                        </span>
                      </summary>

                      <div className="grid gap-0 sm:grid-cols-2 sm:gap-x-10">
                        {remainingPeople.map((person: any) => (
                          <PersonCard
                            key={person._id}
                            person={person}
                          />
                        ))}
                      </div>
                    </details>
                  )}
                </section>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
