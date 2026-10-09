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
      initialValue:
        'Explore the Saraiki cultural region through this illustrative Saraikistan map.',
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
      name: 'regionDescription',
      title: 'About the Saraiki Cultural Region (English)',
      type: 'text',
      rows: 8,
      initialValue:
        'The Saraiki cultural region is associated with the Saraiki language, folk music, poetry, Sufi traditions and a rich cultural heritage. It is particularly associated with southern Punjab and adjoining areas where Saraiki-speaking communities live. Cultural and linguistic identities vary across localities, and the region has no universally agreed official administrative boundary.',
    }),
    defineField({
      name: 'regionDescriptionUr',
      title: 'About the Saraiki Cultural Region (Urdu)',
      type: 'text',
      rows: 8,
      description: 'اردو میں خطے کی ثقافتی اور لسانی وضاحت لکھیں۔',
    }),
    defineField({
      name: 'regionExtra',
      title: 'Additional Regional Information (English)',
      type: 'text',
      rows: 6,
      description:
        'Additional regional paragraphs displayed below the main regional description.',
    }),
    defineField({
      name: 'regionExtraUr',
      title: 'Additional Regional Information (Urdu)',
      type: 'text',
      rows: 6,
      description: 'خطے کے بارے میں اضافی معلومات اردو میں لکھیں۔',
    }),
    defineField({
      name: 'regionClosing',
      title: 'Regional Section Closing Paragraph (English)',
      type: 'text',
      rows: 4,
      description:
        'The concluding paragraph of the regional information section.',
    }),
    defineField({
      name: 'regionClosingUr',
      title: 'Regional Section Closing Paragraph (Urdu)',
      type: 'text',
      rows: 4,
      description: 'خطے کے تعارف کا اختتامی پیراگراف اردو میں لکھیں۔',
    }),
    defineField({
      name: 'placesCardTitle',
      title: 'Places Navigation Card Title (English)',
      type: 'string',
    }),
    defineField({
      name: 'placesCardTitleUr',
      title: 'Places Navigation Card Title (Urdu)',
      type: 'string',
    }),
    defineField({
      name: 'placesCardDescription',
      title: 'Places Navigation Card Description (English)',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'placesCardDescriptionUr',
      title: 'Places Navigation Card Description (Urdu)',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'placesCardLinkLabel',
      title: 'Places Navigation Card Link Label (English)',
      type: 'string',
    }),
    defineField({
      name: 'placesCardLinkLabelUr',
      title: 'Places Navigation Card Link Label (Urdu)',
      type: 'string',
    }),
    defineField({
      name: 'cultureCardTitle',
      title: 'Culture Navigation Card Title (English)',
      type: 'string',
    }),
    defineField({
      name: 'cultureCardTitleUr',
      title: 'Culture Navigation Card Title (Urdu)',
      type: 'string',
    }),
    defineField({
      name: 'cultureCardDescription',
      title: 'Culture Navigation Card Description (English)',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'cultureCardDescriptionUr',
      title: 'Culture Navigation Card Description (Urdu)',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'cultureCardLinkLabel',
      title: 'Culture Navigation Card Link Label (English)',
      type: 'string',
    }),
    defineField({
      name: 'cultureCardLinkLabelUr',
      title: 'Culture Navigation Card Link Label (Urdu)',
      type: 'string',
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
      description: 'اردو میں نقشے سے متعلق وضاحت لکھیں۔',
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
