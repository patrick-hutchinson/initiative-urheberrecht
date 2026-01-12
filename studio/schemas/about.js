import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'about',
  title: 'About',
  type: 'document',
  fields: [
    {
      name: 'order',
      title: 'Order',
      type: 'number',
      initialValue: 2,
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
        name: 'pageTitle',
        title: 'Page title',
        type: 'string',
    }),
    defineField({
      name: 'topImages',
      title: 'Top images',
      type: 'array',
      of: [
        {
            name: 'image', 
            title: 'Image',
            type: 'image',
            options: {
              hotspot: true,
            },
        }
      ],
      options: {
        layout: 'grid',
      },
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
        name: 'chronikTitle',
        title: 'Chronik title',
        type: 'string',
    }),
    defineField({
      name: 'chronikImage',
      title: 'Chronik image',
      type: 'array',
      of: [
        {
            name: 'image', 
            title: 'Image',
            type: 'image',
            options: {
              hotspot: true,
            },
        }
      ],
      options: {
        layout: 'grid',
      },
    }),
    defineField({
        name: 'chronikText',
        title: 'Chronik text',
        type: 'array',
        of: [
          {
            type: 'block'
          }
        ]
    }),
      defineField({
        name: 'bereicheTitle',
        title: 'Bereiche title',
        type: 'string',
    }),
    defineField({
      name: 'bereicheImage',
      title: 'Bereiche image',
      type: 'array',
      of: [
        {
            name: 'image', 
            title: 'Image',
            type: 'image',
            options: {
              hotspot: true,
            },
        }
      ],
      options: {
        layout: 'grid',
      },
    }),
    defineField({
        name: 'bereicheText',
        title: 'Bereiche text',
        type: 'array',
        of: [
          {
            type: 'block'
          }
        ]
    }),
    defineField({
        name: 'statuten',
        title: 'Statuten (.pdf only)',
        type: 'file',
    }),
    defineField({
      name: 'statutenImage',
      title: 'Statuten image',
      type: 'array',
      of: [
        {
            name: 'image', 
            title: 'Image',
            type: 'image',
            options: {
              hotspot: true,
            },
        }
      ],
      options: {
        layout: 'grid',
      },
    }),
    defineField({
        name: 'statutenText',
        title: 'Statuten text',
        type: 'array',
        of: [
          {
            type: 'block'
          }
        ]
    }),
    defineType({
        name: 'tatigkeiten',
        title: 'Tatigkeiten',
        type: 'document',
        fields: [
          defineField({
            name: 'title',
            title: 'Title',
            type: 'string',
          }),
          defineField({
              name: 'subtitle',
              title: 'Subtitle',
              type: 'string',
            }),
          // defineField({
          //   name: 'slug',
          //   title: 'Slug',
          //   type: 'slug',
          //   options: {
          //     source: 'title',
          //     maxLength: 96,
          //   },
          // }),
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
              name: 'activities',
              title: 'Activities',
              type: 'document',
              fields: [
                  defineType({
                      name: 'activity',
                      title: 'Activity',
                      type: 'array',
                      of: [
                          defineType({
                              name: 'activityEntity',
                              title: 'Activity entity',
                              type: 'document',
                              fields: [
                                  defineField({
                                      name: 'info',
                                      title: 'Info',
                                      type: 'string',
                                  }),
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
                              ]
                          })
                          
                      ]
                  })
              ]
          })
        ]
      }),
      defineField({
        name: 'vorstand',
        title: 'Vorstand',
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
    defineField({
      name: 'tatigkeitenImage',
      title: 'Tätigkeiten image',
      type: 'array',
      of: [
        {
            name: 'image', 
            title: 'Image',
            type: 'image',
            options: {
              hotspot: true,
            },
        }
      ],
      options: {
        layout: 'grid',
      },
    }),
    defineField({
        name: 'tatigkeitenText',
        title: 'Tätigkeiten text',
        type: 'array',
        of: [
          {
            type: 'block'
          }
        ]
    }),
  ]
})
