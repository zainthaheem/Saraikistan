import Link from 'next/link'

export default function ContactPage() {
  return (
    <main className="bg-cream text-navy">

      {/* Page Header */}
      <section className="border-b border-navy/10">
        <div className="mx-auto max-w-7xl px-6 pb-10 pt-6 sm:px-10 sm:pb-12 sm:pt-8 lg:px-12">

          <p className="font-body text-sm text-shawl">
            Saraikistan
          </p>

          <h1 className="mt-2 max-w-4xl font-display text-4xl leading-tight text-navy sm:text-5xl">
            Let’s connect,
            <br />
            collaborate & contribute.
          </h1>

          <p className="mt-5 max-w-3xl font-body text-base leading-7 text-navy/70 sm:text-lg">
            Saraikistan is a digital home for the people, culture,
            language, history and stories of the Saraiki region.
            We welcome ideas, collaborations and meaningful
            contributions.
          </p>

        </div>
      </section>

      {/* Contact Categories */}
      <section className="mx-auto max-w-7xl px-6 py-16 sm:px-10 sm:py-20 lg:px-12">

        <div className="mb-10">
          <p className="font-body text-sm text-shawl">
            Get in touch
          </p>

          <h2 className="mt-2 font-display text-4xl leading-tight sm:text-5xl">
            How can we connect?
          </h2>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">

          {/* General */}
          <article className="border border-navy/15 bg-cream p-7 transition hover:-translate-y-1 hover:shadow-lg sm:p-9">

            <span className="font-display text-3xl text-mustard">
              01
            </span>

            <h3 className="mt-5 font-display text-2xl sm:text-3xl">
              General Inquiries
            </h3>

            <p className="mt-4 font-body text-base leading-7 text-navy/65">
              Have a question about Saraikistan, our website,
              content or cultural projects? We would love to
              hear from you.
            </p>

          </article>

          {/* Collaboration */}
          <article className="border border-navy/15 bg-cream p-7 transition hover:-translate-y-1 hover:shadow-lg sm:p-9">

            <span className="font-display text-3xl text-mustard">
              02
            </span>

            <h3 className="mt-5 font-display text-2xl sm:text-3xl">
              Collaborations & Partnerships
            </h3>

            <p className="mt-4 font-body text-base leading-7 text-navy/65">
              Interested in collaborating on cultural projects,
              research, creative work, events or initiatives
              connected to the Saraiki region?
            </p>

          </article>

          {/* Promotion */}
          <article className="border border-navy/15 bg-cream p-7 transition hover:-translate-y-1 hover:shadow-lg sm:p-9">

            <span className="font-display text-3xl text-mustard">
              03
            </span>

            <h3 className="mt-5 font-display text-2xl sm:text-3xl">
              Promotion
            </h3>

            <p className="mt-4 font-body text-base leading-7 text-navy/65">
              Artists, musicians, writers, businesses, events
              and cultural initiatives can contact us about
              relevant promotional opportunities.
            </p>

          </article>

          {/* Media */}
          <article className="border border-navy/15 bg-cream p-7 transition hover:-translate-y-1 hover:shadow-lg sm:p-9">

            <span className="font-display text-3xl text-mustard">
              04
            </span>

            <h3 className="mt-5 font-display text-2xl sm:text-3xl">
              Media & Contributions
            </h3>

            <p className="mt-4 font-body text-base leading-7 text-navy/65">
              Share photographs, historical material, interviews,
              research, personal stories or other contributions
              that help document Saraiki heritage.
            </p>

          </article>

        </div>

      </section>

      {/* Collaboration Banner */}
      <section className="bg-navy text-cream">

        <div className="mx-auto max-w-7xl px-6 py-16 sm:px-10 sm:py-20 lg:px-12">

          <p className="font-body text-sm text-mustard">
            Collaborate with Saraikistan
          </p>

          <div className="mt-5 grid gap-8 lg:grid-cols-2 lg:items-end">

            <h2 className="font-display text-4xl leading-tight sm:text-5xl">
              Help us document,
              <br />
              preserve and share
              <br />
              Saraiki culture.
            </h2>

            <p className="max-w-xl font-body text-base leading-7 text-cream/70 sm:text-lg">
              We are interested in meaningful collaborations
              that celebrate the people, places, language,
              traditions, arts and history of the Saraiki region.
            </p>

          </div>

        </div>

        <div className="tile-rule" />

      </section>

      {/* Share Your Story */}
      <section className="mx-auto max-w-7xl px-6 py-16 sm:px-10 sm:py-20 lg:px-12">

        <div className="max-w-3xl">

          <p className="font-body text-sm text-shawl">
            Contributions
          </p>

          <h2 className="mt-2 font-display text-4xl leading-tight sm:text-5xl">
            Have a story worth telling?
          </h2>

          <p className="mt-5 font-body text-base leading-7 text-navy/65 sm:text-lg">
            Saraikistan grows through the stories and knowledge
            of its people. If you have something that belongs
            in this cultural archive, we would love to hear about it.
          </p>

          <Link
            href="/"
            className="mt-7 inline-flex border border-navy bg-navy px-7 py-4 font-body text-sm text-cream transition hover:bg-mustard hover:text-navy"
          >
            Explore Saraikistan
          </Link>

        </div>

      </section>

    </main>
  )
}
