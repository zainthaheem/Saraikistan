
'use client'

import { useState } from 'react'
import { PortableText } from '@portabletext/react'
import { urlFor } from '@/sanity/lib/image'

export default function LanguageSwitcher({
  english,
  urdu,
  englishLabel = 'Biography',
  urduLabel = 'سوانح',
}: {
  english: any
  urdu?: any
  englishLabel?: string
  urduLabel?: string
}) {
  const [language, setLanguage] = useState<'en' | 'ur'>('en')
  const [activeImage, setActiveImage] = useState<any>(null)

  const hasUrdu = urdu && urdu.length > 0

  const closeImage = () => setActiveImage(null)

  const showPrevious = () => {
    if (!activeImage) return

    setActiveImage((current: any) => ({
      ...current,
      index: Math.max(0, current.index - 1),
    }))
  }

  const showNext = () => {
    if (!activeImage) return

    setActiveImage((current: any) => ({
      ...current,
      index: Math.min(
        current.images.length - 1,
        current.index + 1
      ),
    }))
  }

  // Renders both legacy image blocks and new biography image objects.
  const renderBiographyImage = (value: any, imageValue?: any) => {
    const image = imageValue || value

    if (!image?.asset) return null

    const imageUrl = urlFor(image)
      .width(1400)
      .quality(80)
      .auto('format')
      .url()

    const fullImageUrl = urlFor(image)
      .width(2200)
      .quality(90)
      .auto('format')
      .url()

    const caption = value.caption || ''
    const credit = value.credit || ''

    return (
      <figure className="my-8 sm:my-10">
        <button
          type="button"
          onClick={() =>
            setActiveImage({
              images: [
                {
                  url: fullImageUrl,
                  caption,
                  credit,
                },
              ],
              index: 0,
            })
          }
          className="group block w-full cursor-zoom-in overflow-hidden bg-shawl/10 text-left"
          aria-label={`View image${caption ? `: ${caption}` : ''}`}
        >
          <img
            src={imageUrl}
            alt={caption || 'Biography photograph'}
            loading="lazy"
            decoding="async"
            className="mx-auto max-h-[650px] w-full object-contain transition duration-500 group-hover:scale-[1.01]"
          />
        </button>

        {(caption || credit) && (
          <figcaption className="mt-3 border-l-2 border-mustard/70 pl-4">
            {caption && (
              <p className="font-body text-sm leading-6 text-navy/70">
                {caption}
              </p>
            )}

            {credit && (
              <p className="mt-1 font-body text-xs leading-5 text-navy/40">
                Photo credit: {credit}
              </p>
            )}
          </figcaption>
        )}
      </figure>
    )
  }

  const portableTextComponents = {
    types: {
      // Existing biography image blocks
      image: ({ value }: any) => {
        return renderBiographyImage(value)
      },

      // New bioImage schema objects
      bioImage: ({ value }: any) => {
        return renderBiographyImage(value, value.image)
      },
    },

    block: {
      normal: ({ children }: any) => (
        <p className="mb-5 font-body text-[15px] leading-7 text-navy/75 sm:mb-6 sm:text-base sm:leading-8">
          {children}
        </p>
      ),

      h1: ({ children }: any) => (
        <h1 className="mb-6 mt-8 border-l-[3px] border-mustard pl-4 font-display text-[1.75rem] font-medium leading-[1.35] tracking-normal text-navy sm:mb-7 sm:mt-9 sm:pl-5 sm:text-[2rem]">
          {children}
        </h1>
      ),

      h2: ({ children }: any) => (
        <h2 className="mb-4 mt-9 border-b border-mustard/50 pb-2 font-display text-[1.4rem] font-medium leading-[1.45] tracking-normal text-navy sm:mb-5 sm:mt-11 sm:text-[1.65rem]">
          {children}
        </h2>
      ),

      h3: ({ children }: any) => (
        <h3 className="mb-3 mt-7 font-display text-[1.15rem] font-medium leading-[1.5] tracking-normal text-navy sm:mb-4 sm:mt-9 sm:text-[1.3rem]">
          {children}
        </h3>
      ),

      h4: ({ children }: any) => (
        <h4 className="mb-3 mt-6 border-l-2 border-mustard/70 pl-3 font-display text-[1rem] font-medium leading-[1.5] text-shawl sm:mt-8 sm:text-[1.1rem]">
          {children}
        </h4>
      ),
    },

    list: {
      bullet: ({ children }: any) => (
        <ul className="mb-5 mt-2 list-disc list-outside space-y-1 pl-6 font-body text-[15px] leading-7 text-navy/75 marker:text-mustard marker:text-[0.75em] sm:mb-6 sm:space-y-1.5 sm:pl-7 sm:text-base sm:leading-8">
          {children}
        </ul>
      ),

      number: ({ children }: any) => (
        <ol className="mb-5 mt-2 list-decimal list-outside space-y-1 pl-7 font-body text-[15px] leading-7 text-navy/75 marker:font-semibold marker:text-shawl sm:mb-6 sm:space-y-1.5 sm:pl-8 sm:text-base sm:leading-8">
          {children}
        </ol>
      ),
    },

    listItem: {
      bullet: ({ children }: any) => (
        <li className="pl-1 marker:text-mustard">
          {children}
        </li>
      ),

      number: ({ children }: any) => (
        <li className="pl-1">
          {children}
        </li>
      ),
    },

    marks: {
      strong: ({ children }: any) => (
        <strong className="font-semibold text-navy">
          {children}
        </strong>
      ),

      em: ({ children }: any) => (
        <em className="text-navy/85">
          {children}
        </em>
      ),
    },
  }

  return (
    <>
      <div className="mt-9 max-w-3xl">
        {/* Language Switcher */}
        {hasUrdu && (
          <div className="mb-7 flex items-center gap-1 border-b border-navy/10 pb-3 font-body text-xs">
            <button
              type="button"
              onClick={() => setLanguage('en')}
              className={`px-3 py-1.5 transition ${
                language === 'en'
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
              className={`px-3 py-1.5 transition ${
                language === 'ur'
                  ? 'border-b border-mustard text-navy'
                  : 'text-navy/45 hover:text-shawl'
              }`}
            >
              اردو
            </button>
          </div>
        )}

        {/* Urdu Biography */}
        {language === 'ur' && hasUrdu ? (
          <div dir="rtl" lang="ur">
            <p className="font-body text-sm tracking-wide text-shawl">
              {urduLabel}
            </p>

            <div
              className="
                mt-5
                font-body
                text-navy/75
                [&_h1]:text-right
                [&_h1]:!text-[1.75rem]
                [&_h1]:!leading-[1.55]
                [&_h1]:!font-medium
                [&_h1]:!tracking-normal
                [&_h1]:!mb-6
                [&_h1]:!mt-7
                [&_h2]:text-right
                [&_h2]:!text-[1.4rem]
                [&_h2]:!leading-[1.6]
                [&_h2]:!font-medium
                [&_h2]:!tracking-normal
                [&_h2]:!mb-4
                [&_h2]:!mt-9
                [&_h3]:text-right
                [&_h3]:!text-[1.15rem]
                [&_h3]:!leading-[1.7]
                [&_h3]:!font-medium
                [&_h3]:!tracking-normal
                [&_h3]:!mb-3
                [&_h3]:!mt-7
                [&_h4]:text-right
                [&_h4]:!text-[1rem]
                [&_h4]:!leading-[1.7]
                [&_h4]:!font-medium
                [&_h4]:!mb-3
                [&_h4]:!mt-6
                [&_p]:text-right
                [&_p]:!text-[15px]
                [&_p]:!leading-[2.15]
                [&_p]:!mb-5
                [&_ul]:pr-7
                [&_ul]:pl-0
                [&_ul]:list-disc
                [&_ul]:!leading-[2.1]
                [&_ul]:!mb-5
                [&_ol]:pr-8
                [&_ol]:pl-0
                [&_ol]:list-decimal
                [&_ol]:!leading-[2.1]
                [&_ol]:!mb-5
                [&_li]:pr-1
                [&_li]:pl-0
              "
            >
              <PortableText
                value={urdu}
                components={portableTextComponents}
              />
            </div>
          </div>
        ) : (
          /* English Biography */
          <div dir="ltr" lang="en">
            <p className="font-body text-sm tracking-wide text-shawl">
              {englishLabel}
            </p>

            <div className="mt-5 font-body text-navy/75">
              <PortableText
                value={english}
                components={portableTextComponents}
              />
            </div>
          </div>
        )}
      </div>

      {/* Full-screen biography image viewer */}
      {activeImage && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-navy/95 p-4 sm:p-8"
          role="dialog"
          aria-modal="true"
          aria-label="Photo viewer"
          onClick={closeImage}
        >
          <button
            type="button"
            onClick={closeImage}
            aria-label="Close photo viewer"
            className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center border border-white/30 text-3xl text-white transition hover:border-mustard hover:text-mustard"
          >
            ×
          </button>

          <div
            className="flex max-h-full w-full max-w-6xl flex-col items-center"
            onClick={(event) => event.stopPropagation()}
          >
            <img
              src={activeImage.images[activeImage.index].url}
              alt={
                activeImage.images[activeImage.index].caption ||
                'Biography photograph'
              }
              className="max-h-[75vh] max-w-full object-contain"
            />

            {activeImage.images[activeImage.index].caption && (
              <p className="mt-4 text-center font-body text-sm leading-6 text-white/85">
                {activeImage.images[activeImage.index].caption}
              </p>
            )}

            {activeImage.images[activeImage.index].credit && (
              <p className="mt-2 text-center font-body text-xs text-white/50">
                Photo credit: {activeImage.images[activeImage.index].credit}
              </p>
            )}
          </div>
        </div>
      )}
    </>
  )
}
