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
      },

      "featuredStories": *[_type == "story"] | order(featured desc, publishedAt desc)[0...3]{
        _id,
        title,
        slug,
        summary,
        publishedAt,
        coverImage
      },

      "latestNews": *[_type == "newsPost"] | order(publishedAt desc)[0...3]{
        _id,
        title,
        slug,
        "category": category->{title},
        publishedAt,
        author,
        summary,
        coverImage
      },

      "exploreCards": *[
        _type == "exploreCard" &&
        enabled == true
      ] | order(order asc){
        _id,
        title,
        description,
        image,
        link,
        order,
        enabled
      }
    }
  `)
}

const defaultDescriptions: Record<string, string> = {
  Culture: 'Traditions, language, food, music and more.',
  Places: 'Cities, landscapes and historical places.',
  People: 'Poets, writers, scholars, singers and more.',
  Stories: 'Cultural stories, history, interviews and more.',
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export default async function Home() {
  const {
    settings,
    featuredPeople,
    featuredStories,
    latestNews,
    exploreCards,
  } = await getHomeData()

  const heroImage = settings?.headerImage
    ? urlFor(settings.headerImage)
        .width(1800)
        .height(1000)
        .fit('crop')
        .url()
    : null

  const singleFeaturedPerson = featuredPeople?.length === 1

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

        <div className="absolute inset-0 bg-navy/55" />

        <div className="absolute inset-0 bg-gradient-to-r from-navy/85 via-navy/50 to-transparent" />

        <div className="relative mx-auto flex min-h-[680px] max-w-7xl items-end px-6 pb-16 pt-32 sm:min-h-[720px] sm:px-10 sm:pb-20 lg:px-12">

          <div className="max-w-3xl text-cream">

            <p className="font-body text-sm text-cream/80 sm:text-base">
              A digital home for the Saraiki region
            </p>

            <h1 className="mt-5 font-display text-5xl leading-[0.95] tracking-tight sm:text-7xl lg:text-8xl">
              The land, the language,
              <br />
              and the lives of
              <br />
              Saraikistan.
            </h1>

            <p className="mt-7 max-w-2xl font-body text-base leading-7 text-cream/85 sm:text-lg sm:leading-8">
              Discover the people, places, culture, language, heritage and
              stories that shape the Saraiki region.
            </p>

            <div className="mt-9 flex flex-col gap-3 font-body text-sm sm:flex-row">

              <Link
                href="/culture"
                className="bg-mustard px-7 py-4 text-center text-cream transition hover:bg-mustard/90"
              >
                Explore the culture
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

        <div className="absolute bottom-0 left-0 right-0 h-3 bg-[repeating-linear-gradient(90deg,#C8923A_0px,#C8923A_14px,transparent_14px,transparent_28px)]" />

      </section>


      {/* EXPLORE SARAIKISTAN */}
      <section className="mx-auto max-w-7xl px-6 py-16 sm:px-10 sm:py-20 lg:px-12">

        <div className="mb-9 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">

          <div>

            <p className="font-body text-sm text-shawl">
              Discover
            </p>

            <h2 className="mt-2 font-display text-4xl leading-tight sm:text-5xl">
              Explore Saraikistan
            </h2>

            <div className="mt-4 h-[2px] w-12 bg-mustard" />

          </div>

          <p className="max-w-md font-body text-sm leading-6 text-navy/60">
            Explore the people, places, culture and stories that make the
            Saraiki region unique.
          </p>

        </div>

        {exploreCards?.length > 0 ? (

          <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">

            {exploreCards.map((card: any) => {

              const image = card.image
                ? urlFor(card.image)
                    .width(900)
                    .height(1100)
                    .fit('crop')
                    .url()
                : null

              const description =
                card.description ||
                defaultDescriptions[card.title] ||
                'Discover more about Saraikistan.'

              return (
                <Link
                  key={card._id}
                  href={card.link || '#'}
                  className="group relative block aspect-[4/5] overflow-hidden rounded-[2px] bg-navy"
                >

                  {image ? (
                    <img
                      src={image}
                      alt={card.title}
                      className="absolute inset-0 h-full w-full object-cover transition duration-700 ease-out group-hover:scale-105"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-shawl" />
                  )}

                  <div className="absolute inset-0 bg-gradient-to-b from-navy/10 via-navy/10 to-navy/95" />

                  <div className="absolute left-3 top-3 flex h-7 w-7 items-center justify-center border border-mustard/90 bg-navy/25 font-body text-sm font-light leading-none text-mustard backdrop-blur-[2px] transition duration-300 group-hover:bg-mustard group-hover:text-cream sm:left-4 sm:top-4 sm:h-8 sm:w-8 sm:text-base">
                    +
                  </div>

                  <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5 lg:p-6">

                    <h3 className="font-display text-2xl leading-none text-cream sm:text-3xl">
                      {card.title}
                    </h3>

                    <p className="mt-2 max-w-[95%] font-body text-xs leading-5 text-cream/80 sm:mt-3 sm:text-sm sm:leading-6">
                      {description}
                    </p>

                    <span className="mt-4 inline-block font-body text-[10px] uppercase tracking-[0.14em] text-mustard transition group-hover:tracking-[0.18em] sm:mt-5 sm:text-xs">
                      Explore →
                    </span>

                  </div>

                </Link>
              )
            })}

          </div>

        ) : (

          <div className="border-t border-mustard pt-7">
            <p className="max-w-3xl font-body text-base leading-7 text-navy/55 sm:text-lg">
              Add Explore Cards from the Studio to display them here.
            </p>
          </div>

        )}

      </section>


      {/* FEATURED PEOPLE */}
      {featuredPeople?.length > 0 && (
        <section className="bg-navy text-cream">

          <div className="mx-auto max-w-7xl px-6 py-16 sm:px-10 sm:py-20 lg:px-12">

            <div className="mb-9 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">

              <div>

                <p className="font-body text-sm text-mustard">
                  People
                </p>

                <h2 className="mt-2 font-display text-4xl leading-tight sm:text-5xl">
                  Featured People
                </h2>

                <div className="mt-4 h-[2px] w-12 bg-mustard" />

              </div>

              <Link
                href="/celebrities"
                className="font-body text-xs uppercase tracking-[0.12em] text-cream/65 transition hover:text-mustard"
              >
                View all →
              </Link>

            </div>


            <div
              className={
                singleFeaturedPerson
                  ? 'grid grid-cols-1'
                  : 'grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4'
              }
            >

              {featuredPeople.map((person: any) => {

                const image = person.profileImage
                  ? urlFor(person.profileImage)
                      .width(1400)
                      .height(1000)
                      .fit('crop')
                      .url()
                  : null

                return (
                  <Link
                    key={person.slug?.current || person.name}
                    href={`/celebrities/${person.slug?.current || ''}`}
                    className={
                      singleFeaturedPerson
                        ? 'group relative block aspect-[4/3] w-full overflow-hidden rounded-[2px] bg-shawl sm:aspect-[3/2] lg:max-w-5xl'
                        : 'group relative block aspect-[4/5] overflow-hidden rounded-[2px] bg-shawl'
                    }
                  >

                    {image ? (
                      <img
                        src={image}
                        alt={person.name}
                        className={
                          singleFeaturedPerson
                            ? 'absolute inset-0 h-full w-full object-cover object-[center_22%] transition duration-700 ease-out group-hover:scale-105'
                            : 'absolute inset-0 h-full w-full object-cover transition duration-700 ease-out group-hover:scale-105'
                        }
                      />
                    ) : (
                      <div className="absolute inset-0 bg-shawl" />
                    )}

                    <div className="absolute inset-0 bg-gradient-to-b from-navy/5 via-navy/15 to-navy/95" />

                    <div className="absolute left-3 top-3 flex h-7 w-7 items-center justify-center border border-mustard/90 bg-navy/25 font-body text-sm font-light leading-none text-mustard backdrop-blur-[2px] transition duration-300 group-hover:bg-mustard group-hover:text-cream sm:left-4 sm:top-4 sm:h-8 sm:w-8 sm:text-base">
                      +
                    </div>

                    <div
                      className={
                        singleFeaturedPerson
                          ? 'absolute inset-x-0 bottom-0 p-5 sm:p-7 lg:p-9'
                          : 'absolute inset-x-0 bottom-0 p-4 sm:p-5 lg:p-6'
                      }
                    >

                      {person.category?.title && (
                        <p className="mb-2 font-body text-[9px] uppercase tracking-[0.16em] text-mustard sm:text-[10px]">
                          {person.category.title}
                        </p>
                      )}

                      <h3
                        className={
                          singleFeaturedPerson
                            ? 'font-display text-3xl leading-[1.05] text-cream sm:text-4xl lg:text-5xl'
                            : 'font-display text-2xl leading-[1.05] text-cream sm:text-3xl'
                        }
                      >
                        {person.name}
                      </h3>

                      <span className="mt-4 inline-block font-body text-[10px] uppercase tracking-[0.14em] text-cream/65 transition group-hover:text-mustard group-hover:tracking-[0.18em] sm:text-xs">
                        View profile →
                      </span>

                    </div>

                  </Link>
                )
              })}

            </div>

          </div>

          <div className="tile-rule" />

        </section>
      )}


      {/* STORIES */}
      {featuredStories?.length > 0 && (
        <section className="mx-auto max-w-7xl px-6 py-16 sm:px-10 sm:py-20 lg:px-12">

          <div className="mb-9 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">

            <div>

              <p className="font-body text-sm text-shawl">
                Long-form
              </p>

              <h2 className="mt-2 font-display text-4xl leading-tight sm:text-5xl">
                Stories
              </h2>

              <div className="mt-4 h-[2px] w-12 bg-mustard" />

            </div>

            <Link
              href="/blog"
              className="font-body text-xs uppercase tracking-[0.12em] text-navy/55 transition hover:text-mustard"
            >
              View all →
            </Link>

          </div>


          <div className="grid gap-6 lg:grid-cols-3">

            {featuredStories.map((story: any) => {

              const image = story.coverImage
                ? urlFor(story.coverImage)
                    .width(900)
                    .height(600)
                    .fit('crop')
                    .url()
                : null

              return (
                <Link
                  key={story._id}
                  href={`/blog/${story.slug.current}`}
                  className="group block overflow-hidden border border-navy/10 bg-cream transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                >

                  <div className="aspect-[16/10] overflow-hidden bg-shawl">

                    {image ? (
                      <img
                        src={image}
                        alt={story.title}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center font-display text-cream/40">
                        Saraikistan
                      </div>
                    )}

                  </div>

                  <div className="border-t-2 border-mustard p-6">

                    {story.publishedAt && (
                      <p className="font-body text-[10px] uppercase tracking-[0.12em] text-navy/45">
                        {formatDate(story.publishedAt)}
                      </p>
                    )}

                    <h3 className="mt-3 font-display text-2xl leading-tight transition group-hover:text-shawl">
                      {story.title}
                    </h3>

                    {story.summary && (
                      <p className="mt-3 line-clamp-3 font-body text-sm leading-6 text-navy/60">
                        {story.summary}
                      </p>
                    )}

                    <span className="mt-6 inline-block font-body text-xs uppercase tracking-[0.12em] text-shawl transition group-hover:text-mustard">
                      Read story →
                    </span>

                  </div>

                </Link>
              )
            })}

          </div>

        </section>
      )}


      {/* LATEST NEWS */}
      {latestNews?.length > 0 && (
        <section className="border-t border-navy/10">

          <div className="mx-auto max-w-7xl px-6 py-16 sm:px-10 sm:py-20 lg:px-12">

            <div className="mb-9 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">

              <div>

                <p className="font-body text-sm text-shawl">
                  Latest updates
                </p>

                <h2 className="mt-2 font-display text-4xl leading-tight sm:text-5xl">
                  News
                </h2>

                <div className="mt-4 h-[2px] w-12 bg-mustard" />

              </div>

              <Link
                href="/news"
                className="font-body text-xs uppercase tracking-[0.12em] text-navy/55 transition hover:text-mustard"
              >
                View all →
              </Link>

            </div>


            <div className="grid gap-6 lg:grid-cols-3">

              {latestNews.map((item: any) => {

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

                    <div className="border-t-2 border-mustard p-6">

                      {item.category?.title && (
                        <p className="font-body text-[10px] uppercase tracking-[0.14em] text-shawl">
                          {item.category.title}
                        </p>
                      )}

                      {item.publishedAt && (
                        <p className="mt-2 font-body text-[10px] uppercase tracking-[0.12em] text-navy/45">
                          {formatDate(item.publishedAt)}
                        </p>
                      )}

                      <h3 className="mt-3 font-display text-2xl leading-tight transition group-hover:text-shawl">
                        {item.title}
                      </h3>

                      {item.summary && (
                        <p className="mt-3 line-clamp-3 font-body text-sm leading-6 text-navy/60">
                          {item.summary}
                        </p>
                      )}

                      {item.author && (
                        <p className="mt-4 font-body text-xs text-navy/45">
                          By {item.author}
                        </p>
                      )}

                      <span className="mt-6 inline-block font-body text-xs uppercase tracking-[0.12em] text-shawl transition group-hover:text-mustard">
                        Read news →
                      </span>

                    </div>

                  </Link>
                )
              })}

            </div>

          </div>

        </section>
      )}


      {/* PURPOSE */}
      <section className="mx-auto max-w-7xl px-6 py-16 sm:px-10 sm:py-24 lg:px-12">

        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">

          <div>

            <p className="font-body text-sm text-shawl">
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
              Saraikistan brings together the people, places, language,
              traditions and stories of the Saraiki region in one growing
              cultural archive.
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


      {/* CLOSING BANNER */}
      <section className="bg-navy text-cream">

        <div className="mx-auto max-w-7xl px-6 py-16 sm:px-10 sm:py-20 lg:px-12">

          <div className="grid gap-8 lg:grid-cols-2 lg:items-end">

            <div>

              <p className="font-body text-sm text-mustard">
                Saraikistan
              </p>

              <h2 className="mt-4 max-w-2xl font-display text-4xl leading-tight sm:text-5xl">
                People. Culture.
                <br />
                Heritage. Beyond.
              </h2>

            </div>

            <div>

              <p className="max-w-xl font-body text-base leading-7 text-cream/65 sm:text-lg sm:leading-8">
                Explore the people, places, traditions, stories and
                contemporary life of the Saraiki region.
              </p>

              <Link
                href="/about"
                className="mt-7 inline-block border border-cream/50 px-6 py-3 font-body text-xs uppercase tracking-[0.12em] text-cream transition hover:border-mustard hover:bg-mustard hover:text-navy"
              >
                About Saraikistan →
              </Link>

            </div>

          </div>

        </div>

        <div className="tile-rule" />

      </section>

    </main>
  )
}
