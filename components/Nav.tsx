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
]

async function getSettings() {
  return client.fetch(`*[_type == "siteSettings"][0]{ logo }`)
}

export default async function Nav() {
  const settings = await getSettings()

  return (
    <header className="bg-navy text-cream">
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
        <nav className="hidden items-center gap-7 font-body text-xs uppercase tracking-[0.12em] sm:flex lg:gap-8">
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

        {/* Search Icon */}
        <div className="hidden sm:flex items-center">
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

        {/* Mobile Menu Icon */}
        <div className="flex items-center sm:hidden">
          <button
            type="button"
            aria-label="Open menu"
            className="text-cream transition hover:text-mustard"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              className="h-6 w-6"
            >
              <path d="M4 7h16" />
              <path d="M4 12h16" />
              <path d="M4 17h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Textile / Tile Accent */}
      <div className="tile-rule" />
    </header>
  )
}
