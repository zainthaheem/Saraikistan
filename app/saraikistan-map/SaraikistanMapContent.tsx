'use client'

import { useState } from 'react'

const englishParagraphs = [
  'Saraikistan represents the historic cultural and linguistic region associated with the Saraiki language and its communities. Its cultural landscape includes cities, towns, historic sites, shrines, river plains and traditions that have shaped generations of Saraiki people.',
  'The map highlights important centres such as Multan, Bahawalpur, Dera Ghazi Khan, Rahim Yar Khan, Muzaffargarh, Layyah, Bhakkar and neighbouring areas with significant Saraiki-speaking communities. The extent of Saraiki language and cultural identity varies across localities.',
  'This cultural and linguistic illustration is intended for educational and heritage exploration. It does not represent official administrative boundaries, and language use may extend beyond the areas shown.',
]

const urduParagraphs = [
  'سرائیکستان اس تاریخی ثقافتی اور لسانی خطے کی نمائندگی کرتا ہے جو سرائیکی زبان اور اس سے وابستہ برادریوں کی پہچان ہے۔ اس خطے کی ثقافت میں شہر، قصبے، تاریخی مقامات، مزارات، دریائی میدان اور وہ روایات شامل ہیں جنہوں نے نسل در نسل سرائیکی لوگوں کی زندگی کو تشکیل دیا ہے۔',
  'اس نقشے میں ملتان، بہاولپور، ڈیرہ غازی خان، رحیم یار خان، مظفرگڑھ، لیہ، بھکر اور ان کے آس پاس کے ایسے علاقوں کو نمایاں کیا گیا ہے جہاں سرائیکی زبان بولنے والی آبادیاں موجود ہیں۔ مختلف علاقوں میں سرائیکی زبان اور ثقافتی شناخت کی موجودگی اور وسعت مختلف ہو سکتی ہے۔',
  'یہ نقشہ ثقافتی، لسانی اور تعلیمی معلومات کے لیے تیار کیا گیا ہے۔ اسے کسی سرکاری انتظامی یا سیاسی حد بندی کا نقشہ نہ سمجھا جائے۔ سرائیکی زبان کا استعمال نقشے میں دکھائے گئے علاقوں سے باہر بھی پایا جا سکتا ہے۔',
]

export default function SaraikistanMapContent() {
  const [language, setLanguage] = useState<'en' | 'ur'>('en')

  const isUrdu = language === 'ur'

  return (
    <section
      lang={isUrdu ? 'ur' : 'en'}
      dir={isUrdu ? 'rtl' : 'ltr'}
      className="mx-auto w-full max-w-7xl px-6 pb-16 pt-10 sm:px-10 sm:pb-20 sm:pt-14 lg:px-12 lg:pt-16"
    >
      <div
        dir="ltr"
        className="mb-10 border-b border-navy/15"
      >
        <div
          className="flex items-center gap-7 sm:gap-9"
          aria-label="Choose language"
        >
          <button
            type="button"
            onClick={() => setLanguage('en')}
            aria-pressed={!isUrdu}
            className={`relative -mb-px min-h-12 border-b-[3px] px-1 pb-3 pt-2 font-body text-sm transition-colors sm:text-base ${
              !isUrdu
                ? 'border-gold text-navy'
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
            className={`relative -mb-px min-h-12 border-b-[3px] px-1 pb-3 pt-2 font-body text-base transition-colors sm:text-lg ${
              isUrdu
                ? 'border-gold text-navy'
                : 'border-transparent text-navy/50 hover:text-navy'
            }`}
          >
            اردو
          </button>
        </div>
      </div>

      <header className="mb-10 sm:mb-12">
        <p
          dir="ltr"
          className={`font-body text-xs uppercase tracking-[0.2em] text-shawl sm:text-sm ${
            isUrdu ? 'text-right' : 'text-left'
          }`}
        >
          Saraikistan
        </p>

        <h1
          className={`mt-4 font-display text-4xl leading-tight text-navy sm:text-5xl lg:text-6xl ${
            isUrdu ? 'text-right' : 'text-left'
          }`}
        >
          {isUrdu ? 'سرائیکستان کا نقشہ' : 'Saraikistan Map'}
        </h1>

        <p
          className={`mt-6 max-w-4xl font-body text-base leading-8 text-navy/75 sm:text-lg sm:leading-9 ${
            isUrdu ? 'text-right' : 'text-left'
          }`}
        >
          {isUrdu
            ? 'سرائیکی ثقافتی خطے کا ایک وضاحتی نقشہ دیکھیں، جس میں اس کے شہر، ثقافتی مراکز، زبان اور ورثے کو نمایاں کیا گیا ہے۔'
            : 'Explore the Saraiki cultural region through an illustrated map highlighting its cities, cultural centres, language and heritage.'}
        </p>
      </header>

      <figure className="mb-12 w-full sm:mb-16">
        <a
          href="/images/saraikistan-cultural-map.webp"
          target="_blank"
          rel="noreferrer"
          aria-label={
            isUrdu
              ? 'نقشے کو مکمل سائز میں کھولیں'
              : 'Open the full-size Saraikistan map'
          }
          className="block w-full focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-shawl"
        >
          <img
            src="/images/saraikistan-cultural-map.webp"
            alt={
              isUrdu
                ? 'سرائیکی ثقافتی اور لسانی خطے کا نقشہ'
                : 'Illustrated map of the Saraiki cultural and linguistic region'
            }
            width={2000}
            height={1400}
            loading="eager"
            fetchPriority="high"
            decoding="async"
            className="block h-auto w-full object-contain"
          />
        </a>
      </figure>

      <section
        aria-label={isUrdu ? 'نقشے کی تفصیلات' : 'About the map'}
        className="mx-auto max-w-4xl"
      >
        <div
          className={`space-y-6 font-body text-base leading-8 text-navy/80 sm:text-lg sm:leading-9 ${
            isUrdu ? 'text-right' : 'text-left'
          }`}
        >
          {(isUrdu ? urduParagraphs : englishParagraphs).map(
            (paragraph, index) => (
              <p key={`${language}-${index}`}>{paragraph}</p>
            )
          )}
        </div>
      </section>
    </section>
  )
}
