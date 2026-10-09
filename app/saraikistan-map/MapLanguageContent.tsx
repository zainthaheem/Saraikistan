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

  const text = {
    title: isUrdu ? titleUr || title : title,
    intro: isUrdu ? introUr || intro : intro,
    regionDescription: isUrdu
      ? regionDescriptionUr || regionDescription
      : regionDescription,
    disclaimer: isUrdu
      ? boundaryDisclaimerUr || boundaryDisclaimer
      : boundaryDisclaimer,
    mapAlt: isUrdu ? mainMapAltUr || mainMapAlt : mainMapAlt,
    mapCaption: isUrdu
      ? mainMapCaptionUr || mainMapCaption
      : mainMapCaption,
  }

  return (
    <div dir={isUrdu ? 'rtl' : 'ltr'} lang={isUrdu ? 'ur' : 'en'}>
      <div className="mb-8 flex items-center gap-1 border-b border-navy/10 pb-3 font-body text-xs">
        <button
          type="button"
          onClick={() => setLanguage('en')}
          aria-pressed={!isUrdu}
          className={`px-3 py-2 transition ${
            !isUrdu
              ? 'border-b border-mustard text-navy'
              : 'text-navy/45 hover:text-shawl'
          }`}
        >
          English
        </button>

        <span className="text-navy/20">|</span>

        <button
          type="button"
          onClick={() => setLanguage('ur')}
          aria-pressed={isUrdu}
          className={`px-3 py-2 transition ${
            isUrdu
              ? 'border-b border-mustard text-navy'
              : 'text-navy/45 hover:text-shawl'
          }`}
        >
          اردو
        </button>
      </div>

      <section className="max-w-4xl pb-10 sm:pb-12">
        <p className="font-body text-sm text-shawl">
          {isUrdu ? 'جغرافیہ، زبان اور ورثہ' : 'Geography, language & heritage'}
        </p>

        <h1 className="mt-2 font-display text-4xl leading-tight text-navy sm:text-5xl">
          {text.title}
        </h1>

        <p className="mt-5 max-w-3xl whitespace-pre-line font-body text-base leading-8 text-navy/65 sm:text-lg sm:leading-9">
          {text.intro}
        </p>
      </section>

      <section
        aria-labelledby="map-heading"
        className="pb-10 sm:pb-12"
      >
        <div className="border-t border-mustard pt-7">
          <div className="mb-6 max-w-4xl">
            <p className="font-body text-xs uppercase tracking-[0.16em] text-shawl">
              {isUrdu ? 'ثقافتی نقشہ' : 'Cultural atlas'}
            </p>

            <h2
              id="map-heading"
              className="mt-2 font-display text-2xl leading-tight text-navy sm:text-3xl"
            >
              {isUrdu
                ? 'سرائیکی ثقافتی خطے کا جائزہ'
                : 'Explore the Saraiki Cultural Region'}
            </h2>

            <p className="mt-3 font-body text-sm leading-7 text-navy/65 sm:text-base sm:leading-8">
              {isUrdu
                ? 'سرائیکی ثقافتی خطے کو قریب سے دیکھنے کے لیے مکمل نقشہ کھولیں۔'
                : 'View the full-size map for a closer look at the Saraiki cultural region.'}
            </p>
          </div>

          <figure>
            <a
              href={mainMapUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={
                isUrdu
                  ? 'سرائیکستان کا مکمل نقشہ کھولیں'
                  : 'Open the full-size Saraikistan cultural map'
              }
              className="block focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-shawl"
            >
              <img
                src={mainMapUrl}
                alt={text.mapAlt}
                width={1536}
                height={1024}
                fetchPriority="high"
                decoding="async"
                className="block h-auto w-full"
              />
            </a>

            {text.mapCaption && (
              <figcaption className="mt-3 whitespace-pre-line font-body text-sm leading-7 text-navy/65">
                {text.mapCaption}
              </figcaption>
            )}
          </figure>

          <div className="mt-5">
            <a
              href={mainMapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-12 w-full items-center justify-center border border-mustard bg-mustard px-5 py-3 text-center font-body text-xs font-semibold uppercase tracking-[0.1em] text-navy transition-colors hover:border-[#B17B29] hover:bg-[#B17B29] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-shawl sm:w-auto"
            >
              {isUrdu ? 'مکمل نقشہ دیکھیں' : 'View Full Map'}
            </a>
          </div>

          <p className="mt-4 whitespace-pre-line font-body text-xs leading-7 text-navy/60">
            {text.disclaimer}
          </p>
        </div>
      </section>

      {additionalImages.length > 0 && (
        <section className="pb-12 sm:pb-14">
          <div className="mb-6 border-t border-mustard pt-7">
            <p className="font-body text-xs uppercase tracking-[0.16em] text-shawl">
              {isUrdu ? 'مزید دریافت کریں' : 'More to discover'}
            </p>

            <h2 className="mt-2 font-display text-3xl text-navy sm:text-4xl">
              {isUrdu
                ? 'مزید نقشے اور ثقافتی تصاویر'
                : 'More Maps & Cultural Images'}
            </h2>

            <p className="mt-3 max-w-3xl font-body text-base leading-8 text-navy/65">
              {isUrdu
                ? 'سرائیکی خطے کے مزید نقشے، علاقائی خاکے اور ثقافتی تصاویر دیکھیں۔'
                : 'Explore additional maps, regional illustrations and cultural photographs from the Saraiki region.'}
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {additionalImages.map((image, index) => (
              <figure
                key={`${image.url}-${index}`}
                className="border-b border-navy/10 pb-5"
              >
                <a
                  href={image.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={
                    isUrdu
                      ? 'ثقافتی تصویر دیکھیں'
                      : `View ${image.alt || `cultural image ${index + 1}`}`
                  }
                  className="block focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-shawl"
                >
                  <img
                    src={image.url}
                    alt={
                      isUrdu
                        ? image.altUr || image.alt || 'سرائیکی ثقافتی تصویر'
                        : image.alt || 'Saraikistan cultural image'
                    }
                    width={1000}
                    height={700}
                    loading="lazy"
                    decoding="async"
                    className="block h-auto w-full"
                  />
                </a>

                {(isUrdu ? image.captionUr || image.caption : image.caption) && (
                  <figcaption className="whitespace-pre-line pt-3 font-body text-sm leading-7 text-navy/65">
                    {isUrdu
                      ? image.captionUr || image.caption
                      : image.caption}
                  </figcaption>
                )}
              </figure>
            ))}
          </div>
        </section>
      )}

      <section className="pb-12 sm:pb-14">
        <div className="max-w-4xl border-t border-mustard pt-7">
          <h2 className="font-display text-3xl leading-tight text-navy sm:text-4xl">
            {isUrdu
              ? 'سرائیکی ثقافتی خطے کے بارے میں'
              : 'About the Saraiki Cultural Region'}
          </h2>

          <div className="mt-5 space-y-4 font-body text-base leading-8 text-navy/65 sm:text-lg sm:leading-9">
            <p className="whitespace-pre-line">
              {text.regionDescription}
            </p>

            <p>
              {isUrdu
                ? 'ملتان، ڈیرہ غازی خان، بہاولپور اور دیگر ثقافتی مراکز اس خطے کی متنوع تاریخ اور شناخت میں اہم کردار ادا کرتے ہیں۔ مختلف علاقوں میں زبان اور ثقافتی وابستگی مختلف ہو سکتی ہے، اس لیے اس خطے کی کوئی ایک متفقہ سرکاری حد نہیں سمجھی جانی چاہیے۔'
                : "Multan, Dera Ghazi Khan, Bahawalpur and other cultural centres contribute to the region's diverse history and identity. Language use and cultural affiliations vary across localities, so the region should not be understood as having one universally agreed official boundary."}
            </p>

            <p>
              {isUrdu
                ? 'یہ سرائیکستان نقشہ اس ثقافتی اور لسانی منظرنامے کا تعارف پیش کرتا ہے۔ اس کا مقصد تعلیمی اور ثقافتی آگاہی ہے، نہ کہ سرکاری انتظامی حدود کی مستند نمائندگی۔'
                : 'This Saraikistan map provides a visual introduction to that cultural and linguistic landscape. It is intended for educational and cultural exploration, rather than as an authoritative administrative map.'}
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
