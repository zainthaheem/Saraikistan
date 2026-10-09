import type { Metadata } from 'next'
import Link from 'next/link'
import { client } from '@/sanity/lib/client'
import MapLanguageContent from './MapLanguageContent'
export const revalidate = 60
const fallbackMap = {
  title: 'Saraikistan Map',
  seoTitle: 'Saraikistan Map | Saraiki Cultural Region & Cities',
  seoDescription:
    'Explore the Saraikistan map, discover the Saraiki cultural region in Pakistan, and learn about its cities and heritage.',
  intro:
    'Explore the Saraiki cultural region through our illustrative Saraikistan map. Discover the wider geographical context of Saraiki-speaking communities, important cultural centres and the heritage that connects them.',
  mainMap: null,
  regionDescription:
    'The Saraiki cultural region is associated with the Saraiki language and a rich heritage of folk music, poetry, Sufi traditions, literature and local customs. Its cultural landscape is particularly associated with southern Punjab and extends into adjoining areas where Saraiki-speaking communities live.',
  regionExtra: '',
  regionClosing: '',
  boundaryDisclaimer:
    'This is an illustrative cultural and linguistic map. It does not represent official administrative boundaries.',
  additionalImages: [],
}
async function getMapContent() {
  try {
    const map = await client.fetch(`
      *[_type == "saraikistanMap" && published == true]
        | order(_updatedAt desc)[0] {
          title,
          titleUr,
          seoTitle,
          seoTitleUr,
          seoDescription,
          seoDescriptionUr,
          intro,
          introUr,
          "mainMap": mainMap {
            "url": asset->url,
            alt,
            altUr,
            caption,
            captionUr
          },
          "additionalImages": additionalImages[] {
            "url": asset->url,
            alt,
            altUr,
            caption,
            captionUr
          },
          regionDescription,
          regionDescriptionUr,
          regionExtra,
          regionExtraUr,
          regionClosing,
          regionClosingUr,
          boundaryDisclaimer,
          boundaryDisclaimerUr,
          placesCardTitle,
          placesCardTitleUr,
          placesCardDescription,
          placesCardDescriptionUr,
          placesCardLinkLabel,
          placesCardLinkLabelUr,
          cultureCardTitle,
          cultureCardTitleUr,
          cultureCardDescription,
          cultureCardDescriptionUr,
          cultureCardLinkLabel,
          cultureCardLinkLabelUr
        }
    `)
    return map || fallbackMap
  } catch {
    return fallbackMap
  }
}
type MapImage = {
  url?: string
  alt?: string
  altUr?: string
  caption?: string
  captionUr?: string
}
type MapContent = {
  title?: string
  titleUr?: string
  seoTitle?: string
  seoTitleUr?: string
  seoDescription?: string
  seoDescriptionUr?: string
  intro?: string
  introUr?: string
  mainMap?: MapImage | null
  additionalImages?: MapImage[]
  regionDescription?: string
  regionDescriptionUr?: string
  regionExtra?: string
  regionExtraUr?: string
  regionClosing?: string
  regionClosingUr?: string
  boundaryDisclaimer?: string
  boundaryDisclaimerUr?: string
  placesCardTitle?: string
  placesCardTitleUr?: string
  placesCardDescription?: string
  placesCardDescriptionUr?: string
  placesCardLinkLabel?: string
  placesCardLinkLabelUr?: string
  cultureCardTitle?: string
  cultureCardTitleUr?: string
  cultureCardDescription?: string
  cultureCardDescriptionUr?: string
  cultureCardLinkLabel?: string
  cultureCardLinkLabelUr?: string
}
export async function generateMetadata(): Promise<Metadata> {
  const map = (await getMapContent()) as MapContent
  const title = map.seoTitle || fallbackMap.seoTitle
  const description =
    map.seoDescription || fallbackMap.seoDescription
  const imageUrl =
    map.mainMap?.url ||
    'https://saraikistan.org/images/saraikistan-cultural-map.webp'
  return {
    title,
    description,
    alternates: {
      canonical: 'https://saraikistan.org/saraikistan-map',
    },
    openGraph: {
      title,
      description,
      url: 'https://saraikistan.org/saraikistan-map',
      siteName: 'Saraikistan',
      type: 'website',
      images: [
        {
          url: imageUrl,
          alt: map.mainMap?.alt || 'Saraikistan cultural region map',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
  }
}
export default async function SaraikistanMapPage() {
  const map = (await getMapContent()) as MapContent
  const mainMapUrl =
    map.mainMap?.url ||
    '/images/saraikistan-cultural-map.webp'
  const mainMapAlt =
    map.mainMap?.alt ||
    'Saraikistan map illustrating the Saraiki cultural region and selected cities in Pakistan.'
  const additionalImages = (map.additionalImages || [])
    .filter(
      (image): image is MapImage & { url: string } =>
        Boolean(image.url)
    )
    .map((image) => ({
      url: image.url,
      alt: image.alt,
      altUr: image.altUr,
      caption: image.caption,
      captionUr: image.captionUr,
    }))
  return (
    <main className="min-h-screen bg-cream text-navy">
      <section className="mx-auto max-w-7xl px-6 pb-10 pt-6 sm:px-10 sm:pb-12 sm:pt-8 lg:px-12">
        <MapLanguageContent
          title={map.title || fallbackMap.title}
          titleUr={map.titleUr}
          intro={map.intro || fallbackMap.intro}
          introUr={map.introUr}
          regionDescription={
            map.regionDescription ||
            fallbackMap.regionDescription
          }
          regionDescriptionUr={map.regionDescriptionUr}
          regionExtra={map.regionExtra}
          regionExtraUr={map.regionExtraUr}
          regionClosing={map.regionClosing}
          regionClosingUr={map.regionClosingUr}
          boundaryDisclaimer={
            map.boundaryDisclaimer ||
            fallbackMap.boundaryDisclaimer
          }
          boundaryDisclaimerUr={map.boundaryDisclaimerUr}
          mainMapUrl={mainMapUrl}
          mainMapAlt={mainMapAlt}
          mainMapAltUr={map.mainMap?.altUr}
          mainMapCaption={map.mainMap?.caption}
          mainMapCaptionUr={map.mainMap?.captionUr}
          additionalImages={additionalImages}
          placesCardTitle={map.placesCardTitle}
          placesCardTitleUr={map.placesCardTitleUr}
          placesCardDescription={map.placesCardDescription}
          placesCardDescriptionUr={map.placesCardDescriptionUr}
          placesCardLinkLabel={map.placesCardLinkLabel}
          placesCardLinkLabelUr={map.placesCardLinkLabelUr}
          cultureCardTitle={map.cultureCardTitle}
          cultureCardTitleUr={map.cultureCardTitleUr}
          cultureCardDescription={map.cultureCardDescription}
          cultureCardDescriptionUr={map.cultureCardDescriptionUr}
          cultureCardLinkLabel={map.cultureCardLinkLabel}
          cultureCardLinkLabelUr={map.cultureCardLinkLabelUr}
        />
      </section>
    </main>
  )
}
