const posts = [
  {
    title: 'Abdul Salam Sagar: A Life in Saraiki Music',
    summary: 'The story of a Saraiki singer honored by Saraiki writers and poets for his contribution to the craft.',
  },
]

export default function Blog() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-16">
      <p className="font-body text-sm text-shawl">Long-form stories</p>
      <h1 className="mt-2 font-display text-3xl text-navy sm:text-4xl">Stories</h1>

      <div className="mt-12 space-y-10">
        {posts.map((post) => (
          <article key={post.title} className="border-t-2 border-mustard pt-4">
            <h2 className="font-display text-xl text-navy">{post.title}</h2>
            <p className="mt-2 max-w-2xl font-body text-sm text-navy/70">{post.summary}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
