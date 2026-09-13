const news = [
  {
    date: 'Add date',
    title: '[Add a news headline]',
    summary: 'Short summary of the news item goes here.',
  },
  {
    date: 'Add date',
    title: '[Add a news headline]',
    summary: 'Short summary of the news item goes here.',
  },
]

export default function News() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-16">
      <p className="font-body text-sm text-shawl">What's happening</p>
      <h1 className="mt-2 font-display text-3xl text-navy sm:text-4xl">News</h1>

      <div className="mt-12 divide-y divide-navy/10">
        {news.map((item) => (
          <article key={item.title} className="py-6">
            <p className="font-body text-xs text-navy/50">{item.date}</p>
            <h2 className="mt-1 font-display text-lg text-navy">{item.title}</h2>
            <p className="mt-2 font-body text-sm text-navy/70">{item.summary}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
