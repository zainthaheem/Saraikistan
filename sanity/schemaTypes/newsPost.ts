
import {defineType, defineField} from 'sanity'
import MarkdownPortableTextInput from '../components/MarkdownPortableTextInput'

export const newsPost = defineType({
  name: 'newsPost',
  title: 'News',
  type: 'document',

  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),

    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'title'},
    }),

    defineField({
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: [{type: 'category'}],
    }),

    defineField({
      name: 'publishedAt',
      title: 'Published Date',
      type: 'datetime',
    }),

    defineField({
      name: 'author',
      title: 'Author / Reporter',
      type: 'string',
    }),

    defineField({
      name: 'source',
      title: 'Source',
      type: 'string',
    }),

    defineField({
      name: 'newsType',
      title: 'News Type',
      type: 'string',
      options: {
        list: [
          {title: 'Original Reporting', value: 'original-reporting'},
          {title: 'Press Release', value: 'press-release'},
          {title: 'Source Report', value: 'source-report'},
          {title: 'Editorial / Analysis', value: 'editorial-analysis'},
          {title: 'Community Submission', value: 'community-submission'},
        ],
        layout: 'dropdown',
      },
    }),

    defineField({
      name: 'coverImage',
      title: 'Cover Picture',
      type: 'image',
      options: {hotspot: true},
    }),

    defineField({
      name: 'imageCredits',
      title: 'Image Credits',
      type: 'text',
      rows: 8,
    }),

    defineField({
      name: 'gallery',
      title: 'More Pictures',
      type: 'array',
      of: [{type: 'image', options: {hotspot: true}}],
    }),

    defineField({
      name: 'videoUrl',
      title: 'Video (YouTube/Vimeo link)',
      type: 'url',
    }),

    defineField({
      name: 'summary',
      title: 'Summary',
      type: 'text',
    }),

    defineField({
      name: 'body',
      title: 'Content',
      type: 'array',
      of: [
        {type: 'block'},
        {type: 'newsInlineImage'},
      ],
      components: {
        input: MarkdownPortableTextInput,
      },
    }),

    defineField({
      name: 'bodyUrdu',
      title: 'Content (Urdu)',
      type: 'array',
      of: [
        {type: 'block'},
        {type: 'newsInlineImage'},
      ],
      components: {
        input: MarkdownPortableTextInput,
      },
    }),

    defineField({
      name: 'featured',
      title: 'Featured on Homepage',
      type: 'boolean',
      initialValue: false,
    }),

    defineField({
      name: 'seoTitle',
      title: 'SEO Title',
      type: 'string',
      validation: (Rule) => Rule.max(60),
    }),

    defineField({
      name: 'seoDescription',
      title: 'SEO Description',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.max(160),
    }),

    defineField({
      name: 'seoImage',
      title: 'SEO / Social Share Image',
      type: 'image',
      options: {hotspot: true},
      description:
        'Image used for search engine and social media previews.',
    }),
  ],
})
