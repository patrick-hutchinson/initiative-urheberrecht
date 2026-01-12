
import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'mitglieder',
  title: 'Organisation',
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
      name: 'extraordinaryMembers',
      title: 'Außerordentliche Mitglieder',
      type: 'document',
      fields: [
          defineField({
              name: 'title',
              title: 'Title',
              type: 'string',
            }),
          defineType({
              name: 'extraordinaryMember',
              title: 'Außerordentliches Mitglied',
              type: 'array',
              of: [
                  defineType({
                      name: 'extraordinaryMemberItem',
                      title: 'Außerordentliches Mitglied item',
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
    defineField({
      name: 'middleImage',
      title: 'Middle image',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
        name: 'middleDescription',
        title: 'Middle description',
        type: 'array',
        of: [
          {
            type: 'block'
          }
        ]
    }),

    // defineField({
    //     name: 'bottomTitle',
    //     title: 'Bottom Title',
    //     type: 'string',
    //   }),

    // defineField({
    //   name: 'bottomImage',
    //   title: 'Bottom image',
    //   type: 'array',
    //   of: [
    //     {
    //         name: 'image', 
    //         title: 'Image',
    //         type: 'image',
    //         options: {
    //           hotspot: true,
    //         },
    //     }
    //   ],
    //   options: {
    //     layout: 'grid',
    //   },
    // }),
    // defineField({
    //     name: 'bottomDescription',
    //     title: 'Bottom description',
    //     type: 'array',
    //     of: [
    //       {
    //         type: 'block'
    //       }
    //     ]
    // }),
  ],

  preview: {
    select: {
      title: 'title',
      subtitle: 'topic',
      media: 'bottomImage'
    },
  },
})
