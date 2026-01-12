import {defineField, defineType} from 'sanity'
import React from 'react'

export default defineType({
  name: 'poster',
  title: 'Poster',
  type: 'document',
  fields: [
    {
      name: 'type',
      title: 'Type',
      description: <>
        <hr/>
        <strong>Default</strong><br/>
        Initiative<br/>
        Urheberrecht, AT<br/>
        © Musik<br/>
        Initiative<br/>
        Urheberrecht, AT<br/>
        © Film und Theater<br/>
        Initiative<br/>
        Urheberrecht, AT<br/>
        © Literatur<br/>
        Initiative<br/>
        Urheberrecht, AT<br/>
        © Bildende Kunst<br/><hr/>
        <strong>Konferenz</strong><br/>
        Initiative<br/>
        Urheberrecht, AT<br/>
        Konferenz<br/>
        KI, GVR und Streaming<br/>
        {`<KONFERENZ DATES>`}<br/>
        <hr/>
      </>,
      type: 'string',
      initialValue: 'default',
      options: {
        list: [
          { 
            title: 'Default', 
            value: 'default',
          },
          { 
            title: 'Konferenz', 
            value: 'konferenz', 
          },
        ],
        layout: 'radio',
      },
    },
    {
      name: 'dates',
      title: 'Dates',
      type: 'string',
      description: 'Dates for the conference',
      hidden: ({parent}) => parent.type !== 'konferenz',
    }
  ],
})
