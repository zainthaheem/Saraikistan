
import type { Metadata } from 'next'
import MapLanguageContent from './MapLanguageContent'

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

const englishContent = [
  {
    _type: 'block',
    _key: 'english-introduction',
    style: 'normal',
    markDefs: [],
    children: [
      {
        _type: 'span',
        _key: 'english-introduction-text',
        marks: [],
        text: 'Saraikistan represents the historic cultural and linguistic region associated with the Saraiki language and its communities. Its cultural landscape includes cities, towns, historic sites, shrines, river plains and traditions that have shaped generations of Saraiki people.',
      },
    ],
  },
  {
    _type: 'block',
    _key: 'english-geography',
    style: 'normal',
    markDefs: [],
    children: [
      {
        _type: 'span',
        _key: 'english-geography-text',
        marks: [],
        text: 'The map highlights important centres such as Multan, Bahawalpur, Dera Ghazi Khan, Rahim Yar Khan, Muzaffargarh, Layyah, Bhakkar and neighbouring areas with significant Saraiki-speaking communities. The extent of Saraiki language and cultural identity varies across localities.',
      },
    ],
  },
  {
    _type: 'block',
    _key: 'english-note',
    style: 'normal',
    markDefs: [],
    children: [
      {
        _type: 'span',
        _key: 'english-note-text',
        marks: [],
        text: 'A cultural and linguistic illustration, this map is intended for educational and heritage exploration. It does not represent an official administrative boundary, and language use may extend beyond the areas shown.',
      },
    ],
  },
]

const urduContent = [
  {
    _type: 'block',
    _key: 'urdu-introduction',
    style: 'normal',
    markDefs: [],
    children: [
      {
        _type: 'span',
        _key: 'urdu-introduction-text',
        marks: [],
        text: 'سرائیکستان اس تاریخی ثقافتی اور لسانی خطے کی نمائندگی کرتا ہے جو سرائیکی زبان اور اس سے وابستہ برادریوں کی پہچان ہے۔ اس خطے کی ثقافت میں شہر، قصبے، تاریخی مقامات، مزارات، دریائی میدان اور وہ روایات شامل ہیں جنہوں نے نسل در نسل سرائیکی لوگوں کی زندگی کو تشکیل دیا ہے۔',
      },
    ],
  },
  {
    _type: 'block',
    _key: 'urdu-geography',
    style: 'normal',
    markDefs: [],
    children: [
      {
        _type: 'span',
        _key: 'urdu-geography-text',
        marks: [],
        text: 'اس نقشے میں ملتان، بہاولپور، ڈیرہ غازی خان، رحیم یار خان، مظفرگڑھ، لیہ، بھکر اور ان کے آس پاس کے ایسے علاقوں کو نمایاں کیا گیا ہے جہاں سرائیکی زبان بولنے والی نمایاں آبادیاں موجود ہیں۔ مختلف علاقوں میں سرائیکی زبان اور ثقافتی شناخت کی موجودگی اور وسعت مختلف ہو سکتی ہے۔',
      },
    ],
  },
  {
    _type: 'block',
    _key: 'urdu-note',
    style: 'normal',
    markDefs: [],
    children: [
      {
        _type: 'span',
        _key: 'urdu-note-text',
        marks: [],
        text: 'یہ نقشہ ثقافتی، لسانی اور تعلیمی معلومات کے لیے تیار کیا گیا ہے۔ اسے کسی سرکاری انتظامی یا سیاسی حد بندی کا نقشہ نہ سمجھا جائے۔ سرائیکی زبان کا استعمال نقشے میں دکھائے گئے علاقوں سے باہر بھی پایا جا سکتا ہے۔',
      },
    ],
  },
]

export default function SaraikistanMapPage() {
  return (
    <main className="min-h-screen bg-cream text-navy">
      <section className="mx-auto max-w-7xl px-6 pb-16 pt-12 sm:px-10 sm:pb-20 sm:pt-16 lg:px-12 lg:pt-20">
        <MapLanguageContent
          title="Saraikistan Map"
          titleUr="سرائیکستان کا نقشہ"
          summary="Explore the Saraiki cultural region through an illustrated map highlighting its cities, cultural centres, language and heritage."
          summaryUr="سرائیکی ثقافتی خطے کا ایک وضاحتی نقشہ دیکھیں، جس میں اس کے شہر، ثقافتی مراکز، زبان اور ورثے کو نمایاں کیا گیا ہے۔"
          content={englishContent}
          contentUr={urduContent}
          mainImageUrl="/images/saraikistan-cultural-map.webp"
          mainImageAlt="Illustrated map of the Saraiki cultural and linguistic region"
          galleryImages={[]}
        />
      </section>
    </main>
  )
}
