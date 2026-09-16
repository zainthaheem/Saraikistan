import { client } from '@/sanity/lib/client'
import { urlFor } from '@/sanity/lib/image'
import { PortableText } from '@portabletext/react'

export const revalidate = 60

async function getCultureItem(slug: string) {
  return client.fetch(
    `*[_type == "culture" && slug.current == $slug][0] {
      title,
      "category": category->{title},
      coverImage,
      gallery,
      videoUrl,
      body
    }`,
    { slug }
  )
}

export default async function CulturePage({
  params,
}: {
  params: { slug: string }
}) {
  const item = await getCultureItem(params.slug)

  if (!item) {
    return (
      <section className="mx-auto max-w-3xl px-6 py-16">
        <p className="font-body text-navy">Not found.</p>
      </section>
    )
  }

  return (
    <section>
      {item.coverImage && (
        <div
          className="h-56 w-full bg-cover bg-center sm:h-72"
          style={{ backgroundImage: `url(${urlFor(item.coverImage).width(1200).url()})` }}
        />
      )}

      <div className="mx-auto max-w-3xl px-6 py-12">
        {item.category && (
          <p className="font-body text-xs uppercase tracking-wide text-royal">
            {item.category.title}
          </p>
        )}
        <h1 className="mt-1 font-display text-3xl text-navy">{item.title}</h1>

        {item.videoUrl && (
          <div className="mt-6 aspect-video w-full">
            <iframe
              src={item.videoUrl.replace('watch?v=', 'embed/')}
              className="h-full w-full"
              allowFullScreen
            />
          </div>
        )}

        {item.body && (
          <div className="prose prose-sm mt-8 max-w-none font-body text-navy/80">
            <PortableText value={item.body} />
          </div>
        )}

        {item.gallery && item.gallery.length > 0 && (
          <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {item.gallery.map((img: any, i: number) => (
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
