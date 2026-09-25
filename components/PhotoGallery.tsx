
'use client'

import { useState } from 'react'
import { urlFor } from '@/sanity/lib/image'

type GalleryImage = {
  _key?: string
  _type?: string
  asset?: {
    _ref?: string
    _type?: string
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
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [showAll, setShowAll] = useState(false)

  if (!images || images.length === 0) {
    return null
  }

  const visibleImages = showAll ? images : images.slice(0, 4)

  const selectedImage =
    selectedIndex !== null ? images[selectedIndex] : null

  function closeViewer() {
    setSelectedIndex(null)
  }

  function showPrevious() {
    if (selectedIndex === null) return

    setSelectedIndex(
      (selectedIndex - 1 + images.length) % images.length
    )
  }

  function showNext() {
    if (selectedIndex === null) return

    setSelectedIndex((selectedIndex + 1) % images.length)
  }

  return (
    <>
      {/* Photo Grid */}
      <div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {visibleImages.map((img, i) => {
            if (!img?.asset?._ref) return null

            const imageUrl = urlFor(img)
              .width(700)
              .height(700)
              .fit('crop')
              .auto('format')
              .quality(85)
              .url()

            return (
              <button
                key={img._key || i}
                type="button"
                onClick={() => setSelectedIndex(i)}
                aria-label={`View photo ${i + 1} of ${personName}`}
                className="group overflow-hidden bg-shawl text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-mustard"
              >
                <div className="aspect-square overflow-hidden">
                  <img
                    src={imageUrl}
                    alt={
                      img.caption ||
                      `${personName} — photo ${i + 1}`
                    }
                    width={700}
                    height={700}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>

                {(img.caption || img.credit) && (
                  <div className="bg-white/50 px-3 py-3">
                    {img.caption && (
                      <p className="font-body text-xs leading-5 text-navy sm:text-sm">
                        {img.caption}
                      </p>
                    )}

                    {img.credit && (
                      <p className="mt-1 font-body text-[10px] leading-4 text-navy/55">
                        Photo: {img.credit}
                      </p>
                    )}
                  </div>
                )}
              </button>
            )
          })}
        </div>

        {/* View All / Show Less */}
        {images.length > 4 && (
          <div className="mt-7 flex justify-center">
            <button
              type="button"
              onClick={() => setShowAll(!showAll)}
              className="border border-navy/20 px-7 py-3 font-body text-sm text-navy transition hover:border-mustard hover:bg-mustard hover:text-white"
            >
              {showAll
                ? 'Show Less'
                : `View All ${images.length} Photos`}
            </button>
          </div>
        )}
      </div>

      {/* Fullscreen Photo Viewer */}
      {selectedIndex !== null && selectedImage && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 sm:p-8"
          role="dialog"
          aria-modal="true"
          aria-label="Photo viewer"
          onClick={closeViewer}
        >
          {/* Close Button */}
          <button
            type="button"
            onClick={closeViewer}
            aria-label="Close photo viewer"
            className="absolute right-4 top-4 z-20 flex h-11 w-11 items-center justify-center border border-white/30 text-3xl text-white transition hover:border-mustard hover:text-mustard"
          >
            ×
          </button>

          {/* Previous Button */}
          {images.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                showPrevious()
              }}
              aria-label="Previous photo"
              className="absolute left-2 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center border border-white/30 bg-black/40 text-3xl text-white transition hover:border-mustard hover:text-mustard sm:left-6"
            >
              ‹
            </button>
          )}

          {/* Selected Photo and Caption */}
          <div
            className="flex max-h-full w-full max-w-6xl flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex min-h-0 flex-1 items-center justify-center">
              <img
                src={urlFor(selectedImage)
                  .width(1800)
                  .height(1600)
                  .fit('max')
                  .auto('format')
                  .quality(90)
                  .url()}
                alt={
                  selectedImage.caption ||
                  `${personName} — photo ${(selectedIndex ?? 0) + 1}`
                }
                className="max-h-[72vh] max-w-full object-contain"
              />
            </div>

            <div className="mt-5 max-w-3xl text-center">
              {selectedImage.caption && (
                <p className="font-body text-sm leading-6 text-white sm:text-base">
                  {selectedImage.caption}
                </p>
              )}

              {selectedImage.credit && (
                <p className="mt-2 font-body text-xs text-white/55">
                  Photo: {selectedImage.credit}
                </p>
              )}

              <p className="mt-3 font-body text-xs text-white/50">
                {(selectedIndex ?? 0) + 1} / {images.length}
              </p>
            </div>
          </div>

          {/* Next Button */}
          {images.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                showNext()
              }}
              aria-label="Next photo"
              className="absolute right-2 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center border border-white/30 bg-black/40 text-3xl text-white transition hover:border-mustard hover:text-mustard sm:right-6"
            >
              ›
            </button>
          )}
        </div>
      )}
    </>
  )
}
