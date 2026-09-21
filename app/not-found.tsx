import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="min-h-screen bg-cream text-navy">

      <section className="mx-auto flex min-h-[70vh] max-w-7xl items-center px-6 py-20 sm:px-10 lg:px-12">

        <div className="w-full border-t border-mustard pt-8">

          <p className="font-body text-sm text-shawl">
            Saraikistan
          </p>

          <h1 className="mt-3 font-display text-7xl leading-none text-navy sm:text-8xl lg:text-9xl">
            404
          </h1>

          <h2 className="mt-6 max-w-2xl font-display text-3xl leading-tight sm:text-4xl">
            This page could not be found.
          </h2>

          <p className="mt-4 max-w-xl font-body text-base leading-7 text-navy/60 sm:text-lg sm:leading-8">
            The page you are looking for may have moved, changed, or no longer
            exists.
          </p>

          <div className="mt-8 flex flex-col gap-3 font-body text-sm sm:flex-row">

            <Link
              href="/"
              className="bg-navy px-7 py-4 text-center text-cream transition hover:bg-mustard hover:text-navy"
            >
              Back to Home
            </Link>

            <Link
              href="/culture"
              className="border border-navy/25 px-7 py-4 text-center text-navy transition hover:border-mustard hover:bg-mustard hover:text-navy"
            >
              Explore Culture
            </Link>

          </div>

        </div>

      </section>

      <div className="tile-rule" />

    </main>
  )
}
