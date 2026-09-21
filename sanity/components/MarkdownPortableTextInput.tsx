'use client'

import React, {useCallback} from 'react'
import {PatchEvent, set} from 'sanity'

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

    // Ignore empty lines
    if (!line.trim()) {
      continue
    }

    // Heading 3
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

    // Heading 2
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

    // Heading 1
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

    // Bullet list
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

    // Numbered list
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

    // Normal paragraph
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
  const {renderDefault, onChange} = props

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

  return (
    <div onPasteCapture={handlePaste}>
      {renderDefault(props)}
    </div>
  )
}
