
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

      "featuredStories": *[_type == "story"] | order(featured desc, publishedAt desc)[0...2]{
        _id,
        title,
        slug,
        summary,
        publishedAt,
        coverImage
      },

      "latestNews": *[_type == "newsPost"] | order(publishedAt desc)[0...2]{
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

/**
 * Responsive Sanity image helper.
 *
 * Generates multiple real image widths from Sanity.
 * The browser selects the appropriate source based on
 * the rendered image size and device pixel ratio.
 *
 * ratio = height / width
 */
function ResponsiveImage({
  source,
  alt,
  ratio,
  sizes,
  widths,
  loading = 'lazy',
  priority = false,
  className,
}: {
  source: any
  alt: string
  ratio: number
  sizes: string
  widths: number[]
  loading?: 'lazy' | 'eager'
  priority?: boolean
  className: string
}) {
  if (!source) return null

  const makeUrl = (width: number) =>
    urlFor(source)
      .width(width)
      .height(Math.round(width * ratio))
      .fit('crop')
      .quality(priority ? 72 : 68)
      .format('webp')
      .url()

  const srcSet = widths
    .map((width) => `${makeUrl(width)} ${width}w`)
    .join(', ')

  const largestWidth = widths[widths.length - 1]

  return (
    <img
      src={makeUrl(largestWidth)}
      srcSet={srcSet}
      sizes={sizes}
      alt={alt}
      width={largestWidth}
      height={Math.round(largestWidth * ratio)}
      loading={loading}
      fetchPriority={priority ? 'high' : 'auto'}
      decoding={priority ? 'sync' : 'async'}
      className={className}
    />
  )
}

export default async function Home() {
  const {
    settings,
    featuredPeople,
    featuredStories,
    latestNews,
    exploreCards,
  } = await getHomeData()

  const singleFeaturedPerson = featuredPeople?.length === 1

  return (
    <main className="bg-cream text-navy">

      {/* HERO */}
      <section className="relative min-h-[680px] overflow-hidden bg-navy sm:min-h-[720px]">

        {settings?.headerImage && (
          <ResponsiveImage
            source={settings.headerImage}
            alt="Saraikistan landscape"
            ratio={1000 / 1800}
            widths={[480, 800, 1200, 1600, 1800]}
            sizes="100vw"
            loading="eager"
            priority
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

                  {card.image ? (
                    <ResponsiveImage
                      source={card.image}
                      alt={card.title}
                      ratio={5 / 4}
                      widths={[320, 480, 640, 900]}
                      sizes="(min-width: 1280px) 288px, (min-width: 1024px) 22vw, (min-width: 640px) 45vw, calc(50vw - 27px)"
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

              {featuredPeople.map((person: any) => (

                <Link
                  key={person.slug?.current || person.name}
                  href={`/celebrities/${person.slug?.current || ''}`}
                  className={
                    singleFeaturedPerson
                      ? 'group flex w-full flex-col overflow-hidden rounded-[2px] bg-navy sm:relative sm:block sm:aspect-[3/2] lg:max-w-5xl'
                      : 'group flex flex-col overflow-hidden rounded-[2px] bg-navy sm:relative sm:block sm:aspect-[4/5]'
                  }
                >

                  {/* PORTRAIT */}
                  <div
                    className={
                      singleFeaturedPerson
                        ? 'relative aspect-[4/3] w-full shrink-0 overflow-hidden bg-shawl sm:absolute sm:inset-0 sm:aspect-auto'
                        : 'relative aspect-[4/3] w-full shrink-0 overflow-hidden bg-shawl sm:absolute sm:inset-0 sm:aspect-auto'
                    }
                  >

                    {person.profileImage ? (
                      <ResponsiveImage
                        source={person.profileImage}
                        alt={person.name}
                        ratio={5 / 4}
                        widths={[320, 480, 640, 900, 1400]}
                        sizes={
                          singleFeaturedPerson
                            ? '(min-width: 1024px) 1024px, 100vw'
                            : '(min-width: 1280px) 288px, (min-width: 1024px) 22vw, (min-width: 640px) 45vw, calc(50vw - 27px)'
                        }
                        className={
                          singleFeaturedPerson
                            ? 'absolute inset-0 h-full w-full object-cover object-[center_22%] transition duration-700 ease-out group-hover:scale-105 sm:object-cover'
                            : 'absolute inset-0 h-full w-full object-cover transition duration-700 ease-out group-hover:scale-105'
                        }
                      />
                    ) : (
                      <div className="absolute inset-0 bg-shawl" />
                    )}

                    {/* Desktop-only image gradient.
                        Mobile uses a solid text panel instead. */}
                    <div className="absolute inset-0 hidden bg-gradient-to-b from-navy/5 via-navy/15 to-navy/95 sm:block" />

                  </div>

                  {/* TEXT PANEL */}
                  <div
                    className={
                      singleFeaturedPerson
                        ? 'relative border-t-2 border-mustard bg-navy p-5 sm:absolute sm:inset-x-0 sm:bottom-0 sm:border-t-0 sm:bg-transparent sm:p-7 lg:p-9'
                        : 'relative border-t-2 border-mustard bg-navy p-4 sm:absolute sm:inset-x-0 sm:bottom-0 sm:border-t-0 sm:bg-transparent sm:p-5 lg:p-6'
                    }
                  >

                    {person.category?.title && (
                      <p className="mb-2 font-body text-[10px] uppercase tracking-[0.16em] text-mustard sm:text-[10px]">
                        {person.category.title}
                      </p>
                    )}

                    <h3
                      className={
                        singleFeaturedPerson
                          ? 'font-display text-2xl leading-tight text-cream sm:text-4xl sm:leading-[1.05] lg:text-5xl'
                          : 'font-display text-xl leading-tight text-cream sm:text-3xl sm:leading-[1.05]'
                      }
                    >
                      {person.name}
                    </h3>

                    <span className="mt-4 inline-block font-body text-[10px] uppercase tracking-[0.14em] text-cream/75 transition group-hover:text-mustard group-hover:tracking-[0.18em] sm:text-xs sm:text-cream/65">
                      View profile →
                    </span>

                  </div>

                </Link>

              ))}

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

          <div className="grid gap-6 lg:grid-cols-2">

            {featuredStories.map((story: any) => (

              <Link
                key={story._id}
                href={`/blog/${story.slug.current}`}
                className="group block overflow-hidden border border-navy/10 bg-cream transition duration-300 hover:-translate-y-1 hover:shadow-xl"
              >

                <div className="aspect-[16/10] overflow-hidden bg-shawl">

                  {story.coverImage ? (
                    <ResponsiveImage
                      source={story.coverImage}
                      alt={story.title}
                      ratio={10 / 16}
                      widths={[320, 480, 640, 800, 1000]}
                      sizes="(min-width: 1280px) 576px, (min-width: 1024px) 45vw, calc(100vw - 48px)"
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

            ))}

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

            <div className="grid gap-6 lg:grid-cols-2">

              {latestNews.map((item: any) => (

                <Link
                  key={item._id}
                  href={`/news/${item.slug.current}`}
                  className="group block overflow-hidden border border-navy/10 bg-cream transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                >

                  <div className="aspect-[16/10] overflow-hidden bg-shawl">

                    {item.coverImage ? (
                      <ResponsiveImage
                        source={item.coverImage}
                        alt={item.title}
                        ratio={10 / 16}
                        widths={[320, 480, 640, 800, 1000]}
                        sizes="(min-width: 1280px) 576px, (min-width: 1024px) 45vw, calc(100vw - 48px)"
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

              ))}

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

    </main>
  )
}
