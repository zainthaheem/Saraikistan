
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

  const footerImageDesktop = settings?.footerImage
    ? urlFor(settings.footerImage)
        .width(1600)
        .height(200)
        .fit('crop')
        .quality(82)
        .format('webp')
        .url()
    : null

  const footerImageMobile = settings?.footerImage
    ? urlFor(settings.footerImage)
        .width(800)
        .height(100)
        .fit('crop')
        .quality(82)
        .format('webp')
        .url()
    : null

  const logoUrl = settings?.logo
    ? urlFor(settings.logo)
        .height(100)
        .fit('max')
        .quality(90)
        .format('webp')
        .url()
    : null

  return (
    <footer className="bg-navy text-cream">

      {/* TOP DECORATIVE RULE */}
      <div className="tile-rule" />

      {/* FOOTER CONTENT */}
      <section className="relative overflow-hidden">

        <div className="relative z-10 mx-auto max-w-7xl px-6 pt-7 pb-4 sm:px-10 sm:pt-9 sm:pb-5 lg:px-12 lg:pt-10 lg:pb-5">

          {/* MAIN COLUMNS */}
          <div className="grid gap-7 sm:grid-cols-2 sm:gap-8 lg:grid-cols-[1.35fr_0.8fr_1fr] lg:gap-16">

            {/* BRAND */}
            <div className="max-w-lg">

              {logoUrl ? (
                <Link
                  href="/"
                  className="inline-block"
                  aria-label="Saraikistan Home"
                >
                  <img
                    src={logoUrl}
                    alt="Saraikistan"
                    width={175}
                    height={100}
                    loading="lazy"
                    decoding="async"
                    className="h-9 w-auto max-w-[175px] object-contain sm:h-10"
                  />
                </Link>
              ) : (
                <Link
                  href="/"
                  className="font-display text-xl tracking-tight"
                >
                  {settings?.siteTitle || 'Saraikistan'}
                </Link>
              )}

              <p className="mt-3 max-w-md font-body text-xs leading-5 text-cream/55 sm:text-sm sm:leading-6">
                {settings?.tagline ||
                  'People · Culture · Heritage · Beyond — a digital home for the Saraiki region.'}
              </p>

            </div>

            {/* EXPLORE */}
            <div>

              <p className="font-body text-[10px] uppercase tracking-[0.18em] text-mustard">
                Explore
              </p>

              <nav
                aria-label="Footer navigation"
                className="mt-3 grid grid-cols-2 gap-x-7 gap-y-2"
              >

                {footerLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="font-body text-xs text-cream/55 transition hover:text-mustard sm:text-sm"
                  >
                    {link.label}
                  </Link>
                ))}

              </nav>

            </div>

            {/* CONNECT */}
            <div>

              <p className="font-body text-[10px] uppercase tracking-[0.18em] text-mustard">
                Connect
              </p>

              <div className="mt-3 space-y-2">

                <a
                  href="mailto:hello.saraikistan@gmail.com"
                  className="block break-words font-body text-xs text-cream/55 transition hover:text-mustard sm:text-sm"
                >
                  hello.saraikistan@gmail.com
                </a>

                <a
                  href="https://wa.me/923126789412"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block font-body text-xs text-cream/55 transition hover:text-mustard sm:text-sm"
                >
                  +92 312 6789412
                </a>

                <Link
                  href="/contact"
                  className="inline-block pt-1 font-body text-[10px] uppercase tracking-[0.12em] text-cream/55 transition hover:text-mustard"
                >
                  Contact Saraikistan →
                </Link>

              </div>

            </div>

          </div>

          {/* COPYRIGHT */}
          <div className="mt-6 border-t border-cream/10 pt-3 sm:mt-7 sm:pt-4">

            <div className="flex flex-col gap-1 font-body text-[10px] leading-5 text-cream/35 sm:flex-row sm:items-center sm:justify-between sm:text-xs">

              <p>
                © {new Date().getFullYear()} Saraikistan. All rights reserved.
              </p>

              <p>
                A cultural archive of the Saraiki region.
              </p>

            </div>

          </div>

        </div>

        {/* COMPACT TEXTILE BORDER */}
        {footerImageDesktop && footerImageMobile && (
          <div className="relative h-10 w-full overflow-hidden sm:h-12 lg:h-14">

            <img
              src={footerImageMobile}
              srcSet={`${footerImageMobile} 800w, ${footerImageDesktop} 1600w`}
              sizes="100vw"
              alt=""
              aria-hidden="true"
              width={1600}
              height={200}
              loading="lazy"
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover object-bottom"
            />

            <div className="absolute inset-0 bg-gradient-to-b from-navy/20 to-transparent" />

          </div>
        )}

      </section>

    </footer>
  )
}
