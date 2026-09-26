
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Saraikistan | People, Culture & Heritage',
  description:
    'Learn about Saraikistan, a digital cultural platform documenting the people, language, places, traditions, heritage and stories of the Saraiki region.',
  alternates: {
    canonical: 'https://saraikistan.org/about',
  },
  openGraph: {
    title: 'About Saraikistan | People, Culture & Heritage',
    description:
      'Learn about Saraikistan, a digital cultural platform documenting the people, language, places, traditions, heritage and stories of the Saraiki region.',
    type: 'website',
    url: 'https://saraikistan.org/about',
    siteName: 'Saraikistan',
  },
  twitter: {
    card: 'summary',
    title: 'About Saraikistan | People, Culture & Heritage',
    description:
      'Learn about Saraikistan, a digital cultural platform documenting the people, language, places, traditions, heritage and stories of the Saraiki region.',
  },
}

export default function About() {
  return (
    <section className="min-h-screen bg-cream text-navy">

      {/* PAGE HEADER */}
      <div className="mx-auto max-w-7xl px-6 pb-10 pt-6 sm:px-10 sm:pb-12 sm:pt-8 lg:px-12">

        <p className="font-body text-sm text-shawl">
          Why Saraikistan exists
        </p>

        <h1 className="mt-2 font-display text-4xl leading-tight text-navy sm:text-5xl">
          About Saraikistan
        </h1>

      </div>


      {/* INTRODUCTION */}
      <div className="mx-auto max-w-7xl px-6 pb-20 sm:px-10 lg:px-12">

        <div className="border-t border-mustard pt-7">

          <div className="max-w-4xl">

            <p className="font-display text-3xl leading-tight text-navy sm:text-5xl">
              A digital home for the people, culture, language and heritage of the Saraiki region.
            </p>

            <p className="mt-8 max-w-3xl font-body text-base leading-7 text-navy/70 sm:text-lg sm:leading-8">
              Saraikistan is a growing digital cultural platform dedicated to
              documenting and presenting the people, places, language,
              traditions and stories of the Saraiki region.
            </p>

            <p className="mt-6 max-w-3xl font-body text-base leading-7 text-navy/70 sm:text-lg sm:leading-8">
              It brings together cultural knowledge, biographies, places,
              history, stories and contemporary developments in one
              accessible space — creating a record that can continue to
              grow with time.
            </p>

          </div>

        </div>


        {/* MISSION & VISION */}
        <div className="mt-20 border-t border-navy/10 pt-10 sm:mt-24">

          <div className="grid gap-10 lg:grid-cols-2 lg:gap-20">

            <div>

              <p className="font-body text-sm text-shawl">
                Our mission
              </p>

              <h2 className="mt-2 font-display text-3xl leading-tight sm:text-4xl">
                To document, preserve and share.
              </h2>

              <p className="mt-6 font-body text-base leading-7 text-navy/70 sm:text-lg sm:leading-8">
                Saraikistan aims to make the cultural heritage of the Saraiki
                region easier to discover, understand and preserve through
                carefully presented digital content.
              </p>

            </div>

            <div>

              <p className="font-body text-sm text-shawl">
                Our vision
              </p>

              <h2 className="mt-2 font-display text-3xl leading-tight sm:text-4xl">
                A lasting digital record of a living culture.
              </h2>

              <p className="mt-6 font-body text-base leading-7 text-navy/70 sm:text-lg sm:leading-8">
                We envision Saraikistan becoming a growing cultural archive
                where future generations can discover the people, places,
                traditions, language and stories that shape the Saraiki
                region.
              </p>

            </div>

          </div>

        </div>


        {/* WHAT WE DOCUMENT */}
        <div className="mt-20 border-t border-navy/10 pt-10 sm:mt-24">

          <div className="grid gap-10 lg:grid-cols-2 lg:gap-20">

            <div>

              <p className="font-body text-sm text-shawl">
                What we document
              </p>

              <h2 className="mt-2 font-display text-3xl leading-tight sm:text-4xl">
                People, places, culture, stories and news.
              </h2>

            </div>

            <div className="max-w-3xl">

              <p className="font-body text-base leading-7 text-navy/70 sm:text-lg sm:leading-8">
                Saraikistan brings together different dimensions of the
                region's cultural identity. This includes notable people,
                historic places, language, traditions, music, literature,
                heritage and everyday cultural life.
              </p>

              <p className="mt-6 font-body text-base leading-7 text-navy/70 sm:text-lg sm:leading-8">
                The platform also documents contemporary developments through
                its news and story sections, allowing the archive to represent
                both cultural memory and the present.
              </p>

            </div>

          </div>

        </div>


        {/* PEOPLE */}
        <div className="mt-20 border-t border-navy/10 pt-10 sm:mt-24">

          <div className="grid gap-10 lg:grid-cols-2 lg:gap-20">

            <div>

              <p className="font-body text-sm text-shawl">
                People
              </p>

              <h2 className="mt-2 font-display text-3xl leading-tight sm:text-4xl">
                The voices that carry a culture forward.
              </h2>

            </div>

            <div className="max-w-3xl">

              <p className="font-body text-base leading-7 text-navy/70 sm:text-lg sm:leading-8">
                The Saraiki region has a rich tradition of poetry, music,
                literature, scholarship and storytelling. Saraikistan
                documents people whose work and contributions are part of
                this cultural landscape.
              </p>

              <p className="mt-6 font-body text-base leading-7 text-navy/70 sm:text-lg sm:leading-8">
                These profiles help preserve their stories, achievements
                and cultural legacy for wider audiences and future
                generations.
              </p>

            </div>

          </div>

        </div>


        {/* CULTURE & HERITAGE */}
        <div className="mt-20 border-t border-navy/10 pt-10 sm:mt-24">

          <div className="grid gap-10 lg:grid-cols-2 lg:gap-20">

            <div>

              <p className="font-body text-sm text-shawl">
                Culture & heritage
              </p>

              <h2 className="mt-2 font-display text-3xl leading-tight sm:text-4xl">
                Preserving the details that make the region distinctive.
              </h2>

            </div>

            <div className="max-w-3xl">

              <p className="font-body text-base leading-7 text-navy/70 sm:text-lg sm:leading-8">
                Language, folk music, poetry, traditions, food, crafts,
                landscapes and historic places all form part of the cultural
                story.
              </p>

              <p className="mt-6 font-body text-base leading-7 text-navy/70 sm:text-lg sm:leading-8">
                Saraikistan presents these subjects through articles,
                profiles, photography, stories and other forms of digital
                documentation.
              </p>

            </div>

          </div>

        </div>


        {/* A GROWING ARCHIVE */}
        <div className="mt-20 border-t border-mustard pt-10 sm:mt-24">

          <div className="max-w-4xl">

            <p className="font-body text-sm text-shawl">
              A growing archive
            </p>

            <h2 className="mt-2 font-display text-3xl leading-tight sm:text-5xl">
              This is only the beginning.
            </h2>

            <p className="mt-7 max-w-3xl font-body text-base leading-7 text-navy/70 sm:text-lg sm:leading-8">
              Saraikistan is designed to grow over time. More people,
              places, cultural subjects, stories, photographs and
              contemporary developments can be added as the collection
              expands.
            </p>

            <p className="mt-6 max-w-3xl font-body text-base leading-7 text-navy/70 sm:text-lg sm:leading-8">
              The aim is to create an accessible digital record that can
              preserve knowledge while making the region's heritage easier
              to explore for people at home and around the world.
            </p>

          </div>

        </div>


        {/* CLOSING STATEMENT */}
        <div className="mt-20 pb-10 sm:mt-24 sm:pb-16">

          <div className="bg-navy px-6 py-12 text-cream sm:px-10 sm:py-16">

            <p className="font-body text-sm uppercase tracking-[0.18em] text-mustard">
              Saraikistan
            </p>

            <h2 className="mt-4 max-w-3xl font-display text-3xl leading-tight sm:text-5xl">
              People. Culture. Heritage. Beyond.
            </h2>

            <p className="mt-6 max-w-2xl font-body text-base leading-7 text-cream/70 sm:text-lg sm:leading-8">
              A place to discover the people, traditions, places, language
              and stories of the Saraiki region — and a digital record that
              can continue to grow.
            </p>

          </div>

        </div>

      </div>

    </section>
  )
}
