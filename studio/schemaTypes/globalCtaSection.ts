// Global CTA section singleton: heading and paragraph shared site-wide.
import {SparklesIcon} from '@sanity/icons/Sparkles'
import {defineField, defineType} from 'sanity'

export const globalCtaSection = defineType({
  name: 'globalCtaSection',
  title: 'Global CTA Section',
  type: 'document',
  icon: SparklesIcon,
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
  ],
  preview: {
    prepare() {
      return {
        title: 'Global CTA Section',
      }
    },
  },
})
