'use client'

import type {ClipboardEvent} from 'react'
import {PatchEvent, set} from 'sanity'

function createKey() {
  return Math.random().toString(36).substring(2, 11)
}

function parseInline(text: string) {
  const children: any[] = []
  const markDefs: any[] = []

  const regex =
    /(\*\*[^*]+\*\*|__[^_]+__|\*[^*]+\*|_[^_]+_|`[^`]+`|\[[^\]]+\]\([^)]+\))/g

  const parts = text.split(regex)

  parts.forEach((part) => {
    if (!part) return

    let value = part
    const marks: string[] = []

    if (
      (part.startsWith('**') && part.endsWith('**')) ||
      (part.startsWith('__') && part.endsWith('__'))
    ) {
      value = part.slice(2, -2)
      marks.push('strong')
    } else if (
      (part.startsWith('*') && part.endsWith('*')) ||
      (part.startsWith('_') && part.endsWith('_'))
    ) {
      value = part.slice(1, -1)
      marks.push('em')
    } else if (part.startsWith('`') && part.endsWith('`')) {
      value = part.slice(1, -1)
      marks.push('code')
    } else if (part.startsWith('[')) {
      const match = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/)

      if (match) {
        value = match[1]

        const key = createKey()

        markDefs.push({
          _key: key,
          _type: 'link',
          href: match[2],
        })

        marks.push(key)
      }
    }

    children.push({
      _type: 'span',
      _key: createKey(),
      text: value,
      marks,
    })
  })

  return {
    children:
      children.length > 0
        ? children
        : [
            {
              _type: 'span',
              _key: createKey(),
              text,
              marks: [],
            },
          ],
    markDefs,
  }
}

function createBlock(
  text: string,
  style = 'normal',
  listItem?: 'bullet' | 'number',
  level = 1,
) {
  const inline = parseInline(text)

  return {
    _type: 'block',
    _key: createKey(),
    style,
    ...(listItem ? {listItem, level} : {}),
    markDefs: inline.markDefs,
    children: inline.children,
  }
}

function markdownToBlocks(markdown: string) {
  const lines = markdown.replace(/\r\n/g, '\n').split('\n')

  const blocks: any[] = []
  let paragraph: string[] = []
  let inCodeBlock = false
  let codeLines: string[] = []

  function flushParagraph() {
    if (!paragraph.length) return

    blocks.push(createBlock(paragraph.join(' ')))
    paragraph = []
  }

  function flushCodeBlock() {
    if (!codeLines.length) return

    blocks.push({
      _type: 'block',
      _key: createKey(),
      style: 'normal',
      markDefs: [],
      children: [
        {
          _type: 'span',
          _key: createKey(),
          text: codeLines.join('\n'),
          marks: ['code'],
        },
      ],
    })

    codeLines = []
  }

  for (const line of lines) {
    const trimmed = line.trim()

    if (trimmed.startsWith('```')) {
      flushParagraph()

      if (inCodeBlock) {
        flushCodeBlock()
        inCodeBlock = false
      } else {
        inCodeBlock = true
      }

      continue
    }

    if (inCodeBlock) {
      codeLines.push(line)
      continue
    }

    if (!trimmed) {
      flushParagraph()
      continue
    }

    const heading = trimmed.match(/^(#{1,6})\s+(.+)$/)

    if (heading) {
      flushParagraph()

      const level = heading[1].length

      const style =
        level === 1
          ? 'h1'
          : level === 2
            ? 'h2'
            : level === 3
              ? 'h3'
              : level === 4
                ? 'h4'
                : 'normal'

      blocks.push(createBlock(heading[2], style))
      continue
    }

    const bullet = trimmed.match(/^[-*+]\s+(.+)$/)

    if (bullet) {
      flushParagraph()
      blocks.push(createBlock(bullet[1], 'normal', 'bullet'))
      continue
    }

    const numbered = trimmed.match(/^\d+[.)]\s+(.+)$/)

    if (numbered) {
      flushParagraph()
      blocks.push(createBlock(numbered[1], 'normal', 'number'))
      continue
    }

    const quote = trimmed.match(/^>\s?(.*)$/)

    if (quote) {
      flushParagraph()
      blocks.push(createBlock(quote[1], 'blockquote'))
      continue
    }

    paragraph.push(trimmed)
  }

  flushParagraph()

  if (inCodeBlock) {
    flushCodeBlock()
  }

  return blocks
}

export default function MarkdownPortableTextInput(props: any) {
  function handlePasteCapture(
    event: ClipboardEvent<HTMLDivElement>,
  ) {
    const text = event.clipboardData.getData('text/plain')

    if (!text) return

    const hasMarkdown =
      /^#{1,6}\s/m.test(text) ||
      /^\s*[-*+]\s/m.test(text) ||
      /^\s*\d+[.)]\s/m.test(text) ||
      /\*\*[\s\S]+?\*\*/.test(text) ||
      /(^|\n)>\s/m.test(text) ||
      /```/.test(text)

    if (!hasMarkdown) return

    event.preventDefault()
    event.stopPropagation()

    const blocks = markdownToBlocks(text)

    props.onChange(PatchEvent.from(set(blocks)))
  }

  return (
    <div onPasteCapture={handlePasteCapture}>
      {props.renderDefault(props)}
    </div>
  )
}
