
import type { Metadata } from 'next'
import { client } from '@/sanity/lib/client'
import PeopleCategoryFilter from '@/components/PeopleCategoryFilter'

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

type Person = {
  _id: string
  name: string
  slug: {
    current: string
  }
  category?: {
    title?: string
  } | null
  profileImage?: any
}

async function getPeople(): Promise<Person[]> {
  return client.fetch<Person[]>(
    `*[_type == "person" && defined(slug.current)] | order(name asc) {
      _id,
      name,
      slug,
      "category": category->{title},
      profileImage
    }`
  )
}

export default async function Celebrities() {
  const people = await getPeople()

  const categoryOrder: string[] = [
    'Singers',
    'Poets',
    'Writers',
    'Scholars',
    'Leaders',
  ]

  const categories: string[] = Array.from(
    new Set<string>(
      people.map(
        (person) => person.category?.title || 'Other'
      )
    )
  ).sort((a, b) => {
    const indexA = categoryOrder.indexOf(a)
    const indexB = categoryOrder.indexOf(b)

    if (indexA !== -1 && indexB !== -1) {
      return indexA - indexB
    }

    if (indexA !== -1) {
      return -1
    }

    if (indexB !== -1) {
      return 1
    }

    return a.localeCompare(b)
  })

  return (
    <main className="min-h-screen bg-cream text-navy">
      <header className="mx-auto max-w-7xl px-6 pb-10 pt-6 sm:px-10 sm:pb-12 sm:pt-8 lg:px-12">
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
      </header>

      <div className="mx-auto max-w-7xl px-6 pb-20 sm:px-10 lg:px-12">
        {people.length === 0 ? (
          <div className="border-t border-mustard pt-7">
            <p className="max-w-3xl font-body text-base leading-7 text-navy/55 sm:text-lg">
              No people added yet. Add your first entry in the Studio.
            </p>
          </div>
        ) : (
          <PeopleCategoryFilter
            people={people}
            categories={categories}
          />
        )}
      </div>
    </main>
  )
}
