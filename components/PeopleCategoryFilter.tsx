
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

const CATEGORY_ORDER: string[] = [
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
    useState<string>('All people')
  const [searchQuery, setSearchQuery] = useState('')

  const filterCategories = useMemo<string[]>(() => {
    return Array.from(
      new Set(
        categories
          .map((category) => category.trim())
          .filter((category) => category.length > 0)
      )
    ).sort((a, b) => {
      const indexA = CATEGORY_ORDER.indexOf(a)
      const indexB = CATEGORY_ORDER.indexOf(b)

      if (indexA !== -1 && indexB !== -1) {
        return indexA - indexB
      }

      if (indexA !== -1) return -1
      if (indexB !== -1) return 1

      return a.localeCompare(b)
    })
  }, [categories])

  const visiblePeople = useMemo<Person[]>(() => {
    const query = searchQuery.trim().toLocaleLowerCase()

    return people.filter((person) => {
      const matchesCategory =
        selectedCategory === 'All people' ||
        (person.category?.title || 'Other') === selectedCategory

      const matchesSearch =
        query.length === 0 ||
        person.name.toLocaleLowerCase().includes(query)

      return matchesCategory && matchesSearch
    })
  }, [people, selectedCategory, searchQuery])

  const groupedPeople = useMemo<Record<string, Person[]>>(() => {
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

  const orderedCategories = useMemo<string[]>(() => {
    const availableCategories = Object.keys(groupedPeople)

    return [
      ...CATEGORY_ORDER.filter((category) =>
        availableCategories.includes(category)
      ),
      ...availableCategories
        .filter((category) => !CATEGORY_ORDER.includes(category))
        .sort((a, b) => a.localeCompare(b)),
    ]
  }, [groupedPeople])

  function resetFilters() {
    setSearchQuery('')
    setSelectedCategory('All people')
  }

  return (
    <div>
      <div className="border-t border-mustard pt-6 sm:pt-8">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="font-body text-xs uppercase tracking-[0.16em] text-shawl">
              Saraikistan · People archive
            </p>

            <h2 className="mt-2 font-display text-2xl text-navy sm:text-3xl">
              Find a person
            </h2>
          </div>

          <p className="font-body text-xs text-navy/55">
            {visiblePeople.length}{' '}
            {visiblePeople.length === 1 ? 'profile' : 'profiles'}
          </p>
        </div>

        <div className="mt-5">
          <label
            htmlFor="people-archive-search"
            className="sr-only"
          >
            Search people by name
          </label>

          <div className="flex items-center gap-3 border-b border-navy/25 py-3 transition-colors focus-within:border-mustard">
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              className="h-5 w-5 shrink-0 text-shawl"
            >
              <circle cx="10.8" cy="10.8" r="6.8" />
              <path d="m16 16 4.2 4.2" />
            </svg>

            <input
              id="people-archive-search"
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search by name..."
              autoComplete="off"
              className="min-w-0 flex-1 bg-transparent font-body text-sm text-navy outline-none placeholder:text-navy/45"
            />

            {searchQuery.length > 0 && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                aria-label="Clear search"
                className="shrink-0 font-body text-xs text-shawl transition-colors hover:text-navy"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        <nav
          aria-label="Filter people by category"
          className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3 sm:gap-x-7"
        >
          <button
            type="button"
            onClick={() => setSelectedCategory('All people')}
            aria-pressed={selectedCategory === 'All people'}
            className={`relative pb-2 font-body text-sm transition-colors ${
              selectedCategory === 'All people'
                ? 'font-semibold text-navy after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:bg-mustard'
                : 'text-navy/60 hover:text-navy'
            }`}
          >
            All people
          </button>

          {filterCategories.map((category) => {
            const isSelected = selectedCategory === category

            return (
              <button
                key={category}
                type="button"
                onClick={() => setSelectedCategory(category)}
                aria-pressed={isSelected}
                className={`relative pb-2 font-body text-sm transition-colors ${
                  isSelected
                    ? 'font-semibold text-navy after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:bg-mustard'
                    : 'text-navy/60 hover:text-navy'
                }`}
              >
                {category}
              </button>
            )
          })}
        </nav>

        {(searchQuery.trim().length > 0 ||
          selectedCategory !== 'All people') && (
          <div className="mt-3">
            <button
              type="button"
              onClick={resetFilters}
              className="font-body text-xs text-shawl transition-colors hover:text-navy"
            >
              Clear all filters &rarr;
            </button>
          </div>
        )}
      </div>

      {visiblePeople.length === 0 ? (
        <div className="mt-8 border-t border-navy/10 py-10">
          <h3 className="font-display text-2xl text-navy">
            No people found
          </h3>

          <p className="mt-3 font-body text-sm leading-6 text-navy/60">
            Try a different name or category to find the person you
            are looking for.
          </p>

          <button
            type="button"
            onClick={resetFilters}
            className="mt-5 border-b border-mustard pb-1 font-body text-sm text-shawl transition-colors hover:text-navy"
          >
            Reset search and filters &rarr;
          </button>
        </div>
      ) : (
        <div className="mt-8 space-y-12 sm:mt-10 sm:space-y-14">
          {orderedCategories.map((category) => {
            const categoryPeople = groupedPeople[category]
            const firstPeople = categoryPeople.slice(0, 5)
            const remainingPeople = categoryPeople.slice(5)

            return (
              <section key={category}>
                <div className="mb-3 border-b border-navy/10 pb-3">
                  <p className="font-body text-xs uppercase tracking-[0.16em] text-shawl">
                    {category}
                  </p>
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
                    <summary className="flex cursor-pointer list-none items-center justify-center border-b border-navy/10 py-5 font-body text-xs uppercase tracking-[0.12em] text-shawl transition-colors hover:text-mustard [&::-webkit-details-marker]:hidden">
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
