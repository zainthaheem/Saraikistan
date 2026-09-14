import {defineType, defineField} from 'sanity'

export const category = defineType({
  name: 'category',
  title: 'Category',
  type: 'document',
  fields: [
    defineField({name: 'title', title: 'Title', type: 'string'}),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'title'},
    }),
    defineField({
      name: 'appliesTo',
      title: 'Applies To',
      type: 'string',
      options: {
        list: [
          {title: 'People', value: 'person'},
          {title: 'News', value: 'newsPost'},
          {title: 'Culture', value: 'culture'},
          {title: 'Stories', value: 'story'},
          {title: 'Places', value: 'place'},
        ],
      },
    }),
  ],
})
