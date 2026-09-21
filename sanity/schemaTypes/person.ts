import {defineType, defineField} from 'sanity'
import MarkdownPortableTextInput from '../components/MarkdownPortableTextInput'

export const person = defineType({
  name: 'person',
  title: 'People',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
    }),

    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'name'},
    }),

    defineField({
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: [{type: 'category'}],
    }),

    defineField({
      name: 'profileImage',
      title: 'Profile Picture',
      type: 'image',
      options: {hotspot: true},
    }),

    defineField({
      name: 'coverImage',
      title: 'Cover Picture',
      type: 'image',
      options: {hotspot: true},
    }),

    defineField({
      name: 'gallery',
      title: 'More Pictures',
      type: 'array',
      of: [{type: 'image', options: {hotspot: true}}],
    }),

    defineField({
      name: 'bio',
      title: 'Biography — English',
      type: 'array',
      of: [{type: 'block'}],
      components: {
        input: MarkdownPortableTextInput,
      },
    }),

    defineField({
      name: 'bioUrdu',
      title: 'Biography — اردو',
      type: 'array',
      of: [{type: 'block'}],
      description:
        'Urdu translation of the biography. Write naturally in Urdu; do not use automatic machine translation.',
      components: {
        input: MarkdownPortableTextInput,
      },
    }),

    defineField({
      name: 'socialLinks',
      title: 'Social Media Accounts',
      type: 'array',
      of: [{type: 'socialLink'}],
    }),

    defineField({
      name: 'featured',
      title: 'Featured on Homepage',
      type: 'boolean',
      initialValue: false,
    }),

    // SEO SETTINGS — ENGLISH
    defineField({
      name: 'seoTitle',
      title: 'SEO Title — English',
      type: 'string',
      description:
        'Title shown in English search engine results. Keep it around 50–60 characters.',
      validation: (Rule) => Rule.max(60),
    }),

    defineField({
      name: 'seoDescription',
      title: 'SEO Description — English',
      type: 'text',
      rows: 3,
      description:
        'Short English description shown in search engine results. Keep it around 140–160 characters.',
      validation: (Rule) => Rule.max(160),
    }),

    // SEO SETTINGS — URDU
    defineField({
      name: 'seoTitleUrdu',
      title: 'SEO Title — اردو',
      type: 'string',
      description:
        'اردو صفحے کے لیے سرچ انجن ٹائٹل۔',
      validation: (Rule) => Rule.max(60),
    }),

    defineField({
      name: 'seoDescriptionUrdu',
      title: 'SEO Description — اردو',
      type: 'text',
      rows: 3,
      description:
        'اردو صفحے کے لیے مختصر سرچ انجن تفصیل۔',
      validation: (Rule) => Rule.max(160),
    }),

    defineField({
      name: 'seoImage',
      title: 'SEO / Social Share Image',
      type: 'image',
      options: {hotspot: true},
      description:
        'Image used when this page is shared on social media.',
    }),

    // IMAGE CREDITS
    defineField({
      name: 'imageCredits',
      title: 'Image Credits',
      type: 'text',
      rows: 8,
      description:
        'Credit and license information for profile and gallery images. Include photographer, Wikimedia Commons source and license details.',
    }),
  ],
})
