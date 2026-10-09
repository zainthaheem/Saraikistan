
'use client'

import { useState } from 'react'
import { PortableText } from '@portabletext/react'

type GalleryImage = {
  url: string
  alt: string
  caption: string
}

type MapLanguageContentProps = {
  title: string
  titleUr: string
  summary: string
  summaryUr: string
  content?: unknown
  contentUr?: unknown
  mainImageUrl: string
  mainImageAlt: string
  galleryImages: GalleryImage[]
}

export default function MapLanguageContent({
  title,
  titleUr,
  summary,
  summaryUr,
  content,
  contentUr,
  mainImageUrl,
  mainImageAlt,
  galleryImages,
}: MapLanguageContentProps) {
  const [language, setLanguage] = useState<'en' | 'ur'>('en')

  const isUrdu = language === 'ur'

  const displayedTitle = isUrdu
    ? titleUr || title
    : title

  const displayedSummary = isUrdu
    ? summaryUr || summary
    : summary

  const displayedContent = isUrdu
    ? contentUr
    : content

  const hasContent =
    Array.isArray(displayedContent) &&
    displayedContent.length > 0

  return (
    <article
      lang={isUrdu ? 'ur' : 'en'}
      dir={isUrdu ? 'rtl' : 'ltr'}
      className="w-full min-w-0"
    >
      <div
        dir="ltr"
        className="mb-8 w-full"
      >
        <div
          className="flex w-full items-center gap-5 border-b border-navy/10"
          aria-label="Choose language"
        >
          <button
            type="button"
            onClick={() => setLanguage('en')}
            aria-pressed={!isUrdu}
            lang="en"
            className={`relative min-h-12 border-b-2 px-1 py-3 font-body text-sm transition-colors duration-200 sm:text-base ${
              !isUrdu
                ? 'border-mustard text-navy'
                : 'border-transparent text-navy/50 hover:text-navy'
            }`}
          >
            English
          </button>

          <button
            type="button"
            onClick={() => setLanguage('ur')}
            aria-pressed={isUrdu}
            lang="ur"
            className={`relative min-h-12 border-b-2 px-1 py-3 font-body text-sm transition-colors duration-200 sm:text-base ${
              isUrdu
                ? 'border-mustard text-navy'
                : 'border-transparent text-navy/50 hover:text-navy'
            }`}
          >
            اردو
          </button>
        </div>
      </div>

      <header className="mb-8 sm:mb-10">
        <p
          dir="ltr"
          className={`font-body text-xs uppercase tracking-[0.16em] text-shawl ${
            isUrdu ? 'text-right' : 'text-left'
          }`}
        >
          Saraikistan
        </p>

        {displayedTitle && (
          <h1
            className={`mt-3 font-display text-4xl leading-tight text-navy sm:text-5xl lg:text-6xl ${
              isUrdu ? 'text-right' : 'text-left'
            }`}
          >
            {displayedTitle}
          </h1>
        )}

        {displayedSummary && (
          <p
            className={`mt-6 max-w-4xl font-body text-base leading-8 text-navy/75 sm:text-lg sm:leading-9 ${
              isUrdu ? 'text-right' : 'text-left'
            }`}
          >
            {displayedSummary}
          </p>
        )}
      </header>

      {mainImageUrl && (
        <figure className="mb-10 w-full">
          <a
            href={mainImageUrl}
            target="_blank"
            rel="noreferrer"
            aria-label="Open the full-size Saraikistan map"
            className="block w-full focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-shawl"
          >
            <img
              src={mainImageUrl}
              alt={mainImageAlt}
              width={2000}
              height={1400}
              loading="eager"
              fetchPriority="high"
              decoding="async"
              className="block h-auto w-full object-contain"
            />
          </a>
        </figure>
      )}

      {hasContent && (
        <section className="mb-10">
          <div
            className={`font-body text-base leading-8 text-navy/85 sm:text-lg sm:leading-9 ${
              isUrdu ? 'text-right' : 'text-left'
            }`}
          >
            <PortableText value={displayedContent as never} />
          </div>
        </section>
      )}

      {galleryImages.length > 0 && (
        <section
          aria-label={isUrdu ? 'مزید تصاویر' : 'More pictures'}
          className="mt-10"
        >
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {galleryImages.map((image, index) => (
              <figure
                key={`${image.url}-${index}`}
                className="min-w-0"
              >
                <a
                  href={image.url}
                  target="_blank"
                  rel="noreferrer"
                  className="block focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-shawl"
                  aria-label={
                    image.alt ||
                    (isUrdu
                      ? 'تصویر مکمل کھولیں'
                      : 'Open full-size image')
                  }
                >
                  <img
                    src={image.url}
                    alt={image.alt}
                    loading="lazy"
                    decoding="async"
                    className="block h-auto w-full object-contain"
                  />
                </a>

                {image.caption && (
                  <figcaption
                    className={`mt-3 font-body text-sm leading-6 text-navy/65 ${
                      isUrdu ? 'text-right' : 'text-left'
                    }`}
                  >
                    {image.caption}
                  </figcaption>
                )}
              </figure>
            ))}
          </div>
        </section>
      )}
    </article>
  )
}
