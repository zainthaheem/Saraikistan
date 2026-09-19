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
      <section className="min-h-screen bg-cream text-navy">
        <div className="mx-auto max-w-7xl px-6 pb-20 pt-6 sm:px-10 sm:pt-8 lg:px-12">
          <div className="border-t border-mustard pt-7">
            <p className="font-body text-base leading-7 text-navy/65 sm:text-lg">
              Place not found.
            </p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="min-h-screen bg-cream text-navy">

      {/* Cover Image */}
      {place.coverImage && (
        <div className="h-56 w-full overflow-hidden bg-shawl sm:h-72 lg:h-96">
          <img
            src={urlFor(place.coverImage)
              .width(1800)
              .height(700)
              .fit('crop')
              .url()}
            alt={place.title}
            className="h-full w-full object-cover"
          />
        </div>
      )}

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-6 pb-20 pt-8 sm:px-10 sm:pt-10 lg:px-12">

        <div className="border-t border-mustard pt-7">

          {/* Category */}
          {place.category && (
            <p className="font-body text-sm text-shawl">
              {place.category.title}
            </p>
          )}

          {/* Title */}
          <h1 className="mt-2 max-w-4xl font-display text-4xl leading-tight text-navy sm:text-5xl">
            {place.title}
          </h1>

        </div>

        {/* Video */}
        {place.videoUrl && (
          <div className="mt-10 aspect-video w-full overflow-hidden bg-navy">
            <iframe
              src={place.videoUrl.replace('watch?v=', 'embed/')}
              className="h-full w-full"
              title={place.title}
              allowFullScreen
            />
          </div>
        )}

        {/* Body */}
        {place.body && (
          <div className="mt-10 max-w-3xl">

            <p className="font-body text-sm text-shawl">
              About this place
            </p>

            <div className="prose prose-sm mt-4 max-w-none font-body leading-7 text-navy/75 sm:prose-base">
              <PortableText value={place.body} />
            </div>

          </div>
        )}

        {/* Gallery */}
        {place.gallery && place.gallery.length > 0 && (
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

              {place.gallery.map((img: any, i: number) => (
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
