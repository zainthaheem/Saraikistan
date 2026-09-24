
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

  // Optimized footer background images
  const footerImageDesktop = settings?.footerImage
    ? urlFor(settings.footerImage)
        .width(1600)
        .height(230)
        .fit('crop')
        .quality(72)
        .format('webp')
        .url()
    : null

  const footerImageMobile = settings?.footerImage
    ? urlFor(settings.footerImage)
        .width(800)
        .height(115)
        .fit('crop')
        .quality(72)
        .format('webp')
        .url()
    : null

  // Keep the logo sharp
  const logoUrl = settings?.logo
    ? urlFor(settings.logo)
        .height(75)
        .fit('max')
        .quality(90)
        .format('webp')
        .url()
    : null

  return (
    <footer className="bg-navy text-cream">

      {/* TOP DECORATIVE RULE */}
      <div className="tile-rule" />

      <section className="relative overflow-hidden">

        {/* MAIN FOOTER */}
        <div className="relative z-10 mx-auto max-w-7xl px-6 py-8 sm:px-10 sm:py-10 lg:px-12 lg:py-11">

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-[1.35fr_0.8fr_1fr] lg:gap-16">

            {/* BRAND */}
            <div className="max-w-lg">

              {logoUrl ? (
                <Link href="/" className="inline-block">
                  <img
                    src={logoUrl}
                    alt="Saraikistan"
                    width={175}
                    height={75}
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

              <nav className="mt-3 grid grid-cols-2 gap-x-7 gap-y-2">

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
                  className="block font-body text-xs text-cream/55 transition hover:text-mustard sm:text-sm"
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
          <div className="mt-7 border-t border-cream/10 pt-4">

            <div className="flex flex-col gap-1 font-body text-[10px] text-cream/30 sm:flex-row sm:items-center sm:justify-between sm:text-xs">

              <p>
                © {new Date().getFullYear()} Saraikistan. All rights reserved.
              </p>

              <p>
                A cultural archive of the Saraiki region.
              </p>

            </div>

          </div>

        </div>

        {/* OPTIMIZED TEXTILE FOOTER IMAGE */}
        {footerImageDesktop && footerImageMobile && (
          <div className="relative h-14 w-full overflow-hidden sm:h-16 lg:h-20">

            <img
              src={footerImageDesktop}
              srcSet={`${footerImageMobile} 800w, ${footerImageDesktop} 1600w`}
              sizes="100vw"
              alt=""
              aria-hidden="true"
              width={1600}
              height={230}
              loading="lazy"
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover object-bottom"
            />

            <div className="absolute inset-0 bg-gradient-to-b from-navy via-navy/20 to-transparent" />

          </div>
        )}

      </section>

    </footer>
  )
}
