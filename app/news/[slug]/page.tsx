import { client } from '@/sanity/lib/client'
import { urlFor } from '@/sanity/lib/image'
import { PortableText } from '@portabletext/react'

export const revalidate = 60

async function getNewsPost(slug: string) {
  return client.fetch(
    `*[_type == "newsPost" && slug.current == $slug][0] {
      title,
      "category": category->{title},
      publishedAt,
      coverImage,
      gallery,
      videoUrl,
      body
    }`,
    { slug }
  )
}

export default async function NewsPostPage({
  params,
}: {
  params: { slug: string }
}) {
  const post = await getNewsPost(params.slug)

  if (!post) {
    return (
      <section className="min-h-screen bg-cream text-navy">
        <div className="mx-auto max-w-7xl px-6 pb-20 pt-6 sm:px-10 sm:pt-8 lg:px-12">
          <div className="border-t border-mustard pt-7">
            <p className="font-body text-base leading-7 text-navy/65 sm:text-lg">
              Not found.
            </p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="min-h-screen bg-cream text-navy">

      {/* Cover Image */}
      {post.coverImage && (
        <div className="h-56 w-full overflow-hidden bg-shawl sm:h-72 lg:h-96">
          <img
            src={urlFor(post.coverImage)
              .width(1800)
              .height(700)
              .fit('crop')
              .url()}
            alt={post.title}
            className="h-full w-full object-cover"
          />
        </div>
      )}

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-6 pb-20 pt-8 sm:px-10 sm:pt-10 lg:px-12">

        {/* Article Header */}
        <div className="border-t border-mustard pt-7">

          {post.category && (
            <p className="font-body text-sm text-shawl">
              {post.category.title}
            </p>
          )}

          <h1 className="mt-2 max-w-4xl font-display text-4xl leading-tight text-navy sm:text-5xl">
            {post.title}
          </h1>

          {post.publishedAt && (
            <p className="mt-4 font-body text-sm text-navy/50">
              {new Date(post.publishedAt).toLocaleDateString()}
            </p>
          )}

        </div>

        {/* Video */}
        {post.videoUrl && (
          <div className="mt-10 aspect-video w-full overflow-hidden bg-navy">
            <iframe
              src={post.videoUrl.replace('watch?v=', 'embed/')}
              className="h-full w-full"
              title={post.title}
              allowFullScreen
            />
          </div>
        )}

        {/* Article Body */}
        {post.body && (
          <div className="mt-10 max-w-3xl">

            <p className="font-body text-sm text-shawl">
              Article
            </p>

            <div className="prose prose-sm mt-4 max-w-none font-body leading-7 text-navy/75 sm:prose-base">
              <PortableText value={post.body} />
            </div>

          </div>
        )}

        {/* Gallery */}
        {post.gallery && post.gallery.length > 0 && (
          <div className="mt-14">

            <div className="mb-6">
              <p className="font-body text-sm text-shawl">
                Gallery
              </p>

              <h2 className="mt-2 font-display text-3xl text-navy sm:text-4xl">
                Photos
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">

              {post.gallery.map((img: any, i: number) => (
                <div
                  key={i}
                  className="aspect-square overflow-hidden bg-shawl"
                >
                  <img
                    src={urlFor(img)
                      .width(600)
                      .height(600)
                      .fit('crop')
                      .url()}
                    alt=""
                    className="h-full w-full object-cover transition duration-500 hover:scale-105"
                  />
                </div>
              ))}

            </div>

          </div>
        )}

      </div>

    </section>
  )
}
