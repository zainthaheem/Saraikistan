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
    <section className="min-h-screen bg-cream text-navy">

      {/* Page Header */}
      <div className="mx-auto max-w-7xl px-6 pb-10 pt-6 sm:px-10 sm:pb-12 sm:pt-8 lg:px-12">

        <p className="font-body text-sm text-shawl">
          Traditions that hold it together
        </p>

        <h1 className="mt-2 font-display text-4xl leading-tight text-navy sm:text-5xl">
          Culture
        </h1>

      </div>

      {/* Culture Content */}
      <div className="mx-auto max-w-7xl px-6 pb-20 sm:px-10 lg:px-12">

        {items.length === 0 ? (

          <div className="border-t border-mustard pt-7">

            <p className="max-w-3xl font-body text-base leading-7 text-navy/55 sm:text-lg">
              No culture entries added yet. Add your first entry in the Studio.
            </p>

          </div>

        ) : (

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">

            {items.map((item: any) => (

              <Link
                key={item._id}
                href={`/culture/${item.slug.current}`}
                className="group block overflow-hidden border border-navy/10 bg-cream transition duration-300 hover:-translate-y-1 hover:shadow-xl"
              >

                {item.coverImage && (
                  <div className="aspect-[16/9] overflow-hidden bg-shawl">

                    <img
                      src={urlFor(item.coverImage)
                        .width(900)
                        .height(506)
                        .fit('crop')
                        .url()}
                      alt={item.title}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />

                  </div>
                )}

                <div className="border-t-2 border-mustard p-6">

                  {item.category && (
                    <p className="font-body text-xs uppercase tracking-[0.14em] text-shawl">
                      {item.category.title}
                    </p>
                  )}

                  <h2 className="mt-2 font-display text-2xl text-navy">
                    {item.title}
                  </h2>

                  <span className="mt-5 inline-block font-body text-xs uppercase tracking-[0.12em] text-shawl transition group-hover:text-mustard">
                    Explore →
                  </span>

                </div>

              </Link>

            ))}

          </div>

        )}

      </div>

    </section>
  )
}
