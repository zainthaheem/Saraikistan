import { client } from '@/sanity/lib/client'
import { urlFor } from '@/sanity/lib/image'
import { PortableText } from '@portabletext/react'

export const revalidate = 60

async function getPlace(slug: string) {
  return client.fetch(
    `*[_type == "place" && slug.current == $slug][0] {
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

export default async function PlacePage({
  params,
}: {
  params: { slug: string }
}) {
  const place = await getPlace(params.slug)

  if (!place) {
    return (
      <section className="mx-auto max-w-3xl px-6 py-16">
        <p className="font-body text-navy">Place not found.</p>
      </section>
    )
  }

  return (
    <section>
      {place.coverImage && (
        <div
          className="h-56 w-full bg-cover bg-center sm:h-72"
          style={{ backgroundImage: `url(${urlFor(place.coverImage).width(1200).url()})` }}
        />
      )}

      <div className="mx-auto max-w-3xl px-6 py-12">
        {place.category && (
          <p className="font-body text-xs uppercase tracking-wide text-royal">
            {place.category.title}
          </p>
        )}
        <h1 className="mt-1 font-display text-3xl text-navy">{place.title}</h1>

        {place.videoUrl && (
          <div className="mt-6 aspect-video w-full">
            <iframe
              src={place.videoUrl.replace('watch?v=', 'embed/')}
              className="h-full w-full"
              allowFullScreen
            />
          </div>
        )}

        {place.body && (
          <div className="prose prose-sm mt-8 max-w-none font-body text-navy/80">
            <PortableText value={place.body} />
          </div>
        )}

        {place.gallery && place.gallery.length > 0 && (
          <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {place.gallery.map((img: any, i: number) => (
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
