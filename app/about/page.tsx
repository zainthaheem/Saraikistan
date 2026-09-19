export default function About() {
  return (
    <section className="min-h-screen bg-cream text-navy">

      {/* Page Header */}
      <div className="mx-auto max-w-7xl px-6 pb-10 pt-6 sm:px-10 sm:pb-12 sm:pt-8 lg:px-12">

        <p className="font-body text-sm text-shawl">
          Why this site exists
        </p>

        <h1 className="mt-2 font-display text-4xl leading-tight text-navy sm:text-5xl">
          About Saraikistan
        </h1>

      </div>

      {/* About Content */}
      <div className="mx-auto max-w-7xl px-6 pb-20 sm:px-10 lg:px-12">

        <div className="border-t border-mustard pt-7">

          <div className="max-w-3xl">

            <p className="font-body text-base leading-7 text-navy/70 sm:text-lg">
              Saraikistan is a digital home for the people, culture, language,
              and timeless beauty of the Saraiki region — biographies, history,
              and news from the Saraiki-speaking community in one place.
            </p>

            <p className="mt-5 font-body text-base leading-7 text-navy/70 sm:text-lg">
              [Add more about your motivation for the project here.]
            </p>

          </div>

        </div>

      </div>

    </section>
  )
}
