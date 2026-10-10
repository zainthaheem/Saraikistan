
'use client'

import { useEffect, useState } from 'react'
import { urlFor } from '@/sanity/lib/image'

type GalleryImage = {
  _key?: string
  _type?: string
  asset?: {
    _ref?: string
    _type?: string
    _id?: string
    url?: string
  }
  caption?: string
  credit?: string
}

type PhotoGalleryProps = {
  images: GalleryImage[]
  personName: string
}

export default function PhotoGallery({
  images,
  personName,
}: PhotoGalleryProps) {
  const [showAll, setShowAll] = useState(false)
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  const validImages = images.filter(
    (image) => image?.asset?._ref || image?.asset?._id
  )

  const visibleImages = showAll
    ? validImages
    : validImages.slice(0, 4)

  const activeImage =
    activeIndex !== null ? validImages[activeIndex] : null

  useEffect(() => {
    if (activeIndex === null) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setActiveIndex(null)
      }

      if (event.key === 'ArrowRight' && validImages.length > 1) {
        setActiveIndex((current) =>
          current === null ? null : (current + 1) % validImages.length
        )
      }

      if (event.key === 'ArrowLeft' && validImages.length > 1) {
        setActiveIndex((current) =>
          current === null
            ? null
            : (current - 1 + validImages.length) % validImages.length
        )
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [activeIndex, validImages.length])

  useEffect(() => {
    if (activeIndex === null) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [activeIndex])

  if (validImages.length === 0) {
    return null
  }

  function getImageUrl(image: GalleryImage, width = 1200) {
    return urlFor(image).width(width).auto('format').quality(85).url()
  }

  const viewerControlClass =
    'absolute z-20 flex h-12 w-12 items-center justify-center rounded-full border-2 border-white/80 bg-black/90 text-3xl leading-none text-white shadow-lg transition hover:bg-shawl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-mustard'

  return (
    <>
      {/* Minimal Editorial Photo Grid */}
      <div className="grid grid-cols-2 items-start gap-x-3 gap-y-6 sm:gap-x-5 sm:gap-y-8 lg:grid-cols-4">
        {visibleImages.map((image) => {
          const originalIndex = validImages.indexOf(image)

          return (
            <div key={image._key || originalIndex} className="min-w-0">
              <button
                type="button"
                onClick={() => setActiveIndex(originalIndex)}
                aria-label={`View photo ${originalIndex + 1} of ${personName}`}
                className="group block w-full overflow-hidden bg-shawl/10 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mustard focus-visible:ring-offset-2"
              >
                <div className="aspect-[4/5] overflow-hidden">
                  <img
                    src={getImageUrl(image, 700)}
                    alt={
                      image.caption ||
                      `${personName} - photo ${originalIndex + 1}`
                    }
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03] motion-reduce:transition-none"
                  />
                </div>
              </button>

              {image.caption && (
                <p className="mt-2 font-body text-sm leading-5 text-navy sm:mt-3 sm:leading-6">
                  {image.caption}
                </p>
              )}

              {image.credit && (
                <p className="mt-1 font-body text-xs leading-5 text-navy/65">
                  Photo: {image.credit}
                </p>
              )}
            </div>
          )
        })}
      </div>

      {/* Show More or Fewer Photos */}
      {validImages.length > 4 && (
        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={() => setShowAll((current) => !current)}
            className="border border-navy/30 px-6 py-3 font-body text-sm text-navy transition hover:border-mustard hover:bg-mustard hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mustard focus-visible:ring-offset-2"
          >
            {showAll
              ? 'Show fewer photos'
              : `View all ${validImages.length} photos`}
          </button>
        </div>
      )}

      {/* Full-Screen Photo Viewer */}
      {activeImage && activeIndex !== null && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black p-3 pt-16 sm:p-8"
          role="dialog"
          aria-modal="true"
          aria-label={`${personName} photo gallery`}
          onClick={() => setActiveIndex(null)}
        >
          {/* Close Button */}
          <button
            type="button"
            onClick={() => setActiveIndex(null)}
            aria-label="Close photo viewer"
            className="absolute right-4 top-4 z-30 flex h-12 w-12 items-center justify-center rounded-full border-2 border-white bg-white text-3xl leading-none text-black shadow-lg transition hover:bg-cream focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-mustard sm:right-6 sm:top-6"
          >
            ×
          </button>

          {/* Previous Photo */}
          {validImages.length > 1 && (
            <button
              type="button"
              aria-label="Previous photo"
              onClick={(event) => {
                event.stopPropagation()
                setActiveIndex(
                  (activeIndex - 1 + validImages.length) % validImages.length
                )
              }}
              className={`${viewerControlClass} left-2 top-1/2 -translate-y-1/2 sm:left-6`}
            >
              <span aria-hidden="true">&#8249;</span>
            </button>
          )}

          {/* Image, Caption, Credit and Counter */}
          <div
            className="flex max-h-full w-full max-w-6xl flex-col items-center"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex min-h-0 w-full flex-1 items-center justify-center">
              <img
                src={getImageUrl(activeImage, 1800)}
                alt={
                  activeImage.caption ||
                  `${personName} - photo ${activeIndex + 1}`
                }
                decoding="async"
                className="max-h-[65vh] max-w-full object-contain sm:max-h-[72vh]"
              />
            </div>

            <div className="mt-4 w-full max-w-3xl shrink-0 pb-2 text-center sm:mt-5">
              {activeImage.caption && (
                <p className="font-body text-base leading-6 text-white sm:text-lg sm:leading-7">
                  {activeImage.caption}
                </p>
              )}

              {activeImage.credit && (
                <p className="mt-2 font-body text-sm leading-5 text-white/75">
                  Photo credit: {activeImage.credit}
                </p>
              )}

              <p
                className="mt-3 font-body text-sm font-medium tabular-nums text-white/80"
                aria-live="polite"
              >
                {activeIndex + 1} / {validImages.length}
              </p>
            </div>
          </div>

          {/* Next Photo */}
          {validImages.length > 1 && (
            <button
              type="button"
              aria-label="Next photo"
              onClick={(event) => {
                event.stopPropagation()
                setActiveIndex((activeIndex + 1) % validImages.length)
              }}
              className={`${viewerControlClass} right-2 top-1/2 -translate-y-1/2 sm:right-6`}
            >
              <span aria-hidden="true">&#8250;</span>
            </button>
          )}
        </div>
      )}
    </>
  )
}
