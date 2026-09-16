import Link from 'next/link'
import { client } from '@/sanity/lib/client'
import { urlFor } from '@/sanity/lib/image'

export const revalidate = 60

async function getCulture() {
  return client.fetch(
    `*[_type == "culture"] | order(title asc) {
      _id,
      title,
      slug,
      "category": category->{title},
      coverImage
    }`
  )
}

export default async function Culture() {
  const items = await getCulture()

  return (
    <section className="mx-auto max-w-5xl px-6 py-16">
      <p className="font-body text-sm text-shawl">Traditions that hold it together</p>
      <h1 className="mt-2 font-display text-3xl text-navy sm:text-4xl">Culture</h1>

      {items.length === 0 ? (
        <p className="mt-12 font-body text-navy/50">
          No culture entries added yet. Add your first entry in the Studio.
        </p>
      ) : (
        <div className="mt-12 grid gap-8 sm:grid-cols-2">
          {items.map((item: any) => (
            <Link
              key={item._id}
              href={`/culture/${item.slug.current}`}
              className="block border-t-2 border-mustard pt-4"
            >
              {item.coverImage && (
                <img
                  src={urlFor(item.coverImage).width(600).height(300).url()}
                  alt={item.title}
                  className="mb-3 h-40 w-full object-cover"
                />
              )}
              {item.category && (
                <p className="font-body text-xs uppercase tracking-wide text-royal">
                  {item.category.title}
                </p>
              )}
              <h2 className="mt-1 font-display text-xl text-navy">{item.title}</h2>
            </Link>
          ))}
        </div>
      )}
    </section>
  )
}
