import Link from 'next/link'

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-cream text-navy">

      {/* PAGE HEADER */}
      <section>
        <div className="mx-auto max-w-7xl px-6 pb-10 pt-6 sm:px-10 sm:pb-12 sm:pt-8 lg:px-12">

          <p className="font-body text-sm text-shawl">
            Saraikistan
          </p>

          <h1 className="mt-2 max-w-4xl font-display text-4xl leading-tight text-navy sm:text-5xl">
            Let’s connect,
            <br />
            collaborate & contribute.
          </h1>

        </div>
      </section>


      {/* INTRODUCTION */}
      <section className="mx-auto max-w-7xl px-6 pb-16 sm:px-10 sm:pb-20 lg:px-12">

        <div className="border-t border-mustard pt-7">

          <div className="max-w-3xl">

            <p className="font-body text-base leading-7 text-navy/70 sm:text-lg sm:leading-8">
              Saraikistan is a growing digital archive of the people,
              culture, language, history and stories of the Saraiki region.
              We welcome meaningful ideas, collaborations and contributions
              that help document and celebrate this heritage.
            </p>

          </div>

        </div>

      </section>


      {/* WAYS TO CONNECT */}
      <section className="bg-navy text-cream">

        <div className="mx-auto max-w-7xl px-6 py-16 sm:px-10 sm:py-20 lg:px-12">

          <div className="mb-10">

            <p className="font-body text-sm text-mustard">
              Get in touch
            </p>

            <h2 className="mt-2 font-display text-4xl leading-tight sm:text-5xl">
              How can we connect?
            </h2>

            <div className="mt-4 h-[2px] w-12 bg-mustard" />

          </div>


          <div className="grid gap-px overflow-hidden border border-cream/10 bg-cream/10 sm:grid-cols-2">

            {/* GENERAL */}
            <article className="bg-navy p-7 transition hover:bg-shawl/30 sm:p-9">

              <span className="font-display text-3xl text-mustard">
                01
              </span>

              <h3 className="mt-6 font-display text-2xl sm:text-3xl">
                General Inquiries
              </h3>

              <p className="mt-4 font-body text-sm leading-6 text-cream/65 sm:text-base sm:leading-7">
                Questions about Saraikistan, the website, our content
                or the cultural archive are always welcome.
              </p>

            </article>


            {/* COLLABORATION */}
            <article className="bg-navy p-7 transition hover:bg-shawl/30 sm:p-9">

              <span className="font-display text-3xl text-mustard">
                02
              </span>

              <h3 className="mt-6 font-display text-2xl sm:text-3xl">
                Collaborations
              </h3>

              <p className="mt-4 font-body text-sm leading-6 text-cream/65 sm:text-base sm:leading-7">
                Interested in cultural projects, research, creative work,
                events or initiatives connected to the Saraiki region?
              </p>

            </article>


            {/* PROMOTION */}
            <article className="bg-navy p-7 transition hover:bg-shawl/30 sm:p-9">

              <span className="font-display text-3xl text-mustard">
                03
              </span>

              <h3 className="mt-6 font-display text-2xl sm:text-3xl">
                Promotion
              </h3>

              <p className="mt-4 font-body text-sm leading-6 text-cream/65 sm:text-base sm:leading-7">
                Artists, musicians, writers, businesses, events and
                cultural initiatives can contact us about relevant
                promotional opportunities.
              </p>

            </article>


            {/* CONTRIBUTIONS */}
            <article className="bg-navy p-7 transition hover:bg-shawl/30 sm:p-9">

              <span className="font-display text-3xl text-mustard">
                04
              </span>

              <h3 className="mt-6 font-display text-2xl sm:text-3xl">
                Media & Contributions
              </h3>

              <p className="mt-4 font-body text-sm leading-6 text-cream/65 sm:text-base sm:leading-7">
                Share photographs, historical material, interviews,
                research, personal stories or other material that can
                help document Saraiki heritage.
              </p>

            </article>

          </div>

        </div>

        <div className="tile-rule" />

      </section>


      {/* COLLABORATION STATEMENT */}
      <section className="mx-auto max-w-7xl px-6 py-16 sm:px-10 sm:py-24 lg:px-12">

        <div className="grid gap-10 lg:grid-cols-2 lg:items-end lg:gap-20">

          <div>

            <p className="font-body text-sm text-shawl">
              Collaborate with Saraikistan
            </p>

            <h2 className="mt-2 font-display text-4xl leading-tight sm:text-5xl">
              Help us document,
              <br />
              preserve and share
              <br />
              Saraiki culture.
            </h2>

          </div>


          <div className="max-w-xl">

            <p className="font-body text-base leading-7 text-navy/70 sm:text-lg sm:leading-8">
              Saraikistan is built to grow. Meaningful contributions from
              artists, researchers, writers, photographers, historians,
              cultural organizations and members of the community can help
              make the archive richer and more representative.
            </p>

          </div>

        </div>

      </section>


      {/* SHARE YOUR STORY */}
      <section className="bg-navy text-cream">

        <div className="mx-auto max-w-7xl px-6 py-16 sm:px-10 sm:py-20 lg:px-12">

          <div className="max-w-3xl">

            <p className="font-body text-sm text-mustard">
              Contributions
            </p>

            <h2 className="mt-2 font-display text-4xl leading-tight sm:text-5xl">
              Have a story worth telling?
            </h2>

            <p className="mt-6 font-body text-base leading-7 text-cream/70 sm:text-lg sm:leading-8">
              Saraikistan grows through the stories and knowledge of its
              people. If you have something that belongs in this cultural
              archive, we would love to hear about it.
            </p>

            <Link
              href="/"
              className="mt-8 inline-flex border border-cream/70 px-7 py-4 font-body text-sm uppercase tracking-[0.12em] text-cream transition hover:border-mustard hover:bg-mustard hover:text-navy"
            >
              Explore Saraikistan
            </Link>

          </div>

        </div>

        <div className="tile-rule" />

      </section>

    </main>
  )
}
