
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
  const twoFeaturedPeople = featuredPeople?.length === 2

  return (
    <main className="bg-cream text-navy">

      {/* HERO */}
      <section className="relative min-h-[500px] overflow-hidden bg-navy sm:min-h-[510px] lg:min-h-[540px]">

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

        <div className="relative mx-auto flex min-h-[500px] max-w-7xl items-start px-5 pb-8 pt-24 sm:min-h-[510px] sm:items-center sm:px-10 sm:py-14 lg:min-h-[540px] lg:px-12">

          <div className="max-w-3xl text-cream">

            <p className="mt-3 font-body text-[11px] leading-5 text-cream/80 sm:mt-8 sm:text-sm sm:leading-6 lg:mt-10">
              A digital home for the Saraiki region
            </p>

            <h1 className="mt-3 font-display text-3xl leading-[1.02] tracking-tight sm:mt-4 sm:text-5xl sm:leading-[0.98] md:text-6xl lg:text-7xl">
              The land, the language,
              <br />
              and the lives of
              <br />
              Saraikistan.
            </h1>

            <p className="mt-4 max-w-xl font-body text-[13px] leading-5 text-cream/85 sm:mt-5 sm:text-base sm:leading-7">
              Discover the people, places, culture, language, heritage and
              stories that shape the Saraiki region.
            </p>

            <div className="mt-5 flex flex-col gap-2.5 font-body text-xs sm:mt-6 sm:flex-row sm:gap-3 sm:text-sm">

              <Link
                href="/culture"
                className="bg-mustard px-6 py-3 text-center text-cream transition hover:bg-mustard/90"
              >
                Explore the culture
              </Link>

              <Link
                href="/region"
                className="border border-cream/70 px-6 py-3 text-center text-cream transition hover:bg-cream hover:text-navy"
              >
                Explore the region
              </Link>

            </div>

          </div>

        </div>

        <div className="absolute bottom-0 left-0 right-0 h-2 bg-[repeating-linear-gradient(90deg,#C8923A_0px,#C8923A_14px,transparent_14px,transparent_28px)]" />

      </section>

      {/* EXPLORE SARAIKISTAN */}
      <section className="mx-auto max-w-7xl px-5 py-8 sm:px-10 sm:py-12 lg:px-12">

        <div className="mb-5 flex flex-col justify-between gap-3 sm:mb-6 sm:flex-row sm:items-end">

          <div>
            <p className="font-body text-xs text-shawl sm:text-sm">
              Discover
            </p>

            <h2 className="mt-1.5 font-display text-2xl leading-tight sm:text-4xl">
              Explore Saraikistan
            </h2>

            <div className="mt-3 h-[2px] w-12 bg-mustard" />
          </div>

          <p className="max-w-md font-body text-xs leading-5 text-navy/60 sm:text-sm sm:leading-6">
            Explore the people, places, culture and stories that make the
            Saraiki region unique.
          </p>

        </div>

        {exploreCards?.length > 0 ? (

          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">

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

                  <div className="absolute left-3 top-3 flex h-7 w-7 items-center justify-center border border-mustard/90 bg-navy/25 font-body text-sm font-light leading-none text-mustard backdrop-blur-[2px] transition duration-300 group-hover:bg-mustard group-hover:text-cream sm:left-4 sm:top-4">
                    +
                  </div>

                  <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4 lg:p-5">

                    <h3 className="font-display text-xl leading-none text-cream sm:text-2xl lg:text-3xl">
                      {card.title}
                    </h3>

                    <p className="mt-2 max-w-[95%] font-body text-[11px] leading-4 text-cream/80 sm:mt-2.5 sm:text-xs sm:leading-5">
                      {description}
                    </p>

                    <span className="mt-3 inline-block font-body text-[10px] uppercase tracking-[0.14em] text-mustard transition group-hover:tracking-[0.18em] sm:mt-4 sm:text-[11px]">
                      Explore →
                    </span>

                  </div>

                </Link>
              )
            })}

          </div>

        ) : (

          <div className="border-t border-mustard pt-6">
            <p className="max-w-3xl font-body text-sm leading-6 text-navy/55 sm:text-base">
              Add Explore Cards from the Studio to display them here.
            </p>
          </div>

        )}

      </section>

      {/* FEATURED PEOPLE */}
      {featuredPeople?.length > 0 && (
        <section className="bg-navy text-cream">

          <div className="mx-auto max-w-7xl px-5 py-8 sm:px-10 sm:py-12 lg:px-12">

            <div className="mb-5 flex flex-col justify-between gap-3 sm:mb-6 sm:flex-row sm:items-end">

              <div>
                <p className="font-body text-xs text-mustard sm:text-sm">
                  People
                </p>

                <h2 className="mt-1.5 font-display text-2xl leading-tight sm:text-4xl">
                  Featured People
                </h2>

                <div className="mt-3 h-[2px] w-12 bg-mustard" />
              </div>

              <Link
                href="/celebrities"
                className="font-body text-[11px] uppercase tracking-[0.12em] text-cream/65 transition hover:text-mustard sm:text-xs"
              >
                View all →
              </Link>

            </div>

            <div
              className={
                singleFeaturedPerson
                  ? 'mx-auto grid max-w-2xl grid-cols-1'
                  : twoFeaturedPeople
                    ? 'mx-auto grid max-w-3xl grid-cols-2 gap-3 sm:gap-5'
                    : 'grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4'
              }
            >

              {featuredPeople.map((person: any) => (

                <Link
                  key={person.slug?.current || person.name}
                  href={`/celebrities/${person.slug?.current || ''}`}
                  className={
                    singleFeaturedPerson
                      ? 'group relative block aspect-[4/3] overflow-hidden rounded-[2px] bg-navy'
                      : 'group relative block aspect-[4/5] overflow-hidden rounded-[2px] bg-navy'
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
                          ? '(min-width: 1024px) 768px, 100vw'
                          : twoFeaturedPeople
                            ? '(min-width: 768px) 360px, 45vw'
                            : '(min-width: 1280px) 288px, (min-width: 1024px) 22vw, (min-width: 640px) 45vw, calc(50vw - 27px)'
                      }
                      className="absolute inset-0 h-full w-full object-cover transition duration-700 ease-out group-hover:scale-105"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-shawl" />
                  )}

                  <div className="absolute inset-0 bg-gradient-to-b from-navy/5 via-navy/10 to-navy/95" />

                  <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4 lg:p-5">

                    {person.category?.title && (
                      <p className="mb-1.5 font-body text-[9px] uppercase tracking-[0.16em] text-mustard sm:text-[10px]">
                        {person.category.title}
                      </p>
                    )}

                    <h3
                      className={
                        singleFeaturedPerson
                          ? 'font-display text-2xl leading-tight text-cream sm:text-3xl lg:text-4xl'
                          : 'font-display text-lg leading-tight text-cream sm:text-2xl'
                      }
                    >
                      {person.name}
                    </h3>

                    <span className="mt-3 inline-block font-body text-[10px] uppercase tracking-[0.14em] text-cream/75 transition group-hover:text-mustard sm:text-[11px]">
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
        <section className="mx-auto max-w-7xl px-5 py-8 sm:px-10 sm:py-12 lg:px-12">

          <div className="mb-5 flex flex-col justify-between gap-3 sm:mb-6 sm:flex-row sm:items-end">

            <div>
              <p className="font-body text-xs text-shawl sm:text-sm">
                Long-form
              </p>

              <h2 className="mt-1.5 font-display text-2xl leading-tight sm:text-4xl">
                Stories
              </h2>

              <div className="mt-3 h-[2px] w-12 bg-mustard" />
            </div>

            <Link
              href="/blog"
              className="font-body text-[11px] uppercase tracking-[0.12em] text-navy/55 transition hover:text-mustard sm:text-xs"
            >
              View all →
            </Link>

          </div>

          <div className="grid gap-4 lg:grid-cols-2">

            {featuredStories.map((story: any) => (

              <Link
                key={story._id}
                href={`/blog/${story.slug.current}`}
                className="group block overflow-hidden border border-navy/10 bg-cream transition duration-300 hover:-translate-y-1 hover:shadow-xl"
              >

                <div className="aspect-[16/9] overflow-hidden bg-shawl">

                  {story.coverImage ? (
                    <ResponsiveImage
                      source={story.coverImage}
                      alt={story.title}
                      ratio={9 / 16}
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

                <div className="border-t-2 border-mustard p-4 sm:p-5">

                  {story.publishedAt && (
                    <p className="font-body text-[10px] uppercase tracking-[0.12em] text-navy/45">
                      {formatDate(story.publishedAt)}
                    </p>
                  )}

                  <h3 className="mt-2 font-display text-xl leading-tight transition group-hover:text-shawl sm:text-2xl">
                    {story.title}
                  </h3>

                  {story.summary && (
                    <p className="mt-2 line-clamp-3 font-body text-xs leading-5 text-navy/60 sm:text-sm sm:leading-6">
                      {story.summary}
                    </p>
                  )}

                  <span className="mt-4 inline-block font-body text-[11px] uppercase tracking-[0.12em] text-shawl transition group-hover:text-mustard">
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

          <div className="mx-auto max-w-7xl px-5 py-8 sm:px-10 sm:py-12 lg:px-12">

            <div className="mb-5 flex flex-col justify-between gap-3 sm:mb-6 sm:flex-row sm:items-end">

              <div>
                <p className="font-body text-xs text-shawl sm:text-sm">
                  Latest updates
                </p>

                <h2 className="mt-1.5 font-display text-2xl leading-tight sm:text-4xl">
                  News
                </h2>

                <div className="mt-3 h-[2px] w-12 bg-mustard" />
              </div>

              <Link
                href="/news"
                className="font-body text-[11px] uppercase tracking-[0.12em] text-navy/55 transition hover:text-mustard sm:text-xs"
              >
                View all →
              </Link>

            </div>

            <div className="grid gap-4 lg:grid-cols-2">

              {latestNews.map((item: any) => (

                <Link
                  key={item._id}
                  href={`/news/${item.slug.current}`}
                  className="group block overflow-hidden border border-navy/10 bg-cream transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                >

                  <div className="aspect-[16/9] overflow-hidden bg-shawl">

                    {item.coverImage ? (
                      <ResponsiveImage
                        source={item.coverImage}
                        alt={item.title}
                        ratio={9 / 16}
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

                  <div className="border-t-2 border-mustard p-4 sm:p-5">

                    {item.category?.title && (
                      <p className="font-body text-[10px] uppercase tracking-[0.14em] text-shawl">
                        {item.category.title}
                      </p>
                    )}

                    {item.publishedAt && (
                      <p className="mt-1.5 font-body text-[10px] uppercase tracking-[0.12em] text-navy/45">
                        {formatDate(item.publishedAt)}
                      </p>
                    )}

                    <h3 className="mt-2 font-display text-xl leading-tight transition group-hover:text-shawl sm:text-2xl">
                      {item.title}
                    </h3>

                    {item.summary && (
                      <p className="mt-2 line-clamp-3 font-body text-xs leading-5 text-navy/60 sm:text-sm sm:leading-6">
                        {item.summary}
                      </p>
                    )}

                    {item.author && (
                      <p className="mt-3 font-body text-xs text-navy/45">
                        By {item.author}
                      </p>
                    )}

                    <span className="mt-4 inline-block font-body text-[11px] uppercase tracking-[0.12em] text-shawl transition group-hover:text-mustard">
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
      <section className="mx-auto max-w-7xl px-5 py-8 sm:px-10 sm:py-14 lg:px-12">

        <div className="grid gap-6 lg:grid-cols-2 lg:items-center">

          <div>
            <p className="font-body text-xs text-shawl sm:text-sm">
              Our purpose
            </p>

            <h2 className="mt-3 font-display text-2xl leading-tight sm:text-4xl lg:text-5xl">
              A digital home for
              <br />
              Saraiki culture.
            </h2>
          </div>

          <div>
            <p className="font-body text-sm leading-6 text-navy/65 sm:text-lg sm:leading-7">
              Saraikistan brings together the people, places, language,
              traditions and stories of the Saraiki region in one growing
              cultural archive.
            </p>

            <Link
              href="/about"
              className="mt-5 inline-block border-b border-mustard pb-1 font-body text-xs uppercase tracking-[0.12em] text-navy transition hover:text-mustard sm:text-sm"
            >
              Learn about Saraikistan →
            </Link>
          </div>

        </div>

      </section>

    </main>
  )
}
