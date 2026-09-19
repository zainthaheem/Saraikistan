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
        <div className="mx-auto max-w-7xl px-6 py-10 sm:px-10 sm:py-12 lg:px-12">
          <div className="grid gap-9 sm:grid-cols-[1.35fr_1fr] sm:gap-12">
            <div>
              {settings?.logo ? (
                <Link href="/" className="inline-block">
                  <img
                    src={urlFor(settings.logo)
                      .height(80)
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

              <p className="mt-4 max-w-lg font-body text-sm leading-6 text-cream/65">
                {settings?.tagline ||
                  'People · Culture · Heritage · Beyond — a digital home for the people, culture, language and timeless beauty of the Saraiki region.'}
              </p>

              <Link
                href="/about"
                className="mt-5 inline-block border-b border-mustard pb-1 font-body text-[11px] uppercase tracking-[0.14em] text-cream transition hover:text-mustard"
              >
                Discover Saraikistan →
              </Link>
            </div>

            <div>
              <p className="font-body text-[11px] uppercase tracking-[0.18em] text-mustard">
                Explore
              </p>

              <nav className="mt-4 grid grid-cols-2 gap-x-6 gap-y-3">
                {footerLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="font-body text-sm text-cream/70 transition hover:text-mustard"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>
          </div>

          <div className="mt-9 border-t border-cream/15 pt-5">
            <div className="flex flex-col gap-2 font-body text-[11px] text-cream/40 sm:flex-row sm:items-center sm:justify-between">
              <p>
                © {new Date().getFullYear()} Saraikistan. All rights reserved.
              </p>

              <p>
                A cultural archive of the Saraiki region.
              </p>
            </div>
          </div>
        </div>

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
