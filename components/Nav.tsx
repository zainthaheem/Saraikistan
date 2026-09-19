import Link from 'next/link'
import { client } from '@/sanity/lib/client'
import { urlFor } from '@/sanity/lib/image'

export const revalidate = 60

const links = [
  { href: '/culture', label: 'Culture' },
  { href: '/region', label: 'Places' },
  { href: '/celebrities', label: 'People' },
  { href: '/blog', label: 'Stories' },
  { href: '/news', label: 'News' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
]

async function getSettings() {
  return client.fetch(`*[_type == "siteSettings"][0]{ logo }`)
}

export default async function Nav() {
  const settings = await getSettings()

  return (
    <header className="absolute left-0 right-0 top-0 z-50 bg-transparent text-cream">

      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8 lg:px-10">

        {/* Logo */}
        <Link
          href="/"
          className="flex items-center transition-opacity hover:opacity-90"
        >
          {settings?.logo ? (
            <img
              src={urlFor(settings.logo).height(80).url()}
              alt="Saraikistan"
              className="h-11 w-auto object-contain sm:h-12"
            />
          ) : (
            <span className="font-display text-2xl tracking-tight">
              Saraikistan
            </span>
          )}
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-6 font-body text-xs uppercase tracking-[0.12em] sm:flex lg:gap-7">

          <Link
            href="/"
            className="border-b border-mustard pb-1 text-cream transition hover:text-mustard"
          >
            Home
          </Link>

          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="border-b border-transparent pb-1 text-cream/90 transition hover:border-mustard hover:text-mustard"
            >
              {link.label}
            </Link>
          ))}

        </nav>

        {/* Desktop Search */}
        <div className="hidden items-center sm:flex">
          <button
            type="button"
            aria-label="Search"
            className="text-cream/90 transition hover:text-mustard"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              className="h-5 w-5"
            >
              <circle cx="11" cy="11" r="6.5" />
              <path d="m16 16 4.5 4.5" />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        <details className="relative sm:hidden">

          <summary
            aria-label="Open navigation menu"
            className="flex cursor-pointer list-none items-center text-cream transition hover:text-mustard [&::-webkit-details-marker]:hidden"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              className="h-7 w-7"
            >
              <path d="M4 7h16" />
              <path d="M4 12h16" />
              <path d="M4 17h16" />
            </svg>
          </summary>

          {/* Mobile Dropdown */}
          <div className="absolute right-0 top-12 z-50 w-64 border border-cream/20 bg-navy shadow-xl">

            <Link
              href="/"
              className="block border-b border-cream/10 px-6 py-4 font-body text-sm uppercase tracking-[0.12em] text-cream hover:bg-shawl hover:text-mustard"
            >
              Home
            </Link>

            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block border-b border-cream/10 px-6 py-4 font-body text-sm uppercase tracking-[0.12em] text-cream hover:bg-shawl hover:text-mustard"
              >
                {link.label}
              </Link>
            ))}

            <Link
              href="/search"
              className="block px-6 py-4 font-body text-sm uppercase tracking-[0.12em] text-cream hover:bg-shawl hover:text-mustard"
            >
              Search
            </Link>

          </div>

        </details>

      </div>

    </header>
  )
}
