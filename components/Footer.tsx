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
        <div className="mx-auto max-w-7xl px-6 py-8 sm:px-10 sm:py-10 lg:px-12">
          <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between sm:gap-12">
            <div className="max-w-xl">
              {settings?.logo ? (
                <Link href="/" className="inline-block">
                  <img
                    src={urlFor(settings.logo)
                      .height(70)
                      .fit('max')
                      .url()}
                    alt="Saraikistan"
                    className="h-10 w-auto max-w-[180px] object-contain sm:h-11"
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

              <p className="mt-3 max-w-md font-body text-xs leading-5 text-cream/60 sm:text-sm sm:leading-6">
                {settings?.tagline ||
                  'People · Culture · Heritage · Beyond — a digital home for the Saraiki region.'}
              </p>

              <Link
                href="/about"
                className="mt-4 inline-block border-b border-mustard pb-1 font-body text-[10px] uppercase tracking-[0.14em] text-cream transition hover:text-mustard"
              >
                Discover Saraikistan →
              </Link>
            </div>

            <div className="sm:min-w-[260px]">
              <p className="font-body text-[10px] uppercase tracking-[0.18em] text-mustard">
                Explore
              </p>

              <nav className="mt-3 grid grid-cols-2 gap-x-8 gap-y-2">
                {footerLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="font-body text-xs text-cream/65 transition hover:text-mustard sm:text-sm"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>
          </div>

          <div className="mt-7 border-t border-cream/10 pt-4">
            <div className="flex flex-col gap-1 font-body text-[10px] text-cream/35 sm:flex-row sm:items-center sm:justify-between sm:text-xs">
              <p>
                © {new Date().getFullYear()} Saraikistan. All rights reserved.
              </p>

              <p>A cultural archive of the Saraiki region.</p>
            </div>
          </div>
        </div>

        {footerImage && (
          <div className="h-16 w-full overflow-hidden sm:h-20">
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
