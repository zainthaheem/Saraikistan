
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
    activeIndex !== null
      ? validImages[activeIndex]
      : null

  useEffect(() => {
    if (activeIndex === null) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setActiveIndex(null)
      }

      if (event.key === 'ArrowRight') {
        setActiveIndex((current) =>
          current === null
            ? null
            : (current + 1) % validImages.length
        )
      }

      if (event.key === 'ArrowLeft') {
        setActiveIndex((current) =>
          current === null
            ? null
            : (current - 1 + validImages.length) %
              validImages.length
        )
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [activeIndex, validImages.length])

  if (validImages.length === 0) {
    return null
  }

  function getImageUrl(image: GalleryImage, width = 1200) {
    return urlFor(image)
      .width(width)
      .auto('format')
      .quality(85)
      .url()
  }

  return (
    <>
      {/* Gallery Grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
        {visibleImages.map((image, index) => {
          const originalIndex = validImages.indexOf(image)

          return (
            <button
              key={image._key || originalIndex}
              type="button"
              onClick={() => setActiveIndex(originalIndex)}
              aria-label={`View photo ${originalIndex + 1} of ${personName}`}
              className="group overflow-hidden border border-navy/10 bg-white/40 text-left transition hover:border-mustard focus:outline-none focus:ring-2 focus:ring-mustard"
            >
              <div className="aspect-[4/5] overflow-hidden bg-shawl/10">
                <img
                  src={getImageUrl(image, 700)}
                  alt={
                    image.caption ||
                    `${personName} - photo ${originalIndex + 1}`
                  }
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
              </div>

              {(image.caption || image.credit) && (
                <div className="p-3 sm:p-4">
                  {image.caption && (
                    <p className="font-body text-sm leading-6 text-navy">
                      {image.caption}
                    </p>
                  )}

                  {image.credit && (
                    <p className="mt-1 font-body text-xs leading-5 text-navy/50">
                      Photo: {image.credit}
                    </p>
                  )}
                </div>
              )}
            </button>
          )
        })}
      </div>

      {/* View All Photos */}
      {validImages.length > 4 && (
        <div className="mt-7 flex justify-center">
          <button
            type="button"
            onClick={() => setShowAll((current) => !current)}
            className="border border-navy/20 px-6 py-3 font-body text-sm text-navy transition hover:border-mustard hover:bg-mustard hover:text-white"
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
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 sm:p-8"
          role="dialog"
          aria-modal="true"
          aria-label={`${personName} photo gallery`}
          onClick={() => setActiveIndex(null)}
        >
          <button
            type="button"
            onClick={() => setActiveIndex(null)}
            aria-label="Close photo viewer"
            className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center border border-white/30 text-3xl text-white transition hover:bg-white/10"
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
                  (activeIndex - 1 + validImages.length) %
                    validImages.length
                )
              }}
              className="absolute left-2 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center border border-white/30 text-2xl text-white transition hover:bg-white/10 sm:left-6"
            >
              ‹
            </button>
          )}

          {/* Image and Caption */}
          <div
            className="flex max-h-full w-full max-w-5xl flex-col items-center"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex min-h-0 flex-1 items-center justify-center">
              <img
                src={getImageUrl(activeImage, 1800)}
                alt={
                  activeImage.caption ||
                  `${personName} - photo ${activeIndex + 1}`
                }
                className="max-h-[70vh] max-w-full object-contain"
              />
            </div>

            <div className="mt-5 w-full max-w-3xl text-center">
              {activeImage.caption && (
                <p className="font-body text-base leading-7 text-white sm:text-lg">
                  {activeImage.caption}
                </p>
              )}

              {activeImage.credit && (
                <p className="mt-2 font-body text-sm text-white/60">
                  Photo credit: {activeImage.credit}
                </p>
              )}

              <p className="mt-3 font-body text-xs text-white/50">
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
                setActiveIndex(
                  (activeIndex + 1) % validImages.length
                )
              }}
              className="absolute right-2 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center border border-white/30 text-2xl text-white transition hover:bg-white/10 sm:right-6"
            >
              ›
            </button>
          )}
        </div>
      )}
    </>
  )
}
