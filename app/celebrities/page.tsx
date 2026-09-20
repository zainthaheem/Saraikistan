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

  // Group people by category
  const groupedPeople = people.reduce((groups: any, person: any) => {
    const category = person.category?.title || 'Other'

    if (!groups[category]) {
      groups[category] = []
    }

    groups[category].push(person)

    return groups
  }, {})

  // Keep category sections in a deliberate editorial order
  const categoryOrder = [
    'Singers',
    'Poets',
    'Writers',
    'Scholars',
    'Leaders',
  ]

  const orderedCategories = [
    ...categoryOrder.filter((category) => groupedPeople[category]),
    ...Object.keys(groupedPeople)
      .filter((category) => !categoryOrder.includes(category))
      .sort(),
  ]

  return (
    <section className="min-h-screen bg-cream text-navy">

      {/* PAGE HEADER */}
      <div className="mx-auto max-w-7xl px-6 pb-10 pt-6 sm:px-10 sm:pb-12 sm:pt-8 lg:px-12">

        <p className="font-body text-sm text-shawl">
          Notable Saraikis
        </p>

        <h1 className="mt-2 font-display text-4xl leading-tight text-navy sm:text-5xl">
          People
        </h1>

        <p className="mt-5 max-w-3xl font-body text-base leading-7 text-navy/65 sm:text-lg sm:leading-8">
          Singers, poets, writers, scholars, and other notable people who
          represent Saraiki culture and its living heritage.
        </p>

      </div>


      {/* PEOPLE CONTENT */}
      <div className="mx-auto max-w-7xl px-6 pb-20 sm:px-10 lg:px-12">

        {people.length === 0 ? (

          <div className="border-t border-mustard pt-7">

            <p className="max-w-3xl font-body text-base leading-7 text-navy/55 sm:text-lg">
              No people added yet. Add your first entry in the Studio.
            </p>

          </div>

        ) : (

          <div className="space-y-16 border-t border-mustard pt-10">

            {orderedCategories.map((category) => (

              <section key={category}>

                {/* CATEGORY HEADING */}
                <div className="mb-6 border-b border-navy/10 pb-4">

                  <p className="font-body text-xs uppercase tracking-[0.16em] text-shawl">
                    Category
                  </p>

                  <h2 className="mt-1 font-display text-3xl text-navy sm:text-4xl">
                    {category}
                  </h2>

                </div>


                {/* PEOPLE IN CATEGORY */}
                <div className="grid gap-0 sm:grid-cols-2 sm:gap-x-10">

                  {groupedPeople[category].map((person: any) => (

                    <Link
                      key={person._id}
                      href={`/celebrities/${person.slug.current}`}
                      className="group flex items-center gap-6 border-b border-navy/10 py-8 transition duration-300 hover:bg-navy/[0.02]"
                    >

                      {/* PROFILE IMAGE */}
                      <div className="h-24 w-24 shrink-0 overflow-hidden rounded-full bg-shawl sm:h-28 sm:w-28">

                        {person.profileImage ? (

                          <img
                            src={urlFor(person.profileImage)
                              .width(220)
                              .height(220)
                              .fit('crop')
                              .url()}
                            alt={person.name}
                            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                          />

                        ) : (

                          <div className="flex h-full w-full items-center justify-center font-display text-sm text-cream/50">
                            Saraikistan
                          </div>

                        )}

                      </div>


                      {/* PERSON INFORMATION */}
                      <div className="min-w-0">

                        <h3 className="font-display text-2xl leading-tight text-navy transition group-hover:text-shawl sm:text-3xl">
                          {person.name}
                        </h3>

                        <span className="mt-4 inline-block font-body text-xs uppercase tracking-[0.12em] text-shawl transition group-hover:text-mustard">
                          View profile →
                        </span>

                      </div>

                    </Link>

                  ))}

                </div>

              </section>

            ))}

          </div>

        )}

      </div>

    </section>
  )
}
