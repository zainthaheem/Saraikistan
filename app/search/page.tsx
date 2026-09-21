import Link from 'next/link'
import { client } from '@/sanity/lib/client'
import { urlFor } from '@/sanity/lib/image'

export const revalidate = 60

async function searchContent(query: string) {
  const safeQuery = query
    .replace(/[^a-zA-Z0-9\u0600-\u06FF\s-]/g, '')
    .trim()

  if (!safeQuery) return []

  const searchPattern = `${safeQuery}*`

  return client.fetch(
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
      ] | order(_type asc, title asc, name asc) {
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
}

function getResultUrl(item: any) {
  if (item._type === 'person') {
    return `/celebrities/${item.slug.current}`
  }

  if (item._type === 'place') {
    return `/region/${item.slug.current}`
  }

  if (item._type === 'culture') {
    return `/culture/${item.slug.current}`
  }

  if (item._type === 'newsPost') {
    return `/news/${item.slug.current}`
  }

  return `/blog/${item.slug.current}`
}

function getTypeLabel(type: string) {
  if (type === 'person') return 'People'
  if (type === 'place') return 'Places'
  if (type === 'culture') return 'Culture'
  if (type === 'newsPost') return 'News'

  return 'Stories'
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const params = await searchParams
  const query = params.q?.trim() || ''

  const results = query ? await searchContent(query) : []

  return (
    <section className="min-h-screen bg-cream text-navy">

      {/* HEADER */}
      <div className="mx-auto max-w-7xl px-6 pb-10 pt-6 sm:px-10 sm:pb-12 sm:pt-8 lg:px-12">

        <p className="font-body text-sm text-shawl">
          Explore Saraikistan
        </p>

        <h1 className="mt-2 font-display text-4xl leading-tight text-navy sm:text-5xl">
          Search
        </h1>

        <p className="mt-4 max-w-2xl font-body text-base leading-7 text-navy/60 sm:text-lg sm:leading-8">
          Search across the people, places, culture, stories and news of
          Saraikistan.
        </p>

      </div>


      {/* SEARCH */}
      <div className="mx-auto max-w-7xl px-6 pb-20 sm:px-10 lg:px-12">

        <form
          action="/search"
          method="get"
          className="border-t border-mustard pt-7"
        >

          <div className="flex flex-col gap-3 sm:flex-row">

            <input
              type="search"
              name="q"
              defaultValue={query}
              placeholder="Search people, places, culture, news or stories..."
              aria-label="Search Saraikistan"
              className="min-h-14 flex-1 border border-navy/15 bg-cream px-5 font-body text-base text-navy outline-none placeholder:text-navy/40 focus:border-shawl"
            />

            <button
              type="submit"
              className="min-h-14 bg-navy px-8 font-body text-sm text-cream transition hover:bg-mustard hover:text-navy"
            >
              Search
            </button>

          </div>

        </form>


        {/* RESULTS */}
        {query && (
          <div className="mt-12">

            {results.length === 0 ? (

              <div className="border-t border-navy/10 pt-7">

                <p className="font-body text-base leading-7 text-navy/60 sm:text-lg">
                  No results found for “{query}”.
                </p>

                <p className="mt-2 font-body text-sm leading-6 text-navy/45">
                  Try another name, place, story, cultural topic or news
                  headline.
                </p>

              </div>

            ) : (

              <div className="border-t border-navy/10">

                <div className="flex items-center justify-between border-b border-navy/10 py-5">

                  <p className="font-body text-sm text-navy/50">
                    {results.length} result
                    {results.length === 1 ? '' : 's'} found
                  </p>

                  <p className="hidden font-body text-xs uppercase tracking-[0.12em] text-shawl sm:block">
                    Saraikistan Archive
                  </p>

                </div>


                <div className="grid gap-0 sm:grid-cols-2 sm:gap-x-10">

                  {results.map((item: any) => {

                    const image =
                      item._type === 'person'
                        ? item.profileImage
                        : item.coverImage

                    const title =
                      item._type === 'person'
                        ? item.name
                        : item.title

                    return (
                      <Link
                        key={item._id}
                        href={getResultUrl(item)}
                        className="group flex items-center gap-5 border-b border-navy/10 py-6 transition hover:bg-navy/[0.02]"
                      >

                        <div className="h-20 w-20 shrink-0 overflow-hidden bg-shawl">

                          {image ? (
                            <img
                              src={urlFor(image)
                                .width(240)
                                .height(240)
                                .fit('crop')
                                .url()}
                              alt={title}
                              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center font-display text-xs text-cream/45">
                              Saraikistan
                            </div>
                          )}

                        </div>


                        <div className="min-w-0">

                          <p className="font-body text-xs uppercase tracking-[0.12em] text-shawl">
                            {getTypeLabel(item._type)}
                          </p>

                          <h2 className="mt-1 font-display text-xl leading-tight text-navy transition group-hover:text-shawl sm:text-2xl">
                            {title}
                          </h2>

                          {item.category && (
                            <p className="mt-1 font-body text-xs text-navy/45">
                              {item.category.title}
                            </p>
                          )}

                        </div>

                      </Link>
                    )
                  })}

                </div>

              </div>
            )}

          </div>
        )}


        {/* EMPTY SEARCH STATE */}
        {!query && (
          <div className="mt-12 border-t border-navy/10 pt-8">

            <p className="font-body text-base leading-7 text-navy/55 sm:text-lg">
              Search the Saraikistan archive by name, place, cultural topic,
              story or news.
            </p>

          </div>
        )}

      </div>

    </section>
  )
}
