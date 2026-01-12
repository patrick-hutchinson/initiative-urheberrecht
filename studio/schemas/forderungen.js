
import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'forderungen',
  title: 'Forderungen',
  type: 'document',
  fields: [
    {
      name: 'order',
      title: 'Order',
      type: 'number',
      initialValue: 4,
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
        name: 'forderungen',
        title: 'Forderungen',
        type: 'document',
        fields: [
            defineType({
                name: 'categories',
                title: 'Categories',
                type: 'array',
                of: [
                    defineType({
                        name: 'category',
                        title: 'Category',
                        type: 'document',
                        fields: [
                            defineField({
                                name: 'title',
                                title: 'Title',
                                type: 'string',
                            }),
                            defineField({
                              name: 'anchorTitle',
                              title: 'Anchor title',
                              type: 'string',
                            }),
                            defineField({
                              name: 'mobileTitle',
                              title: 'Mobile title',
                              type: 'string',
                            }),
                            defineType({
                                name: 'branches',
                                title: 'Branch',
                                type: 'document',
                                fields: [
                                    defineType({
                                        name: 'branch',
                                        title: 'Branch',
                                        type: 'array',
                                        of: [
                                            defineType({
                                                name: 'branchEntity',
                                                title: 'Branch entity',
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
                                                        name: 'articles',
                                                        title: 'Articles',
                                                        type: 'document',
                                                        fields: [
                                                            defineType({
                                                                name: 'article',
                                                                title: 'Article',
                                                                type: 'array',
                                                                of: [
                                                                    defineType({
                                                                        name: 'articleEntity',
                                                                        title: 'Article entity',
                                                                        type: 'document',
                                                                        fields: [
                                                                            defineField({
                                                                              name: 'info',
                                                                              title: 'Info',
                                                                              type: 'string',
                                                                            }),
                                                                            defineField({
                                                                                name: 'articleTitle',
                                                                                title: 'Article title',
                                                                                type: 'string',
                                                                             }),
                                                                             defineField({
                                                                                name: 'articleText',
                                                                                title: 'Article text',
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
                                            })
                                            
                                        ]
                                    })
                                ]
                            })
                        ],    
                        preview: {
                            select: {
                            title: 'title'
                            }
                        }
                    }),
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

    defineType({
      name: 'fzuCategory',
      title: 'Forderungen zum Urhebervertragsrecht',
      type: 'document',
      fields: [
          defineField({
              name: 'title',
              title: 'Title',
              type: 'string',
          }),
          defineField({
            name: 'titleMobile',
            title: 'Title mobile',
            type: 'string',
          }),
          defineType({
              name: 'branches',
              title: 'Branch',
              type: 'document',
              fields: [
                  defineType({
                      name: 'branch',
                      title: 'Branch',
                      type: 'array',
                      of: [
                          defineType({
                              name: 'branchEntity',
                              title: 'Branch entity',
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
                                      name: 'articles',
                                      title: 'Articles',
                                      type: 'document',
                                      fields: [
                                          defineType({
                                              name: 'article',
                                              title: 'Article',
                                              type: 'array',
                                              of: [
                                                  defineType({
                                                      name: 'articleEntity',
                                                      title: 'Article entity',
                                                      type: 'document',
                                                      fields: [
                                                          defineField({
                                                            name: 'info',
                                                            title: 'Info',
                                                            type: 'string',
                                                          }),
                                                          defineField({
                                                              name: 'articleTitle',
                                                              title: 'Article title',
                                                              type: 'string',
                                                           }),
                                                           defineField({
                                                              name: 'articleText',
                                                              title: 'Article text',
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
                          })
                          
                      ]
                  })
              ]
          })
      ],    
      preview: {
          select: {
          title: 'title'
          }
      }
  }),

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
