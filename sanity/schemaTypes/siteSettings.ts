import {defineType, defineField} from 'sanity'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'image',
    }),
    defineField({
      name: 'headerImage',
      title: 'Header/Hero Picture',
      type: 'image',
      options: {hotspot: true},
    }),
    defineField({
      name: 'footerImage',
      title: 'Footer Picture',
      type: 'image',
      options: {hotspot: true},
    }),
    defineField({
      name: 'siteTitle',
      title: 'Site Title',
      type: 'string',
    }),
    defineField({
      name: 'tagline',
      title: 'Tagline',
      type: 'string',
    }),
  ],
})
