
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
      logo,
      siteTitle,
      tagline
    }
  `)
}

export default async function Footer() {
  const settings = await getFooterData()

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

      {/* FOOTER CONTENT */}
      <div className="mx-auto max-w-7xl px-6 py-9 sm:px-10 sm:py-10 lg:px-12 lg:py-12">

        {/* MAIN FOOTER GRID */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-[1.35fr_0.8fr_1fr] lg:gap-16">

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

            <p className="mt-4 max-w-md font-body text-sm leading-6 text-cream/55">
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
              className="mt-4 grid grid-cols-2 gap-x-6 gap-y-3"
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

            <div className="mt-4 space-y-3">

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
        <div className="mt-8 border-t border-cream/10 pt-5 sm:mt-10">

          <div className="flex flex-col gap-2 font-body text-xs leading-5 text-cream/35 sm:flex-row sm:items-center sm:justify-between">

            <p>
              © {new Date().getFullYear()} Saraikistan. All rights reserved.
            </p>

            <p>
              A cultural archive of the Saraiki region.
            </p>

          </div>

        </div>

      </div>

      {/* BOTTOM TEXTILE ACCENT */}
      <div
        aria-hidden="true"
        className="h-[10px] w-full border-t border-mustard/50"
        style={{
          backgroundImage:
            'repeating-linear-gradient(90deg, #C8923A 0px, #C8923A 5px, transparent 5px, transparent 22px)',
          backgroundSize: '22px 3px',
          backgroundPosition: 'bottom',
          backgroundRepeat: 'repeat-x',
        }}
      />

    </footer>
  )
}
