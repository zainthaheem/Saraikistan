
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

    // ENGLISH BIOGRAPHY
    defineField({
      name: 'bio',
      title: 'Biography — English',
      description:
        'Write the biography using the standard Sanity editor. Insert a Biography Image between paragraphs to add a photo with a caption and optional credit.',
      type: 'array',
      of: [
        // Normal paragraphs and headings
        defineArrayMember({
          type: 'block',
        }),

        // New biography image object
        defineArrayMember({
          type: 'bioImage',
        }),

        // Legacy image blocks retained for existing biographies
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

    // URDU BIOGRAPHY
    defineField({
      name: 'bioUrdu',
      title: 'Biography — اردو',
      description:
        'اردو سوانح عمری لکھیں۔ پیراگراف کے درمیان Biography Image شامل کرکے تصویر، عنوان اور اختیاری کریڈٹ درج کریں۔',
      type: 'array',
      of: [
        // Urdu paragraphs and headings
        defineArrayMember({
          type: 'block',
        }),

        // New biography image object
        defineArrayMember({
          type: 'bioImage',
        }),

        // Legacy image blocks retained for existing biographies
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
