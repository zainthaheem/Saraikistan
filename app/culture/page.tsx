const topics = [
  { title: 'Language', body: 'Saraiki, its dialects, and its place among the languages of the region.' },
  { title: 'Dress & Craft', body: 'Traditional embroidery, khussa, and textile work of the Saraiki belt.' },
  { title: 'Cuisine', body: 'Dishes and food traditions particular to the Saraiki region.' },
  { title: 'Music', body: 'Folk music, instruments, and singers who carry the tradition forward.' },
  { title: 'Festivals', body: 'Melas and seasonal celebrations across the Saraiki-speaking districts.' },
]

export default function Culture() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-16">
      <p className="font-body text-sm text-shawl">Traditions that hold it together</p>
      <h1 className="mt-2 font-display text-3xl text-navy sm:text-4xl">Culture</h1>

      <div className="mt-12 grid gap-8 sm:grid-cols-2">
        {topics.map((t) => (
          <div key={t.title} className="border-t-2 border-mustard pt-4">
            <h2 className="font-display text-xl text-navy">{t.title}</h2>
            <p className="mt-2 font-body text-sm text-navy/70">{t.body}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
