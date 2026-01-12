import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'person',
  title: 'Person',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
    }),
    defineField({
      name: 'regalia',
      title: 'Regalia',
      type: 'string',
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'about',
      title: 'About',
      type: 'array',
      of: [
        {
          type: 'block'
        }
      ]
    }),
  ],
  preview: {
    select: {
      title: 'name',
      media: 'image',
    },
  },
})
