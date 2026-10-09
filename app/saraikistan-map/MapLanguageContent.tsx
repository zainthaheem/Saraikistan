'use client'

import { useState } from 'react'

type MapLanguageContentProps = {
  title: string
  titleUr?: string
  summary?: string
  summaryUr?: string
  content?: string
  contentUr?: string
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
  summary,
  summaryUr,
  content,
  contentUr,
  mainMapUrl,
  mainMapAlt,
  mainMapAltUr,
  mainMapCaption,
  mainMapCaptionUr,
  additionalImages,
}: MapLanguageContentProps) {
  const [language, setLanguage] = useState<'en' | 'ur'>('en')
  const isUrdu = language === 'ur'

  const displayedTitle = isUrdu ? titleUr || title : title
  const displayedSummary = isUrdu
    ? summaryUr || summary
    : summary
  const displayedContent = isUrdu
    ? contentUr || content
    : content
  const displayedMapAlt = isUrdu
    ? mainMapAltUr || mainMapAlt
    : mainMapAlt
  const displayedMapCaption = isUrdu
    ? mainMapCaptionUr || mainMapCaption
    : mainMapCaption

  return (
    <div
      dir={isUrdu ? 'rtl' : 'ltr'}
      lang={isUrdu ? 'ur' : 'en'}
      className={isUrdu ? 'text-right' : 'text-left'}
    >
      <div
        dir="ltr"
        className="mb-8 flex w-full justify-start border-b border-navy/10 sm:mb-10"
      >
        <div className="flex items-center font-body text-sm">
          <button
            type="button"
            onClick={() => setLanguage('en')}
            aria-pressed={!isUrdu}
            className={`min-h-12 border-b-2 px-4 py-3 transition-colors ${
              !isUrdu
                ? 'border-mustard font-semibold text-navy'
                : 'border-transparent text-navy/60 hover:text-shawl'
            }`}
          >
            English
          </button>

          <span aria-hidden="true" className="text-navy/30">
            |
          </span>

          <button
            type="button"
            onClick={() => setLanguage('ur')}
            aria-pressed={isUrdu}
            className={`min-h-12 border-b-2 px-4 py-3 transition-colors ${
              isUrdu
                ? 'border-mustard font-semibold text-navy'
                : 'border-transparent text-navy/60 hover:text-shawl'
            }`}
          >
            اردو
          </button>
        </div>
      </div>

      <header className="pb-8 sm:pb-10">
        <h1 className="font-display text-4xl leading-tight text-navy sm:text-5xl lg:text-6xl">
          {displayedTitle}
        </h1>

        {displayedSummary && (
          <p className="mt-5 max-w-3xl whitespace-pre-line font-body text-base leading-8 text-navy/70 sm:text-lg sm:leading-9">
            {displayedSummary}
          </p>
        )}

        {displayedContent && (
          <div className="mt-5 max-w-4xl whitespace-pre-line font-body text-base leading-8 text-navy/80 sm:text-lg sm:leading-9">
            {displayedContent}
          </div>
        )}
      </header>

      <section className="border-t border-mustard pt-6 sm:pt-8">
        <figure>
          <a
            href={mainMapUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={isUrdu ? 'مکمل نقشہ دیکھیں' : 'View full map'}
            className="block focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-shawl"
          >
            <img
              src={mainMapUrl}
              alt={displayedMapAlt}
              width={1536}
              height={1024}
              fetchPriority="high"
              decoding="async"
              className="block h-auto w-full"
            />
          </a>

          {displayedMapCaption && (
            <figcaption className="mt-3 whitespace-pre-line font-body text-sm leading-7 text-navy/65 sm:text-base">
              {displayedMapCaption}
            </figcaption>
          )}
        </figure>

        <a
          href={mainMapUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-flex min-h-12 items-center justify-center bg-mustard px-5 py-3 font-body text-sm font-semibold text-navy transition-colors hover:bg-[#B17B29] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-shawl"
        >
          {isUrdu ? 'مکمل نقشہ دیکھیں' : 'View Full Map'}
        </a>
      </section>

      {additionalImages.length > 0 && (
        <section className="mt-10 border-t border-navy/15 pt-6 sm:mt-12 sm:pt-8">
          <h2 className="font-display text-2xl leading-tight text-navy sm:text-3xl">
            {isUrdu ? 'مزید تصاویر' : 'More Pictures'}
          </h2>

          <div className="mt-6 grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
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
                  className="min-w-0"
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
                    <figcaption className="mt-3 whitespace-pre-line font-body text-sm leading-7 text-navy/65">
                      {imageCaption}
                    </figcaption>
                  )}
                </figure>
              )
            })}
          </div>
        </section>
      )}
    </div>
  )
}
