import { client } from '@/sanity/lib/client'
import { urlFor } from '@/sanity/lib/image'
import { PortableText } from '@portabletext/react'

export const revalidate = 60

async function getPerson(slug: string) {
  return client.fetch(
    `*[_type == "person" && slug.current == $slug][0] {
      name,
      "category": category->{title},
      profileImage,
      coverImage,
      gallery,
      bio,
      socialLinks
    }`,
    { slug }
  )
}

export default async function PersonPage({
  params,
}: {
  params: { slug: string }
}) {
  const person = await getPerson(params.slug)

  if (!person) {
    return (
      <section className="mx-auto max-w-3xl px-6 py-16">
        <p className="font-body text-navy">Person not found.</p>
      </section>
    )
  }

  return (
    <section>
      {person.coverImage && (
        <div
          className="h-56 w-full bg-cover bg-center sm:h-72"
          style={{ backgroundImage: `url(${urlFor(person.coverImage).width(1200).url()})` }}
        />
      )}

      <div className="mx-auto max-w-3xl px-6 py-12">
        <div className="flex items-center gap-4">
          {person.profileImage && (
            <img
              src={urlFor(person.profileImage).width(120).height(120).url()}
              alt={person.name}
              className="h-24 w-24 rounded-full border-4 border-cream object-cover"
            />
          )}
          <div>
            {person.category && (
              <p className="font-body text-xs uppercase tracking-wide text-royal">
                {person.category.title}
              </p>
            )}
            <h1 className="font-display text-3xl text-navy">{person.name}</h1>
          </div>
        </div>

        {person.socialLinks && person.socialLinks.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-3 font-body text-sm">
            {person.socialLinks.map((link: any, i: number) => (
              <a
                key={i}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-shawl underline underline-offset-4"
              >
                {link.platform}
              </a>
            ))}
          </div>
        )}

        {person.bio && (
          <div className="prose prose-sm mt-8 max-w-none font-body text-navy/80">
            <PortableText value={person.bio} />
          </div>
        )}

        {person.gallery && person.gallery.length > 0 && (
          <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {person.gallery.map((img: any, i: number) => (
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
