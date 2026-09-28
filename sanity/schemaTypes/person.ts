
import { defineType, defineField, defineArrayMember } from 'sanity'

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
      options: { source: 'name' },
    }),

    defineField({
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: [{ type: 'category' }],
    }),

    defineField({
      name: 'profileImage',
      title: 'Profile Picture',
      type: 'image',
      options: { hotspot: true },
    }),

    defineField({
      name: 'coverImage',
      title: 'Cover Picture',
      type: 'image',
      options: { hotspot: true },
    }),

    // PHOTO GALLERY WITH CAPTIONS
    defineField({
      name: 'gallery',
      title: 'Photo Gallery',
      description:
        'Upload gallery photos. Each photo can have its own caption and optional photo credit.',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'image',
          options: { hotspot: true },
          fields: [
            defineField({
              name: 'caption',
              title: 'Photo Caption',
              type: 'string',
              description:
                'A short description displayed below the photo.',
            }),
            defineField({
              name: 'credit',
              title: 'Photo Credit',
              type: 'string',
              description:
                'Optional photographer, source, or copyright credit.',
            }),
          ],
        }),
      ],
    }),

    // ENGLISH BIOGRAPHY — MARKDOWN
    defineField({
      name: 'bioMarkdown',
      title: 'Biography — English (Markdown)',
      type: 'text',
      rows: 20,
      description:
        'Paste your English biography using Markdown. Use # for headings, **text** for bold, *text* for italics, - for bullet lists, and 1. for numbered lists. Leave blank to use the existing Biography — English field below.',
    }),

    // URDU BIOGRAPHY — MARKDOWN
    defineField({
      name: 'bioUrduMarkdown',
      title: 'Biography — اردو (Markdown)',
      type: 'text',
      rows: 20,
      description:
        'اردو سوانح عمری Markdown میں پیسٹ کریں۔ سرخی کے لیے #، بولڈ کے لیے **متن**، اور فہرست کے لیے - استعمال کریں۔ خالی چھوڑنے پر نیچے موجود پرانا اردو بائیو استعمال ہوگا۔',
    }),

    // EXISTING ENGLISH BIOGRAPHY — PORTABLE TEXT
    defineField({
      name: 'bio',
      title: 'Biography — English (Legacy Editor)',
      description:
        'Existing structured biography editor. Keep your current content and biography images here. This remains available for older profiles.',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'block',
        }),

        defineArrayMember({
          type: 'image',
          options: { hotspot: true },
          fields: [
            defineField({
              name: 'caption',
              title: 'Image Caption',
              type: 'string',
              description:
                'Displayed directly below the image in the biography.',
            }),
            defineField({
              name: 'credit',
              title: 'Image Credit',
              type: 'string',
              description:
                'Optional photographer, source, or copyright credit.',
            }),
          ],
        }),
      ],
    }),

    // EXISTING URDU BIOGRAPHY — PORTABLE TEXT
    defineField({
      name: 'bioUrdu',
      title: 'Biography — اردو (Legacy Editor)',
      description:
        'پرانا اردو بائیو ایڈیٹر۔ موجودہ مواد اور تصاویر محفوظ رکھیں۔',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'block',
        }),

        defineArrayMember({
          type: 'image',
          options: { hotspot: true },
          fields: [
            defineField({
              name: 'caption',
              title: 'Image Caption — اردو',
              type: 'string',
              description:
                'اردو میں تصویر کی وضاحت درج کریں۔',
            }),
            defineField({
              name: 'credit',
              title: 'Image Credit',
              type: 'string',
              description:
                'تصویر کے فوٹوگرافر یا ماخذ کا کریڈٹ (اختیاری)۔',
            }),
          ],
        }),
      ],
    }),

    defineField({
      name: 'socialLinks',
      title: 'Social Media Accounts',
      type: 'array',
      of: [{ type: 'socialLink' }],
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
      description: 'اردو صفحے کے لیے سرچ انجن ٹائٹل۔',
      validation: (Rule) => Rule.max(60),
    }),

    defineField({
      name: 'seoDescriptionUrdu',
      title: 'SEO Description — اردو',
      type: 'text',
      rows: 3,
      description: 'اردو صفحے کے لیے مختصر سرچ انجن تفصیل۔',
      validation: (Rule) => Rule.max(160),
    }),

    defineField({
      name: 'seoImage',
      title: 'SEO / Social Share Image',
      type: 'image',
      options: { hotspot: true },
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
        'General credit and license information for profile, cover, and gallery images. Include photographer, source, and license details.',
    }),
  ],
})
