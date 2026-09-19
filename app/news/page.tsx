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
      summary,
      coverImage
    }`
  )
}

export default async function News() {
  const news = await getNews()

  return (
    <section className="min-h-screen bg-cream text-navy">

      {/* Page Header */}
      <div className="mx-auto max-w-7xl px-6 pb-10 pt-6 sm:px-10 sm:pb-12 sm:pt-8 lg:px-12">

        <p className="font-body text-sm text-shawl">
          What's happening
        </p>

        <h1 className="mt-2 font-display text-4xl leading-tight text-navy sm:text-5xl">
          News
        </h1>

      </div>

      {/* News Content */}
      <div className="mx-auto max-w-7xl px-6 pb-20 sm:px-10 lg:px-12">

        {news.length === 0 ? (

          <div className="border-t border-mustard pt-7">

            <p className="max-w-3xl font-body text-base leading-7 text-navy/55 sm:text-lg">
              No news added yet. Add your first entry in the Studio.
            </p>

          </div>

        ) : (

          <div className="border-t border-mustard">

            {news.map((item: any) => (

              <Link
                key={item._id}
                href={`/news/${item.slug.current}`}
                className="group flex gap-5 border-b border-navy/10 py-7 transition hover:bg-navy/[0.02]"
              >

                {item.coverImage && (
                  <div className="h-24 w-32 shrink-0 overflow-hidden bg-shawl sm:h-28 sm:w-44">

                    <img
                      src={urlFor(item.coverImage)
                        .width(600)
                        .height(400)
                        .fit('crop')
                        .url()}
                      alt={item.title}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />

                  </div>
                )}

                <div className="min-w-0">

                  {item.publishedAt && (
                    <p className="font-body text-xs uppercase tracking-[0.12em] text-shawl">
                      {new Date(item.publishedAt).toLocaleDateString()}
                    </p>
                  )}

                  {item.category && (
                    <p className="mt-1 font-body text-xs uppercase tracking-[0.12em] text-shawl">
                      {item.category.title}
                    </p>
                  )}

                  <h2 className="mt-2 font-display text-xl text-navy transition group-hover:text-shawl sm:text-2xl">
                    {item.title}
                  </h2>

                  {item.summary && (
                    <p className="mt-2 line-clamp-2 font-body text-sm leading-6 text-navy/65">
                      {item.summary}
                    </p>
                  )}

                </div>

              </Link>

            ))}

          </div>

        )}

      </div>

    </section>
  )
}
