import Link from 'next/link'

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="mx-auto grid max-w-5xl gap-10 px-6 py-16 sm:grid-cols-5 sm:py-24">
        <div className="sm:col-span-3">
          <p className="font-body text-sm text-shawl">The Saraiki belt, told by its own people</p>
          <h1 className="mt-4 font-display text-4xl leading-tight text-navy sm:text-5xl">
            The land, the language,
            <br />
            and the lives of Saraikistan.
          </h1>
          <p className="mt-6 max-w-md font-body text-navy/70">
            Biographies of the singers, poets, and leaders who carry Saraiki
            culture forward, the history of the region they come from, and
            the traditions that hold it together.
          </p>
          <div className="mt-8 flex gap-4 font-body text-sm">
            <Link
              href="/celebrities"
              className="bg-mustard px-5 py-3 text-cream transition hover:bg-mustard/90"
            >
              Meet notable Saraikis
            </Link>
            <Link
              href="/region"
              className="border border-navy px-5 py-3 text-navy transition hover:bg-navy hover:text-cream"
            >
              Explore the region
            </Link>
          </div>
        </div>
        <div className="sm:col-span-2">
          <div
            className="h-56 w-full sm:h-full"
            style={{
              backgroundImage:
                'repeating-linear-gradient(45deg, #2F688F 0px, #2F688F 10px, #E7DCC8 10px, #E7DCC8 20px), repeating-linear-gradient(-45deg, #1E3A8A 0px, #1E3A8A 2px, transparent 2px, transparent 20px)',
            }}
            aria-hidden
          />
        </div>
      </section>

      <div className="tile-rule mx-6" />

      {/* Featured biography */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <p className="font-body text-sm text-shawl">Featured biography</p>
        <h2 className="mt-2 font-display text-3xl text-navy">Abdul Salam Sagar</h2>
        <p className="mt-4 max-w-2xl font-body text-navy/70">
          A Saraiki singer honored by Saraiki writers and poets for his
          contribution to Saraiki music. Full biography coming soon.
        </p>
        <Link
          href="/celebrities"
          className="mt-4 inline-block font-body text-sm text-royal underline decoration-royal/40 underline-offset-4 hover:decoration-royal"
        >
          Read more biographies
        </Link>
      </section>

      <div className="tile-rule mx-6" />

      {/* Section previews */}
      <section className="mx-auto grid max-w-5xl gap-8 px-6 py-16 sm:grid-cols-3">
        {[
          {
            href: '/region',
            title: 'Places',
            body: 'The geography, districts, and history of the Saraiki belt.',
          },
          {
            href: '/culture',
            title: 'Culture',
            body: 'Language, dress, cuisine, music, and festivals.',
          },
          {
            href: '/news',
            title: 'News',
            body: 'What is happening across the Saraiki community today.',
          },
        ].map((item) => (
          <Link key={item.href} href={item.href} className="block border-t-2 border-mustard pt-4">
            <h3 className="font-display text-xl text-navy">{item.title}</h3>
            <p className="mt-2 font-body text-sm text-navy/70">{item.body}</p>
          </Link>
        ))}
      </section>
    </>
  )
}
