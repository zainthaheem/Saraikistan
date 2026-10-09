
import {defineType, defineField} from 'sanity'

export const saraikistanMap = defineType({
  name: 'saraikistanMap',
  title: 'Saraikistan Map',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title (English)',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'titleUr',
      title: 'Title (Urdu)',
      type: 'string',
    }),
    defineField({
      name: 'summary',
      title: 'Summary (English)',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'summaryUr',
      title: 'Summary (Urdu)',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'content',
      title: 'Main Content (English)',
      type: 'array',
      of: [{type: 'block'}],
    }),
    defineField({
      name: 'contentUr',
      title: 'Main Content (Urdu)',
      type: 'array',
      of: [{type: 'block'}],
    }),
    defineField({
      name: 'mainImage',
      title: 'Main Picture',
      type: 'image',
      options: {hotspot: false},
      fields: [
        defineField({
          name: 'alt',
          title: 'Alternative Text',
          type: 'string',
        }),
      ],
    }),
    defineField({
      name: 'gallery',
      title: 'More Pictures',
      type: 'array',
      of: [
        {
          type: 'image',
          options: {hotspot: false},
          fields: [
            defineField({
              name: 'caption',
              title: 'Caption',
              type: 'string',
            }),
            defineField({
              name: 'alt',
              title: 'Alternative Text',
              type: 'string',
            }),
          ],
        },
      ],
    }),
    defineField({
      name: 'seoTitle',
      title: 'SEO Title (English)',
      type: 'string',
      validation: (Rule) => Rule.max(60),
    }),
    defineField({
      name: 'seoTitleUr',
      title: 'SEO Title (Urdu)',
      type: 'string',
      validation: (Rule) => Rule.max(60),
    }),
    defineField({
      name: 'seoDescription',
      title: 'SEO Description (English)',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.max(160),
    }),
    defineField({
      name: 'seoDescriptionUr',
      title: 'SEO Description (Urdu)',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.max(160),
    }),
    defineField({
      name: 'seoImage',
      title: 'SEO Picture',
      type: 'image',
      options: {hotspot: false},
    }),
    defineField({
      name: 'published',
      title: 'Published',
      type: 'boolean',
      initialValue: false,
    }),
  ],
})
