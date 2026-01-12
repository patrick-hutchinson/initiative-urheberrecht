import {defineField, defineType} from 'sanity'
import CustomImageInput from '../components/CustomImageInput'

export default defineType({
  name: 'konferenz',
  title: 'Konferenz',
  type: 'document',
  fields: [
    {
      name: 'order',
      title: 'Order',
      type: 'number',
      initialValue: 1,
      readOnly: true,
      hidden: true,
    },
    {
      name: 'id',
      title: 'id',
      type: 'string',
      readOnly: true,
      hidden: true,
      initialValue: 'konferenz',
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
      name: 'pageTitleMobile',
      title: 'Page title mobile',
      type: 'string',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'pageTitle',
        maxLength: 96,
        slugify: (input) =>
          input
            .toLowerCase()
            .replace(/\s+|\.+/g, '-')
            .slice(0, 96),
      },
      validation: (Rule) => Rule.required(),
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
        },
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
          type: 'block',
        },
      ],
    }),
    defineField({
      name: 'topic',
      title: 'Topic',
      type: 'string',
    }),
    defineType({
      name: 'program',
      title: 'Program',
      type: 'document',
      fields: [
        defineType({
          name: 'days',
          title: 'Days',
          type: 'array',
          of: [
            defineType({
              name: 'day',
              title: 'Day',
              type: 'document',
              fields: [
                defineField({
                  name: 'date',
                  title: 'Date',
                  type: 'date',
                }),
                defineType({
                  name: 'partOfDays',
                  title: 'Part of days',
                  type: 'document',
                  fields: [
                    defineType({
                      name: 'partofDay',
                      title: 'Part of day',
                      type: 'array',
                      of: [
                        defineType({
                          name: 'partofDayEntity',
                          title: 'Part of day entity',
                          type: 'document',
                          fields: [
                            defineField({
                              name: 'title',
                              title: 'Title',
                              type: 'string',
                            }),
                            defineType({
                              name: 'events',
                              title: 'Events',
                              type: 'document',
                              fields: [
                                defineType({
                                  name: 'event',
                                  title: 'Event',
                                  type: 'array',
                                  of: [
                                    defineType({
                                      name: 'eventEntity',
                                      title: 'Event entity',
                                      type: 'document',
                                      fields: [
                                        defineField({
                                          name: 'info',
                                          title: 'Info',
                                          type: 'string',
                                        }),
                                        defineField({
                                          name: 'eventTitle',
                                          title: 'Event title',
                                          type: 'array',
                                          of: [
                                            {
                                              type: 'block',
                                            },
                                          ],
                                        }),
                                      ],
                                    }),
                                  ],
                                }),
                              ],
                            }),
                          ],
                        }),
                      ],
                    }),
                  ],
                }),
              ],
              preview: {
                select: {
                  title: 'date',
                },
              },
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: 'programFile',
      title: 'Program file (.pdf only)',
      type: 'file',
    }),
    defineField({
      name: 'amPodium',
      title: 'Am Podium',
      type: 'array',
      of: [
        {
          name: 'name',
          title: `Person's name`,
          type: 'reference',
          to: {
            type: 'person',
          },
        },
      ],
    }),
    defineField({
      name: 'bottomMedia',
      title: 'Bottom media',
      type: 'object',
      fields: [
        {
          name: 'selectedMedia',
          title: 'Selected Media',
          type: 'string',
          initialValue: 'none',
          options: {
            list: [
              {title: 'None', value: 'none'},
              {title: 'Photo', value: 'photo'},
              {title: 'Embedded video', value: 'embedVideo'},
            ],
            layout: 'radio',
          },
        },
        {
          name: 'bottomImage',
          title: 'Bottom image',
          type: 'image',
          options: {
            hotspot: true,
          },
          hidden: ({parent}) => parent && parent.selectedMedia !== 'photo',
        },
        {
          name: 'embedVideo',
          title: 'Embedded video',
          type: 'document',
          fields: [
            {
              name: 'url',
              title: 'URL',
              type: 'url',
            },
          ],
          hidden: ({parent}) => parent && parent.selectedMedia !== 'embedVideo',
        },
      ],
    }),
    defineType({
      name: 'importantBlocks',
      title: 'Important blocks',
      type: 'document',
      fields: [
        defineType({
          name: 'block',
          title: 'Block',
          type: 'array',
          of: [
            defineType({
              name: 'blockEntity',
              title: 'Block entity',
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
                      type: 'block',
                    },
                  ],
                }),
              ],
            }),
          ],
        }),
      ],
    }),
    {
      name: 'fotoarchiv',
      title: 'Fotoarchiv',
      type: 'array',
      of: [
        {
          name: 'folder',
          title: 'Folder',
          type: 'object',
          fields: [
            {
              name: 'title',
              title: 'Title',
              type: 'string',
            },
            {
              name: 'credits',
              title: 'Credits',
              type: 'string',
            },
            {
              name: 'images',
              title: 'Images',
              type: 'array',
              components: {
                input: CustomImageInput,
              },
              of: [
                {
                  name: 'imageItem',
                  title: 'Image',
                  type: 'object',
                  fields: [
                    {
                      name: 'image',
                      title: 'Image',
                      type: 'image',
                      options: {
                        hotspot: true,
                      },
                    },
                    {
                      name: 'caption',
                      title: 'Caption',
                      type: 'string',
                    },
                  ],
                  preview: {
                    select: {
                      title: 'caption',
                      media: 'image',
                    },
                    prepare: (selection) => {
                      return {
                        title: selection.title || '-',
                        media: selection.media,
                      }
                    },
                  },
                },
              ],
            },
          ],
        },
      ],
    },
  ],

  preview: {
    select: {
      title: 'pageTitle',
    },
  },
})
