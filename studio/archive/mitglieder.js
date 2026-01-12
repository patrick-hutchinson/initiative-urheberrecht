import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'mitglieder',
  title: 'Mitglieder',
  type: 'document',
  fields: [
    {
      name: 'order',
      title: 'Order',
      type: 'number',
      initialValue: 3,
      readOnly: true,
      hidden: true
    },
    defineField({
      name: 'menuTitle',
      title: 'Menu Title',
      type: 'string',
    }),
    defineField({
        name: 'pageTitle',
        title: 'Page title',
        type: 'string',
    }),
    defineType({
        name: 'verbande',
        title: 'Verbande',
        type: 'document',
        fields: [
            defineField({
                name: 'title',
                title: 'Title',
                type: 'string',
              }),
            defineType({
                name: 'verband',
                title: 'Verband',
                type: 'array',
                of: [
                    defineType({
                        name: 'verbandItem',
                        title: 'Verband item',
                        type: 'document',
                        fields: [
                            defineField({
                              name: 'title',
                              title: 'Title',
                              type: 'string',
                            }),
                            defineField({
                                name: 'description',
                                title: 'Description',
                                type: 'array',
                                of: [
                                  {
                                    type: 'block'
                                  }
                                ]
                            }),
                            defineField({
                                name: 'logo',
                                title: 'Logo',
                                type: 'image',
                                options: {
                                  hotspot: true,
                                },
                              }),
                        ],
                        preview: {
                            select: {
                              title: 'description',
                            },
                        },    
                    }),
                ],
            }),
        ],
    }),
    defineType({
        name: 'organisations',
        title: 'Organisations',
        type: 'document',
        fields: [
            defineField({
                name: 'title',
                title: 'Title',
                type: 'string',
              }),
            defineField({
                name: 'description',
                title: 'Description',
                type: 'array',
                of: [
                  {
                    type: 'block'
                  }
                ]
            }),
            defineType({
                name: 'organisation',
                title: 'Organisation',
                type: 'array',
                of: [
                    defineType({
                        name: 'organisationItem',
                        title: 'Organisation item',
                        type: 'document',
                        fields: [
                            defineType({
                                name: 'url',
                                title: 'URL',
                                type: 'url',
                            }),
                            defineField({
                                name: 'logo',
                                title: 'Logo',
                                type: 'image',
                                options: {
                                  hotspot: true,
                                },
                              }),
                        ],   
                        preview: {
                            select: {
                              title: 'url',
                            },
                        },  
                    }),
                ],
            }),
        ],
    }),
    defineType({
        name: 'rechtsbeistande',
        title: 'Rechtsbeistande',
        type: 'document',
        fields: [
            defineField({
                name: 'title',
                title: 'Title',
                type: 'string',
              }),
              defineField({
                name: 'people',
                title: 'People',
                type: 'array',
                of: [
                    {
                        name: 'name',
                        title: `Person's name`,
                        type: 'reference',
                        to: {
                            type: 'person'
                        }
                    },
                ],
            }), 
        ],
    }),        
  ],
  preview: {
    select: {
      title: 'slug.current',
    },
  },
})