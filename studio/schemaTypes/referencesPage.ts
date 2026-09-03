// References page singleton: localized hero + video references section.
import {ImagesIcon} from '@sanity/icons/Images'
import {defineField, defineType} from 'sanity'

export const referencesPage = defineType({
  name: 'referencesPage',
  title: 'References Page',
  type: 'document',
  icon: ImagesIcon,
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'localizedString',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'paragraph',
      title: 'Paragraph',
      type: 'localizedText',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'references',
      title: 'References',
      type: 'serviceRelatedReferencesSection',
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'References Page',
      }
    },
  },
})
