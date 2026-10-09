import { defineField, defineType } from 'sanity'
export const saraikistanMap = defineType({
  name: 'saraikistanMap',
  title: 'Saraikistan Map',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Page Title (English)',
      type: 'string',
      initialValue: 'Saraikistan Map',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'titleUr',
      title: 'Page Title (Urdu)',
      type: 'string',
      description: 'اردو میں صفحے کا عنوان لکھیں۔',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      initialValue: { current: 'saraikistan-map' },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'seoTitle',
      title: 'SEO Title (English)',
      type: 'string',
      initialValue: 'Saraikistan Map | Saraiki Cultural Region & Cities',
      validation: (Rule) => Rule.max(60),
    }),
    defineField({
      name: 'seoTitleUr',
      title: 'SEO Title (Urdu)',
      type: 'string',
      description: 'اردو میں سرچ انجن کے لیے عنوان۔',
      validation: (Rule) => Rule.max(60),
    }),
    defineField({
      name: 'seoDescription',
      title: 'SEO Description (English)',
      type: 'text',
      rows: 3,
      initialValue:
        'Explore the Saraikistan map, discover the Saraiki cultural region in Pakistan, and learn about its cities and heritage.',
      validation: (Rule) => Rule.max(160),
    }),
    defineField({
      name: 'seoDescriptionUr',
      title: 'SEO Description (Urdu)',
      type: 'text',
      rows: 3,
      description: 'اردو میں سرچ انجن کے لیے تفصیل۔',
      validation: (Rule) => Rule.max(160),
    }),
    defineField({
      name: 'intro',
      title: 'Introduction (English)',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'introUr',
      title: 'Introduction (Urdu)',
      type: 'text',
      rows: 4,
      description: 'اردو میں تعارف لکھیں۔',
    }),
    defineField({
      name: 'mainMap',
      title: 'Main Cultural Map',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alternative Text (English)',
          type: 'string',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'altUr',
          title: 'Alternative Text (Urdu)',
          type: 'string',
          description: 'اردو میں تصویر کی وضاحت۔',
        }),
        defineField({
          name: 'caption',
          title: 'Map Caption (English)',
          type: 'string',
        }),
        defineField({
          name: 'captionUr',
          title: 'Map Caption (Urdu)',
          type: 'string',
          description: 'اردو میں نقشے کا عنوان یا وضاحت۔',
        }),
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'additionalImages',
      title: 'Additional Maps & Images',
      description:
        'Upload supporting maps, regional illustrations or cultural photographs.',
      type: 'array',
      of: [
        {
          type: 'image',
          options: {
            hotspot: true,
          },
          fields: [
            defineField({
              name: 'alt',
              title: 'Alternative Text (English)',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'altUr',
              title: 'Alternative Text (Urdu)',
              type: 'string',
            }),
            defineField({
              name: 'caption',
              title: 'Caption (English)',
              type: 'string',
            }),
            defineField({
              name: 'captionUr',
              title: 'Caption (Urdu)',
              type: 'string',
            }),
          ],
        },
      ],
    }),
    defineField({
      name: 'regionContent',
      title: 'Regional Information (English)',
      type: 'text',
      rows: 14,
      description:
        'Write the complete regional section here. Separate paragraphs with a blank line.',
    }),
    defineField({
      name: 'regionContentUr',
      title: 'Regional Information (Urdu)',
      type: 'text',
      rows: 14,
      description:
        'خطے کی مکمل وضاحت یہاں لکھیں۔ پیراگراف الگ کرنے کے لیے ایک خالی سطر چھوڑیں۔',
    }),
    defineField({
      name: 'placesCardContent',
      title: 'Places & Cities Card (English)',
      type: 'text',
      rows: 5,
      description:
        'Enter the card title, description and link label on separate lines, in that order.',
    }),
    defineField({
      name: 'placesCardContentUr',
      title: 'Places & Cities Card (Urdu)',
      type: 'text',
      rows: 5,
      description:
        'کارڈ کا عنوان، تفصیل اور لنک کا متن الگ الگ سطروں میں لکھیں۔',
    }),
    defineField({
      name: 'cultureCardContent',
      title: 'Saraiki Culture Card (English)',
      type: 'text',
      rows: 5,
      description:
        'Enter the card title, description and link label on separate lines, in that order.',
    }),
    defineField({
      name: 'cultureCardContentUr',
      title: 'Saraiki Culture Card (Urdu)',
      type: 'text',
      rows: 5,
      description:
        'کارڈ کا عنوان، تفصیل اور لنک کا متن الگ الگ سطروں میں لکھیں۔',
    }),
    defineField({
      name: 'boundaryDisclaimer',
      title: 'Map Disclaimer (English)',
      type: 'text',
      rows: 3,
      initialValue:
        'This is an illustrative cultural and linguistic map. It does not represent official administrative boundaries.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'boundaryDisclaimerUr',
      title: 'Map Disclaimer (Urdu)',
      type: 'text',
      rows: 3,
      description: 'اردو میں نقشے سے متعلق وضاحت۔',
    }),
    defineField({
      name: 'published',
      title: 'Published',
      type: 'boolean',
      initialValue: false,
      description:
        'Enable this when the map content is ready to appear on the public website.',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      media: 'mainMap',
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
