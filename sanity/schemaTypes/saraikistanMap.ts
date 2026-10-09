import { defineField, defineType } from 'sanity'

export const saraikistanMap = defineType({
  name: 'saraikistanMap',
  title: 'Saraikistan Map',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Page Title',
      type: 'string',
      initialValue: 'Saraikistan Map',
      validation: (Rule) => Rule.required(),
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
      title: 'SEO Title',
      type: 'string',
      initialValue: 'Saraikistan Map | Saraiki Cultural Region & Cities',
      validation: (Rule) => Rule.max(60),
    }),
    defineField({
      name: 'seoDescription',
      title: 'SEO Description',
      type: 'text',
      rows: 3,
      initialValue:
        'Explore the Saraikistan map, discover the Saraiki cultural region in Pakistan, and learn about its cities and heritage.',
      validation: (Rule) => Rule.max(160),
    }),
    defineField({
      name: 'intro',
      title: 'Introduction',
      type: 'text',
      rows: 4,
      initialValue:
        'Explore the Saraiki cultural region through this illustrative Saraikistan map.',
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
          title: 'Alternative Text',
          type: 'string',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'caption',
          title: 'Map Caption',
          type: 'string',
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
              title: 'Alternative Text',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'caption',
              title: 'Caption',
              type: 'string',
            }),
          ],
        },
      ],
    }),
    defineField({
      name: 'regionDescription',
      title: 'About the Saraiki Cultural Region',
      type: 'text',
      rows: 8,
      initialValue:
        'The Saraiki cultural region is associated with the Saraiki language, folk music, poetry, Sufi traditions and a rich cultural heritage. It is particularly associated with southern Punjab and adjoining areas where Saraiki-speaking communities live. Cultural and linguistic identities vary across localities, and the region has no universally agreed official administrative boundary.',
    }),
    defineField({
      name: 'boundaryDisclaimer',
      title: 'Map Disclaimer',
      type: 'text',
      rows: 3,
      initialValue:
        'This is an illustrative cultural and linguistic map. It does not represent official administrative boundaries.',
      validation: (Rule) => Rule.required(),
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
