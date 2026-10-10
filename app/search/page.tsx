
import Link from 'next/link'
import { client } from '@/sanity/lib/client'
import { urlFor } from '@/sanity/lib/image'

export const revalidate = 60

type SearchResult = {
  _id: string
  _type: string
  name?: string
  title?: string
  slug?: { current?: string }
  category?: { title?: string }
  coverImage?: any
  profileImage?: any
  imageUrl?: string
  href: string
}

const mapResult: SearchResult = {
  _id: 'saraikistan-map',
  _type: 'staticPage',
  title: 'Saraikistan Map',
  imageUrl: '/images/saraikistan-cultural-map.webp',
  href: '/saraikistan-map',
}

function cleanQuery(query: string) {
  return query
    .replace(/[^a-zA-Z0-9\u0600-\u06FF\s-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 100)
}

function isMapSearch(query: string) {
  const normalized = query.toLowerCase().replace(/[-\s]+/g, ' ').trim()

  return (
    normalized === 'map' ||
    normalized === 'maps' ||
    normalized === 'saraikistan map' ||
    normalized === 'saraikistan maps' ||
    normalized === 'map of saraikistan' ||
    normalized === 'cultural map' ||
    normalized === 'region map'
  )
}

async function searchContent(query: string): Promise<SearchResult[]> {
  const safeQuery = cleanQuery(query)

  if (!safeQuery) return []

  if (isMapSearch(safeQuery)) {
    return [mapResult]
  }

  const searchPattern = `${safeQuery}*`

  const documents = await client.fetch(
    `
      *[
        _type in ["person", "place", "culture", "newsPost", "story"] &&
        (
          (_type == "person" &&
            (
              name match $searchPattern ||
              pt::text(body) match $searchPattern
            )
          ) ||
          (_type != "person" &&
            (
              title match $searchPattern ||
              summary match $searchPattern ||
              pt::text(body) match $searchPattern
            )
          )
        )
      ] {
        _id,
        _type,
        name,
        title,
        slug,
        "category": category->{title},
        coverImage,
        profileImage
      }
    `,
    { searchPattern }
  )

  return documents
    .filter((item: any) => item.slug?.current)
    .map((item: any) => ({
      ...item,
      href:
        item._type === 'person'
          ? `/celebrities/${item.slug.current}`
          : item._type === 'place'
            ? `/region/${item.slug.current}`
            : item._type === 'culture'
              ? `/culture/${item.slug.current}`
              : item._type === 'newsPost'
                ? `/news/${item.slug.current}`
                : `/blog/${item.slug.current}`,
    }))
}

function getTypeLabel(type: string) {
  if (type === 'person') return 'People'
  if (type === 'place') return 'Places'
  if (type === 'culture') return 'Culture'
  if (type === 'newsPost') return 'News'
  if (type === 'staticPage') return 'Maps & Guides'

  return 'Stories'
}

function getResultImage(item: SearchResult) {
  if (item.imageUrl) return item.imageUrl

  const image =
    item._type === 'person' ? item.profileImage : item.coverImage

  if (!image) return null

  return urlFor(image).width(480).height(360).fit('crop').url()
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const params = await searchParams
  const query = cleanQuery(params.q || '')
  const results = query ? await searchContent(query) : []

  return (
    <main className="min-h-screen bg-cream text-navy">
      <section className="mx-auto max-w-7xl px-5 pb-12 pt-10 sm:px-10 sm:pb-16 sm:pt-14 lg:px-12">
        <div className="max-w-3xl">
          <p className="font-body text-sm tracking-wide text-shawl sm:text-base">
            Explore Saraikistan
          </p>

          <h1 className="mt-2 font-display text-5xl leading-tight sm:text-6xl lg:text-7xl">
            Search
          </h1>

          <p className="mt-5 max-w-2xl font-body text-base leading-7 text-navy/65 sm:text-lg sm:leading-8">
            Discover the people, places, traditions, stories and news that
            shape Saraikistan.
          </p>
        </div>

        <div className="mt-9 border-t border-mustard pt-7 sm:mt-12 sm:pt-9">
          <form action="/search" method="get" role="search">
            <label
              htmlFor="site-search"
              className="mb-3 block font-body text-sm text-navy/75"
            >
              What would you like to discover?
            </label>

            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative min-w-0 flex-1">
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-shawl"
                >
                  <circle cx="10.8" cy="10.8" r="6.8" />
                  <path d="m16 16 4.5 4.5" />
                </svg>

                <input
                  id="site-search"
                  type="search"
                  name="q"
                  defaultValue={query}
                  placeholder="Try Saraikistan Map, a person or a place..."
                  aria-label="Search Saraikistan"
                  maxLength={100}
                  className="min-h-14 w-full rounded-sm border border-navy/20 bg-cream py-4 pl-12 pr-4 font-body text-base text-navy outline-none transition placeholder:text-navy/40 focus:border-shawl focus:ring-1 focus:ring-shawl"
                />
              </div>

              <button
                type="submit"
                className="min-h-14 bg-navy px-8 py-4 font-body text-sm font-medium text-cream transition-colors hover:bg-shawl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-shawl sm:min-w-36"
              >
                Search
              </button>
            </div>

            <p className="mt-3 font-body text-xs leading-5 text-navy/50">
              Search by name, location, cultural topic, story or headline.
            </p>
          </form>
        </div>

        {query ? (
          <section
            aria-live="polite"
            aria-label="Search results"
            className="mt-10 sm:mt-14"
          >
            <div className="flex flex-wrap items-center justify-between gap-3 border-y border-navy/15 py-5">
              <div>
                <p className="font-body text-sm text-navy/55">
                  Search results for
                </p>
                <h2 className="mt-1 break-words font-display text-2xl sm:text-3xl">
                  &ldquo;{query}&rdquo;
                </h2>
              </div>

              <p className="font-body text-sm text-navy/55">
                {results.length} {results.length === 1 ? 'result' : 'results'}
              </p>
            </div>

            {results.length > 0 ? (
              <div className="grid gap-x-8 sm:grid-cols-2 lg:gap-x-12">
                {results.map((item) => {
                  const title = item.title || item.name || 'Untitled'
                  const image = getResultImage(item)

                  return (
                    <Link
                      key={item._id}
                      href={item.href}
                      className="group flex min-w-0 gap-4 border-b border-navy/10 py-5 transition-colors hover:bg-navy/[0.025] sm:gap-5 sm:py-7"
                    >
                      <div className="h-24 w-24 shrink-0 overflow-hidden bg-navy/5 sm:h-28 sm:w-28">
                        {image ? (
                          <img
                            src={image}
                            alt=""
                            loading="lazy"
                            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center px-2 text-center font-display text-xs text-shawl">
                            Saraikistan
                          </div>
                        )}
                      </div>

                      <div className="min-w-0 flex-1 py-1">
                        <p className="font-body text-xs uppercase tracking-[0.14em] text-shawl">
                          {getTypeLabel(item._type)}
                        </p>

                        <h3 className="mt-2 break-words font-display text-xl leading-snug transition-colors group-hover:text-shawl sm:text-2xl">
                          {title}
                        </h3>

                        {item.category?.title && (
                          <p className="mt-2 font-body text-sm text-navy/50">
                            {item.category.title}
                          </p>
                        )}

                        <span className="mt-3 inline-flex items-center gap-2 font-body text-sm text-shawl">
                          Explore
                          <span
                            aria-hidden="true"
                            className="transition-transform group-hover:translate-x-1"
                          >
                            &rarr;
                          </span>
                        </span>
                      </div>
                    </Link>
                  )
                })}
              </div>
            ) : (
              <div className="py-12 sm:py-16">
                <div className="flex h-12 w-12 items-center justify-center border border-mustard text-shawl">
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    className="h-6 w-6"
                  >
                    <circle cx="10.8" cy="10.8" r="6.8" />
                    <path d="m16 16 4.5 4.5" />
                  </svg>
                </div>

                <h3 className="mt-5 font-display text-2xl sm:text-3xl">
                  Nothing found just yet
                </h3>

                <p className="mt-3 max-w-xl font-body text-base leading-7 text-navy/60">
                  Try a shorter search or a different spelling. You can search
                  for people, places, cultural traditions, stories and news.
                </p>

                <Link
                  href="/saraikistan-map"
                  className="mt-6 inline-flex items-center gap-2 border-b border-mustard pb-1 font-body text-sm text-shawl transition-colors hover:text-navy"
                >
                  Explore the Saraikistan Map
                  <span aria-hidden="true">&rarr;</span>
                </Link>
              </div>
            )}
          </section>
        ) : (
          <section className="mt-10 border-t border-navy/10 py-8 sm:mt-14 sm:py-10">
            <p className="font-body text-sm uppercase tracking-[0.14em] text-shawl">
              Begin your discovery
            </p>

            <h2 className="mt-3 max-w-2xl font-display text-2xl leading-snug sm:text-3xl">
              Explore the people, heritage and places of Saraikistan.
            </h2>

            <Link
              href="/saraikistan-map"
              className="group mt-6 flex items-center justify-between gap-4 border border-navy/15 p-5 transition-colors hover:border-mustard sm:p-7"
            >
              <span>
                <span className="block font-body text-xs uppercase tracking-[0.14em] text-shawl">
                  Maps &amp; Guides
                </span>
                <span className="mt-2 block font-display text-2xl sm:text-3xl">
                  Saraikistan Map
                </span>
                <span className="mt-2 block font-body text-sm text-navy/55">
                  Explore the region and its cultural geography.
                </span>
              </span>

              <span
                aria-hidden="true"
                className="shrink-0 font-body text-2xl text-shawl transition-transform group-hover:translate-x-1"
              >
                &rarr;
              </span>
            </Link>
          </section>
        )}
      </section>
    </main>
  )
}
