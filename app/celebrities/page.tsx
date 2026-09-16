import Link from 'next/link'
import { client } from '@/sanity/lib/client'
import { urlFor } from '@/sanity/lib/image'

export const revalidate = 60

async function getPeople() {
  return client.fetch(
    `*[_type == "person"] | order(name asc) {
      _id,
      name,
      slug,
      "category": category->{title},
      profileImage
    }`
  )
}

export default async function Celebrities() {
  const people = await getPeople()

  return (
    <section className="mx-auto max-w-5xl px-6 py-16">
      <p className="font-body text-sm text-shawl">Notable Saraikis</p>
      <h1 className="mt-2 font-display text-3xl text-navy sm:text-4xl">People</h1>
      <p className="mt-4 max-w-2xl font-body text-navy/70">
        Singers, poets, writers, and leaders who represent Saraiki culture.
      </p>

      {people.length === 0 ? (
        <p className="mt-12 font-body text-navy/50">
          No people added yet. Add your first entry in the Studio.
        </p>
      ) : (
        <div className="mt-12 grid gap-8 sm:grid-cols-2">
          {people.map((person: any) => (
            <Link
              key={person._id}
              href={`/celebrities/${person.slug.current}`}
              className="flex items-start gap-4 border-t-2 border-mustard pt-4"
            >
              {person.profileImage && (
                <img
                  src={urlFor(person.profileImage).width(96).height(96).url()}
                  alt={person.name}
                  className="h-16 w-16 rounded-full object-cover"
                />
              )}
              <div>
                {person.category && (
                  <p className="font-body text-xs uppercase tracking-wide text-royal">
                    {person.category.title}
                  </p>
                )}
                <h2 className="mt-1 font-display text-xl text-navy">{person.name}</h2>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  )
}
