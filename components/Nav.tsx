
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { client } from '@/sanity/lib/client'
import { urlFor } from '@/sanity/lib/image'

const links = [
  { href: '/culture', label: 'Culture' },
  { href: '/region', label: 'Places' },
  { href: '/celebrities', label: 'People' },
  { href: '/blog', label: 'Stories' },
  { href: '/news', label: 'News' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
]

export default function Nav() {
  const pathname = usePathname()
  const [logo, setLogo] = useState<any>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const mobileMenuRef = useRef<HTMLDivElement>(null)

  const isHome = pathname === '/'

  useEffect(() => {
    async function loadLogo() {
      try {
        const settings = await client.fetch(
          `*[_type == "siteSettings"][0]{ logo }`
        )

        if (settings?.logo) {
          setLogo(settings.logo)
        }
      } catch (error) {
        console.error('Failed to load logo:', error)
      }
    }

    loadLogo()
  }, [])

  // Close mobile menu whenever the page changes
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  // Close mobile menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node)
      ) {
        setMobileMenuOpen(false)
      }
    }

    if (mobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [mobileMenuOpen])

  // Close mobile menu when pressing Escape
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setMobileMenuOpen(false)
      }
    }

    if (mobileMenuOpen) {
      document.addEventListener('keydown', handleEscape)
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [mobileMenuOpen])

  const closeMobileMenu = () => {
    setMobileMenuOpen(false)
  }

  return (
    <header
      className={
        isHome
          ? 'absolute left-0 right-0 top-0 z-50 text-cream'
          : 'relative z-50 w-full bg-navy text-cream'
      }
    >
      <div
        className={
          isHome
            ? 'mx-auto flex max-w-7xl items-center gap-4 px-5 py-5 sm:px-8 lg:px-10'
            : 'mx-auto flex min-h-[104px] max-w-7xl items-center gap-4 px-5 py-5 sm:min-h-[112px] sm:px-8 lg:px-10'
        }
      >
        {/* Logo */}
        <Link
          href="/"
          onClick={closeMobileMenu}
          className="flex shrink-0 items-center transition-opacity hover:opacity-90"
        >
          {logo ? (
            <img
              src={urlFor(logo)
                .width(600)
                .quality(90)
                .format('webp')
                .url()}
              alt="Saraikistan"
              width={600}
              height={120}
              className="h-12 w-auto max-w-[190px] object-contain sm:h-14 sm:max-w-[225px] lg:h-16 lg:max-w-[245px]"
            />
          ) : (
            <span className="font-display text-2xl tracking-tight">
              Saraikistan
            </span>
          )}
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden min-w-0 flex-1 items-center justify-center gap-3 font-body text-[10px] uppercase tracking-[0.1em] sm:flex lg:gap-4 lg:text-[11px]">
          <Link
            href="/"
            className={`whitespace-nowrap border-b pb-1 transition ${
              isHome
                ? 'border-mustard text-cream'
                : 'border-transparent text-cream/90 hover:border-mustard hover:text-mustard'
            }`}
          >
            Home
          </Link>

          {links.map((link) => {
            const active =
              pathname === link.href ||
              pathname.startsWith(`${link.href}/`)

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`whitespace-nowrap border-b pb-1 transition ${
                  active
                    ? 'border-mustard text-mustard'
                    : 'border-transparent text-cream/90 hover:border-mustard hover:text-mustard'
                }`}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>

        {/* Desktop Search */}
        <Link
          href="/search"
          aria-label="Search"
          className="hidden shrink-0 items-center justify-center text-cream/90 transition hover:text-mustard sm:flex"
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
        </Link>

        {/* Mobile Menu */}
        <div
          ref={mobileMenuRef}
          className="relative ml-auto shrink-0 sm:hidden"
        >
          <button
            type="button"
            aria-label={
              mobileMenuOpen
                ? 'Close navigation menu'
                : 'Open navigation menu'
            }
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen((open) => !open)}
            className="flex cursor-pointer items-center text-cream transition hover:text-mustard"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              className="h-7 w-7"
            >
              {mobileMenuOpen ? (
                <>
                  <path d="M6 6l12 12" />
                  <path d="M18 6L6 18" />
                </>
              ) : (
                <>
                  <path d="M4 7h16" />
                  <path d="M4 12h16" />
                  <path d="M4 17h16" />
                </>
              )}
            </svg>
          </button>

          {/* Mobile Dropdown */}
          {mobileMenuOpen && (
            <div className="absolute right-0 top-12 z-50 w-64 border border-cream/20 bg-navy shadow-xl">
              <Link
                href="/"
                onClick={closeMobileMenu}
                className={`block border-b border-cream/10 px-6 py-4 font-body text-sm uppercase tracking-[0.12em] ${
                  isHome
                    ? 'text-mustard'
                    : 'text-cream hover:bg-shawl hover:text-mustard'
                }`}
              >
                Home
              </Link>

              {links.map((link) => {
                const active =
                  pathname === link.href ||
                  pathname.startsWith(`${link.href}/`)

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={closeMobileMenu}
                    className={`block border-b border-cream/10 px-6 py-4 font-body text-sm uppercase tracking-[0.12em] ${
                      active
                        ? 'text-mustard'
                        : 'text-cream hover:bg-shawl hover:text-mustard'
                    }`}
                  >
                    {link.label}
                  </Link>
                )
              })}

              <Link
                href="/search"
                onClick={closeMobileMenu}
                className="block px-6 py-4 font-body text-sm uppercase tracking-[0.12em] text-cream hover:bg-shawl hover:text-mustard"
              >
                Search
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
