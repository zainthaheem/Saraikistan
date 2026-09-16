import Link from 'next/link'
import { client } from '@/sanity/lib/client'
import { urlFor } from '@/sanity/lib/image'

export const revalidate = 60

async function getStories() {
  return client.fetch(
    `*[_type == "story"] | order(publishedAt desc) {
      _id,
      title,
      slug,
      "category": category->{title},
      publishedAt,
      summary,
      coverImage
    }`
  )
}

export default async function Blog() {
  const stories = await getStories()

  return (
    <section className="mx-auto max-w-5xl px-6 py-16">
      <p className="font-body text-sm text-shawl">Long-form stories</p>
      <h1 className="mt-2 font-display text-3xl text-navy sm:text-4xl">Stories</h1>

      {stories.length === 0 ? (
        <p className="mt-12 font-body text-navy/50">
          No stories added yet. Add your first entry in the Studio.
        </p>
      ) : (
        <div className="mt-12 space-y-10">
          {stories.map((post: any) => (
            <Link
              key={post._id}
              href={`/blog/${post.slug.current}`}
              className="block border-t-2 border-mustard pt-4"
            >
              {post.coverImage && (
                <img
                  src={urlFor(post.coverImage).width(800).height(320).url()}
                  alt={post.title}
                  className="mb-4 h-48 w-full object-cover"
                />
              )}
              {post.category && (
                <p className="font-body text-xs uppercase tracking-wide text-royal">
                  {post.category.title}
                </p>
              )}
              <h2 className="mt-1 font-display text-xl text-navy">{post.title}</h2>
              {post.summary && (
                <p className="mt-2 max-w-2xl font-body text-sm text-navy/70">{post.summary}</p>
              )}
            </Link>
          ))}
        </div>
      )}
    </section>
  )
}
