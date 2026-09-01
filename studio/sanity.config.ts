import {defineConfig} from 'sanity'
import type {Template} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'
import {structure} from './structure'
import {createHeroSection, type HomePageLocale} from './seed/heroDefaults'

const LOCALES: Array<{id: HomePageLocale; title: string}> = [
  {id: 'hu', title: 'Hungarian'},
  {id: 'en', title: 'English'},
]

export default defineConfig({
  name: 'default',
  title: 'Luminosafilm',

  projectId: '018x49q7',
  dataset: 'production',

  plugins: [structureTool({structure}), visionTool()],

  schema: {
    types: schemaTypes,
    templates: (prev) => [
      ...prev,
      ...LOCALES.map(
        (locale): Template => ({
          id: `homePage-${locale.id}`,
          title: `Home Page (${locale.title})`,
          schemaType: 'homePage',
          parameters: [{name: 'language', type: 'string'}],
          value: {
            language: locale.id,
            sections: [createHeroSection(locale.id)],
          },
        }),
      ),
    ],
  },
})
