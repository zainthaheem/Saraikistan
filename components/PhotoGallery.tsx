'use client'

import { useEffect, useRef, useState } from 'react'
import type { TouchEvent } from 'react'
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
  const touchStart = useRef<{ x: number; y: number } | null>(null)

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

  function handleTouchStart(event: TouchEvent<HTMLDivElement>) {
    const touch = event.touches[0]
    if (!touch) return

    touchStart.current = {
      x: touch.clientX,
      y: touch.clientY,
    }
  }

  function handleTouchEnd(event: TouchEvent<HTMLDivElement>) {
    const start = touchStart.current
    touchStart.current = null

    if (!start || activeIndex === null || validImages.length < 2) {
      return
    }

    const touch = event.changedTouches[0]
    if (!touch) return

    const deltaX = touch.clientX - start.x
    const deltaY = touch.clientY - start.y

    if (Math.abs(deltaX) < 45) return
    if (Math.abs(deltaX) <= Math.abs(deltaY) * 1.2) return

    if (deltaX < 0) {
      setActiveIndex((activeIndex + 1) % validImages.length)
    } else {
      setActiveIndex(
        (activeIndex - 1 + validImages.length) % validImages.length
      )
    }
  }

  const glassControlClass =
    'relative isolate flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/50 bg-white/[0.12] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.65),inset_0_-1px_0_rgba(255,255,255,0.12),0_6px_22px_rgba(0,0,0,0.3)] backdrop-blur-2xl backdrop-saturate-150 transition-transform duration-200 hover:bg-white/20 active:scale-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 before:pointer-events-none before:absolute before:inset-[1px] before:rounded-full before:border before:border-white/20 before:content-[""] after:pointer-events-none after:absolute after:left-[20%] after:right-[20%] after:top-[2px] after:h-px after:rounded-full after:bg-gradient-to-r after:from-transparent after:via-white/90 after:to-transparent after:content-[""] sm:h-14 sm:w-14'
      return (
    <>
      {/* Gallery Grid */}
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
          className="fixed inset-0 z-[100] overflow-hidden bg-black/[0.94]"
          style={{
            height: '100dvh',
            width: '100vw',
            isolation: 'isolate',
          }}
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
            className={`fixed right-4 top-[calc(env(safe-area-inset-top)+16px)] z-[120] ${glassControlClass} text-3xl sm:right-6 sm:top-6`}
          >
            <span className="relative z-10 -mt-0.5" aria-hidden="true">
              &times;
            </span>
          </button>

          {/* Photo Stage and Information */}
          <div
            className="absolute inset-x-0 bottom-0 top-[calc(env(safe-area-inset-top)+72px)] flex flex-col items-center px-2 pb-[calc(env(safe-area-inset-bottom)+12px)] sm:top-20 sm:px-6 sm:pb-6"
            onClick={(event) => event.stopPropagation()}
          >
            {/* Photo Stage */}
            <div className="relative flex min-h-0 w-full flex-1 items-center justify-center">
              {validImages.length > 1 && (
                <button
                  type="button"
                  aria-label="Previous photo"
                  onClick={() =>
                    setActiveIndex(
                      (activeIndex - 1 + validImages.length) %
                        validImages.length
                    )
                  }
                  className={`absolute left-1 top-1/2 z-30 -translate-y-1/2 ${glassControlClass} sm:left-2`}
                >
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="relative z-10 h-6 w-6"
                  >
                    <path
                      d="M15 18L9 12L15 6"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              )}

              <div
                className="flex h-full min-h-0 w-full items-center justify-center touch-pan-y"
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
              >
                <img
                  src={getImageUrl(activeImage, 1800)}
                  alt={
                    activeImage.caption ||
                    `${personName} - photo ${activeIndex + 1}`
                  }
                  decoding="async"
                  draggable={false}
                  className="block max-h-full max-w-full select-none object-contain"
                  style={{
                    width: 'auto',
                    height: 'auto',
                    maxWidth: '100%',
                    maxHeight: '100%',
                  }}
                />
              </div>

              {validImages.length > 1 && (
                <button
                  type="button"
                  aria-label="Next photo"
                  onClick={() =>
                    setActiveIndex((activeIndex + 1) % validImages.length)
                  }
                  className={`absolute right-1 top-1/2 z-30 -translate-y-1/2 ${glassControlClass} sm:right-2`}
                >
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="relative z-10 h-6 w-6"
                  >
                    <path
                      d="M9 18L15 12L9 6"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              )}
            </div>

            {/* Caption, Credit and Counter */}
            <div className="w-full shrink-0 pb-1 pt-3 text-center sm:pt-4">
              {activeImage.caption && (
                <p className="mx-auto max-w-3xl font-body text-sm leading-5 text-white sm:text-lg sm:leading-7">
                  {activeImage.caption}
                </p>
              )}

              {activeImage.credit && (
                <p className="mt-1 font-body text-xs leading-5 text-white/75 sm:mt-2 sm:text-sm">
                  Photo credit: {activeImage.credit}
                </p>
              )}

              <p
                className="mt-2 font-body text-sm font-medium tabular-nums text-white/85 sm:mt-3"
                aria-live="polite"
              >
                {activeIndex + 1} / {validImages.length}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
