export default function Footer() {
  return (
    <footer className="bg-navy text-cream">
      <div className="tile-rule" />
      <div className="mx-auto max-w-5xl px-6 py-10 font-body text-sm">
        <p className="font-display text-lg text-cream">Saraikistan</p>
        <p className="mt-2 max-w-md text-cream/70">
          People · Culture · Heritage · Beyond — a digital home for the
          people, culture, language and timeless beauty of the Saraiki
          region.
        </p>
        <p className="mt-6 text-xs text-cream/50">
          © {new Date().getFullYear()} Saraikistan. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
