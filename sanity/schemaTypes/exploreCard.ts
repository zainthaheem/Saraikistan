import {defineType, defineField} from 'sanity'

export const exploreCard = defineType({
  name: 'exploreCard',
  title: 'Explore Card',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),

    defineField({
      name: 'description',
      title: 'Short Description',
      type: 'text',
      rows: 3,
    }),

    defineField({
      name: 'image',
      title: 'Card Picture',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),

    defineField({
      name: 'link',
      title: 'Page Link',
      type: 'string',
      description:
        'Example: /culture, /region, /celebrities, or /blog',
    }),

    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      initialValue: 1,
    }),

    defineField({
      name: 'enabled',
      title: 'Show on Homepage',
      type: 'boolean',
      initialValue: true,
    }),
  ],

  preview: {
    select: {
      title: 'title',
      media: 'image',
      order: 'order',
    },
    prepare({title, media, order}) {
      return {
        title: title || 'Untitled Explore Card',
        subtitle: `Order: ${order ?? 1}`,
        media,
      }
    },
  },
})
