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
              that help document and share this heritage.
            </p>

          </div>

        </div>

      </section>


      {/* DIRECT CONTACT */}
      <section className="bg-navy text-cream">

        <div className="mx-auto max-w-7xl px-6 py-16 sm:px-10 sm:py-20 lg:px-12">

          <div className="mb-10">

            <p className="font-body text-sm text-mustard">
              Contact Saraikistan
            </p>

            <h2 className="mt-2 font-display text-4xl leading-tight sm:text-5xl">
              Get in touch directly.
            </h2>

            <div className="mt-4 h-[2px] w-12 bg-mustard" />

          </div>


          <div className="grid gap-6 sm:grid-cols-2">

            {/* EMAIL */}
            <a
              href="mailto:hello.saraikistan@gmail.com"
              className="group border border-cream/15 bg-navy p-7 transition duration-300 hover:-translate-y-1 hover:bg-shawl/30 hover:shadow-xl sm:p-9"
            >

              <span className="font-display text-3xl text-mustard">
                01
              </span>

              <h3 className="mt-6 font-display text-2xl sm:text-3xl">
                Email
              </h3>

              <p className="mt-4 font-body text-sm leading-6 text-cream/65 sm:text-base sm:leading-7">
                For general inquiries, collaborations, cultural projects,
                media inquiries, news submissions and contributions.
              </p>

              <p className="mt-6 break-all font-body text-sm text-cream transition group-hover:text-mustard sm:text-base">
                hello.saraikistan@gmail.com
              </p>

              <span className="mt-6 inline-block font-body text-xs uppercase tracking-[0.12em] text-mustard">
                Send an email →
              </span>

            </a>


            {/* WHATSAPP */}
            <a
              href="https://wa.me/923126789412"
              target="_blank"
              rel="noopener noreferrer"
              className="group border border-cream/15 bg-navy p-7 transition duration-300 hover:-translate-y-1 hover:bg-shawl/30 hover:shadow-xl sm:p-9"
            >

              <span className="font-display text-3xl text-mustard">
                02
              </span>

              <h3 className="mt-6 font-display text-2xl sm:text-3xl">
                WhatsApp
              </h3>

              <p className="mt-4 font-body text-sm leading-6 text-cream/65 sm:text-base sm:leading-7">
                For quick questions, collaborations, events and
                other inquiries.
              </p>

              <p className="mt-6 font-body text-sm text-cream transition group-hover:text-mustard sm:text-base">
                +92 312 6789412
              </p>

              <span className="mt-6 inline-block font-body text-xs uppercase tracking-[0.12em] text-mustard">
                Open WhatsApp →
              </span>

            </a>

          </div>

        </div>

        <div className="tile-rule" />

      </section>


      {/* WAYS TO CONNECT */}
      <section className="bg-cream text-navy">

        <div className="mx-auto max-w-7xl px-6 py-16 sm:px-10 sm:py-20 lg:px-12">

          <div className="mb-10">

            <p className="font-body text-sm text-shawl">
              Get in touch
            </p>

            <h2 className="mt-2 font-display text-4xl leading-tight sm:text-5xl">
              How can we connect?
            </h2>

            <div className="mt-4 h-[2px] w-12 bg-mustard" />

          </div>


          <div className="grid gap-px overflow-hidden border border-navy/10 bg-navy/10 sm:grid-cols-2">

            {/* GENERAL */}
            <article className="bg-cream p-7 transition hover:bg-navy/[0.03] sm:p-9">

              <span className="font-display text-3xl text-mustard">
                01
              </span>

              <h3 className="mt-6 font-display text-2xl sm:text-3xl">
                General Inquiries
              </h3>

              <p className="mt-4 font-body text-sm leading-6 text-navy/65 sm:text-base sm:leading-7">
                Questions about Saraikistan, the website, its content
                or the cultural archive are welcome.
              </p>

            </article>


            {/* COLLABORATION */}
            <article className="bg-cream p-7 transition hover:bg-navy/[0.03] sm:p-9">

              <span className="font-display text-3xl text-mustard">
                02
              </span>

              <h3 className="mt-6 font-display text-2xl sm:text-3xl">
                Collaborations
              </h3>

              <p className="mt-4 font-body text-sm leading-6 text-navy/65 sm:text-base sm:leading-7">
                Interested in cultural projects, research, creative work,
                events or initiatives connected to the Saraiki region?
              </p>

            </article>


            {/* PROMOTION */}
            <article className="bg-cream p-7 transition hover:bg-navy/[0.03] sm:p-9">

              <span className="font-display text-3xl text-mustard">
                03
              </span>

              <h3 className="mt-6 font-display text-2xl sm:text-3xl">
                Promotion
              </h3>

              <p className="mt-4 font-body text-sm leading-6 text-navy/65 sm:text-base sm:leading-7">
                Artists, musicians, writers, cultural organizations,
                events and relevant initiatives can contact us about
                promotional opportunities.
              </p>

            </article>


            {/* NEWS & CONTRIBUTIONS */}
            <article className="bg-cream p-7 transition hover:bg-navy/[0.03] sm:p-9">

              <span className="font-display text-3xl text-mustard">
                04
              </span>

              <h3 className="mt-6 font-display text-2xl sm:text-3xl">
                News & Contributions
              </h3>

              <p className="mt-4 font-body text-sm leading-6 text-navy/65 sm:text-base sm:leading-7">
                Share photographs, historical material, interviews,
                research, news, personal stories or other material that
                can help document Saraiki heritage.
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
              Have something worth sharing?
            </h2>

            <p className="mt-6 font-body text-base leading-7 text-cream/70 sm:text-lg sm:leading-8">
              Saraikistan grows through the stories, knowledge and
              contributions of its people. If you have material that could
              become part of this cultural archive, we would love to hear
              from you.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">

              <a
                href="mailto:hello.saraikistan@gmail.com"
                className="inline-flex border border-cream/70 px-7 py-4 font-body text-sm uppercase tracking-[0.12em] text-cream transition hover:border-mustard hover:bg-mustard hover:text-navy"
              >
                Email Saraikistan
              </a>

              <a
                href="https://wa.me/923126789412"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex border border-cream/70 px-7 py-4 font-body text-sm uppercase tracking-[0.12em] text-cream transition hover:border-mustard hover:bg-mustard hover:text-navy"
              >
                WhatsApp Us
              </a>

            </div>

          </div>

        </div>

        <div className="tile-rule" />

      </section>

    </main>
  )
}
