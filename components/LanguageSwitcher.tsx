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

  const portableTextComponents = {
    block: {
      normal: ({children}: any) => (
        <p className="mb-6 font-body text-[15px] leading-8 text-navy/75 sm:text-base sm:leading-8">
          {children}
        </p>
      ),

      h1: ({children}: any) => (
        <h1 className="mb-7 mt-10 border-l-4 border-mustard pl-5 font-display text-3xl font-semibold leading-tight text-navy sm:text-4xl">
          {children}
        </h1>
      ),

      h2: ({children}: any) => (
        <h2 className="mb-5 mt-12 font-display text-2xl font-semibold leading-tight text-navy sm:text-3xl">
          <span className="border-b-2 border-mustard/70 pb-1">
            {children}
          </span>
        </h2>
      ),

      h3: ({children}: any) => (
        <h3 className="mb-4 mt-9 font-display text-xl font-semibold leading-tight text-navy sm:text-2xl">
          {children}
        </h3>
      ),

      h4: ({children}: any) => (
        <h4 className="mb-3 mt-7 font-display text-lg font-semibold leading-tight text-shawl sm:text-xl">
          {children}
        </h4>
      ),
    },

    list: {
      bullet: ({children}: any) => (
        <ul className="mb-7 mt-3 space-y-2 pl-6 font-body text-[15px] leading-7 text-navy/75 marker:text-mustard sm:text-base sm:leading-8">
          {children}
        </ul>
      ),

      number: ({children}: any) => (
        <ol className="mb-7 mt-3 space-y-2 pl-7 font-body text-[15px] leading-7 text-navy/75 marker:font-semibold marker:text-shawl sm:text-base sm:leading-8">
          {children}
        </ol>
      ),
    },

    listItem: {
      bullet: ({children}: any) => (
        <li className="pl-2 marker:text-mustard">
          {children}
        </li>
      ),

      number: ({children}: any) => (
        <li className="pl-2">
          {children}
        </li>
      ),
    },

    marks: {
      strong: ({children}: any) => (
        <strong className="font-semibold text-navy">
          {children}
        </strong>
      ),

      em: ({children}: any) => (
        <em className="text-navy/85">
          {children}
        </em>
      ),
    },
  }

  return (
    <div className="mt-10 max-w-3xl">
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

          <div className="mt-5 font-body text-navy/75 [&_h1]:text-right [&_h2]:text-right [&_h3]:text-right [&_h4]:text-right [&_p]:text-right [&_ul]:pr-7 [&_ol]:pr-7">
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
  )
}
