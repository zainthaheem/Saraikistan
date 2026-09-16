import { client } from '@/sanity/lib/client'
import { urlFor } from '@/sanity/lib/image'
import { PortableText } from '@portabletext/react'

export const revalidate = 60

async function getStory(slug: string) {
  return client.fetch(
    `*[_type == "story" && slug.current == $slug][0] {
      title,
      "category": category->{title},
      publishedAt,
      coverImage,
      gallery,
      videoUrl,
      body,
      "relatedPersonName": relatedPerson->name,
      "relatedPersonSlug": relatedPerson->slug.current
    }`,
    { slug }
  )
}

export default async function StoryPage({
  params,
}: {
  params: { slug: string }
}) {
  const story = await getStory(params.slug)

  if (!story) {
    return (
      <section className="mx-auto max-w-3xl px-6 py-16">
        <p className="font-body text-navy">Not found.</p>
      </section>
    )
  }

  return (
    <section>
      {story.coverImage && (
        <div
          className="h-56 w-full bg-cover bg-center sm:h-72"
          style={{ backgroundImage: `url(${urlFor(story.coverImage).width(1200).url()})` }}
        />
      )}

      <div className="mx-auto max-w-3xl px-6 py-12">
        {story.category && (
          <p className="font-body text-xs uppercase tracking-wide text-royal">
            {story.category.title}
          </p>
        )}
        <h1 className="mt-1 font-display text-3xl text-navy">{story.title}</h1>
        {story.publishedAt && (
          <p className="mt-2 font-body text-xs text-navy/50">
            {new Date(story.publishedAt).toLocaleDateString()}
          </p>
        )}

        {story.relatedPersonName && (
          <a
            href={`/celebrities/${story.relatedPersonSlug}`}
            className="mt-2 inline-block font-body text-sm text-shawl underline underline-offset-4"
          >
            About {story.relatedPersonName} →
          </a>
        )}

        {story.videoUrl && (
          <div className="mt-6 aspect-video w-full">
            <iframe
              src={story.videoUrl.replace('watch?v=', 'embed/')}
              className="h-full w-full"
              allowFullScreen
            />
          </div>
        )}

        {story.body && (
          <div className="prose prose-sm mt-8 max-w-none font-body text-navy/80">
            <PortableText value={story.body} />
          </div>
        )}

        {story.gallery && story.gallery.length > 0 && (
          <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {story.gallery.map((img: any, i: number) => (
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
