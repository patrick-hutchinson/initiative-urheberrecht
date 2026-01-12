
import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'contact',
  title: 'Contact',
  type: 'document',
  fields: [
    {
      name: 'order',
      title: 'Order',
      type: 'number',
      initialValue: 6,
      readOnly: true,
      hidden: true
    },
    {
      name: 'id',
      title: 'id',
      type: 'string',
      readOnly: true,
      hidden: true
    },
    defineField({
      name: 'menuTitle',
      title: 'Menu Title',
      type: 'string',
    }),
    defineField({
        name: 'infoLeft',
        title: 'Info left',
        type: 'array',
        of: [
          {
            type: 'block'
          }
        ]
    }),
    defineField({
      name: 'infoRight',
      title: 'Info right',
      type: 'array',
      of: [
        {
          type: 'block'
        }
      ]
    }),
  ],
})
