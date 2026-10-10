
'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { urlFor } from '@/sanity/lib/image'

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

type Props = {
  people: Person[]
  categories: string[]
}

const CATEGORY_ORDER = [
  'Singers',
  'Poets',
  'Writers',
  'Scholars',
  'Leaders',
]

function PersonCard({ person }: { person: Person }) {
  const imageUrl = person.profileImage
    ? urlFor(person.profileImage)
        .width(224)
        .height(224)
        .fit('crop')
        .quality(75)
        .format('webp')
        .url()
    : null

  return (
    <Link
      href={`/celebrities/${person.slug.current}`}
      className="group flex min-w-0 items-center gap-5 border-b border-navy/10 py-6 transition-colors hover:bg-navy/[0.02] sm:gap-6 sm:py-8"
    >
      <div className="h-24 w-24 shrink-0 overflow-hidden rounded-full bg-shawl sm:h-28 sm:w-28">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={person.name}
            width={224}
            height={224}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center px-2 text-center font-body text-xs text-cream">
            Saraikistan
          </div>
        )}
      </div>

      <div className="min-w-0">
        <h3 className="break-words font-display text-2xl leading-tight text-navy transition-colors group-hover:text-shawl sm:text-3xl">
          {person.name}
        </h3>

        <span className="mt-4 inline-block font-body text-xs uppercase tracking-[0.12em] text-shawl transition-colors group-hover:text-mustard">
          View profile &rarr;
        </span>
      </div>
    </Link>
  )
}

export default function PeopleCategoryFilter({
  people,
  categories,
}: Props) {
  const [selectedCategory, setSelectedCategory] =
    useState('All people')

  const visiblePeople = useMemo(() => {
    if (selectedCategory === 'All people') {
      return people
    }

    return people.filter(
      (person) =>
        (person.category?.title || 'Other') === selectedCategory
    )
  }, [people, selectedCategory])

  const groupedPeople = useMemo(() => {
    return visiblePeople.reduce<Record<string, Person[]>>(
      (groups, person) => {
        const category = person.category?.title || 'Other'

        if (!groups[category]) {
          groups[category] = []
        }

        groups[category].push(person)
        return groups
      },
      {}
    )
  }, [visiblePeople])

  const orderedCategories = [
    ...CATEGORY_ORDER.filter(
      (category) => groupedPeople[category]
    ),
    ...Object.keys(groupedPeople)
      .filter((category) => !CATEGORY_ORDER.includes(category))
      .sort((a, b) => a.localeCompare(b)),
  ]

  return (
    <div>
      <div className="border-t border-mustard pt-7 sm:pt-9">
        <p className="font-body text-xs uppercase tracking-[0.16em] text-shawl">
          Browse the archive
        </p>

        <h2 className="mt-2 font-display text-2xl text-navy sm:text-3xl">
          Filter by category
        </h2>

        <div
          className="mt-5 flex flex-wrap gap-2"
          role="group"
          aria-label="Filter people by category"
        >
          {['All people', ...categories].map((category) => {
            const isSelected = selectedCategory === category

            return (
              <button
                key={category}
                type="button"
                aria-pressed={isSelected}
                onClick={() => setSelectedCategory(category)}
                className={`border px-4 py-3 font-body text-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-shawl ${
                  isSelected
                    ? 'border-navy bg-navy text-cream'
                    : 'border-navy/20 bg-transparent text-navy hover:border-mustard hover:bg-navy/[0.03]'
                }`}
              >
                {category}
              </button>
            )
          })}
        </div>

        <p
          className="mt-4 font-body text-sm text-navy/55"
          aria-live="polite"
        >
          Showing {visiblePeople.length}{' '}
          {visiblePeople.length === 1 ? 'person' : 'people'}
          {selectedCategory === 'All people'
            ? ' across all categories'
            : ` in ${selectedCategory}`}
        </p>
      </div>

      {visiblePeople.length === 0 ? (
        <div className="mt-8 border-t border-navy/10 py-10">
          <h3 className="font-display text-2xl text-navy">
            No people in this category yet
          </h3>

          <p className="mt-3 font-body text-base leading-7 text-navy/60">
            Try another category or browse the complete collection.
          </p>

          <button
            type="button"
            onClick={() => setSelectedCategory('All people')}
            className="mt-5 border-b border-mustard pb-1 font-body text-sm text-shawl hover:text-navy"
          >
            Show all people &rarr;
          </button>
        </div>
      ) : (
        <div className="mt-10 space-y-14">
          {orderedCategories.map((category) => {
            const categoryPeople = groupedPeople[category]
            const firstPeople = categoryPeople.slice(0, 5)
            const remainingPeople = categoryPeople.slice(5)

            return (
              <section key={category}>
                <div className="mb-4 border-b border-navy/10 pb-4">
                  <p className="font-body text-xs uppercase tracking-[0.16em] text-shawl">
                    Category
                  </p>

                  <h3 className="mt-1 font-display text-3xl text-navy sm:text-4xl">
                    {category}
                  </h3>
                </div>

                <div className="grid gap-0 sm:grid-cols-2 sm:gap-x-10">
                  {firstPeople.map((person) => (
                    <PersonCard
                      key={person._id}
                      person={person}
                    />
                  ))}
                </div>

                {remainingPeople.length > 0 && (
                  <details className="group mt-2">
                    <summary className="flex cursor-pointer list-none items-center justify-center border-b border-navy/10 py-6 font-body text-xs uppercase tracking-[0.14em] text-shawl transition-colors hover:text-mustard [&::-webkit-details-marker]:hidden">
                      <span>
                        View all {category} ({categoryPeople.length})
                      </span>

                      <span className="ml-3 flex h-7 w-7 items-center justify-center border border-navy/15 text-lg leading-none transition group-open:rotate-45 group-open:border-mustard group-open:text-mustard">
                        +
                      </span>
                    </summary>

                    <div className="grid gap-0 sm:grid-cols-2 sm:gap-x-10">
                      {remainingPeople.map((person) => (
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
  )
}
