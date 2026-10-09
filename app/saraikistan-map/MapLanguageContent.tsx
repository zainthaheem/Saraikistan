'use client'
import { useState } from 'react'
type MapLanguageContentProps = {
  title: string
  titleUr?: string
  intro: string
  introUr?: string
  regionDescription: string
  regionDescriptionUr?: string
  boundaryDisclaimer: string
  boundaryDisclaimerUr?: string
  mainMapUrl: string
  mainMapAlt: string
  mainMapAltUr?: string
  mainMapCaption?: string
  mainMapCaptionUr?: string
  additionalImages: {
    url: string
    alt?: string
    altUr?: string
    caption?: string
    captionUr?: string
  }[]
}
export default function MapLanguageContent({
  title,
  titleUr,
  intro,
  introUr,
  regionDescription,
  regionDescriptionUr,
  boundaryDisclaimer,
  boundaryDisclaimerUr,
  mainMapUrl,
  mainMapAlt,
  mainMapAltUr,
  mainMapCaption,
  mainMapCaptionUr,
  additionalImages,
}: MapLanguageContentProps) {
  const [language, setLanguage] = useState<'en' | 'ur'>('en')
  const isUrdu = language === 'ur'
  const content = {
    eyebrow: isUrdu
      ? 'جغرافیہ، زبان اور ورثہ'
      : 'Geography, Language & Heritage',
    title: isUrdu ? titleUr || title : title,
    intro: isUrdu ? introUr || intro : intro,
    mapEyebrow: isUrdu ? 'ثقافتی نقشہ' : 'Cultural Atlas',
    mapHeading: isUrdu
      ? 'سرائیکی ثقافتی خطے کا جائزہ'
      : 'Explore the Saraiki Cultural Region',
    mapIntro: isUrdu
      ? 'سرائیکی ثقافتی خطے اور اس سے وابستہ شہروں اور ثقافتی مراکز کو نقشے میں دیکھیں۔'
      : 'Explore the Saraiki cultural region and discover its cities and cultural centres through this illustrative map.',
    mapAlt: isUrdu ? mainMapAltUr || mainMapAlt : mainMapAlt,
    mapCaption: isUrdu
      ? mainMapCaptionUr || mainMapCaption
      : mainMapCaption,
    viewMap: isUrdu ? 'مکمل نقشہ دیکھیں' : 'View Full Map',
    moreEyebrow: isUrdu ? 'مزید دریافت کریں' : 'Explore More',
    moreHeading: isUrdu
      ? 'مزید نقشے اور ثقافتی تصاویر'
      : 'More Maps & Cultural Images',
    moreIntro: isUrdu
      ? 'سرائیکی خطے سے متعلق مزید نقشے، علاقائی خاکے اور ثقافتی تصاویر دیکھیں۔'
      : 'Explore additional maps, regional illustrations and cultural photographs from the Saraiki region.',
    disclaimer: isUrdu
      ? boundaryDisclaimerUr || boundaryDisclaimer
      : boundaryDisclaimer,
    regionHeading: isUrdu
      ? 'سرائیکی ثقافتی خطے کے بارے میں'
      : 'About the Saraiki Cultural Region',
    regionDescription: isUrdu
      ? regionDescriptionUr || regionDescription
      : regionDescription,
    regionExtra: isUrdu
      ? 'ملتان، ڈیرہ غازی خان، بہاولپور اور دیگر ثقافتی مراکز اس خطے کی متنوع تاریخ اور شناخت میں اہم کردار ادا کرتے ہیں۔ مختلف علاقوں میں زبان اور ثقافتی وابستگی مختلف ہو سکتی ہے، اس لیے اس خطے کی کوئی ایک متفقہ سرکاری حد نہیں سمجھی جانی چاہیے۔'
      : "Multan, Dera Ghazi Khan, Bahawalpur and other cultural centres contribute to the region's diverse history and identity. Language use and cultural affiliations vary across localities, so the region should not be understood as having one universally agreed official boundary.",
    regionClosing: isUrdu
      ? 'یہ نقشہ ثقافتی اور لسانی آگاہی کے لیے تیار کیا گیا ہے، سرکاری انتظامی حدود کی مستند نمائندگی کے لیے نہیں۔'
      : 'This map is intended for cultural and linguistic awareness, not as an authoritative representation of official administrative boundaries.',
    placesEyebrow: isUrdu ? 'مقامات دریافت کریں' : 'Discover Destinations',
    placesTitle: isUrdu ? 'مقامات اور شہر' : 'Places & Cities',
    placesDescription: isUrdu
      ? 'سرائیکستان پر درج شہروں، تاریخی مقامات اور ثقافتی مراکز کو دریافت کریں۔'
      : 'Explore the cities, historic sites, landmarks and cultural places documented on Saraikistan.',
    placesLink: isUrdu ? 'مقامات دیکھیں' : 'Explore Places',
    cultureEyebrow: isUrdu ? 'روایات دریافت کریں' : 'Discover Traditions',
    cultureTitle: isUrdu ? 'سرائیکی ثقافت' : 'Saraiki Culture',
    cultureDescription: isUrdu
      ? 'سرائیکی زبان، لوک موسیقی، شاعری، روایات اور ثقافتی ورثے کے بارے میں جانیں۔'
      : 'Discover Saraiki language, folk music, poetry, traditions and cultural heritage.',
    cultureLink: isUrdu ? 'ثقافت دیکھیں' : 'Explore Culture',
  }
  return (
    <div
      dir={isUrdu ? 'rtl' : 'ltr'}
      lang={isUrdu ? 'ur' : 'en'}
      className={isUrdu ? 'text-right' : 'text-left'}
    >
      {/* LANGUAGE SWITCHER */}
      <div
        dir="ltr"
        className="mb-10 grid w-full grid-cols-[1fr_auto] items-center border-b border-navy/10 sm:mb-12"
      >
        <div aria-hidden="true" />
        <div className="flex min-w-0 flex-row items-center justify-end font-body text-sm">
          <button
            type="button"
            onClick={() => setLanguage('en')}
            aria-pressed={!isUrdu}
            className={`min-h-12 shrink-0 border-b-2 px-4 py-3 transition-colors ${
              !isUrdu
                ? 'border-mustard font-semibold text-navy'
                : 'border-transparent text-navy/50 hover:text-shawl'
            }`}
          >
            English
          </button>
          <span
            aria-hidden="true"
            className="text-navy/25"
          >
            |
          </span>
          <button
            type="button"
            onClick={() => setLanguage('ur')}
            aria-pressed={isUrdu}
            className={`min-h-12 shrink-0 border-b-2 px-4 py-3 transition-colors ${
              isUrdu
                ? 'border-mustard font-semibold text-navy'
                : 'border-transparent text-navy/50 hover:text-shawl'
            }`}
          >
            اردو
          </button>
        </div>
      </div>
      {/* PAGE INTRODUCTION */}
      <section className="pb-12 sm:pb-16">
        <div className="pb-8 sm:pb-10">
          <p className="font-body text-sm text-shawl">
            {content.eyebrow}
          </p>
          <h1 className="mt-4 font-display text-4xl leading-tight text-navy sm:text-5xl lg:text-6xl">
            {content.title}
          </h1>
          <p className="mt-5 max-w-3xl whitespace-pre-line font-body text-base leading-8 text-navy/70 sm:text-lg sm:leading-9">
            {content.intro}
          </p>
        </div>
      </section>
      {/* MAIN CULTURAL MAP */}
      <section
        aria-labelledby="map-heading"
        className="pb-12 sm:pb-16"
      >
        <div className="border-t border-mustard pt-7 sm:pt-9">
          <p className="font-body text-xs uppercase tracking-[0.16em] text-shawl">
            {content.mapEyebrow}
          </p>
          <h2
            id="map-heading"
            className="mt-3 font-display text-3xl leading-tight text-navy sm:text-4xl"
          >
            {content.mapHeading}
          </h2>
          <p className="mt-4 max-w-3xl font-body text-base leading-8 text-navy/70 sm:text-lg sm:leading-9">
            {content.mapIntro}
          </p>
          <figure className="mt-7 sm:mt-9">
            <a
              href={mainMapUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={content.viewMap}
              className="block focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-shawl"
            >
              <img
                src={mainMapUrl}
                alt={content.mapAlt}
                width={1536}
                height={1024}
                fetchPriority="high"
                decoding="async"
                className="block h-auto w-full"
              />
            </a>
            {content.mapCaption && (
              <figcaption className="mt-4 whitespace-pre-line font-body text-sm leading-7 text-navy/65 sm:text-base">
                {content.mapCaption}
              </figcaption>
            )}
          </figure>
          <a
            href={mainMapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 flex min-h-14 w-full items-center justify-center bg-mustard px-5 py-4 text-center font-body text-sm font-semibold text-navy transition-colors hover:bg-[#B17B29] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-shawl sm:w-auto"
          >
            {content.viewMap}
          </a>
          <p className="mt-5 whitespace-pre-line font-body text-sm leading-7 text-navy/65 sm:text-base sm:leading-8">
            {content.disclaimer}
          </p>
        </div>
      </section>
      {/* ADDITIONAL CULTURAL IMAGES */}
      {additionalImages.length > 0 && (
        <section className="pb-12 sm:pb-16">
          <div className="border-t border-mustard pt-7 sm:pt-9">
            <p className="font-body text-xs uppercase tracking-[0.16em] text-shawl">
              {content.moreEyebrow}
            </p>
            <h2 className="mt-3 font-display text-3xl leading-tight text-navy sm:text-4xl">
              {content.moreHeading}
            </h2>
            <p className="mt-4 max-w-3xl font-body text-base leading-8 text-navy/70 sm:text-lg sm:leading-9">
              {content.moreIntro}
            </p>
          </div>
          <div className="mt-7 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {additionalImages.map((image, index) => {
              const imageAlt = isUrdu
                ? image.altUr || image.alt || 'سرائیکی ثقافتی تصویر'
                : image.alt || `Saraikistan cultural image ${index + 1}`
              const imageCaption = isUrdu
                ? image.captionUr || image.caption
                : image.caption
              return (
                <figure
                  key={`${image.url}-${index}`}
                  className="min-w-0 border-b border-navy/10 pb-5"
                >
                  <a
                    href={image.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={imageAlt}
                    className="block focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-shawl"
                  >
                    <img
                      src={image.url}
                      alt={imageAlt}
                      width={1000}
                      height={700}
                      loading="lazy"
                      decoding="async"
                      className="block h-auto w-full"
                    />
                  </a>
                  {imageCaption && (
                    <figcaption className="whitespace-pre-line pt-3 font-body text-sm leading-7 text-navy/65">
                      {imageCaption}
                    </figcaption>
                  )}
                </figure>
              )
            })}
          </div>
        </section>
      )}
      {/* ABOUT THE REGION */}
      <section className="pb-12 sm:pb-16">
        <div className="border-t border-mustard pt-7 sm:pt-9">
          <h2 className="font-display text-3xl leading-tight text-navy sm:text-4xl">
            {content.regionHeading}
          </h2>
          <div className="mt-5 max-w-4xl space-y-4 font-body text-base leading-8 text-navy/70 sm:text-lg sm:leading-9">
            <p className="whitespace-pre-line">
              {content.regionDescription}
            </p>
            <p>{content.regionExtra}</p>
            <p>{content.regionClosing}</p>
          </div>
        </div>
      </section>
      {/* RELATED SECTIONS */}
      <section className="pb-10 pt-4 sm:pb-12 sm:pt-6">
        <div className="grid gap-5 sm:grid-cols-2">
          <a
            href="/region"
            className="group block border-b border-navy/15 bg-[#E7DCC8] p-6 transition-colors hover:bg-[#E1D3BA] sm:p-8"
          >
            <p className="font-body text-xs uppercase tracking-[0.16em] text-shawl">
              {content.placesEyebrow}
            </p>
            <h2 className="mt-4 font-display text-3xl leading-tight text-navy sm:text-4xl">
              {content.placesTitle}
            </h2>
            <p className="mt-4 font-body text-base leading-8 text-navy/70">
              {content.placesDescription}
            </p>
            <span className="mt-6 inline-block font-body text-sm font-semibold text-shawl transition-colors group-hover:text-navy">
              {content.placesLink} →
            </span>
          </a>
          <a
            href="/culture"
            className="group block border-b border-navy/15 bg-[#E7DCC8] p-6 transition-colors hover:bg-[#E1D3BA] sm:p-8"
          >
            <p className="font-body text-xs uppercase tracking-[0.16em] text-shawl">
              {content.cultureEyebrow}
            </p>
            <h2 className="mt-4 font-display text-3xl leading-tight text-navy sm:text-4xl">
              {content.cultureTitle}
            </h2>
            <p className="mt-4 font-body text-base leading-8 text-navy/70">
              {content.cultureDescription}
            </p>
            <span className="mt-6 inline-block font-body text-sm font-semibold text-shawl transition-colors group-hover:text-navy">
              {content.cultureLink} →
            </span>
          </a>
        </div>
      </section>
    </div>
  )
}
