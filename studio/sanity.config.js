// sanity.config.js
import { defineConfig } from 'sanity'
import { deskTool } from 'sanity/desk'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './schemas'
import { myStructure } from './deskStructure'

export default defineConfig({
  name: 'default',
  title: 'Initiative Urheberrecht AT',
  projectId: '0zh2hq04',
  dataset: 'production',

  plugins: [
    deskTool({
      structure: myStructure,
    }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },

  vite: (config) => {
    // Confirm that this function is being executed by logging:
    console.log("Applying custom Vite config for Sanity")

    config.server = config.server || {}
    config.server.host = '0.0.0.0'
    config.server.port = 3333
    config.server.allowedHosts = 'all'  // Allow all hosts temporarily

    config.preview = config.preview || {}
    config.preview.allowedHosts = 'all'

    config.build = config.build || {}
    config.build.outDir = 'build'

    return config
  }
})
