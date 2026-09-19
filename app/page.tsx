import Link from 'next/link'
import { client } from '@/sanity/lib/client'
import { urlFor } from '@/sanity/lib/image'

export const revalidate = 60

async function getHomeData() {
  return client.fetch(`
    {
      "settings": *[_type == "siteSettings"][0]{
        headerImage,
        siteTitle,
        tagline
      },
      "featuredPeople": *[_type == "person" && featured == true][0...4]{
        name,
        slug,
        profileImage,
        category->{title}
      }
    }
  `)
}

export default async function Home() {
  const { settings, featuredPeople } = await getHomeData()

  const heroImage = settings?.headerImage
    ? urlFor(settings.headerImage).width(1800).height(1000).fit('crop').url()
    : null

  return (
    <main className="bg-cream text-navy">

      {/* HERO */}
      <section className="relative min-h-[680px] overflow-hidden bg-navy sm:min-h-[720px]">

        {heroImage && (
          <img
            src={heroImage}
            alt="Saraikistan landscape"
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}

        {/* Image overlay */}
        <div className="absolute inset-0 bg-navy/55" />

        {/* Subtle gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-navy/85 via-navy/50 to-transparent" />

        <div className="relative mx-auto flex min-h-[680px] max-w-7xl items-end px-6 pb-16 pt-32 sm:min-h-[720px] sm:px-10 sm:pb-20 lg:px-12">

          <div className="max-w-3xl text-cream">

            <p className="font-body text-sm uppercase tracking-[0.2em] text-cream/80 sm:text-base">
              The Saraiki belt, told by its own people
            </p>

            <h1 className="mt-5 font-display text-5xl leading-[0.95] tracking-tight sm:text-7xl lg:text-8xl">
              The land, the language,
              <br />
              and the lives of
              <br />
              Saraikistan.
            </h1>

            <p className="mt-7 max-w-2xl font-body text-base leading-7 text-cream/85 sm:text-lg sm:leading-8">
              Biographies of the singers, poets, writers and leaders
              who carry Saraiki culture forward, the history of the
              region they come from, and the traditions that hold it together.
            </p>

            <div className="mt-9 flex flex-col gap-3 font-body text-sm sm:flex-row">

              <Link
                href="/celebrities"
                className="bg-mustard px-7 py-4 text-center text-cream transition hover:bg-mustard/90"
              >
                Meet notable Saraikis
              </Link>

              <Link
                href="/region"
                className="border border-cream/70 px-7 py-4 text-center text-cream transition hover:bg-cream hover:text-navy"
              >
                Explore the region
              </Link>

            </div>

          </div>
        </div>

        {/* Textile accent */}
        <div className="absolute bottom-0 left-0 right-0 h-3 bg-[repeating-linear-gradient(90deg,#C8923A_0px,#C8923A_14px,transparent_14px,transparent_28px)]" />

      </section>


      {/* EXPLORE SARAikistan */}
      <section className="mx-auto max-w-7xl px-6 py-16 sm:px-10 sm:py-20 lg:px-12">

        <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">

          <div>
            <p className="font-body text-sm uppercase tracking-[0.18em] text-shawl">
              Discover
            </p>

            <h2 className="mt-2 font-display text-4xl sm:text-5xl">
              Explore Saraikistan
            </h2>
          </div>

          <p className="max-w-md font-body text-sm leading-6 text-navy/60">
            Explore the people, places, culture and stories that make
            the Saraiki region unique.
          </p>

        </div>


        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

          {[
            {
              href: '/culture',
              title: 'Culture',
              body: 'Traditions, language, food, music and more.',
            },
            {
              href: '/region',
              title: 'Places',
              body: 'Cities, landscapes and historical places.',
            },
            {
              href: '/celebrities',
              title: 'People',
              body: 'Poets, writers, scholars, singers and more.',
            },
            {
              href: '/blog',
              title: 'Stories',
              body: 'Cultural stories, history, interviews and more.',
            },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group border border-navy/10 bg-cream p-7 transition hover:-translate-y-1 hover:shadow-lg"
            >

              <div className="mb-10 flex h-10 w-10 items-center justify-center border border-mustard font-display text-lg text-mustard">
                +
              </div>

              <h3 className="font-display text-2xl">
                {item.title}
              </h3>

              <p className="mt-3 font-body text-sm leading-6 text-navy/65">
                {item.body}
              </p>

              <span className="mt-6 inline-block font-body text-xs uppercase tracking-[0.12em] text-shawl transition group-hover:text-mustard">
                Explore →
              </span>

            </Link>
          ))}

        </div>

      </section>


      {/* FEATURED PEOPLE */}
      {featuredPeople?.length > 0 && (
        <section className="bg-navy text-cream">

          <div className="mx-auto max-w-7xl px-6 py-16 sm:px-10 sm:py-20 lg:px-12">

            <div className="mb-10 flex items-end justify-between gap-4">

              <div>
                <p className="font-body text-sm uppercase tracking-[0.18em] text-mustard">
                  People
                </p>

                <h2 className="mt-2 font-display text-4xl sm:text-5xl">
                  Featured People
                </h2>
              </div>

              <Link
                href="/celebrities"
                className="hidden font-body text-xs uppercase tracking-[0.12em] text-cream/70 transition hover:text-mustard sm:block"
              >
                View all →
              </Link>

            </div>


            <div className="grid grid-cols-2 gap-5 sm:grid-cols-4">

              {featuredPeople.map((person: any) => {

                const image = person.profileImage
                  ? urlFor(person.profileImage)
                      .width(500)
                      .height(600)
                      .fit('crop')
                      .url()
                  : null

                return (
                  <Link
                    key={person.slug?.current || person.name}
                    href={`/celebrities/${person.slug?.current || ''}`}
                    className="group"
                  >

                    <div className="aspect-[4/5] overflow-hidden bg-shawl">

                      {image ? (
                        <img
                          src={image}
                          alt={person.name}
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center font-display text-cream/50">
                          Saraikistan
                        </div>
                      )}

                    </div>

                    <p className="mt-4 font-display text-xl">
                      {person.name}
                    </p>

                    {person.category?.title && (
                      <p className="mt-1 font-body text-xs uppercase tracking-[0.12em] text-cream/55">
                        {person.category.title}
                      </p>
                    )}

                  </Link>
                )
              })}

            </div>

          </div>

          <div className="tile-rule" />

        </section>
      )}


      {/* FEATURED STORY / CULTURAL MESSAGE */}
      <section className="mx-auto max-w-7xl px-6 py-16 sm:px-10 sm:py-24 lg:px-12">

        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">

          <div>

            <p className="font-body text-sm uppercase tracking-[0.18em] text-shawl">
              Our purpose
            </p>

            <h2 className="mt-4 font-display text-4xl leading-tight sm:text-6xl">
              A digital home for
              <br />
              Saraiki culture.
            </h2>

          </div>

          <div>

            <p className="font-body text-lg leading-8 text-navy/65">
              Saraikistan brings together the people, places,
              language, traditions and stories of the Saraiki region
              in one growing cultural archive.
            </p>

            <Link
              href="/about"
              className="mt-7 inline-block border-b border-mustard pb-1 font-body text-sm uppercase tracking-[0.12em] text-navy transition hover:text-mustard"
            >
              Learn about Saraikistan →
            </Link>

          </div>

        </div>

      </section>

    </main>
  )
}
