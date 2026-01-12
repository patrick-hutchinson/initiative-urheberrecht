
import {defineField, defineType} from 'sanity'
import CustomImageInput from '../components/CustomImageInput'

export default defineType({
  name: 'presse',
  title: 'Presse',
  type: 'document',
  fields: [
    {
        name: 'order',
        title: 'Order',
        type: 'number',
        initialValue: 5,
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
        title: 'Menu title',
        type: 'string',
    }),
    defineType({
        name: 'posts',
        title: 'Posts',
        type: 'array',
        of: [
            defineType({
                name: 'post',
                title: 'Post',
                type: 'document',
                fields: [
                    defineField({
                        name: 'title',
                        title: 'Title',
                        type: 'array',
                        of: [
                          {
                            type: 'block'
                          }
                        ]
                    }),
                    defineField({
                        name: 'archive',
                        title: 'Archive',
                        type: 'boolean',
                        initialValue: false
                    }),
                    defineField({
                        name: 'inverse',
                        title: 'Inverse',
                        type: 'boolean',
                        initialValue: false
                    }),
                    defineField({
                        name: 'anchors',
                        title: 'Anchors',
                        type: 'array',
                        of: [{ type: 'string' }],
                      }),
                    defineField({
                        name: 'file',
                        title: 'File',
                        type: 'file',
                    }),
                    defineField({
                        name: 'filename',
                        title: 'Filename',
                        type: 'string',
                    }),
                    defineField({
                        name: 'media',
                        title: 'Media',
                        type: 'object',
                        hidden: ({ parent }) => parent?.inverse === true,
                        fields: [
                            {
                                name: 'selectedMedia',
                                title: 'Select Media',
                                type: 'string',
                                initialValue: "none",
                                options: {
                                    list: [
                                        {title: 'None', value: 'none'},
                                        {title: 'Photos', value: 'photos'},
                                        {title: 'Embedded video', value: 'embedVideo'}
                                    ],
                                    layout: 'radio'
                                }
                            },
                            {
                                name: 'photos',
                                title: 'Photos',
                                type: 'document',
                                fields: [
                                    {
                                        name: 'images',
                                        title: 'Images',
                                        type: 'array',
                                        of: [
                                            {
                                                name: 'image',
                                                title: 'Image',
                                                type: 'image',
                                                options: {
                                                    hotspot: true
                                                }
                                            }
                                        ],
                                        options: {
                                            layout: 'grid'
                                        }
                                    }
                                ],
                                hidden: ({ parent }) => parent && parent.selectedMedia !== 'photos',
                            },
                            { 
                                name: 'embedVideo',
                                title: 'Embedded video',
                                type: 'document',
                                fields: [
                                    {
                                        name: 'url',
                                        title: 'URL',
                                        type: 'url' 
                                    }
                                ],
                                hidden: ({ parent }) => parent && parent.selectedMedia !== 'embedVideo',
                            }
                        ],
                    }),
                ],

                preview: {
                    select: {
                      title: 'title',
                    },
                },

            }),
        ],
    }),
    {
        name: 'fotoarchiv',
        title: 'Fotoarchiv',
        type: 'array',
        of: [
            {
                name: 'fotoarchivItem',
                title: 'Fotoarchiv Item',
                type: 'object',
                fields: [
                    {
                        name: 'menuTitle',
                        title: 'Title',
                        type: 'string'
                    },
                    {
                        name: 'fotoarchiv',
                        title: 'Folders',
                        type: 'array',
                        of: [
                            {
                                type: 'object',
                                name: 'folder',
                                title: 'Folder',
                                fields: [
                                    {
                                        name: 'title',
                                        title: 'Title',
                                        type: 'string'
                                    },
                                    {
                                        name: 'credits',
                                        title: 'Credits',
                                        type: 'string'
                                    },
                                    {
                                        name: 'images',
                                        title: 'Images',
                                        type: 'array',
                                        components: {
                                            input: CustomImageInput
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
                                                        type: 'string'
                                                    },
                                                ],
                                                preview: {
                                                    select: {
                                                        title: 'caption',
                                                        media: 'image'
                                                    },
                                                    prepare: (selection) => {
                                                        return {
                                                            title: selection.title || '-',
                                                            media: selection.media
                                                        }
                                                    }
                                                }
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
    }
    
  ],
})

