import { defineType, defineField } from 'sanity'

export const bioImage = defineType({
  name: 'bioImage',
  title: 'Biography Image',
  type: 'object',

  fields: [
    defineField({
      name: 'image',
      title: 'Photo',
      type: 'image',
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'caption',
      title: 'Photo Caption',
      type: 'string',
      description:
        'Write the caption displayed below the photo.',
    }),

    defineField({
      name: 'credit',
      title: 'Photo Credit',
      type: 'string',
      description:
        'Optional photographer, source, or copyright credit.',
    }),
  ],

  preview: {
    select: {
      title: 'caption',
      media: 'image',
    },
    prepare({ title, media }) {
      return {
        title: title || 'Biography Photo',
        media,
      }
    },
  },
})
