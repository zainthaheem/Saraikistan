import Link from 'next/link'

const links = [
  { href: '/celebrities', label: 'People' },
  { href: '/region', label: 'Places' },
  { href: '/culture', label: 'Culture' },
  { href: '/news', label: 'News' },
  { href: '/blog', label: 'Stories' },
  { href: '/about', label: 'About' },
]

export default function Nav() {
  return (
    <header className="bg-navy text-cream">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
        <Link href="/" className="font-display text-2xl">
          Saraikistan
        </Link>
        <nav className="hidden gap-6 font-body text-sm sm:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="border-b border-transparent pb-1 transition hover:border-mustard hover:text-mustard"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="tile-rule" />
    </header>
  )
}
