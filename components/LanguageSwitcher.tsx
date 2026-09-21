'use client'

import {useState} from 'react'
import {PortableText} from '@portabletext/react'

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

  const hasUrdu = urdu && urdu.length > 0

  return (
    <div className="mt-10 max-w-3xl">
      {/* Language Switcher */}
      {hasUrdu && (
        <div className="mb-6 flex items-center gap-1 border-b border-navy/10 pb-3 font-body text-xs">
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

      {/* Content */}
      {language === 'ur' && hasUrdu ? (
        <div dir="rtl" lang="ur">
          <p className="font-body text-sm text-shawl">
            {urduLabel}
          </p>

          <div className="prose prose-sm mt-4 max-w-none font-body leading-8 text-navy/75 sm:prose-base">
            <PortableText value={urdu} />
          </div>
        </div>
      ) : (
        <div dir="ltr" lang="en">
          <p className="font-body text-sm text-shawl">
            {englishLabel}
          </p>

          <div className="prose prose-sm mt-4 max-w-none font-body leading-7 text-navy/75 sm:prose-base">
            <PortableText value={english} />
          </div>
        </div>
      )}
    </div>
  )
}
