
'use client'

import React, { useCallback, useRef, useState } from 'react'
import { PatchEvent, set, useClient } from 'sanity'

function createKey() {
  return Math.random().toString(36).slice(2, 11)
}

function parseInlineMarkdown(text: string) {
  const children: any[] = []
  let remaining = text

  const pattern = /(\*\*(.+?)\*\*|__(.+?)__|\*(.+?)\*|_(.+?)_)/

  while (remaining.length > 0) {
    const match = remaining.match(pattern)

    if (!match || match.index === undefined) {
      children.push({
        _type: 'span',
        _key: createKey(),
        text: remaining,
        marks: [],
      })
      break
    }

    if (match.index > 0) {
      children.push({
        _type: 'span',
        _key: createKey(),
        text: remaining.slice(0, match.index),
        marks: [],
      })
    }

    const fullMatch = match[0]

    const boldText = match[2] || match[3]
    const italicText = match[4] || match[5]

    children.push({
      _type: 'span',
      _key: createKey(),
      text: boldText || italicText,
      marks: [boldText ? 'strong' : 'em'],
    })

    remaining = remaining.slice(
      match.index + fullMatch.length
    )
  }

  return children
}

function parseMarkdown(markdown: string) {
  const lines = markdown
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .split('\n')

  const blocks: any[] = []

  for (const rawLine of lines) {
    const line = rawLine.trimEnd()

    if (!line.trim()) {
      continue
    }

    const h3 = line.match(/^###\s+(.+)$/)

    if (h3) {
      blocks.push({
        _type: 'block',
        _key: createKey(),
        style: 'h3',
        children: parseInlineMarkdown(h3[1]),
        markDefs: [],
      })
      continue
    }

    const h2 = line.match(/^##\s+(.+)$/)

    if (h2) {
      blocks.push({
        _type: 'block',
        _key: createKey(),
        style: 'h2',
        children: parseInlineMarkdown(h2[1]),
        markDefs: [],
      })
      continue
    }

    const h1 = line.match(/^#\s+(.+)$/)

    if (h1) {
      blocks.push({
        _type: 'block',
        _key: createKey(),
        style: 'h1',
        children: parseInlineMarkdown(h1[1]),
        markDefs: [],
      })
      continue
    }

    const bullet = line.match(/^\s*[-*]\s+(.+)$/)

    if (bullet) {
      blocks.push({
        _type: 'block',
        _key: createKey(),
        style: 'normal',
        listItem: 'bullet',
        level: 1,
        children: parseInlineMarkdown(bullet[1]),
        markDefs: [],
      })
      continue
    }

    const numbered = line.match(/^\s*\d+\.\s+(.+)$/)

    if (numbered) {
      blocks.push({
        _type: 'block',
        _key: createKey(),
        style: 'normal',
        listItem: 'number',
        level: 1,
        children: parseInlineMarkdown(numbered[1]),
        markDefs: [],
      })
      continue
    }

    blocks.push({
      _type: 'block',
      _key: createKey(),
      style: 'normal',
      children: parseInlineMarkdown(line),
      markDefs: [],
    })
  }

  return blocks
}

export default function MarkdownPortableTextInput(props: any) {
  const { renderDefault, onChange, value } = props

  const client = useClient({
    apiVersion: '2025-01-01',
  })

  const fileInputRef = useRef<HTMLInputElement>(null)

  const [uploading, setUploading] = useState(false)
  const [uploadMessage, setUploadMessage] = useState('')

  const handlePaste = useCallback(
    (event: React.ClipboardEvent<HTMLDivElement>) => {
      const text = event.clipboardData.getData('text/plain')

      if (!text) {
        return
      }

      const hasMarkdown =
        /^#{1,3}\s+/m.test(text) ||
        /\*\*[^*]+\*\*/.test(text) ||
        /(^|\n)\s*[-*]\s+/.test(text) ||
        /(^|\n)\s*\d+\.\s+/.test(text)

      if (!hasMarkdown) {
        return
      }

      event.preventDefault()
      event.stopPropagation()

      const blocks = parseMarkdown(text)

      onChange(PatchEvent.from(set(blocks)))
    },
    [onChange]
  )

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    if (!file.type.startsWith('image/')) {
      setUploadMessage('Please select an image file.')
      return
    }

    setUploading(true)
    setUploadMessage('Uploading image...')

    try {
      const asset = await client.assets.upload('image', file, {
        filename: file.name,
      })

      const imageItem = {
        _type: 'image',
        _key: createKey(),
        asset: {
          _type: 'reference',
          _ref: asset._id,
        },
        caption: '',
        credit: '',
      }

      const currentValue = Array.isArray(value) ? value : []

      onChange(
        PatchEvent.from(
          set([...currentValue, imageItem])
        )
      )

      setUploadMessage(
        'Image uploaded. Add its caption in the image fields.'
      )
    } catch (error) {
      console.error('Image upload failed:', error)

      setUploadMessage(
        'Upload failed. Please try again.'
      )
    } finally {
      setUploading(false)

      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-gray-300 p-3">
        <p className="mb-2 text-sm font-medium">
          Insert an image into the biography
        </p>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />

        <button
          type="button"
          disabled={uploading}
          onClick={() => fileInputRef.current?.click()}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          {uploading ? 'Uploading...' : '＋ Upload biography image'}
        </button>

        {uploadMessage && (
          <p className="mt-2 text-sm text-gray-500">
            {uploadMessage}
          </p>
        )}

        <p className="mt-2 text-xs text-gray-500">
          The image will be added at the end of the biography.
          You can then add its caption and credit.
        </p>
      </div>

      <div onPasteCapture={handlePaste}>
        {renderDefault(props)}
      </div>
    </div>
  )
}
