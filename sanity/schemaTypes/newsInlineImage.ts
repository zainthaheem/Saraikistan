
import {defineType, defineField} from 'sanity'

export const newsInlineImage = defineType({
  name: 'newsInlineImage',
  title: 'In-Content Image',
  type: 'object',

  fields: [
    defineField({
      name: 'image',
      title: 'Picture',
      type: 'image',
      options: {hotspot: true},
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'alt',
      title: 'Alternative Text (SEO)',
      type: 'string',
      description: 'Describe the image for Google and screen readers.',
    }),

    defineField({
      name: 'caption',
      title: 'Image Caption',
      type: 'string',
    }),

    defineField({
      name: 'credit',
      title: 'Image Credit',
      type: 'string',
    }),
  ],

  preview: {
    select: {
      title: 'caption',
      media: 'image',
    },
    prepare({title, media}) {
      return {
        title: title || 'In-Content Image',
        media,
      }
    },
  },
})
