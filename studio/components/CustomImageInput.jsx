import React, {useCallback, useState} from 'react'
import {Stack, Card, Text, Spinner, Box} from '@sanity/ui'
import {insert, setIfMissing, useClient} from 'sanity'

export default function CustomImageInput(props) {
  const {value, onChange, renderDefault} = props
  const client = useClient()
  
  const [isUploading, setIsUploading] = useState(false)

  const handleDrop = useCallback(async (event) => {
    event.preventDefault()
    const files = event.dataTransfer?.files
    if (!files || !files.length) return

    setIsUploading(true) // show loading indicator

    try {
      const uploads = await Promise.all(
        Array.from(files).map(async (file, idx) => {
          const asset = await client.assets.upload('image', file, {
            filename: file.name
          })

          return {
            _type: 'imageItem',
            _key: `file-${file.name}-${Date.now()}-${idx}`,
            image: {
              _type: 'image',
              asset: {
                _type: 'reference',
                _ref: asset._id
              }
            },
            caption: ''
          }
        })
      )

      // Insert uploaded items into the array
      onChange([
        setIfMissing([], []),
        insert(uploads, 'after', [-1])
      ])
    } finally {
      // Hide loading indicator after uploads or if an error occurs
      setIsUploading(false)
    }
  }, [client, onChange])

  return (
    <Stack space={3}>
      {/* Drop zone */}
      <Card
        padding={4}
        radius={2}
        shadow={1}
        tone="primary"
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        {isUploading ? (
          <Box display="flex" alignItems="center" justifyContent="center" height="fill">
            <Spinner muted />
            <Box marginLeft={2}>
              <Text>Uploading...</Text>
            </Box>
          </Box>
        ) : (
          <Text weight="normal">
            Drag &amp; Drop images here
          </Text>
        )}
      </Card>

      {/* Render the default array UI (so you can see/edit items) */}
      {renderDefault(props)}
    </Stack>
  )
}
