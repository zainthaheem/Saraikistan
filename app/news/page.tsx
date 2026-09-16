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
    <section className="mx-auto max-w-5xl px-6 py-16">
      <p className="font-body text-sm text-shawl">What's happening</p>
      <h1 className="mt-2 font-display text-3xl text-navy sm:text-4xl">News</h1>

      {news.length === 0 ? (
        <p className="mt-12 font-body text-navy/50">
          No news added yet. Add your first entry in the Studio.
        </p>
      ) : (
        <div className="mt-12 divide-y divide-navy/10">
          {news.map((item: any) => (
            <Link
              key={item._id}
              href={`/news/${item.slug.current}`}
              className="flex gap-4 py-6"
            >
              {item.coverImage && (
                <img
                  src={urlFor(item.coverImage).width(160).height(120).url()}
                  alt={item.title}
                  className="h-20 w-28 flex-shrink-0 object-cover"
                />
              )}
              <div>
                {item.publishedAt && (
                  <p className="font-body text-xs text-navy/50">
                    {new Date(item.publishedAt).toLocaleDateString()}
                  </p>
                )}
                <h2 className="mt-1 font-display text-lg text-navy">{item.title}</h2>
                {item.summary && (
                  <p className="mt-2 font-body text-sm text-navy/70">{item.summary}</p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  )
}
