import type { Metadata } from 'next'
import Link from 'next/link'
import { client } from '@/sanity/lib/client'
import { urlFor } from '@/sanity/lib/image'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Saraiki Stories | History, People & Perspectives',
  description:
    'Explore stories, interviews, history and perspectives about the people, places, traditions and heritage of the Saraiki region.',
  alternates: {
    canonical: 'https://saraikistan-ml2d.vercel.app/blog',
  },
  openGraph: {
    title: 'Saraiki Stories | History, People & Perspectives',
    description:
      'Explore stories, interviews, history and perspectives about the people, places, traditions and heritage of the Saraiki region.',
    type: 'website',
    url: 'https://saraikistan-ml2d.vercel.app/blog',
    siteName: 'Saraikistan',
  },
  twitter: {
    card: 'summary',
    title: 'Saraiki Stories | History, People & Perspectives',
    description:
      'Explore stories, interviews, history and perspectives about the people, places, traditions and heritage of the Saraiki region.',
  },
}

async function getStories() {
  return client.fetch(
    `*[_type == "story"] | order(publishedAt desc) {
      _id,
      title,
      slug,
      "category": category->{title},
      publishedAt,
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

export default async function Blog() {
  const stories = await getStories()

  const featured = stories[0]
  const remaining = stories.slice(1)

  return (
    <main className="min-h-screen bg-cream text-navy">

      {/* PAGE HEADER */}
      <section>
        <div className="mx-auto max-w-7xl px-6 pb-10 pt-6 sm:px-10 sm:pb-12 sm:pt-8 lg:px-12">

          <p className="font-body text-sm text-shawl">
            Long-form stories
          </p>

          <h1 className="mt-2 font-display text-4xl leading-tight text-navy sm:text-5xl">
            Stories
          </h1>

        </div>
      </section>

      {/* STORIES INTRO */}
      <section className="mx-auto max-w-7xl px-6 pb-12 sm:px-10 sm:pb-16 lg:px-12">

        <div className="border-t border-mustard pt-7">

          <div className="max-w-3xl">

            <p className="font-body text-base leading-7 text-navy/65 sm:text-lg sm:leading-8">
              Stories, interviews, history and perspectives from
              the people, places and traditions of the Saraiki region.
            </p>

          </div>

        </div>

      </section>

      {stories.length === 0 ? (

        /* EMPTY STATE */
        <section className="mx-auto max-w-7xl px-6 pb-20 sm:px-10 lg:px-12">

          <div className="border border-navy/10 bg-cream p-8 sm:p-12">

            <p className="font-body text-sm uppercase tracking-[0.14em] text-mustard">
              Story archive
            </p>

            <h2 className="mt-4 font-display text-3xl sm:text-4xl">
              The archive is just beginning.
            </h2>

            <p className="mt-4 max-w-2xl font-body text-base leading-7 text-navy/60 sm:text-lg">
              No stories have been published yet. Add your first
              story through the Studio and it will appear here.
            </p>

          </div>

        </section>

      ) : (

        <>

          {/* FEATURED STORY */}
          <section className="mx-auto max-w-7xl px-6 pb-16 sm:px-10 sm:pb-20 lg:px-12">

            <Link
              href={`/blog/${featured.slug.current}`}
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

                  {/* LINK */}
                  <span className="mt-8 inline-block font-body text-xs uppercase tracking-[0.14em] text-mustard">
                    Read story →
                  </span>

                </div>

              </div>

            </Link>

          </section>

          {/* MORE STORIES */}
          {remaining.length > 0 && (

            <section className="border-t border-navy/10">

              <div className="mx-auto max-w-7xl px-6 py-16 sm:px-10 sm:py-20 lg:px-12">

                <div className="mb-10">

                  <p className="font-body text-sm text-shawl">
                    Continue exploring
                  </p>

                  <h2 className="mt-2 font-display text-4xl sm:text-5xl">
                    More Stories
                  </h2>

                  <div className="mt-4 h-[2px] w-12 bg-mustard" />

                </div>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

                  {remaining.map((post: any) => {

                    const image = post.coverImage
                      ? urlFor(post.coverImage)
                          .width(900)
                          .height(600)
                          .fit('crop')
                          .url()
                      : null

                    return (
                      <Link
                        key={post._id}
                        href={`/blog/${post.slug.current}`}
                        className="group block overflow-hidden border border-navy/10 bg-cream transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                      >

                        {/* IMAGE */}
                        <div className="aspect-[16/10] overflow-hidden bg-shawl">

                          {image ? (
                            <img
                              src={image}
                              alt={post.title}
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
                          {post.category && (
                            <p className="font-body text-[10px] uppercase tracking-[0.14em] text-shawl">
                              {post.category.title}
                            </p>
                          )}

                          {/* DATE */}
                          {post.publishedAt && (
                            <p className="mt-2 font-body text-[10px] uppercase tracking-[0.12em] text-navy/45">
                              Published · {formatDate(post.publishedAt)}
                            </p>
                          )}

                          {/* TITLE */}
                          <h3 className="mt-3 font-display text-2xl leading-tight transition group-hover:text-shawl">
                            {post.title}
                          </h3>

                          {/* SUMMARY */}
                          {post.summary && (
                            <p className="mt-3 line-clamp-3 font-body text-sm leading-6 text-navy/60">
                              {post.summary}
                            </p>
                          )}

                          {/* LINK */}
                          <span className="mt-6 inline-block font-body text-xs uppercase tracking-[0.12em] text-shawl transition group-hover:text-mustard">
                            Read story →
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
                    The Saraiki archive
                  </p>

                  <h2 className="mt-4 max-w-2xl font-display text-4xl leading-tight sm:text-5xl">
                    Stories worth
                    <br />
                    remembering.
                  </h2>

                </div>

                <div>

                  <p className="max-w-xl font-body text-base leading-7 text-cream/65 sm:text-lg sm:leading-8">
                    Explore the stories, memories, traditions and
                    perspectives that help preserve the cultural
                    heritage of the Saraiki region.
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
