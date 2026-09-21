import Link from 'next/link'
import { client } from '@/sanity/lib/client'
import { urlFor } from '@/sanity/lib/image'

export const revalidate = 60

const footerLinks = [
  { href: '/culture', label: 'Culture' },
  { href: '/region', label: 'Places' },
  { href: '/celebrities', label: 'People' },
  { href: '/blog', label: 'Stories' },
  { href: '/news', label: 'News' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
]

async function getFooterData() {
  return client.fetch(`
    *[_type == "siteSettings"][0]{
      footerImage,
      logo,
      siteTitle,
      tagline
    }
  `)
}

export default async function Footer() {
  const settings = await getFooterData()

  const footerImage = settings?.footerImage
    ? urlFor(settings.footerImage)
        .width(1800)
        .height(400)
        .fit('crop')
        .url()
    : null

  return (
    <footer className="bg-navy text-cream">

      <div className="tile-rule" />

      <section>

        <div className="mx-auto max-w-7xl px-6 py-10 sm:px-10 sm:py-14 lg:px-12">

          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr] lg:gap-16">

            {/* BRAND */}
            <div className="max-w-xl">

              {settings?.logo ? (
                <Link href="/" className="inline-block">
                  <img
                    src={urlFor(settings.logo)
                      .height(90)
                      .fit('max')
                      .url()}
                    alt="Saraikistan"
                    className="h-11 w-auto max-w-[200px] object-contain sm:h-12"
                  />
                </Link>
              ) : (
                <Link
                  href="/"
                  className="font-display text-2xl tracking-tight"
                >
                  {settings?.siteTitle || 'Saraikistan'}
                </Link>
              )}

              <p className="mt-4 max-w-md font-body text-sm leading-6 text-cream/60">
                {settings?.tagline ||
                  'People · Culture · Heritage · Beyond — a digital home for the Saraiki region.'}
              </p>

              <p className="mt-5 max-w-md font-body text-sm leading-6 text-cream/45">
                A growing digital archive documenting the people, places,
                language, traditions and stories of the Saraiki region.
              </p>

              <Link
                href="/about"
                className="mt-6 inline-block border-b border-mustard pb-1 font-body text-[10px] uppercase tracking-[0.14em] text-cream transition hover:text-mustard"
              >
                About Saraikistan →
              </Link>

            </div>


            {/* EXPLORE */}
            <div>

              <p className="font-body text-[10px] uppercase tracking-[0.18em] text-mustard">
                Explore
              </p>

              <nav className="mt-4 grid grid-cols-2 gap-x-8 gap-y-3">

                {footerLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="font-body text-sm text-cream/60 transition hover:text-mustard"
                  >
                    {link.label}
                  </Link>
                ))}

              </nav>

            </div>


            {/* CONTACT */}
            <div>

              <p className="font-body text-[10px] uppercase tracking-[0.18em] text-mustard">
                Connect
              </p>

              <div className="mt-4 space-y-3">

                <a
                  href="mailto:hello.saraikistan@gmail.com"
                  className="block font-body text-sm text-cream/60 transition hover:text-mustard"
                >
                  hello.saraikistan@gmail.com
                </a>

                <a
                  href="https://wa.me/923126789412"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block font-body text-sm text-cream/60 transition hover:text-mustard"
                >
                  +92 312 6789412
                </a>

                <Link
                  href="/contact"
                  className="inline-block pt-2 font-body text-[10px] uppercase tracking-[0.14em] text-cream/60 transition hover:text-mustard"
                >
                  Contact Saraikistan →
                </Link>

              </div>

            </div>

          </div>


          {/* COPYRIGHT */}
          <div className="mt-10 border-t border-cream/10 pt-5">

            <div className="flex flex-col gap-2 font-body text-[10px] text-cream/35 sm:flex-row sm:items-center sm:justify-between sm:text-xs">

              <p>
                © {new Date().getFullYear()} Saraikistan. All rights reserved.
              </p>

              <p>
                A cultural archive of the Saraiki region.
              </p>

            </div>

          </div>

        </div>


        {/* FOOTER IMAGE */}
        {footerImage && (
          <div className="h-20 w-full overflow-hidden sm:h-24">

            <img
              src={footerImage}
              alt=""
              aria-hidden="true"
              className="h-full w-full object-cover object-bottom"
            />

          </div>
        )}

      </section>

    </footer>
  )
}
