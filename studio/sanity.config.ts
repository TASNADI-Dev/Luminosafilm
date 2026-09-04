import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'
import {structure} from './structure'

const singletonTypes = new Set([
  'homePage',
  'servicePage',
  'referencesPage',
  'aboutPage',
  'privacyPage',
  'globalCtaSection',
  'clientLogos',
])

export default defineConfig({
  name: 'default',
  title: 'Luminosafilm',

  projectId: '018x49q7',
  dataset: 'production',

  plugins: [structureTool({structure}), visionTool()],

  schema: {
    types: schemaTypes,
  },

  document: {
    newDocumentOptions: (prev) =>
      prev.filter((item) => !singletonTypes.has(item.templateId)),
    actions: (prev, {schemaType}) => {
      if (!singletonTypes.has(schemaType)) {
        return prev
      }

      return prev.filter(({action}) => action !== 'duplicate' && action !== 'delete')
    },
  },
})
