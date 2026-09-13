const sections = [
  {
    title: 'Geography',
    body: 'The Saraiki belt spans parts of southern Punjab and beyond, including the Cholistan desert and the fertile plains along the Indus.',
  },
  {
    title: 'Districts',
    body: 'Multan, Bahawalpur, Dera Ghazi Khan, and the surrounding districts that make up the Saraiki-speaking region.',
  },
  {
    title: 'History',
    body: 'A long history shaped by Sufi shrines, trade routes, and the cultures that passed through the region.',
  },
]

export default function Region() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-16">
      <p className="font-body text-sm text-shawl">Where Saraiki culture comes from</p>
      <h1 className="mt-2 font-display text-3xl text-navy sm:text-4xl">Places</h1>

      <div className="mt-12 space-y-10">
        {sections.map((s) => (
          <div key={s.title} className="border-t-2 border-mustard pt-4">
            <h2 className="font-display text-xl text-navy">{s.title}</h2>
            <p className="mt-2 max-w-2xl font-body text-sm text-navy/70">{s.body}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
