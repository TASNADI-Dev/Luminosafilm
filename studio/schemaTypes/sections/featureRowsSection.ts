// Service page section: heading plus supporting paragraph.
import {defineField, defineType} from 'sanity'

export const featureRowsSection = defineType({
  name: 'featureRowsSection',
  title: 'Feature Section',
  type: 'object',
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
    select: {headingHu: 'heading.hu'},
    prepare({headingHu}) {
      return {
        title: headingHu || 'Feature Section',
        subtitle: 'Heading and paragraph',
      }
    },
  },
})
