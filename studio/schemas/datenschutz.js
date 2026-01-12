
import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'datenschutz',
  title: 'Datenschutz',
  type: 'document',
  fields: [
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
        name: 'leftBlock',
        title: 'Left block',
        type: 'array',
        of: [
          {
            type: 'block'
          }
        ]
    }),
    defineField({
        name: 'rightBlock',
        title: 'Right block',
        type: 'array',
        of: [
          {
            type: 'block'
          }
        ]
    }),
    defineField({
      name: 'downloadDatenschutz',
      title: 'Download Datenschutz',
      type: 'file',
    }),
    
  ],
})
