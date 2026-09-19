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
        .height(700)
        .fit('crop')
        .url()
    : null

  return (
    <footer className="bg-navy text-cream">
      <div className="tile-rule" />

      <section className="relative overflow-hidden">
        {footerImage && (
          <img
            src={footerImage}
            alt="Saraikistan landscape"
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}

        <div className="absolute inset-0 bg-navy/80" />

        <div className="relative mx-auto max-w-7xl px-6 py-16 sm:px-10 sm:py-20 lg:px-12">
          <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr]">
            <div>
              {settings?.logo ? (
                <Link href="/" className="inline-block">
                  <img
                    src={urlFor(settings.logo)
                      .height(100)
                      .fit('max')
                      .url()}
                    alt="Saraikistan"
                    className="h-14 w-auto max-w-[240px] object-contain sm:h-16"
                  />
                </Link>
              ) : (
                <Link
                  href="/"
                  className="font-display text-3xl tracking-tight"
                >
                  {settings?.siteTitle || 'Saraikistan'}
                </Link>
              )}

              <p className="mt-6 max-w-xl font-body text-sm leading-7 text-cream/75 sm:text-base">
                {settings?.tagline ||
                  'People · Culture · Heritage · Beyond — a digital home for the people, culture, language and timeless beauty of the Saraiki region.'}
              </p>

              <Link
                href="/about"
                className="mt-7 inline-block border-b border-mustard pb-1 font-body text-xs uppercase tracking-[0.14em] text-cream transition hover:text-mustard"
              >
                Discover Saraikistan →
              </Link>
            </div>

            <div>
              <p className="font-body text-xs uppercase tracking-[0.18em] text-mustard">
                Explore
              </p>

              <nav className="mt-5 grid grid-cols-2 gap-x-8 gap-y-4">
                {footerLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="font-body text-sm text-cream/75 transition hover:text-mustard"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>
          </div>

          <div className="mt-14 border-t border-cream/15 pt-6">
            <div className="flex flex-col gap-3 font-body text-xs text-cream/45 sm:flex-row sm:items-center sm:justify-between">
              <p>
                © {new Date().getFullYear()} Saraikistan. All rights reserved.
              </p>

              <p>
                A cultural archive of the Saraiki region.
              </p>
            </div>
          </div>
        </div>
      </section>
    </footer>
  )
}
