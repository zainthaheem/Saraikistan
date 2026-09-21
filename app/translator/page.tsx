'use client'

import {useState} from 'react'

export default function TranslatorPage() {
  const [sourceLanguage, setSourceLanguage] = useState('English')
  const [targetLanguage, setTargetLanguage] = useState('Saraiki')
  const [text, setText] = useState('')
  const [result, setResult] = useState('')

  const swapLanguages = () => {
    setSourceLanguage(targetLanguage)
    setTargetLanguage(sourceLanguage)
    setText(result)
    setResult(text)
  }

  return (
    <main className="min-h-screen bg-cream text-navy">
      <section className="mx-auto max-w-6xl px-6 pb-20 pt-32 sm:px-10 lg:px-12">
        <div className="max-w-3xl">
          <p className="font-body text-sm text-shawl">
            Saraikistan Language Project
          </p>

          <h1 className="mt-3 font-display text-4xl leading-tight text-navy sm:text-5xl">
            Saraiki Translator
          </h1>

          <p className="mt-5 max-w-2xl font-body text-base leading-7 text-navy/65 sm:text-lg">
            Translate between Saraiki and other languages while exploring and
            preserving the language of the Saraiki region.
          </p>
        </div>

        <div className="mt-12 border-t border-mustard pt-7">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-center">
            <select
              value={sourceLanguage}
              onChange={(e) => setSourceLanguage(e.target.value)}
              className="border border-navy/15 bg-white px-5 py-3 font-body text-sm text-navy outline-none focus:border-mustard"
            >
              <option>English</option>
              <option>اردو</option>
              <option>Punjabi</option>
              <option>Saraiki</option>
            </select>

            <button
              type="button"
              onClick={swapLanguages}
              aria-label="Swap languages"
              className="flex h-11 w-11 items-center justify-center border border-navy/15 text-shawl transition hover:border-mustard hover:text-mustard"
            >
              ⇄
            </button>

            <select
              value={targetLanguage}
              onChange={(e) => setTargetLanguage(e.target.value)}
              className="border border-navy/15 bg-white px-5 py-3 font-body text-sm text-navy outline-none focus:border-mustard"
            >
              <option>Saraiki</option>
              <option>English</option>
              <option>اردو</option>
              <option>Punjabi</option>
            </select>
          </div>
        </div>

        <div className="mt-8 grid gap-5 lg:grid-cols-2">
          <div className="border border-navy/15 bg-white">
            <div className="border-b border-navy/10 px-5 py-4">
              <p className="font-body text-sm text-shawl">
                {sourceLanguage}
              </p>
            </div>

            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type or paste your text here..."
              className="min-h-[300px] w-full resize-none bg-transparent px-5 py-5 font-body text-base leading-7 text-navy outline-none placeholder:text-navy/35"
              maxLength={5000}
            />

            <div className="border-t border-navy/10 px-5 py-3 text-right font-body text-xs text-navy/40">
              {text.length}/5000
            </div>
          </div>

          <div className="border border-navy/15 bg-white">
            <div className="border-b border-navy/10 px-5 py-4">
              <p className="font-body text-sm text-shawl">
                {targetLanguage}
              </p>
            </div>

            <div
              dir={
                targetLanguage === 'Saraiki' || targetLanguage === 'اردو'
                  ? 'rtl'
                  : 'ltr'
              }
              className="min-h-[350px] px-5 py-5 font-body text-base leading-8 text-navy"
            >
              {result || (
                <span className="text-navy/35">
                  Your translation will appear here.
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={() =>
              setResult(
                'Translation engine will be connected here in the next step.'
              )
            }
            className="border border-mustard bg-mustard px-8 py-3 font-body text-sm text-white transition hover:bg-navy hover:text-cream"
          >
            Translate
          </button>
        </div>

        <div className="mt-10 border-t border-navy/10 pt-6">
          <p className="font-body text-xs leading-6 text-navy/50">
            Saraiki is a lower-resource language. Translations may require
            review, particularly for cultural expressions, names and regional
            vocabulary.
          </p>
        </div>
      </section>
    </main>
  )
}
