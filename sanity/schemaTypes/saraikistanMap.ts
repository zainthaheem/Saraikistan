
import { defineField, defineType } from 'sanity'

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
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      initialValue: {
        current: 'saraikistan-map',
      },
      validation: (Rule) => Rule.required(),
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
      type: 'text',
      rows: 10,
    }),

    defineField({
      name: 'contentUr',
      title: 'Main Content (Urdu)',
      type: 'text',
      rows: 10,
    }),

    defineField({
      name: 'mainImage',
      title: 'Main Picture',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),

    defineField({
      name: 'mainImageAlt',
      title: 'Main Picture Alternative Text',
      type: 'string',
    }),

    defineField({
      name: 'additionalImages',
      title: 'More Pictures',
      description: 'Add any additional maps or cultural photographs.',
      type: 'array',
      of: [
        {
          type: 'image',
          options: {
            hotspot: true,
          },
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
      description:
        'Optional image used when sharing this page on social media.',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),

    defineField({
      name: 'published',
      title: 'Published',
      type: 'boolean',
      initialValue: false,
      description:
        'Enable this to show the map page on the public website.',
    }),
  ],

  preview: {
    select: {
      title: 'title',
      media: 'mainImage',
      published: 'published',
    },
    prepare({ title, media, published }) {
      return {
        title: title || 'Saraikistan Map',
        subtitle: published ? 'Published' : 'Draft',
        media,
      }
    },
  },
})
