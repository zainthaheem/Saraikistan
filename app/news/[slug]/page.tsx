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
      <section className="mx-auto max-w-3xl px-6 py-16">
        <p className="font-body text-navy">Not found.</p>
      </section>
    )
  }

  return (
    <section>
      {post.coverImage && (
        <div
          className="h-56 w-full bg-cover bg-center sm:h-72"
          style={{ backgroundImage: `url(${urlFor(post.coverImage).width(1200).url()})` }}
        />
      )}

      <div className="mx-auto max-w-3xl px-6 py-12">
        {post.category && (
          <p className="font-body text-xs uppercase tracking-wide text-royal">
            {post.category.title}
          </p>
        )}
        <h1 className="mt-1 font-display text-3xl text-navy">{post.title}</h1>
        {post.publishedAt && (
          <p className="mt-2 font-body text-xs text-navy/50">
            {new Date(post.publishedAt).toLocaleDateString()}
          </p>
        )}

        {post.videoUrl && (
          <div className="mt-6 aspect-video w-full">
            <iframe
              src={post.videoUrl.replace('watch?v=', 'embed/')}
              className="h-full w-full"
              allowFullScreen
            />
          </div>
        )}

        {post.body && (
          <div className="prose prose-sm mt-8 max-w-none font-body text-navy/80">
            <PortableText value={post.body} />
          </div>
        )}

        {post.gallery && post.gallery.length > 0 && (
          <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {post.gallery.map((img: any, i: number) => (
              <img
                key={i}
                src={urlFor(img).width(400).url()}
                alt=""
                className="aspect-square w-full object-cover"
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
