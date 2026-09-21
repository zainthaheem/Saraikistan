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
        <p className="mb-5 font-body text-[15px] leading-7 text-navy/75 sm:mb-6 sm:text-base sm:leading-8">
          {children}
        </p>
      ),

      h1: ({children}: any) => (
        <h1 className="mb-7 mt-8 border-l-[3px] border-mustard pl-4 font-display text-[1.75rem] font-semibold leading-[1.15] tracking-[-0.015em] text-navy sm:mb-9 sm:mt-10 sm:pl-5 sm:text-3xl">
          {children}
        </h1>
      ),

      h2: ({children}: any) => (
        <h2 className="mb-5 mt-10 border-b border-mustard/60 pb-3 font-display text-[1.5rem] font-semibold leading-[1.2] tracking-[-0.01em] text-navy sm:mb-6 sm:mt-13 sm:text-[1.8rem]">
          {children}
        </h2>
      ),

      h3: ({children}: any) => (
        <h3 className="mb-4 mt-8 font-display text-[1.2rem] font-semibold leading-[1.25] text-navy sm:mb-5 sm:mt-10 sm:text-[1.45rem]">
          {children}
        </h3>
      ),

      h4: ({children}: any) => (
        <h4 className="mb-3 mt-7 border-l-2 border-mustard/70 pl-3 font-display text-[1.05rem] font-semibold leading-[1.3] text-shawl sm:mt-8 sm:text-lg">
          {children}
        </h4>
      ),
    },

    list: {
      bullet: ({children}: any) => (
        <ul className="mb-6 mt-2 list-disc list-outside space-y-1.5 pl-6 font-body text-[15px] leading-7 text-navy/75 marker:text-mustard marker:text-[0.8em] sm:mb-7 sm:space-y-2 sm:pl-7 sm:text-base sm:leading-8">
          {children}
        </ul>
      ),

      number: ({children}: any) => (
        <ol className="mb-6 mt-2 list-decimal list-outside space-y-1.5 pl-7 font-body text-[15px] leading-7 text-navy/75 marker:font-semibold marker:text-shawl sm:mb-7 sm:space-y-2 sm:pl-8 sm:text-base sm:leading-8">
          {children}
        </ol>
      ),
    },

    listItem: {
      bullet: ({children}: any) => (
        <li className="pl-1 marker:text-mustard">
          {children}
        </li>
      ),

      number: ({children}: any) => (
        <li className="pl-1">
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

          <div
            className="
              mt-5
              font-body
              text-navy/75
              [&_h1]:text-right
              [&_h2]:text-right
              [&_h3]:text-right
              [&_h4]:text-right
              [&_p]:text-right
              [&_ul]:pr-7
              [&_ul]:pl-0
              [&_ul]:list-disc
              [&_ol]:pr-8
              [&_ol]:pl-0
              [&_ol]:list-decimal
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
  )
}
