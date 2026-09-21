import Link from 'next/link'
import { client } from '@/sanity/lib/client'
import { urlFor } from '@/sanity/lib/image'

export const revalidate = 60

async function getNews() {
  return client.fetch(
    `*[_type == "newsPost"] | order(publishedAt desc) {
      _id,
      title,
      slug,
      "category": category->{title},
      publishedAt,
      author,
      source,
      newsType,
      summary,
      coverImage
    }`
  )
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

function formatNewsType(type: string) {
  const labels: Record<string, string> = {
    'original-reporting': 'Original Reporting',
    'press-release': 'Press Release',
    'source-report': 'Source Report',
    'editorial-analysis': 'Editorial / Analysis',
    'community-submission': 'Community Submission',
  }

  return labels[type] || type
}

export default async function News() {
  const news = await getNews()

  const featured = news[0]
  const remaining = news.slice(1)

  return (
    <main className="min-h-screen bg-cream text-navy">

      {/* PAGE HEADER */}
      <section>
        <div className="mx-auto max-w-7xl px-6 pb-10 pt-6 sm:px-10 sm:pb-12 sm:pt-8 lg:px-12">

          <p className="font-body text-sm text-shawl">
            What's happening
          </p>

          <h1 className="mt-2 font-display text-4xl leading-tight text-navy sm:text-5xl">
            News
          </h1>

        </div>
      </section>


      {/* NEWS INTRO */}
      <section className="mx-auto max-w-7xl px-6 pb-12 sm:px-10 sm:pb-16 lg:px-12">

        <div className="border-t border-mustard pt-7">

          <div className="max-w-3xl">

            <p className="font-body text-base leading-7 text-navy/65 sm:text-lg sm:leading-8">
              Latest updates, announcements and developments from
              across the Saraiki region.
            </p>

          </div>

        </div>

      </section>


      {news.length === 0 ? (

        /* EMPTY STATE */
        <section className="mx-auto max-w-7xl px-6 pb-20 sm:px-10 lg:px-12">

          <div className="border border-navy/10 bg-cream p-8 sm:p-12">

            <p className="font-body text-sm uppercase tracking-[0.14em] text-mustard">
              News archive
            </p>

            <h2 className="mt-4 font-display text-3xl sm:text-4xl">
              The archive is just beginning.
            </h2>

            <p className="mt-4 max-w-2xl font-body text-base leading-7 text-navy/60 sm:text-lg">
              No news stories have been published yet. Add your first
              news entry through the Studio and it will appear here.
            </p>

          </div>

        </section>

      ) : (

        <>

          {/* FEATURED NEWS */}
          <section className="mx-auto max-w-7xl px-6 pb-16 sm:px-10 sm:pb-20 lg:px-12">

            <Link
              href={`/news/${featured.slug.current}`}
              className="group block overflow-hidden bg-navy"
            >

              <div className="grid lg:grid-cols-2">

                {/* IMAGE */}
                <div className="relative aspect-[16/10] overflow-hidden bg-shawl lg:aspect-auto lg:min-h-[430px]">

                  {featured.coverImage ? (
                    <img
                      src={urlFor(featured.coverImage)
                        .width(1200)
                        .height(800)
                        .fit('crop')
                        .url()}
                      alt={featured.title}
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full min-h-[300px] items-center justify-center bg-shawl font-display text-cream/40">
                      Saraikistan
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-navy/60 via-transparent to-transparent lg:bg-gradient-to-r" />

                </div>


                {/* FEATURED CONTENT */}
                <div className="flex flex-col justify-center p-7 text-cream sm:p-10 lg:p-14">

                  {/* CATEGORY */}
                  {featured.category && (
                    <span className="w-fit bg-mustard px-4 py-2 font-body text-[10px] uppercase tracking-[0.14em] text-navy">
                      {featured.category.title}
                    </span>
                  )}

                  {/* DATE */}
                  {featured.publishedAt && (
                    <p className="mt-4 font-body text-xs uppercase tracking-[0.14em] text-cream/60">
                      Published · {formatDate(featured.publishedAt)}
                    </p>
                  )}

                  {/* AUTHOR */}
                  {featured.author && (
                    <p className="mt-2 font-body text-xs text-cream/55">
                      By {featured.author}
                    </p>
                  )}

                  {/* TITLE */}
                  <h2 className="mt-5 font-display text-3xl leading-tight sm:text-4xl lg:text-5xl">
                    {featured.title}
                  </h2>

                  {/* SUMMARY */}
                  {featured.summary && (
                    <p className="mt-5 max-w-xl font-body text-sm leading-7 text-cream/65 sm:text-base sm:leading-7">
                      {featured.summary}
                    </p>
                  )}

                  {/* SOURCE / TYPE */}
                  <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2 font-body text-[10px] uppercase tracking-[0.12em] text-cream/45">
                    {featured.source && (
                      <span>Source · {featured.source}</span>
                    )}

                    {featured.newsType && (
                      <span>
                        {formatNewsType(featured.newsType)}
                      </span>
                    )}
                  </div>

                  {/* LINK */}
                  <span className="mt-8 inline-block font-body text-xs uppercase tracking-[0.14em] text-mustard">
                    Read news →
                  </span>

                </div>

              </div>

            </Link>

          </section>


          {/* MORE NEWS */}
          {remaining.length > 0 && (

            <section className="border-t border-navy/10">

              <div className="mx-auto max-w-7xl px-6 py-16 sm:px-10 sm:py-20 lg:px-12">

                <div className="mb-10">

                  <p className="font-body text-sm text-shawl">
                    Latest updates
                  </p>

                  <h2 className="mt-2 font-display text-4xl sm:text-5xl">
                    More News
                  </h2>

                  <div className="mt-4 h-[2px] w-12 bg-mustard" />

                </div>


                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

                  {remaining.map((item: any) => {

                    const image = item.coverImage
                      ? urlFor(item.coverImage)
                          .width(900)
                          .height(600)
                          .fit('crop')
                          .url()
                      : null

                    return (
                      <Link
                        key={item._id}
                        href={`/news/${item.slug.current}`}
                        className="group block overflow-hidden border border-navy/10 bg-cream transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                      >

                        {/* IMAGE */}
                        <div className="aspect-[16/10] overflow-hidden bg-shawl">

                          {image ? (
                            <img
                              src={image}
                              alt={item.title}
                              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center font-display text-cream/40">
                              Saraikistan
                            </div>
                          )}

                        </div>


                        {/* CONTENT */}
                        <div className="border-t-2 border-mustard p-6">

                          {/* CATEGORY */}
                          {item.category && (
                            <p className="font-body text-[10px] uppercase tracking-[0.14em] text-shawl">
                              {item.category.title}
                            </p>
                          )}

                          {/* DATE */}
                          {item.publishedAt && (
                            <p className="mt-2 font-body text-[10px] uppercase tracking-[0.12em] text-navy/45">
                              Published · {formatDate(item.publishedAt)}
                            </p>
                          )}

                          {/* AUTHOR */}
                          {item.author && (
                            <p className="mt-2 font-body text-[11px] text-navy/50">
                              By {item.author}
                            </p>
                          )}

                          {/* TITLE */}
                          <h3 className="mt-3 font-display text-2xl leading-tight transition group-hover:text-shawl">
                            {item.title}
                          </h3>

                          {/* SUMMARY */}
                          {item.summary && (
                            <p className="mt-3 line-clamp-3 font-body text-sm leading-6 text-navy/60">
                              {item.summary}
                            </p>
                          )}

                          {/* SOURCE / TYPE */}
                          <div className="mt-4 flex flex-wrap gap-x-3 gap-y-1 font-body text-[9px] uppercase tracking-[0.1em] text-navy/40">
                            {item.source && (
                              <span>Source · {item.source}</span>
                            )}

                            {item.newsType && (
                              <span>
                                {formatNewsType(item.newsType)}
                              </span>
                            )}
                          </div>

                          {/* LINK */}
                          <span className="mt-6 inline-block font-body text-xs uppercase tracking-[0.12em] text-shawl transition group-hover:text-mustard">
                            Read more →
                          </span>

                        </div>

                      </Link>
                    )
                  })}

                </div>

              </div>

            </section>

          )}


          {/* CLOSING BANNER */}
          <section className="bg-navy text-cream">

            <div className="mx-auto max-w-7xl px-6 py-16 sm:px-10 sm:py-20 lg:px-12">

              <div className="grid gap-8 lg:grid-cols-2 lg:items-end">

                <div>

                  <p className="font-body text-sm uppercase tracking-[0.18em] text-mustard">
                    Stay informed
                  </p>

                  <h2 className="mt-4 max-w-2xl font-display text-4xl leading-tight sm:text-5xl">
                    Stories that keep
                    <br />
                    Saraikistan alive.
                  </h2>

                </div>

                <div>

                  <p className="max-w-xl font-body text-base leading-7 text-cream/65 sm:text-lg sm:leading-8">
                    Keep exploring the latest stories, updates and
                    developments from across the Saraiki region.
                  </p>

                </div>

              </div>

            </div>

            <div className="tile-rule" />

          </section>

        </>

      )}

    </main>
  )
}
