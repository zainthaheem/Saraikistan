const celebrities = [
  {
    name: 'Abdul Salam Sagar',
    category: 'Music',
    bio: 'A Saraiki singer honored by Saraiki writers and poets for his contribution to Saraiki music.',
  },
  {
    name: '[Add a poet]',
    category: 'Literature',
    bio: 'Short description of their contribution to Saraiki literature.',
  },
  {
    name: '[Add a public figure]',
    category: 'Public Life',
    bio: 'Short description of their contribution to the Saraiki community.',
  },
]

export default function Celebrities() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-16">
      <p className="font-body text-sm text-shawl">Notable Saraikis</p>
      <h1 className="mt-2 font-display text-3xl text-navy sm:text-4xl">People</h1>
      <p className="mt-4 max-w-2xl font-body text-navy/70">
        Singers, poets, writers, and leaders who represent Saraiki culture.
      </p>

      <div className="mt-12 grid gap-8 sm:grid-cols-2">
        {celebrities.map((person) => (
          <article key={person.name} className="border-t-2 border-mustard pt-4">
            <p className="font-body text-xs uppercase tracking-wide text-royal">
              {person.category}
            </p>
            <h2 className="mt-1 font-display text-xl text-navy">{person.name}</h2>
            <p className="mt-2 font-body text-sm text-navy/70">{person.bio}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
