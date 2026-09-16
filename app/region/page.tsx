import Link from 'next/link'
import { client } from '@/sanity/lib/client'
import { urlFor } from '@/sanity/lib/image'

export const revalidate = 60

async function getPlaces() {
  return client.fetch(
    `*[_type == "place"] | order(title asc) {
      _id,
      title,
      slug,
      "category": category->{title},
      coverImage
    }`
  )
}

export default async function Region() {
  const places = await getPlaces()

  return (
    <section className="mx-auto max-w-5xl px-6 py-16">
      <p className="font-body text-sm text-shawl">Where Saraiki culture comes from</p>
      <h1 className="mt-2 font-display text-3xl text-navy sm:text-4xl">Places</h1>

      {places.length === 0 ? (
        <p className="mt-12 font-body text-navy/50">
          No places added yet. Add your first entry in the Studio.
        </p>
      ) : (
        <div className="mt-12 grid gap-8 sm:grid-cols-2">
          {places.map((place: any) => (
            <Link
              key={place._id}
              href={`/region/${place.slug.current}`}
              className="block border-t-2 border-mustard pt-4"
            >
              {place.coverImage && (
                <img
                  src={urlFor(place.coverImage).width(600).height(300).url()}
                  alt={place.title}
                  className="mb-3 h-40 w-full object-cover"
                />
              )}
              {place.category && (
                <p className="font-body text-xs uppercase tracking-wide text-royal">
                  {place.category.title}
                </p>
              )}
              <h2 className="mt-1 font-display text-xl text-navy">{place.title}</h2>
            </Link>
          ))}
        </div>
      )}
    </section>
  )
}
