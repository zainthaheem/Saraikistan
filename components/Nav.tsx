import Link from 'next/link'
import { client } from '@/sanity/lib/client'
import { urlFor } from '@/sanity/lib/image'

export const revalidate = 60

const links = [
  { href: '/celebrities', label: 'People' },
  { href: '/region', label: 'Places' },
  { href: '/culture', label: 'Culture' },
  { href: '/news', label: 'News' },
  { href: '/blog', label: 'Stories' },
  { href: '/about', label: 'About' },
]

async function getSettings() {
  return client.fetch(`*[_type == "siteSettings"][0]{ logo }`)
}

export default async function Nav() {
  const settings = await getSettings()

  return (
    <header className="bg-navy text-cream">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
        <Link href="/" className="flex items-center gap-3 font-display text-2xl">
          {settings?.logo ? (
            <img
              src={urlFor(settings.logo).height(48).url()}
              alt="Saraikistan"
              className="h-10 w-auto"
            />
          ) : (
            'Saraikistan'
          )}
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
