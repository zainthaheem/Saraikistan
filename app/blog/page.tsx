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
    <section className="min-h-screen bg-cream text-navy">

      {/* Page Header */}
      <div className="mx-auto max-w-7xl px-6 pb-10 pt-6 sm:px-10 sm:pb-12 sm:pt-8 lg:px-12">

        <p className="font-body text-sm text-shawl">
          Long-form stories
        </p>

        <h1 className="mt-2 font-display text-4xl leading-tight text-navy sm:text-5xl">
          Stories
        </h1>

      </div>

      {/* Stories Content */}
      <div className="mx-auto max-w-7xl px-6 pb-20 sm:px-10 lg:px-12">

        {stories.length === 0 ? (

          <div className="border-t border-mustard pt-7">

            <p className="max-w-3xl font-body text-base leading-7 text-navy/55 sm:text-lg">
              No stories added yet. Add your first entry in the Studio.
            </p>

          </div>

        ) : (

          <div className="border-t border-mustard">

            {stories.map((post: any) => (

              <Link
                key={post._id}
                href={`/blog/${post.slug.current}`}
                className="group block border-b border-navy/10 py-7 transition hover:bg-navy/[0.02]"
              >

                {post.coverImage && (
                  <div className="aspect-[16/7] overflow-hidden bg-shawl">

                    <img
                      src={urlFor(post.coverImage)
                        .width(1200)
                        .height(525)
                        .fit('crop')
                        .url()}
                      alt={post.title}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />

                  </div>
                )}

                <div className="pt-5">

                  <div className="flex flex-wrap items-center gap-3">

                    {post.category && (
                      <p className="font-body text-xs uppercase tracking-[0.12em] text-shawl">
                        {post.category.title}
                      </p>
                    )}

                    {post.publishedAt && (
                      <p className="font-body text-xs uppercase tracking-[0.12em] text-navy/45">
                        {new Date(post.publishedAt).toLocaleDateString()}
                      </p>
                    )}

                  </div>

                  <h2 className="mt-2 font-display text-2xl text-navy transition group-hover:text-shawl sm:text-3xl">
                    {post.title}
                  </h2>

                  {post.summary && (
                    <p className="mt-3 max-w-3xl font-body text-sm leading-6 text-navy/65 sm:text-base">
                      {post.summary}
                    </p>
                  )}

                  <span className="mt-5 inline-block font-body text-xs uppercase tracking-[0.12em] text-shawl transition group-hover:text-mustard">
                    Read story →
                  </span>

                </div>

              </Link>

            ))}

          </div>

        )}

      </div>

    </section>
  )
}
