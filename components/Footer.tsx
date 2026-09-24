
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

  // Optimized original textile image for desktop
  const footerImageDesktop = settings?.footerImage
    ? urlFor(settings.footerImage)
        .width(1200)
        .quality(80)
        .format('webp')
        .url()
    : null

  // Smaller textile image for mobile
  const footerImageMobile = settings?.footerImage
    ? urlFor(settings.footerImage)
        .width(500)
        .quality(80)
        .format('webp')
        .url()
    : null

  // Keep the logo sharp
  const logoUrl = settings?.logo
    ? urlFor(settings.logo)
        .height(120)
        .fit('max')
        .quality(90)
        .format('webp')
        .url()
    : null

  return (
    <footer className="relative overflow-hidden bg-navy text-cream">

      {/* TOP DECORATIVE RULE */}
      <div className="tile-rule" />

      {/* MAIN FOOTER CONTENT */}
      <div className="mx-auto max-w-7xl px-6 pb-4 pt-7 sm:px-10 sm:pb-5 sm:pt-8 lg:px-12 lg:pb-5 lg:pt-9">

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-[1.35fr_0.8fr_1fr] lg:gap-16">

          {/* BRAND */}
          <div className="max-w-lg">

            {logoUrl ? (
              <Link
                href="/"
                className="inline-block transition-opacity hover:opacity-90"
              >
                <img
                  src={logoUrl}
                  alt="Saraikistan"
                  width={240}
                  height={120}
                  loading="lazy"
                  decoding="async"
                  className="h-10 w-auto max-w-[220px] object-contain sm:h-12"
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

            <p className="mt-3 max-w-md font-body text-sm leading-6 text-cream/55">
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
              className="mt-3 grid grid-cols-2 gap-x-6 gap-y-2"
            >
              {footerLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="font-body text-sm text-cream/60 transition-colors duration-200 hover:text-mustard"
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
                className="block break-words font-body text-sm text-cream/60 transition-colors duration-200 hover:text-mustard"
              >
                hello.saraikistan@gmail.com
              </a>

              <a
                href="https://wa.me/923126789412"
                target="_blank"
                rel="noopener noreferrer"
                className="block font-body text-sm text-cream/60 transition-colors duration-200 hover:text-mustard"
              >
                +92 312 6789412
              </a>

              <Link
                href="/contact"
                className="inline-block pt-1 font-body text-[10px] uppercase tracking-[0.12em] text-cream/60 transition-colors duration-200 hover:text-mustard"
              >
                Contact Saraikistan →
              </Link>

            </div>

          </div>

        </div>

        {/* COPYRIGHT */}
        <div className="mt-6 border-t border-cream/10 pt-3 sm:mt-7 sm:pt-4">

          <div className="flex flex-col gap-1 font-body text-xs leading-5 text-cream/35 sm:flex-row sm:items-center sm:justify-between">

            <p>
              © {new Date().getFullYear()} Saraikistan. All rights reserved.
            </p>

            <p>
              A cultural archive of the Saraiki region.
            </p>

          </div>

        </div>

      </div>

      {/* ORIGINAL CULTURAL TEXTILE IMAGE */}
      {footerImageDesktop && footerImageMobile && (
        <div className="relative h-10 w-full overflow-hidden border-t border-mustard/50 sm:h-12 lg:h-14">

          <img
            src={footerImageDesktop}
            srcSet={`${footerImageMobile} 500w, ${footerImageDesktop} 1200w`}
            sizes="100vw"
            alt=""
            aria-hidden="true"
            width={1200}
            height={480}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover object-bottom"
          />

          <div className="absolute inset-0 bg-gradient-to-b from-navy/10 via-transparent to-navy/20" />

        </div>
      )}

    </footer>
  )
}
