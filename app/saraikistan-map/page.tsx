import type { Metadata } from 'next'
import SaraikistanMapContent from './SaraikistanMapContent'

export const metadata: Metadata = {
  title: 'Saraikistan Map | Saraiki Cultural Region & Cities',
  description:
    'Explore the Saraiki cultural and linguistic region through an illustrated map highlighting its cities, heritage and cultural identity.',
  alternates: {
    canonical: 'https://saraikistan.org/saraikistan-map',
  },
  openGraph: {
    title: 'Saraikistan Map | Saraiki Cultural Region',
    description:
      'Discover the cities, cultural centres and heritage of the Saraiki region through the Saraikistan cultural map.',
    url: 'https://saraikistan.org/saraikistan-map',
    siteName: 'Saraikistan',
    type: 'website',
    images: [
      {
        url: 'https://saraikistan.org/images/saraikistan-cultural-map.webp',
        alt: 'Saraikistan cultural and linguistic region map',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Saraikistan Map | Saraiki Cultural Region',
    description:
      'Explore Saraiki cities, heritage and cultural identity through the Saraikistan map.',
    images: [
      'https://saraikistan.org/images/saraikistan-cultural-map.webp',
    ],
  },
}

export default function SaraikistanMapPage() {
  return (
    <main className="min-h-screen bg-cream text-navy">
      <SaraikistanMapContent />
    </main>
  )
}
